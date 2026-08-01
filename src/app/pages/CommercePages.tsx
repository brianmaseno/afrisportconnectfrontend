import { Link, useNavigate } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { goToCheckout, payments } from '../../lib/payments';
import { formatDate, formatMoney, formatNumber } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';

/* -------------------------------------------------------------------------- */
/* Cart                                                                        */
/* -------------------------------------------------------------------------- */

type CartItem = {
  id: number;
  quantity?: number;
  price?: string | number;
  subtotal?: string | number;
  product?: { id: number; name?: string; image?: string | null; price?: string | number; currency?: string };
};

export function CartPage() {
  const cart = useApi<unknown>('/cart');
  const items = extractList<CartItem>(cart.data);

  const currency =
    items[0]?.product?.currency ??
    (cart.data as { currency?: string } | null)?.currency ??
    'KES';

  const update = useMutation(async (id: number, quantity: number) => {
    await api.put(`/cart/items/${id}`, { quantity });
    cart.reload();
  });

  const remove = useMutation(async (id: number) => {
    await api.delete(`/cart/items/${id}`);
    cart.reload();
  });

  const navigate = useNavigate();

  /**
   * Checkout creates the order, then starts a Paystack session for it. If the
   * gateway is unavailable the order still exists, so we send the user to it
   * rather than losing the purchase.
   */
  const checkout = useMutation(async (amount: number, currency: string) => {
    const order = await api.post<{ id?: number; reference?: string; total?: string | number }>(
      '/orders',
    );
    cart.reload();

    try {
      const init = await payments.initialize(Number(order?.total ?? amount), 'order', currency, {
        order_id: order?.id,
      });
      if (goToCheckout(init)) return order;
    } catch {
      /* fall through to the order page */
    }

    navigate(order?.id ? `/app/orders/${order.id}` : '/app/orders');
    return order;
  });

  const total = items.reduce((sum, i) => {
    const line = Number(i.subtotal ?? 0) || Number(i.price ?? i.product?.price ?? 0) * (i.quantity ?? 1);
    return sum + line;
  }, 0);

  return (
    <>
      <PageHeader
        title="Cart"
        subtitle="Review your items before checking out."
        actions={
          items.length > 0 ? (
            <button
              className="button button-green button-sm"
              type="button"
              disabled={checkout.pending}
              onClick={() => void checkout.run(total, currency)}
            >
              {checkout.pending ? 'Placing order…' : `Checkout · ${formatMoney(total, currency)}`}
            </button>
          ) : null
        }
      />

      {(update.error || remove.error || checkout.error) && (
        <Alert>{update.error ?? remove.error ?? checkout.error}</Alert>
      )}

      <Panel className="panel-flush">
        <DataState
          loading={cart.loading}
          error={cart.error}
          data={items}
          onRetry={cart.reload}
          empty={{ title: 'Your cart is empty', body: 'Add something from the shop to get started.' }}
        >
          {(rows) =>
            rows.map((i) => (
              <Row
                key={i.id}
                media={
                  mediaUrl(i.product?.image) ? (
                    <img src={mediaUrl(i.product?.image)!} alt="" loading="lazy" />
                  ) : null
                }
                title={i.product?.name ?? 'Item'}
                meta={formatMoney(i.price ?? i.product?.price, currency)}
                right={
                  <>
                    <input
                      className="field-input qty-input"
                      type="number"
                      min={1}
                      max={99}
                      defaultValue={i.quantity ?? 1}
                      aria-label="Quantity"
                      onBlur={(e) => {
                        const q = Number(e.target.value);
                        if (q >= 1 && q !== i.quantity) void update.run(i.id, q);
                      }}
                    />
                    <button
                      className="button button-outline button-sm"
                      type="button"
                      disabled={remove.pending}
                      onClick={() => void remove.run(i.id)}
                    >
                      Remove
                    </button>
                  </>
                }
              />
            ))
          }
        </DataState>
      </Panel>

      {items.length > 0 && (
        <Panel style={{ marginTop: 18 }}>
          <div className="inline" style={{ justifyContent: 'space-between' }}>
            <strong>Total</strong>
            <span className="stat-tile-value" style={{ fontSize: 24 }}>
              {formatMoney(total, currency)}
            </span>
          </div>
        </Panel>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Orders                                                                      */
/* -------------------------------------------------------------------------- */

type Order = {
  id: number;
  reference?: string;
  status?: string;
  total?: string | number;
  currency?: string;
  created_at?: string;
  items_count?: number;
};

export function OrdersPage() {
  const orders = useApi<unknown>('/orders');
  const list = extractList<Order>(orders.data);

  const spent = list.reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  return (
    <>
      <PageHeader title="Orders" subtitle="Everything you have bought through the marketplace." />

      <div className="grid-3" style={{ marginBottom: 28 }}>
        <Stat label="Orders" value={formatNumber(list.length)} />
        <Stat label="Total spent" value={formatMoney(spent, list[0]?.currency ?? 'KES')} />
        <Stat
          label="Delivered"
          value={formatNumber(list.filter((o) => o.status === 'delivered').length)}
        />
      </div>

      <Section title="Order history">
        <Panel className="panel-flush">
          <DataState
            loading={orders.loading}
            error={orders.error}
            data={list}
            onRetry={orders.reload}
            empty={{ title: 'No orders yet', body: 'Your marketplace orders will appear here.' }}
          >
            {(rows) =>
              rows.map((o) => (
                <Link key={o.id} to={`/app/orders/${o.id}`}>
                  <Row
                    title={o.reference ?? `Order #${o.id}`}
                    meta={[
                      formatDate(o.created_at),
                      o.items_count ? `${o.items_count} items` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                    right={
                      <>
                        <span>{formatMoney(o.total, o.currency ?? 'KES')}</span>
                        <Badge tone={o.status === 'delivered' ? 'green' : 'gold'}>
                          {o.status ?? 'Pending'}
                        </Badge>
                      </>
                    }
                  />
                </Link>
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}
