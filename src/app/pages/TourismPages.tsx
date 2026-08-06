import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatDate, formatMoney } from '../../lib/format';
import { goToCheckout, type PaystackInit } from '../../lib/payments';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Section } from '../ui';

type Company = {
  id?: number;
  name?: string;
  slug?: string;
  logo?: string | null;
  description?: string | null;
  city?: string | null;
  country?: string | null;
};

type DateSlot = {
  id: number;
  travel_date?: string;
  capacity?: number | null;
  booked_count?: number | null;
};

type Destination = {
  id: number;
  name?: string;
  slug?: string;
  tagline?: string | null;
  summary?: string | null;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  cover_image?: string | null;
  price?: number | string | null;
  currency?: string | null;
  duration_days?: number | null;
  max_guests?: number | null;
  booking_enabled?: boolean;
  date_mode?: 'flexible' | 'fixed' | string;
  highlights?: string[] | null;
  includes?: string[] | null;
  meeting_point?: string | null;
  company?: Company | null;
  available_dates?: DateSlot[] | null;
};

function placeOf(d?: Destination | null) {
  return [d?.city, d?.country].filter(Boolean).join(', ') || 'Africa';
}

export function TourismPage() {
  const navigate = useNavigate();
  const list = useApi<unknown>('/tourism', [], { per_page: 40 });
  const destinations = extractList<Destination>(list.data);

  return (
    <>
      <PageHeader
        title="Tourism"
        subtitle="Tours from partner companies across Africa — pick a date and pay securely with Paystack."
        actions={
          <>
            <Link className="button button-outline button-sm" to="/app/tourism/bookings">
              My bookings
            </Link>
            <Link className="button button-outline button-sm" to="/app/community">
              Community
            </Link>
          </>
        }
      />

      <DataState
        loading={list.loading}
        error={list.error}
        data={destinations}
        onRetry={list.reload}
        empty={{ title: 'No tours yet', body: 'Partner tour companies will publish trips here.' }}
      >
        {(items) => (
          <div className="grid-2">
            {items.map((d) => {
              const price = Number(d.price ?? 0);
              const cover = mediaUrl(d.cover_image);
              return (
                <Panel key={d.id} className="panel-flush">
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                    />
                  ) : null}
                  <div style={{ padding: 16 }}>
                    {d.company?.name ? (
                      <span style={{ fontSize: 12, color: 'var(--green, #14A06E)', fontWeight: 600 }}>
                        {d.company.name}
                      </span>
                    ) : null}
                    <strong style={{ display: 'block', fontSize: 17, marginTop: 4 }}>{d.name}</strong>
                    <p style={{ margin: '6px 0 10px', color: 'var(--muted)', fontSize: 13 }}>
                      {d.tagline || d.summary || placeOf(d)}
                    </p>
                    <div className="inline" style={{ justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13 }}>
                        {placeOf(d)} · {d.duration_days ?? 1}d ·{' '}
                        {d.date_mode === 'fixed' ? 'Fixed dates' : 'Open calendar'} ·{' '}
                        {price <= 0 ? 'Free' : formatMoney(price, d.currency ?? 'USD')}
                      </span>
                      <button
                        type="button"
                        className="button button-green button-sm"
                        onClick={() => navigate(`/app/tourism/${d.slug}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        )}
      </DataState>
    </>
  );
}

export function TourismDetailPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const dest = useApi<Destination>(`/tourism/${slug}`, [slug]);
  const [guests, setGuests] = useState(1);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [dateId, setDateId] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const d = dest.data;
  const fixed = d?.date_mode === 'fixed';
  const slots = d?.available_dates ?? [];

  const book = useMutation(async () => {
    const selected = fixed
      ? slots.find((s) => s.id === dateId) ?? slots[0]
      : null;
    const date = fixed ? (selected?.travel_date ?? '').slice(0, 10) : travelDate;
    if (!date) throw new Error('Please select a travel date.');

    const res = await api.post<{
      booking?: unknown;
      payment?: PaystackInit;
      requires_payment?: boolean;
    }>(`/tourism/${slug}/book`, {
      guests,
      travel_date: date,
      destination_date_id: selected?.id,
      contact_phone: phone || undefined,
      notes: notes || undefined,
      callback_url: `${window.location.origin}/app/payment/return`,
    });

    if (res?.payment && goToCheckout(res.payment)) return;
    setNotice('Successfully booked! Your tour is confirmed.');
  });

  const price = Number(d?.price ?? 0);
  const currency = d?.currency ?? 'USD';
  const cover = mediaUrl(d?.cover_image);
  const total = useMemo(() => price * guests, [price, guests]);
  const maxGuests = d?.max_guests ?? 50;
  const companyLogo = mediaUrl(d?.company?.logo);

  return (
    <>
      <PageHeader
        title={d?.name ?? 'Tour'}
        subtitle={d?.tagline ?? placeOf(d)}
        actions={
          <Link className="button button-outline button-sm" to="/app/tourism">
            All tours
          </Link>
        }
      />

      {dest.error && <Alert>{dest.error}</Alert>}
      {book.error && <Alert>{book.error}</Alert>}
      {notice && <Alert kind="success">{notice}</Alert>}

      {cover ? (
        <img
          src={cover}
          alt=""
          style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 16, marginBottom: 20 }}
        />
      ) : null}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="stack">
          {d?.company ? (
            <Panel>
              <div className="inline" style={{ gap: 12 }}>
                {companyLogo ? (
                  <img src={companyLogo} alt="" width={48} height={48} style={{ borderRadius: 12, objectFit: 'cover' }} />
                ) : null}
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Operated by</div>
                  <strong>{d.company.name}</strong>
                  {d.company.description ? (
                    <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 13 }}>{d.company.description}</p>
                  ) : null}
                </div>
              </div>
            </Panel>
          ) : null}

          <Panel>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{d?.summary ?? d?.description ?? 'Loading…'}</p>
            <div className="inline" style={{ marginTop: 16, gap: 8, flexWrap: 'wrap' }}>
              <Badge>{placeOf(d)}</Badge>
              <Badge>{d?.duration_days ?? 1} day(s)</Badge>
              <Badge>{fixed ? 'Fixed dates' : 'Open calendar'}</Badge>
              <Badge tone="green">{price <= 0 ? 'Free' : `${formatMoney(price, currency)} / guest`}</Badge>
            </div>
          </Panel>

          {(d?.highlights?.length ?? 0) > 0 && (
            <Section title="Highlights">
              <Panel>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {d!.highlights!.map((h) => (
                    <li key={h} style={{ marginBottom: 6 }}>
                      {h}
                    </li>
                  ))}
                </ul>
              </Panel>
            </Section>
          )}
        </div>

        <Panel>
          <h3 style={{ marginTop: 0 }}>Book &amp; pay with Paystack</h3>
          {d?.booking_enabled === false ? (
            <p style={{ color: 'var(--muted)' }}>Bookings are currently closed for this tour.</p>
          ) : (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                void book.run();
              }}
            >
              {fixed ? (
                <label>
                  Departure date
                  <select
                    required
                    value={dateId ?? ''}
                    onChange={(e) => setDateId(Number(e.target.value) || null)}
                  >
                    <option value="">Select a date</option>
                    {slots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {formatDate(s.travel_date)}
                        {s.capacity != null
                          ? ` · ${Math.max(0, (s.capacity ?? 0) - (s.booked_count ?? 0))} left`
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label>
                  Travel date
                  <input
                    type="date"
                    required
                    value={travelDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </label>
              )}
              <label>
                Guests
                <input
                  type="number"
                  min={1}
                  max={maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                />
              </label>
              <label>
                Contact phone (optional)
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label>
                Notes (optional)
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              <p style={{ margin: 0, fontWeight: 600 }}>
                Total: {price <= 0 ? 'Free' : formatMoney(total, currency)}
              </p>
              <button className="button button-green" type="submit" disabled={book.pending}>
                {book.pending ? 'Starting checkout…' : price > 0 ? 'Pay with Paystack' : 'Confirm booking'}
              </button>
              <button className="button button-outline" type="button" onClick={() => navigate('/app/tourism')}>
                Back to list
              </button>
            </form>
          )}
        </Panel>
      </div>
    </>
  );
}

type TourismBooking = {
  id: number;
  reference?: string;
  status?: string;
  guests?: number;
  travel_date?: string;
  total_amount?: number | string;
  currency?: string;
  destination?: Destination | null;
};

export function TourismBookingsPage() {
  const bookings = useApi<unknown>('/me/tourism-bookings');
  const list = extractList<TourismBooking>(bookings.data);

  return (
    <>
      <PageHeader
        title="Tourism bookings"
        subtitle="Your tour orders — confirmed trips and payment status."
        actions={
          <Link className="button button-green button-sm" to="/app/tourism">
            Browse tours
          </Link>
        }
      />

      <Section title="Your bookings">
        <Panel className="panel-flush">
          <DataState
            loading={bookings.loading}
            error={bookings.error}
            data={list}
            onRetry={bookings.reload}
            empty={{ title: 'No tourism bookings yet', body: 'When you book a tour, it will show up here.' }}
          >
            {(rows) =>
              rows.map((b) => (
                <div key={b.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border, #e5e5e5)' }}>
                  <div className="inline" style={{ justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <strong style={{ display: 'block' }}>{b.destination?.name ?? 'Tour'}</strong>
                      <span className="muted" style={{ fontSize: 13 }}>
                        {[
                          b.destination?.company?.name,
                          b.travel_date ? formatDate(b.travel_date) : null,
                          b.guests ? `${b.guests} guest${b.guests === 1 ? '' : 's'}` : null,
                          b.reference ? `Ref ${b.reference}` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600 }}>
                        {Number(b.total_amount ?? 0) <= 0
                          ? 'Free'
                          : formatMoney(b.total_amount, b.currency ?? 'USD')}
                      </div>
                      <Badge tone={b.status === 'confirmed' ? 'green' : 'gold'}>
                        {(b.status ?? 'pending').replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}

