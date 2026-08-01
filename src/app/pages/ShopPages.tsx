import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { payments, goToCheckout } from '../../lib/payments';
import { formatDate, formatMoney, formatNumber, labelOf } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, Media, PageHeader, Panel, Row, Section, Stat } from '../ui';
import type { Product } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* Shop                                                                        */
/* -------------------------------------------------------------------------- */

export function ShopPage() {
  const [category, setCategory] = useState('');
  const [term, setTerm] = useState('');

  const categories = useApi<unknown>('/products/categories');
  const products = useApi<unknown>('/products', [category], {
    per_page: 36,
    ...(category ? { category } : null),
  });
  const cart = useApi<unknown>('/cart');

  const catList = extractList<{ id?: number; name?: string; slug?: string } | string>(categories.data);
  const list = extractList<Product>(products.data);
  const cartItems = extractList<{ id: number }>(cart.data);

  const filtered = term
    ? list.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()))
    : list;

  const navigate = useNavigate();

  // Adding from the grid also opens the item, so there is somewhere to review
  // the purchase and check out rather than the click seeming to do nothing.
  const addToCart = useMutation(async (product: Product) => {
    await api.post('/cart/items', { product_id: product.id, quantity: 1 });
    cart.reload();
    navigate(`/app/shop/${product.slug ?? product.id}`);
  });

  return (
    <>
      <PageHeader
        title="Shop"
        subtitle="Club merchandise, kit and fan essentials from the marketplace."
        actions={
          <Link className="button button-outline button-sm" to="/app/cart">
            Cart · {formatNumber(cartItems.length)}
          </Link>
        }
      />

      <div className="discover-search">
        <input
          className="field-input"
          type="search"
          placeholder="Search products…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Search products"
        />
      </div>

      {catList.length > 0 && (
        <div className="inline" style={{ marginBottom: 22 }}>
          <button
            type="button"
            className={`chip${category === '' ? ' chip-active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {catList.map((c, i) => {
            const value = typeof c === 'string' ? c : (c.slug ?? String(c.id ?? ''));
            const label = typeof c === 'string' ? c : (c.name ?? value);
            return (
              <button
                key={`${value}-${i}`}
                type="button"
                className={`chip${category === value ? ' chip-active' : ''}`}
                onClick={() => setCategory(value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {addToCart.error && <Alert>{addToCart.error}</Alert>}

      <DataState
        loading={products.loading}
        error={products.error}
        data={filtered}
        onRetry={products.reload}
        empty={{ title: 'No products found', body: 'Try another category or search term.' }}
      >
        {(items) => (
          <div className="grid-4">
            {items.map((p) => {
              const soldOut = p.stock !== null && p.stock !== undefined && p.stock <= 0;

              return (
                <article key={p.id} className="shop-card">
                  <Link className="shop-card-media" to={`/app/shop/${p.slug ?? p.id}`}>
                    <Media
                      src={p.image ?? p.images?.[0]}
                      alt={p.name}
                      ratio="1 / 1"
                      label={p.name.slice(0, 2)}
                    />
                    {soldOut && <span className="shop-card-flag">Sold out</span>}
                    {labelOf(p.category) && (
                      <span className="shop-card-cat">{labelOf(p.category)}</span>
                    )}
                  </Link>

                  <div className="shop-card-body">
                    <Link to={`/app/shop/${p.slug ?? p.id}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p className="shop-card-price">{formatMoney(p.price, p.currency ?? 'KES')}</p>

                    {soldOut ? (
                      <Badge tone="red">Out of stock</Badge>
                    ) : (
                      <button
                        className="button button-green button-sm shop-card-cta"
                        type="button"
                        disabled={addToCart.pending}
                        onClick={() => void addToCart.run(p)}
                      >
                        {addToCart.pending ? 'Adding…' : 'Add to cart'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Product detail                                                              */
/* -------------------------------------------------------------------------- */

export function ProductPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = useApi<Product>(`/products/${slug}`, [slug]);
  const p = product.data;

  const addToCart = useMutation(async () => {
    await api.post('/cart/items', { product_id: p!.id, quantity: qty });
    setAdded(true);
  });

  const images = [p?.image, ...(p?.images ?? [])].filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  return (
    <>
      <PageHeader
        title={p?.name ?? 'Product'}
        subtitle={labelOf(p?.category) || 'Marketplace item'}
        actions={
          <Link className="button button-outline button-sm" to="/app/shop">
            Back to shop
          </Link>
        }
      />

      <DataState
        loading={product.loading}
        error={product.error}
        data={p}
        onRetry={product.reload}
        skeletonRows={2}
        empty={{ title: 'Product not found' }}
      >
        {(item) => (
          <div className="product-detail">
            <div>
              <Media src={images[active]} alt={item.name} ratio="1 / 1" label={item.name.slice(0, 2)} />
              {images.length > 1 && (
                <div className="inline" style={{ marginTop: 12 }}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`thumb${i === active ? ' thumb-active' : ''}`}
                      onClick={() => setActive(i)}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={mediaUrl(img)!} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Panel>
              {added && <Alert kind="success">Added to your cart.</Alert>}
              {addToCart.error && <Alert>{addToCart.error}</Alert>}

              <span className="stat-tile-value" style={{ fontSize: 32 }}>
                {formatMoney(item.price, item.currency ?? 'KES')}
              </span>

              <div className="inline" style={{ margin: '14px 0' }}>
                {item.stock !== null && item.stock !== undefined && (
                  <Badge tone={item.stock > 0 ? 'green' : 'red'}>
                    {item.stock > 0 ? `${formatNumber(item.stock)} in stock` : 'Out of stock'}
                  </Badge>
                )}
                {labelOf(item.category) && <Badge tone="blue">{labelOf(item.category)}</Badge>}
              </div>

              <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                {item.description ?? 'No description provided.'}
              </p>

              <div className="inline" style={{ marginTop: 18 }}>
                <input
                  className="field-input qty-input"
                  type="number"
                  min={1}
                  max={item.stock ?? 99}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  aria-label="Quantity"
                />
                <button
                  className="button button-green"
                  type="button"
                  disabled={addToCart.pending || (item.stock !== null && item.stock !== undefined && item.stock <= 0)}
                  onClick={() => void addToCart.run()}
                >
                  {addToCart.pending ? 'Adding…' : 'Add to cart'}
                </button>
                <button
                  className="button button-outline"
                  type="button"
                  onClick={() => navigate('/app/cart')}
                >
                  Go to cart
                </button>
              </div>
            </Panel>
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Order detail                                                                */
/* -------------------------------------------------------------------------- */

type OrderDetail = {
  id: number;
  reference?: string;
  status?: string;
  total?: string | number;
  currency?: string;
  created_at?: string;
  items?: {
    id: number;
    quantity?: number;
    price?: string | number;
    product?: { name?: string; image?: string | null };
  }[];
};

export function OrderPage() {
  const { id = '' } = useParams();
  const order = useApi<OrderDetail>(`/orders/${id}`, [id]);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const pay = useMutation(async (amount: number, currency: string) => {
    const init = await payments.initialize(amount, 'order', currency, { order_id: id });
    if (!goToCheckout(init)) throw new Error('Could not start checkout.');
    return init;
  });

  async function downloadReceipt() {
    setReceiptError(null);
    try {
      const data = await api.get<{ url?: string }>(`/orders/${id}/receipt`);
      if (data?.url) window.open(data.url, '_blank', 'noopener');
      else setReceiptError('Receipt is not available yet.');
    } catch (e) {
      setReceiptError(e instanceof Error ? e.message : 'Could not fetch the receipt.');
    }
  }

  const o = order.data;
  const currency = o?.currency ?? 'KES';

  return (
    <>
      <PageHeader
        title={o?.reference ?? `Order #${id}`}
        subtitle={o?.created_at ? `Placed ${formatDate(o.created_at, true)}` : 'Order details'}
        actions={
          <>
            <button className="button button-outline button-sm" type="button" onClick={downloadReceipt}>
              Receipt
            </button>
            <Link className="button button-outline button-sm" to="/app/orders">
              All orders
            </Link>
          </>
        }
      />

      {receiptError && <Alert>{receiptError}</Alert>}
      {pay.error && <Alert>{pay.error}</Alert>}

      <DataState
        loading={order.loading}
        error={order.error}
        data={o}
        onRetry={order.reload}
        skeletonRows={2}
        empty={{ title: 'Order not found' }}
      >
        {(item) => (
          <>
            <div className="grid-3" style={{ marginBottom: 26 }}>
              <Stat label="Status" value={item.status ?? 'Pending'} />
              <Stat label="Total" value={formatMoney(item.total, currency)} />
              <Stat label="Items" value={formatNumber(item.items?.length ?? 0)} />
            </div>

            <Section title="Items">
              <Panel className="panel-flush">
                {(item.items ?? []).map((line) => (
                  <Row
                    key={line.id}
                    media={
                      mediaUrl(line.product?.image) ? (
                        <img src={mediaUrl(line.product?.image)!} alt="" loading="lazy" />
                      ) : null
                    }
                    title={line.product?.name ?? 'Item'}
                    meta={`Qty ${line.quantity ?? 1}`}
                    right={<span>{formatMoney(line.price, currency)}</span>}
                  />
                ))}
              </Panel>
            </Section>

            {item.status !== 'paid' && item.status !== 'delivered' && (
              <Panel>
                <p className="muted" style={{ marginTop: 0 }}>
                  This order is awaiting payment.
                </p>
                <button
                  className="button button-green button-sm"
                  type="button"
                  disabled={pay.pending}
                  onClick={() => void pay.run(Number(item.total ?? 0), currency)}
                >
                  {pay.pending ? 'Opening checkout…' : `Pay ${formatMoney(item.total, currency)}`}
                </button>
              </Panel>
            )}
          </>
        )}
      </DataState>
    </>
  );
}
