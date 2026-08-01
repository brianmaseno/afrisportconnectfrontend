import { Link } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatMoney, formatNumber } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';

/* -------------------------------------------------------------------------- */
/* Founders                                                                    */
/* -------------------------------------------------------------------------- */

type FoundersPackage = {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  price?: string | number;
  currency?: string;
  benefits?: string[];
  slots?: number | null;
};

/**
 * `GET /founders` returns a single programme plus the caller's eligibility —
 * `{ package, eligible, subscribed, subscription, required_tiers }` — rather
 * than a list of packages.
 */
type FoundersState = {
  package?: FoundersPackage & { required_tier_slugs?: string[] };
  eligible?: boolean;
  subscribed?: boolean;
  subscription?: { status?: string; created_at?: string } | null;
  required_tiers?: string[];
};

export function FoundersPage() {
  const founders = useApi<FoundersState>('/founders');

  const state = founders.data;
  const pkg = state?.package;
  const requiredTiers = state?.required_tiers ?? pkg?.required_tier_slugs ?? [];

  const join = useMutation(async () => {
    await api.post('/founders/join');
    founders.reload();
  });

  return (
    <>
      <PageHeader
        title="Founders programme"
        subtitle="Back Afrisport Connect early and be recognised as part of the founding community."
      />

      {join.error && <Alert>{join.error}</Alert>}

      {state?.subscribed && (
        <Panel style={{ marginBottom: 26 }}>
          <div className="inline" style={{ justifyContent: 'space-between' }}>
            <div>
              <span className="stat-tile-label">Your founder status</span>
              <strong style={{ display: 'block', fontSize: 20 }}>{pkg?.name ?? 'Founders'}</strong>
            </div>
            <Badge tone="green">{state.subscription?.status ?? 'Active'}</Badge>
          </div>
        </Panel>
      )}

      <DataState
        loading={founders.loading}
        error={founders.error}
        data={pkg}
        onRetry={founders.reload}
        skeletonRows={2}
        empty={{ title: 'No programme open', body: 'The founders programme will be announced here.' }}
      >
        {(p) => (
          <div className="grid-2">
            <Panel className="tier-card">
              <strong style={{ display: 'block', fontSize: 19, marginBottom: 8 }}>
                {p.name ?? p.title}
              </strong>
              <span className="stat-tile-value" style={{ fontSize: 30 }}>
                {formatMoney(p.price, p.currency ?? 'KES')}
              </span>
              <p className="muted" style={{ fontSize: 14, margin: '12px 0 16px' }}>
                {p.description ?? ''}
              </p>
              {Array.isArray(p.benefits) && p.benefits.length > 0 && (
                <ul className="tier-benefits">
                  {p.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}

              {requiredTiers.length > 0 && (
                <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>
                  Open to {requiredTiers.join(', ')} members.
                </p>
              )}

              {state?.subscribed ? (
                <Badge tone="green">You are a founder</Badge>
              ) : (
                <button
                  className="button button-green button-sm"
                  type="button"
                  style={{ marginTop: 14 }}
                  disabled={join.pending || state?.eligible === false}
                  onClick={() => void join.run()}
                  title={
                    state?.eligible === false
                      ? 'Upgrade your membership to become eligible'
                      : undefined
                  }
                >
                  {join.pending ? 'Joining…' : 'Join as founder'}
                </button>
              )}

              {state?.eligible === false && !state?.subscribed && (
                <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
                  Your current membership is not eligible yet — upgrade on the{' '}
                  <Link to="/app/membership">Membership</Link> page.
                </p>
              )}
            </Panel>
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Partners / businesses                                                       */
/* -------------------------------------------------------------------------- */

type Business = {
  id: number;
  slug: string;
  name: string;
  category?: string | null;
  description?: string | null;
  logo?: string | null;
  city?: string | null;
};

export function PartnersPage() {
  const businesses = useApi<unknown>('/businesses', [], { per_page: 30 });
  const list = extractList<Business>(businesses.data);

  return (
    <>
      <PageHeader
        title="Partners"
        subtitle="Businesses, sponsors and institutions working with the Afrisport Connect community."
      />

      <DataState
        loading={businesses.loading}
        error={businesses.error}
        data={list}
        onRetry={businesses.reload}
        empty={{ title: 'No partners listed', body: 'Partner businesses will appear here.' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((b) => (
              <Panel key={b.id}>
                <div className="inline" style={{ gap: 12, marginBottom: 12 }}>
                  <span className="club-card-crest" style={{ width: 46, height: 46 }}>
                    {mediaUrl(b.logo) ? (
                      <img src={mediaUrl(b.logo)!} alt="" loading="lazy" />
                    ) : (
                      b.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <div>
                    <strong style={{ display: 'block' }}>{b.name}</strong>
                    {b.city && (
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {b.city}
                      </span>
                    )}
                  </div>
                </div>
                {b.category && (
                  <div className="inline" style={{ marginBottom: 10 }}>
                    <Badge tone="blue">{b.category}</Badge>
                  </div>
                )}
                <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
                  {b.description ?? ''}
                </p>
              </Panel>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Stakeholders                                                                */
/* -------------------------------------------------------------------------- */

type Stakeholder = {
  id: number;
  name?: string;
  title?: string;
  domain?: string | null;
  description?: string | null;
  category?: string | null;
};

export function StakeholdersPage() {
  const stakeholders = useApi<unknown>('/stakeholders');
  const list = extractList<Stakeholder>(stakeholders.data);

  return (
    <>
      <PageHeader
        title="Stakeholders"
        subtitle="The twelve domains that make up the Afrisport Connect ecosystem."
      />

      <DataState
        loading={stakeholders.loading}
        error={stakeholders.error}
        data={list}
        onRetry={stakeholders.reload}
        empty={{ title: 'No stakeholder data' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((s, i) => (
              <Panel key={s.id ?? i}>
                <span className="stat-tile-label">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <strong style={{ display: 'block', margin: '6px 0' }}>
                  {s.name ?? s.title ?? s.domain}
                </strong>
                <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
                  {s.description ?? s.category ?? ''}
                </p>
              </Panel>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Growth / referrals                                                          */
/* -------------------------------------------------------------------------- */

export function GrowthPage() {
  const referral = useApi<{ code?: string; referrals?: number; rewards?: number; link?: string }>(
    '/growth/referral',
  );
  const checklist = useApi<unknown>('/growth/checklist');

  const steps = extractList<{ id?: number; label?: string; title?: string; done?: boolean; completed?: boolean }>(
    checklist.data,
  );

  const apply = useMutation(async () => api.post('/growth/ambassador/apply'));

  return (
    <>
      <PageHeader
        title="Grow the movement"
        subtitle="Invite others, complete your onboarding and become a community ambassador."
      />

      {apply.error && <Alert>{apply.error}</Alert>}

      <div className="grid-3" style={{ marginBottom: 30 }}>
        <Stat label="Your code" value={referral.data?.code ?? '—'} hint="Share to earn rewards" />
        <Stat label="Referrals" value={formatNumber(referral.data?.referrals ?? 0)} />
        <Stat label="Rewards earned" value={formatNumber(referral.data?.rewards ?? 0)} />
      </div>

      <Section title="Getting started">
        <Panel className="panel-flush">
          <DataState
            loading={checklist.loading}
            error={checklist.error}
            data={steps}
            onRetry={checklist.reload}
            empty={{ title: 'Nothing to complete', body: "You're all set up." }}
          >
            {(items) =>
              items.map((s, i) => (
                <Row
                  key={s.id ?? i}
                  title={s.label ?? s.title ?? 'Step'}
                  right={
                    <Badge tone={s.done ?? s.completed ? 'green' : 'neutral'}>
                      {s.done ?? s.completed ? 'Done' : 'To do'}
                    </Badge>
                  }
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>

      <Section title="Ambassadors">
        <Panel>
          <p className="muted" style={{ marginTop: 0 }}>
            Ambassadors grow chapters, host events and represent Afrisport Connect in their community.
          </p>
          <button
            className="button button-green button-sm"
            type="button"
            disabled={apply.pending}
            onClick={() => void apply.run()}
          >
            {apply.pending ? 'Submitting…' : 'Apply to be an ambassador'}
          </button>
        </Panel>
      </Section>
    </>
  );
}
