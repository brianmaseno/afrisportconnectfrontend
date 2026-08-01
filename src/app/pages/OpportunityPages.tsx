import { useState } from 'react';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatDate, formatMoney, formatNumber, initials } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, Media, PageHeader, Panel, Row, Section, Stat } from '../ui';

/* -------------------------------------------------------------------------- */
/* Opportunities                                                               */
/* -------------------------------------------------------------------------- */

type Opportunity = {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  type?: string | null;
  location?: string | null;
  deadline_at?: string | null;
  closes_at?: string | null;
  institution?: { name?: string } | string | null;
};

export function OpportunitiesPage() {
  const [tab, setTab] = useState<'all' | 'saved'>('all');

  const all = useApi<unknown>(tab === 'all' ? '/opportunities' : null, [tab], { per_page: 30 });
  const saved = useApi<unknown>(tab === 'saved' ? '/opportunities/bookmarks/mine' : null, [tab]);

  const active = tab === 'all' ? all : saved;
  const list = extractList<Opportunity>(active.data);

  const bookmark = useMutation(async (slug: string) => {
    await api.post(`/opportunities/${slug}/bookmark`);
    active.reload();
  });

  const apply = useMutation(async (slug: string) => api.post(`/opportunities/${slug}/apply`));

  return (
    <>
      <PageHeader
        title="Opportunities"
        subtitle="Scholarships, trials, jobs and programmes across the African football ecosystem."
      />

      <div className="segmented" role="group" aria-label="Opportunity view">
        <button type="button" aria-pressed={tab === 'all'} onClick={() => setTab('all')}>
          All
        </button>
        <button type="button" aria-pressed={tab === 'saved'} onClick={() => setTab('saved')}>
          Saved
        </button>
      </div>

      {(bookmark.error || apply.error) && <Alert>{bookmark.error ?? apply.error}</Alert>}

      <DataState
        loading={active.loading}
        error={active.error}
        data={list}
        onRetry={active.reload}
        empty={{
          title: tab === 'saved' ? 'Nothing saved yet' : 'No opportunities listed',
          body: 'New programmes are published regularly.',
        }}
      >
        {(items) => (
          <div className="grid-2">
            {items.map((o) => (
              <Panel key={o.id}>
                <div className="inline" style={{ marginBottom: 10 }}>
                  {o.type && <Badge tone="blue">{o.type}</Badge>}
                  {(o.deadline_at ?? o.closes_at) && (
                    <Badge tone="gold">Closes {formatDate(o.deadline_at ?? o.closes_at)}</Badge>
                  )}
                </div>
                <strong style={{ display: 'block', marginBottom: 6 }}>{o.title}</strong>
                <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>
                  {o.summary ?? o.description ?? ''}
                </p>
                <div className="inline">
                  <button
                    className="button button-green button-sm"
                    type="button"
                    disabled={apply.pending}
                    onClick={() => void apply.run(o.slug)}
                  >
                    {apply.pending ? 'Applying…' : 'Apply'}
                  </button>
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    disabled={bookmark.pending}
                    onClick={() => void bookmark.run(o.slug)}
                  >
                    {tab === 'saved' ? 'Saved' : 'Save'}
                  </button>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Talent                                                                      */
/* -------------------------------------------------------------------------- */

type Player = {
  id: number;
  name?: string;
  position?: string | null;
  club?: string | { name?: string } | null;
  age?: number | null;
  avatar?: string | null;
  country?: { name?: string } | null;
};

export function TalentPage() {
  const [tab, setTab] = useState<'players' | 'scouts' | 'mine' | 'shortlist'>('players');

  const players = useApi<unknown>(tab === 'players' ? '/talent/players' : null, [tab], { per_page: 30 });
  const mine = useApi<unknown>(tab === 'mine' ? '/me/talent-profile' : null, [tab]);
  const shortlist = useApi<unknown>(tab === 'shortlist' ? '/talent/shortlist/mine' : null, [tab]);
  const scouts = useApi<unknown>(tab === 'scouts' ? '/talent/scouts' : null, [tab]);

  const add = useMutation(async (id: number) => {
    await api.post(`/talent/shortlist/${id}`);
    shortlist.reload();
  });

  const profile = mine.data as Record<string, unknown> | null;

  return (
    <>
      <PageHeader
        title="Talent"
        subtitle="Player profiles, scouting and pathways from grassroots to professional football."
      />

      <div className="segmented" role="group" aria-label="Talent sections">
        <button type="button" aria-pressed={tab === 'players'} onClick={() => setTab('players')}>
          Players
        </button>
        <button type="button" aria-pressed={tab === 'scouts'} onClick={() => setTab('scouts')}>
          Scouts
        </button>
        <button type="button" aria-pressed={tab === 'shortlist'} onClick={() => setTab('shortlist')}>
          My shortlist
        </button>
        <button type="button" aria-pressed={tab === 'mine'} onClick={() => setTab('mine')}>
          My profile
        </button>
      </div>

      {add.error && <Alert>{add.error}</Alert>}

      {(tab === 'players' || tab === 'shortlist') && (
        <DataState
          loading={tab === 'players' ? players.loading : shortlist.loading}
          error={tab === 'players' ? players.error : shortlist.error}
          data={extractList<Player>(tab === 'players' ? players.data : shortlist.data)}
          onRetry={tab === 'players' ? players.reload : shortlist.reload}
          empty={{
            title: tab === 'shortlist' ? 'Shortlist is empty' : 'No player profiles yet',
            body:
              tab === 'shortlist'
                ? 'Shortlist players to track them here.'
                : 'Player profiles will appear here as they are published.',
          }}
        >
          {(items) => (
            <div className="grid-3">
              {items.map((p) => (
                <Panel key={p.id}>
                  <div className="inline" style={{ gap: 12, marginBottom: 12 }}>
                    <span className="club-card-crest" style={{ width: 46, height: 46 }}>
                      {mediaUrl(p.avatar) ? (
                        <img src={mediaUrl(p.avatar)!} alt="" loading="lazy" />
                      ) : (
                        initials(p.name)
                      )}
                    </span>
                    <div>
                      <strong style={{ display: 'block' }}>{p.name ?? 'Player'}</strong>
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {[p.position, p.age ? `${p.age} yrs` : null].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  </div>
                  {tab === 'players' && (
                    <button
                      className="button button-outline button-sm"
                      type="button"
                      disabled={add.pending}
                      onClick={() => void add.run(p.id)}
                    >
                      {add.pending ? 'Adding…' : 'Add to shortlist'}
                    </button>
                  )}
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      )}

      {tab === 'scouts' && (
        <DataState
          loading={scouts.loading}
          error={scouts.error}
          data={extractList<Player & { organisation?: string }>(scouts.data)}
          onRetry={scouts.reload}
          empty={{ title: "No scouts listed", body: "Registered scouts will appear here." }}
        >
          {(items) => (
            <div className="grid-3">
              {items.map((s) => (
                <Panel key={s.id}>
                  <div className="inline" style={{ gap: 12 }}>
                    <span className="club-card-crest" style={{ width: 46, height: 46 }}>
                      {mediaUrl(s.avatar) ? <img src={mediaUrl(s.avatar)!} alt="" loading="lazy" /> : initials(s.name)}
                    </span>
                    <div>
                      <strong style={{ display: "block" }}>{s.name ?? "Scout"}</strong>
                      <span className="muted" style={{ fontSize: 12.5 }}>{s.organisation ?? ""}</span>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      )}

      {tab === 'mine' && (
        <Panel>
          {mine.loading ? (
            <p className="muted">Loading…</p>
          ) : profile && Object.keys(profile).length > 0 ? (
            <div className="stack">
              {Object.entries(profile)
                .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
                .map(([k, v]) => (
                  <Row key={k} title={k.replace(/_/g, ' ')} right={<span>{String(v)}</span>} />
                ))}
            </div>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              You do not have a talent profile yet. Create one in the mobile app to be discoverable by
              scouts.
            </p>
          )}
        </Panel>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Impact projects                                                             */
/* -------------------------------------------------------------------------- */

type Project = {
  id: number;
  slug: string;
  title?: string;
  name?: string;
  summary?: string | null;
  description?: string | null;
  cover?: string | null;
  /** What the API actually returns for project artwork. */
  cover_image?: string | null;
  goal_amount?: string | number | null;
  raised_amount?: string | number | null;
  /** Server-computed funding progress; prefer it over deriving from amounts. */
  progress_percent?: number | null;
  currency?: string;
};

export function ProjectsPage() {
  const projects = useApi<unknown>('/projects', [], { per_page: 24 });
  const list = extractList<Project>(projects.data);

  return (
    <>
      <PageHeader
        title="Impact projects"
        subtitle="Community projects funded by supporters, clubs and partners."
      />

      <DataState
        loading={projects.loading}
        error={projects.error}
        data={list}
        onRetry={projects.reload}
        empty={{ title: 'No projects listed', body: 'Community projects will appear here.' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((p) => {
              const goal = Number(p.goal_amount ?? 0);
              const raised = Number(p.raised_amount ?? 0);
              const pct =
                p.progress_percent != null
                  ? Math.min(100, Math.round(Number(p.progress_percent)))
                  : goal > 0
                    ? Math.min(100, Math.round((raised / goal) * 100))
                    : 0;
              return (
                <Panel key={p.id}>
                  <Media src={p.cover_image ?? p.cover} alt={p.title ?? p.name ?? 'Project'} ratio="16 / 9" label="Project" />
                  <strong style={{ display: 'block', marginBottom: 6 }}>{p.title ?? p.name}</strong>
                  <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>
                    {p.summary ?? p.description ?? ''}
                  </p>
                  {goal > 0 && (
                    <>
                      <div className="progress" aria-hidden="true">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {formatMoney(raised, p.currency ?? 'KES')} of{' '}
                        {formatMoney(goal, p.currency ?? 'KES')} · {pct}%
                      </span>
                    </>
                  )}
                </Panel>
              );
            })}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Challenges                                                                  */
/* -------------------------------------------------------------------------- */

export function ChallengesPage() {
  const mine = useApi<unknown>('/challenges/mine');
  const all = useApi<unknown>('/challenges', [], { per_page: 30 });

  const myList = extractList<{ id: number; title?: string; name?: string; status?: string; progress?: number }>(
    mine.data,
  );
  const allList = extractList<{
    id: number;
    title?: string;
    name?: string;
    description?: string;
    points?: number;
  }>(all.data);

  const join = useMutation(async (id: number) => {
    await api.post(`/challenges/${id}/join`);
    mine.reload();
  });

  return (
    <>
      <PageHeader
        title="Challenges"
        subtitle="Take part, earn points and turn support into measurable contribution."
      />

      {join.error && <Alert>{join.error}</Alert>}

      <div className="grid-3" style={{ marginBottom: 30 }}>
        <Stat label="Joined" value={formatNumber(myList.length)} />
        <Stat label="Available" value={formatNumber(allList.length)} />
        <Stat
          label="Completed"
          value={formatNumber(myList.filter((c) => c.status === 'completed').length)}
        />
      </div>

      <Section title="My challenges">
        <Panel className="panel-flush">
          <DataState
            loading={mine.loading}
            error={mine.error}
            data={myList}
            onRetry={mine.reload}
            empty={{ title: 'No challenges joined', body: 'Join one below to get started.' }}
          >
            {(items) =>
              items.map((c) => (
                <Row
                  key={c.id}
                  title={c.title ?? c.name ?? 'Challenge'}
                  right={
                    <>
                      {c.progress !== undefined && <Badge tone="green">{c.progress}%</Badge>}
                      <Badge>{c.status ?? 'In progress'}</Badge>
                    </>
                  }
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>

      <Section title="Open challenges">
        <DataState
          loading={all.loading}
          error={all.error}
          data={allList}
          onRetry={all.reload}
          empty={{ title: 'No open challenges' }}
        >
          {(items) => (
            <div className="grid-3">
              {items.map((c) => (
                <Panel key={c.id}>
                  {c.points !== undefined && (
                    <div className="inline" style={{ marginBottom: 8 }}>
                      <Badge tone="gold">{formatNumber(c.points)} pts</Badge>
                    </div>
                  )}
                  <strong style={{ display: 'block', marginBottom: 6 }}>{c.title ?? c.name}</strong>
                  <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>
                    {c.description ?? ''}
                  </p>
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    disabled={join.pending}
                    onClick={() => void join.run(c.id)}
                  >
                    {join.pending ? 'Joining…' : 'Join challenge'}
                  </button>
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      </Section>
    </>
  );
}
