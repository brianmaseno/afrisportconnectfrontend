import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../lib/auth';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { goToCheckout, payments } from '../../lib/payments';
import { formatDate, formatMoney, formatNumber, relativeTime } from '../../lib/format';
import { Alert, TextField } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';
import type { MembershipTier, NotificationItem, RewardBalance, Ticket } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* Profile                                                                     */
/* -------------------------------------------------------------------------- */

export function ProfilePage() {
  const { user, refresh } = useAuth();

  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setOccupation(user?.occupation ?? '');
  }, [user]);

  const save = useMutation(async () => {
    await api.put('/auth/profile', { name: name.trim(), occupation: occupation.trim() || null });
    await refresh();
    setSaved(true);
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(false);
    await save.run();
  }

  const avatar = mediaUrl(user?.avatar);

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details as they appear across Afrisport Connect." />

      <div className="grid-2">
        <Panel>
          <form onSubmit={onSubmit} noValidate>
            {save.error && <Alert>{save.error}</Alert>}
            {saved && <Alert kind="success">Profile updated.</Alert>}

            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={save.fieldErrors?.name?.[0]}
              required
            />
            <TextField
              label="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Optional"
            />
            <TextField label="Email" value={user?.email ?? '—'} disabled readOnly />
            <TextField label="Phone" value={user?.phone ?? '—'} disabled readOnly />

            <button className="button button-green" type="submit" disabled={save.pending}>
              {save.pending ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </Panel>

        <div className="stack">
          <Panel>
            <div className="inline" style={{ gap: 16 }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : null}
              <div>
                <strong style={{ display: 'block', fontSize: 18 }}>{user?.name}</strong>
                <span className="muted">{user?.membership?.tier?.name ?? 'Free'} member</span>
              </div>
            </div>
          </Panel>

          <div className="grid-2">
            <Stat label="Club" value={user?.preferred_club?.name ?? '—'} />
            <Stat label="Country" value={user?.country?.name ?? '—'} />
            <Stat label="Referral code" value={user?.referral_code ?? '—'} />
            <Stat label="Loyalty" value={formatNumber(user?.loyalty_points)} hint={user?.loyalty_level ?? undefined} />
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Security                                                                    */
/* -------------------------------------------------------------------------- */

export function SecurityPage() {
  const history = useApi<unknown>('/auth/login-history');
  const events = extractList<{
    id: number;
    status?: string;
    provider?: string;
    ip_address?: string;
    user_agent?: string;
    created_at?: string;
  }>(history.data);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const change = useMutation(async () =>
    api.post('/auth/change-password', {
      current_password: current,
      password: next,
      password_confirmation: confirm,
    }),
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(false);
    setLocalError(null);
    if (next.length < 8) return setLocalError('New password must be at least 8 characters.');
    if (next !== confirm) return setLocalError('New passwords do not match.');

    const res = await change.run();
    if (res !== null) {
      setDone(true);
      setCurrent('');
      setNext('');
      setConfirm('');
    }
  }

  return (
    <>
      <PageHeader title="Security" subtitle="Password, two-factor authentication and recent sign-in activity." />

      <div className="grid-2">
        <Section title="Change password">
          <Panel>
            <form onSubmit={onSubmit} noValidate>
              {(localError || change.error) && <Alert>{localError ?? change.error}</Alert>}
              {done && <Alert kind="success">Password updated.</Alert>}

              <TextField
                label="Current password"
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
              />
              <TextField
                label="New password"
                type="password"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                hint="At least 8 characters."
                required
              />
              <TextField
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button className="button button-green" type="submit" disabled={change.pending}>
                {change.pending ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </Panel>
        </Section>

        <Section title="Two-factor authentication">
          <MfaPanel />
        </Section>
      </div>

      <Section title="Recent sign-in activity">
        <Panel className="panel-flush">
          <DataState
            loading={history.loading}
            error={history.error}
            data={events}
            onRetry={history.reload}
            empty={{ title: 'No sign-in history yet' }}
          >
            {(items) =>
              items.map((ev) => (
                <Row
                  key={ev.id}
                  title={ev.ip_address ?? 'Unknown device'}
                  meta={ev.user_agent ?? ev.provider ?? ''}
                  right={
                    <>
                      <Badge tone={ev.status === 'success' ? 'green' : 'red'}>{ev.status ?? '—'}</Badge>
                      <span>{relativeTime(ev.created_at)}</span>
                    </>
                  }
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}

/** Enable / confirm / disable the account's second factor. */
function MfaPanel() {
  const { user, refresh } = useAuth();
  const [stage, setStage] = useState<'idle' | 'confirm'>('idle');
  const [code, setCode] = useState('');
  const [channel, setChannel] = useState<string>('');
  const [done, setDone] = useState<string | null>(null);

  const enable = useMutation(async () => {
    const res = await api.post<{ channel?: string; message?: string }>('/auth/mfa/enable');
    setChannel(res?.channel ?? '');
    setStage('confirm');
    return res;
  });

  const confirm = useMutation(async () => {
    await api.post('/auth/mfa/confirm', { code: code.trim() });
    await refresh();
    setStage('idle');
    setCode('');
    setDone('Two-factor authentication is on.');
  });

  const disable = useMutation(async () => {
    await api.post('/auth/mfa/disable');
    await refresh();
    setDone('Two-factor authentication is off.');
  });

  const error = enable.error ?? confirm.error ?? disable.error;

  return (
    <Panel>
      {error && <Alert>{error}</Alert>}
      {done && <Alert kind="success">{done}</Alert>}

      <div className="inline" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <strong style={{ display: 'block' }}>Status</strong>
          <span className="muted">
            {user?.mfa_enabled
              ? 'Enabled — you confirm a code at each sign in.'
              : 'Add a second step when signing in.'}
          </span>
        </div>
        <Badge tone={user?.mfa_enabled ? 'green' : 'neutral'}>
          {user?.mfa_enabled ? 'On' : 'Off'}
        </Badge>
      </div>

      {stage === 'confirm' ? (
        <>
          <TextField
            label={`Code sent to your ${channel === 'email' ? 'email' : 'phone'}`}
            className="otp-input"
            inputMode="numeric"
            maxLength={6}
            placeholder="······"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
          <div className="inline">
            <button
              className="button button-green button-sm"
              type="button"
              disabled={confirm.pending || code.length < 6}
              onClick={() => void confirm.run()}
            >
              {confirm.pending ? 'Confirming…' : 'Confirm'}
            </button>
            <button
              className="button button-outline button-sm"
              type="button"
              onClick={() => {
                setStage('idle');
                setCode('');
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : user?.mfa_enabled ? (
        <button
          className="button button-outline button-sm"
          type="button"
          disabled={disable.pending}
          onClick={() => void disable.run()}
        >
          {disable.pending ? 'Disabling…' : 'Turn off two-factor'}
        </button>
      ) : (
        <button
          className="button button-green button-sm"
          type="button"
          disabled={enable.pending}
          onClick={() => void enable.run()}
        >
          {enable.pending ? 'Sending code…' : 'Turn on two-factor'}
        </button>
      )}
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                               */
/* -------------------------------------------------------------------------- */

export function NotificationsPage() {
  const list = useApi<unknown>('/notifications', [], { per_page: 40 });
  const items = extractList<NotificationItem>(list.data);

  const markAll = useMutation(async () => {
    await api.post('/notifications/read-all');
    list.reload();
  });

  const markOne = useMutation(async (id: number | string) => {
    await api.post(`/notifications/${id}/read`);
    list.reload();
  });

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Match alerts, community updates and account activity."
        actions={
          <button
            className="button button-outline button-sm"
            type="button"
            onClick={() => void markAll.run()}
            disabled={markAll.pending || items.length === 0}
          >
            {markAll.pending ? 'Marking…' : 'Mark all as read'}
          </button>
        }
      />

      <Panel className="panel-flush">
        <DataState
          loading={list.loading}
          error={list.error}
          data={items}
          onRetry={list.reload}
          empty={{ title: "You're all caught up", body: 'New notifications will appear here.' }}
        >
          {(rows) =>
            rows.map((n) => (
              <Row
                key={n.id}
                title={n.title ?? 'Notification'}
                meta={n.body ?? n.message ?? ''}
                onClick={n.read_at ? undefined : () => void markOne.run(n.id)}
                right={
                  <>
                    {!n.read_at && <Badge tone="blue">New</Badge>}
                    <span>{relativeTime(n.created_at)}</span>
                  </>
                }
              />
            ))
          }
        </DataState>
      </Panel>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Wallet, rewards & tickets                                                   */
/* -------------------------------------------------------------------------- */

export function WalletPage() {
  const { user } = useAuth();
  const wallet = useApi<{ balance?: number; currency?: string }>('/wallet');
  const balance = useApi<RewardBalance>('/rewards/balance');
  const history = useApi<unknown>('/rewards/history', [], { per_page: 20 });
  const tickets = useApi<unknown>('/tickets/mine');
  const rules = useApi<unknown>('/rewards/rules');

  const [topUpAmount, setTopUpAmount] = useState('500');

  const topUp = useMutation(async (amount: number) => {
    const init = await payments.topUpWallet(amount);
    if (!goToCheckout(init)) throw new Error('Could not open the payment page.');
    return init;
  });

  async function downloadTicket(id: number) {
    const data = await api.get<{ url?: string }>(`/tickets/${id}/download`);
    if (data?.url) window.open(data.url, '_blank', 'noopener');
  }

  const historyList = extractList<{
    id: number;
    points?: number;
    reason?: string;
    description?: string;
    created_at?: string;
  }>(history.data);
  const ticketList = extractList<Ticket>(tickets.data);

  const currency = wallet.data?.currency ?? user?.country?.currency ?? 'KES';

  return (
    <>
      <PageHeader title="Wallet & rewards" subtitle="Your balance, points earned and tickets you hold." />

      <div className="grid-3" style={{ marginBottom: 30 }}>
        <Stat
          label="Wallet balance"
          value={formatMoney(wallet.data?.balance ?? user?.wallet_balance, currency)}
        />
        <Stat
          label="Reward points"
          value={formatNumber(
            balance.data?.balance ?? balance.data?.points ?? user?.loyalty_points ?? 0,
          )}
          hint={balance.data?.level ?? user?.loyalty_level ?? undefined}
        />
        <Stat label="Tickets" value={formatNumber(ticketList.length)} />
      </div>

      <Section title="Top up your wallet">
        <Panel>
          {topUp.error && <Alert>{topUp.error}</Alert>}
          <p className="muted" style={{ marginTop: 0 }}>
            Add funds with Paystack to buy tickets and merchandise faster.
          </p>
          <div className="inline">
            {[500, 1000, 2500].map((amt) => (
              <button
                key={amt}
                type="button"
                className={`chip${String(amt) === topUpAmount ? ' chip-active' : ''}`}
                onClick={() => setTopUpAmount(String(amt))}
              >
                {formatMoney(amt, currency)}
              </button>
            ))}
            <input
              className="field-input"
              style={{ maxWidth: 140 }}
              type="number"
              min={50}
              max={500000}
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              aria-label="Top-up amount"
            />
            <button
              className="button button-green button-sm"
              type="button"
              disabled={topUp.pending || Number(topUpAmount) < 50}
              onClick={() => void topUp.run(Number(topUpAmount))}
            >
              {topUp.pending ? 'Opening…' : 'Top up'}
            </button>
          </div>
          <span className="field-hint">Minimum {formatMoney(50, currency)}.</span>
        </Panel>
      </Section>

      <div className="grid-2">
        <Section title="Points activity">
          <Panel className="panel-flush">
            <DataState
              loading={history.loading}
              error={history.error}
              data={historyList}
              onRetry={history.reload}
              empty={{ title: 'No activity yet', body: 'Earn points through events, learning and predictions.' }}
            >
              {(rows) =>
                rows.map((h) => (
                  <Row
                    key={h.id}
                    title={h.reason ?? h.description ?? 'Points'}
                    meta={formatDate(h.created_at)}
                    right={
                      <Badge tone={(h.points ?? 0) >= 0 ? 'green' : 'red'}>
                        {(h.points ?? 0) >= 0 ? '+' : ''}
                        {formatNumber(h.points)}
                      </Badge>
                    }
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>

        <Section title="My tickets">
          <Panel className="panel-flush">
            <DataState
              loading={tickets.loading}
              error={tickets.error}
              data={ticketList}
              onRetry={tickets.reload}
              empty={{ title: 'No tickets yet', body: 'Tickets you buy or claim will appear here.' }}
            >
              {(rows) =>
                rows.map((t) => (
                  <Row
                    key={t.id}
                    title={t.event?.title ?? t.reference ?? 'Ticket'}
                    meta={[t.category, formatDate(t.event?.starts_at, true)].filter(Boolean).join(' · ')}
                    right={
                      <>
                        <Badge tone="gold">{t.status ?? 'Issued'}</Badge>
                        <button
                          className="button button-outline button-sm"
                          type="button"
                          onClick={() => void downloadTicket(t.id)}
                        >
                          Download
                        </button>
                      </>
                    }
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>
      </div>

      {extractList<{ id?: number; action?: string; label?: string; points?: number }>(rules.data)
        .length > 0 && (
        <Section title="How points are earned">
          <Panel className="panel-flush">
            {extractList<{ id?: number; action?: string; label?: string; points?: number }>(
              rules.data,
            ).map((r, i) => (
              <Row
                key={r.id ?? i}
                title={r.label ?? r.action ?? 'Action'}
                right={<Badge tone="green">+{formatNumber(r.points)}</Badge>}
              />
            ))}
          </Panel>
        </Section>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Membership                                                                  */
/* -------------------------------------------------------------------------- */

export function MembershipPage() {
  const { user, refresh } = useAuth();
  const current = useApi<{ tier?: MembershipTier; status?: string; ends_at?: string }>(
    '/membership/current',
  );
  const tiers = useApi<MembershipTier[]>('/membership/tiers');
  const compare = useApi<unknown>('/membership/compare');

  const list = (tiers.data ?? []).filter((t) => t.is_visible !== false);
  const activeTierId = current.data?.tier?.id ?? user?.membership?.tier?.id;
  const comparison = extractList<Record<string, unknown>>(compare.data);

  /**
   * Free tiers activate immediately; paid tiers return a Paystack session that
   * the browser is redirected to.
   */
  const subscribe = useMutation(async (tier: MembershipTier) => {
    const init = await payments.subscribe(tier.slug);
    if (Number(tier.price) > 0 && goToCheckout(init)) return init;
    await refresh();
    current.reload();
    return init;
  });

  return (
    <>
      <PageHeader
        title="Membership"
        subtitle="What your tier includes and how to move up."
      />

      <Panel style={{ marginBottom: 30 }}>
        <div className="inline" style={{ justifyContent: 'space-between' }}>
          <div>
            <span className="stat-tile-label">Current plan</span>
            <strong style={{ display: 'block', fontSize: 22, letterSpacing: '-0.03em' }}>
              {current.data?.tier?.name ?? user?.membership?.tier?.name ?? 'Free'}
            </strong>
            {current.data?.ends_at && (
              <span className="muted">Renews {formatDate(current.data.ends_at)}</span>
            )}
          </div>
          <Badge tone="green">{current.data?.status ?? 'Active'}</Badge>
        </div>
      </Panel>

      <Section title="All tiers">
        <DataState
          loading={tiers.loading}
          error={tiers.error}
          data={list}
          onRetry={tiers.reload}
          empty={{ title: 'No tiers available' }}
        >
          {(items) => (
            <div className="grid-4">
              {items.map((t) => {
                const isCurrent = t.id === activeTierId;
                return (
                  <Panel key={t.id} className={isCurrent ? 'tier-card tier-current' : 'tier-card'}>
                    <div className="inline" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                      <strong style={{ fontSize: 17 }}>{t.name}</strong>
                      {isCurrent && <Badge tone="green">Current</Badge>}
                    </div>
                    <span className="stat-tile-value" style={{ fontSize: 26 }}>
                      {Number(t.price) > 0 ? formatMoney(t.price, t.currency ?? 'KES') : 'Free'}
                    </span>
                    <p className="muted" style={{ fontSize: 13.5, margin: '10px 0 14px' }}>
                      {t.description}
                    </p>
                    {Array.isArray(t.benefits) && t.benefits.length > 0 && (
                      <ul className="tier-benefits">
                        {t.benefits.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {!isCurrent && (
                      <button
                        className="button button-green button-sm"
                        type="button"
                        style={{ marginTop: 14 }}
                        disabled={subscribe.pending}
                        onClick={() => void subscribe.run(t)}
                      >
                        {subscribe.pending
                          ? 'Starting…'
                          : Number(t.price) > 0
                            ? 'Upgrade'
                            : 'Switch to Free'}
                      </button>
                    )}
                  </Panel>
                );
              })}
            </div>
          )}
        </DataState>
      </Section>

      {comparison.length > 0 && (
        <Section title="Compare benefits">
          <Panel className="panel-flush">
            {comparison.map((row, i) => (
              <Row
                key={i}
                title={String(row.feature ?? row.name ?? row.label ?? `Benefit ${i + 1}`)}
                meta={Object.entries(row)
                  .filter(([k]) => !['feature', 'name', 'label'].includes(k))
                  .map(([k, v]) => `${k}: ${typeof v === 'boolean' ? (v ? '✓' : '—') : String(v)}`)
                  .join('  ·  ')}
              />
            ))}
          </Panel>
        </Section>
      )}
    </>
  );
}
