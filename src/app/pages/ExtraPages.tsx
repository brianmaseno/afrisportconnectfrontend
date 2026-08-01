import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatDate, formatMoney, formatNumber } from '../../lib/format';
import { Alert, TextField } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';
import type { EventItem } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* Event detail — gallery, cover, RSVP                                         */
/* -------------------------------------------------------------------------- */

export function EventPage() {
  const { slug = '' } = useParams();
  const event = useApi<EventItem>(`/events/${slug}`, [slug]);
  const gallery = useApi<unknown>(`/events/${slug}/gallery`, [slug]);

  const [notice, setNotice] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);

  const rsvp = useMutation(async () => {
    await api.post(`/events/${slug}/rsvp`);
    setNotice('You are on the list for this event.');
  });

  const uploadPhoto = useMutation(async (file: File) => {
    const form = new FormData();
    form.append('photo', file);
    await api.post(`/events/${slug}/gallery`, form);
    setNotice('Photo added to the gallery.');
    gallery.reload();
  });

  const uploadCover = useMutation(async (file: File) => {
    const form = new FormData();
    form.append('cover', file);
    await api.post(`/events/${slug}/cover`, form);
    setNotice('Cover image updated.');
    event.reload();
  });

  const e = event.data;
  const photos = extractList<{ id: number; url?: string; path?: string; caption?: string }>(
    gallery.data,
  );
  const error = rsvp.error ?? uploadPhoto.error ?? uploadCover.error;

  return (
    <>
      <PageHeader
        title={e?.title ?? 'Event'}
        subtitle={[e?.location, formatDate(e?.starts_at, true)].filter(Boolean).join(' · ')}
        actions={
          <>
            <button
              className="button button-green button-sm"
              type="button"
              disabled={rsvp.pending}
              onClick={() => void rsvp.run()}
            >
              {rsvp.pending ? 'Saving…' : 'RSVP'}
            </button>
            <Link className="button button-outline button-sm" to="/app/events">
              All events
            </Link>
          </>
        }
      />

      {error && <Alert>{error}</Alert>}
      {notice && <Alert kind="success">{notice}</Alert>}

      <DataState
        loading={event.loading}
        error={event.error}
        data={e}
        onRetry={event.reload}
        skeletonRows={2}
        empty={{ title: 'Event not found' }}
      >
        {(item) => (
          <>
            {mediaUrl(item.cover) && (
              <img
                className="event-cover"
                style={{ maxHeight: 300, objectFit: 'cover', marginBottom: 22 }}
                src={mediaUrl(item.cover)!}
                alt=""
              />
            )}

            <div className="grid-3" style={{ marginBottom: 24 }}>
              <Stat label="Starts" value={formatDate(item.starts_at, true)} />
              <Stat label="Ends" value={formatDate(item.ends_at, true)} />
              <Stat
                label="Entry"
                value={item.is_free ? 'Free' : formatMoney(item.price)}
              />
            </div>

            <Panel style={{ marginBottom: 24 }}>
              <p style={{ marginTop: 0, fontSize: 15, lineHeight: 1.65 }}>
                {item.description ?? 'No description provided.'}
              </p>
            </Panel>
          </>
        )}
      </DataState>

      <Section
        title="Gallery"
        action={
          <div className="inline">
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                if (f) void uploadPhoto.run(f);
              }}
            />
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                if (f) void uploadCover.run(f);
              }}
            />
            <button
              className="button button-outline button-sm"
              type="button"
              disabled={uploadPhoto.pending}
              onClick={() => photoRef.current?.click()}
            >
              {uploadPhoto.pending ? 'Uploading…' : 'Add photo'}
            </button>
            <button
              className="button button-outline button-sm"
              type="button"
              disabled={uploadCover.pending}
              onClick={() => coverRef.current?.click()}
            >
              {uploadCover.pending ? 'Uploading…' : 'Set cover'}
            </button>
          </div>
        }
      >
        <DataState
          loading={gallery.loading}
          error={gallery.error}
          data={photos}
          onRetry={gallery.reload}
          empty={{ title: 'No photos yet', body: 'Be the first to add a photo from this event.' }}
        >
          {(items) => (
            <div className="grid-4">
              {items.map((p) => (
                <div key={p.id} className="product-media" style={{ aspectRatio: '4 / 3' }}>
                  {mediaUrl(p.url ?? p.path) && (
                    <img src={mediaUrl(p.url ?? p.path)!} alt={p.caption ?? ''} loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          )}
        </DataState>
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Institutions                                                                */
/* -------------------------------------------------------------------------- */

type Institution = {
  id: number;
  slug?: string;
  name?: string;
  type?: string | null;
  description?: string | null;
  logo?: string | null;
  country?: { name?: string } | string | null;
};

export function InstitutionsPage() {
  const institutions = useApi<unknown>('/institutions', [], { per_page: 40 });
  const partners = useApi<unknown>('/opportunities/institutions');

  const list = extractList<Institution>(institutions.data);
  const oppPartners = extractList<Institution>(partners.data);

  return (
    <>
      <PageHeader
        title="Institutions"
        subtitle="Federations, academies, schools and organisations in the ecosystem."
      />

      <DataState
        loading={institutions.loading}
        error={institutions.error}
        data={list}
        onRetry={institutions.reload}
        empty={{ title: 'No institutions listed' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((i) => (
              <Panel key={i.id}>
                <div className="inline" style={{ gap: 12, marginBottom: 10 }}>
                  <span className="club-card-crest" style={{ width: 44, height: 44 }}>
                    {mediaUrl(i.logo) ? (
                      <img src={mediaUrl(i.logo)!} alt="" loading="lazy" />
                    ) : (
                      (i.name ?? '??').slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <div>
                    <strong style={{ display: 'block' }}>{i.name}</strong>
                    {i.type && (
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {i.type}
                      </span>
                    )}
                  </div>
                </div>
                <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
                  {i.description ?? ''}
                </p>
              </Panel>
            ))}
          </div>
        )}
      </DataState>

      {oppPartners.length > 0 && (
        <Section title="Opportunity partners">
          <Panel className="panel-flush">
            {oppPartners.map((i) => (
              <Row key={i.id} title={i.name ?? 'Institution'} meta={i.type ?? ''} />
            ))}
          </Panel>
        </Section>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Verify — passport / ticket check                                            */
/* -------------------------------------------------------------------------- */

export function VerifyPage() {
  const [code, setCode] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [ticketResult, setTicketResult] = useState<Record<string, unknown> | null>(null);

  const verify = useMutation(async () => {
    const res = await api.get<Record<string, unknown>>('/trust/verify', {
      query: { code: code.trim() },
    });
    setResult(res ?? {});
    return res;
  });

  const scan = useMutation(async () => {
    const res = await api.post<Record<string, unknown>>('/tickets/scan', {
      code: ticketCode.trim(),
    });
    setTicketResult(res ?? {});
    return res;
  });

  return (
    <>
      <PageHeader
        title="Verify"
        subtitle="Check a Fan Passport number or scan a ticket reference at the gate."
      />

      <div className="grid-2">
        <Section title="Verify a Fan Passport">
          <Panel>
            {verify.error && <Alert>{verify.error}</Alert>}
            <TextField
              label="Member number"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CCA-KE-000000"
            />
            <button
              className="button button-green button-sm"
              type="button"
              disabled={verify.pending || !code.trim()}
              onClick={() => void verify.run()}
            >
              {verify.pending ? 'Checking…' : 'Verify'}
            </button>

            {result && (
              <div className="stack" style={{ marginTop: 16 }}>
                {Object.entries(result)
                  .filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v))
                  .map(([k, v]) => (
                    <Row
                      key={k}
                      title={k.replace(/_/g, ' ')}
                      right={
                        typeof v === 'boolean' ? (
                          <Badge tone={v ? 'green' : 'red'}>{v ? 'Yes' : 'No'}</Badge>
                        ) : (
                          <span>{String(v)}</span>
                        )
                      }
                    />
                  ))}
              </div>
            )}
          </Panel>
        </Section>

        <Section title="Scan a ticket">
          <Panel>
            {scan.error && <Alert>{scan.error}</Alert>}
            <TextField
              label="Ticket reference"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              placeholder="TKT-000000"
            />
            <button
              className="button button-green button-sm"
              type="button"
              disabled={scan.pending || !ticketCode.trim()}
              onClick={() => void scan.run()}
            >
              {scan.pending ? 'Checking…' : 'Scan ticket'}
            </button>

            {ticketResult && (
              <Alert kind="success">
                {String(ticketResult.message ?? 'Ticket is valid.')}
              </Alert>
            )}
          </Panel>
        </Section>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Sponsor / campaign dashboard                                                */
/* -------------------------------------------------------------------------- */

type Campaign = {
  id: number;
  name?: string;
  title?: string;
  status?: string;
  budget?: string | number;
  impressions?: number;
  clicks?: number;
  starts_at?: string | null;
  ends_at?: string | null;
};

export function SponsorPage() {
  const { user } = useAuth();

  // /dashboard and /analytics/dashboard are role-gated; for a plain fan the API
  // answers with a redirect to the admin login, which surfaces as an opaque
  // CORS failure. Only call them when the account actually has the role.
  const privileged = (user?.roles ?? []).some((r) =>
    ['sponsor', 'admin', 'super_admin', 'business'].includes(r),
  );

  const dashboard = useApi<Record<string, unknown>>(privileged ? '/dashboard' : null);
  const analytics = useApi<Record<string, unknown>>(privileged ? '/analytics/dashboard' : null);
  const campaigns = useApi<unknown>('/campaigns');

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const list = extractList<Campaign>(campaigns.data);

  const create = useMutation(async () => {
    await api.post('/campaigns', { name: name.trim(), budget: Number(budget) || 0 });
    setName('');
    setBudget('');
    setNotice('Campaign created.');
    campaigns.reload();
  });

  const pause = useMutation(async (id: number, status: string) => {
    await api.put(`/campaigns/${id}`, { status });
    campaigns.reload();
  });

  const feedback = useMutation(async (id: number) => {
    await api.post(`/campaigns/${id}/feedback`, { sentiment: 'positive' });
    setNotice('Feedback recorded.');
  });

  const stats = { ...(dashboard.data ?? {}), ...(analytics.data ?? {}) };
  const numericStats = Object.entries(stats).filter(([, v]) => typeof v === 'number') as [
    string,
    number,
  ][];

  return (
    <>
      <PageHeader
        title="Sponsor dashboard"
        subtitle="Campaign performance and reach across the Afrisport Connect community."
      />

      {(create.error || pause.error || feedback.error) && (
        <Alert>{create.error ?? pause.error ?? feedback.error}</Alert>
      )}
      {notice && <Alert kind="success">{notice}</Alert>}

      {!privileged && (
        <Alert kind="info">
          Campaign analytics need a sponsor or business role on your account. Ask an
          administrator to grant access — the campaign list below still works.
        </Alert>
      )}

      {numericStats.length > 0 && (
        <div className="grid-4" style={{ marginBottom: 30 }}>
          {numericStats.slice(0, 8).map(([k, v]) => (
            <Stat key={k} label={k.replace(/_/g, ' ')} value={formatNumber(v)} />
          ))}
        </div>
      )}

      <Section title="Create a campaign">
        <Panel>
          <div className="inline">
            <input
              className="field-input"
              style={{ maxWidth: 280 }}
              placeholder="Campaign name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Campaign name"
            />
            <input
              className="field-input"
              style={{ maxWidth: 160 }}
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              aria-label="Budget"
            />
            <button
              className="button button-green button-sm"
              type="button"
              disabled={create.pending || !name.trim()}
              onClick={() => void create.run()}
            >
              {create.pending ? 'Creating…' : 'Create campaign'}
            </button>
          </div>
        </Panel>
      </Section>

      <Section title="Campaigns">
        <Panel className="panel-flush">
          <DataState
            loading={campaigns.loading}
            error={campaigns.error}
            data={list}
            onRetry={campaigns.reload}
            empty={{
              title: 'No campaigns',
              body: 'Create a campaign above, or ask an admin to grant sponsor access.',
            }}
          >
            {(items) =>
              items.map((c) => (
                <Row
                  key={c.id}
                  title={c.name ?? c.title ?? `Campaign ${c.id}`}
                  meta={[
                    c.budget !== undefined ? formatMoney(c.budget) : null,
                    c.impressions !== undefined ? `${formatNumber(c.impressions)} impressions` : null,
                    c.clicks !== undefined ? `${formatNumber(c.clicks)} clicks` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  right={
                    <>
                      <Badge tone={c.status === 'active' ? 'green' : 'neutral'}>
                        {c.status ?? 'draft'}
                      </Badge>
                      <button
                        className="button button-outline button-sm"
                        type="button"
                        disabled={pause.pending}
                        onClick={() =>
                          void pause.run(c.id, c.status === 'active' ? 'paused' : 'active')
                        }
                      >
                        {c.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        className="button button-outline button-sm"
                        type="button"
                        disabled={feedback.pending}
                        onClick={() => void feedback.run(c.id)}
                      >
                        Feedback
                      </button>
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
