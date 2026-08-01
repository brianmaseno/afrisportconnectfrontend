import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatDate, formatNumber, labelOf, relativeTime } from '../../lib/format';
import { Badge, DataState, PageHeader, Panel, Row, Section } from '../ui';
import type { Club, FootballMatch, NewsItem } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* Clubs directory                                                             */
/* -------------------------------------------------------------------------- */

export function ClubsPage() {
  const [term, setTerm] = useState('');
  const clubs = useApi<unknown>('/clubs', [], { per_page: 100 });
  const list = extractList<Club>(clubs.data);

  const filtered = term
    ? list.filter((c) => c.name.toLowerCase().includes(term.toLowerCase()))
    : list;

  return (
    <>
      <PageHeader title="Clubs" subtitle="Every club on Afrisport Connect and the communities behind them." />

      <div className="discover-search">
        <input
          className="field-input"
          type="search"
          placeholder="Filter clubs…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Filter clubs"
        />
      </div>

      <DataState
        loading={clubs.loading}
        error={clubs.error}
        data={filtered}
        onRetry={clubs.reload}
        empty={{ title: 'No clubs found', body: 'Try a different search term.' }}
      >
        {(items) => (
          <div className="grid-4">
            {items.map((c) => (
              <Link key={c.id} to={`/app/clubs/${c.slug}`} className="club-link">
                <Panel className="club-card">
                  <span
                    className="club-card-crest"
                    style={{ borderColor: c.primary_color ?? 'var(--line)' }}
                  >
                    {mediaUrl(c.logo) ? (
                      <img src={mediaUrl(c.logo)!} alt="" loading="lazy" />
                    ) : (
                      c.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <strong>{c.name}</strong>
                  {c.impact_pillar && <span className="muted">{c.impact_pillar}</span>}
                </Panel>
              </Link>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Club hub                                                                    */
/* -------------------------------------------------------------------------- */

type HubTab = 'news' | 'fixtures' | 'polls' | 'leaderboard';

export function ClubHubPage() {
  const { slug = '' } = useParams();
  const [tab, setTab] = useState<HubTab>('news');

  const club = useApi<Club>(`/clubs/${slug}`, [slug]);
  const hub = useApi<{ tabs?: string[] }>(`/clubs/${slug}/hub`, [slug]);
  const news = useApi<unknown>(tab === 'news' ? `/clubs/${slug}/news` : null, [slug, tab]);
  const matches = useApi<unknown>(tab === 'fixtures' ? `/clubs/${slug}/matches` : null, [slug, tab]);
  const polls = useApi<unknown>(tab === 'polls' ? `/clubs/${slug}/polls` : null, [slug, tab]);
  const board = useApi<unknown>(tab === 'leaderboard' ? `/clubs/${slug}/leaderboard` : null, [slug, tab]);

  const vote = useMutation(async (pollId: number, optionId: number) => {
    await api.post(`/polls/${pollId}/vote`, { option_id: optionId });
    polls.reload();
  });

  const crest = mediaUrl(club.data?.logo);

  return (
    <>
      <PageHeader
        title={club.data?.name ?? 'Club'}
        subtitle={club.data?.description ?? 'Club news, fixtures, polls and supporters.'}
        actions={
          <Link className="button button-outline button-sm" to="/app/clubs">
            All clubs
          </Link>
        }
      />

      {crest && (
        <Panel style={{ marginBottom: 24 }}>
          <div className="inline" style={{ gap: 16 }}>
            <span className="club-card-crest" style={{ width: 64, height: 64 }}>
              <img src={crest} alt="" />
            </span>
            <div>
              <strong style={{ display: 'block', fontSize: 18 }}>{club.data?.name}</strong>
              {club.data?.impact_pillar && (
                <span className="muted">Impact pillar: {club.data.impact_pillar}</span>
              )}
            </div>
          </div>
        </Panel>
      )}

      {/* The club hub config decides which tabs this club exposes. */}
      <div className="segmented" role="group" aria-label="Club sections">
        {(hub.data?.tabs?.filter((t): t is HubTab =>
          (['news', 'fixtures', 'polls', 'leaderboard'] as string[]).includes(t),
        ) ?? (['news', 'fixtures', 'polls', 'leaderboard'] as HubTab[])).map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'news' && (
        <Panel className="panel-flush">
          <DataState
            loading={news.loading}
            error={news.error}
            data={extractList<NewsItem>(news.data)}
            onRetry={news.reload}
            empty={{ title: 'No club news yet' }}
          >
            {(items) =>
              items.map((n) => (
                <Row
                  key={n.id}
                  media={mediaUrl(n.image) ? <img src={mediaUrl(n.image)!} alt="" loading="lazy" /> : null}
                  title={n.title}
                  meta={n.excerpt ?? ''}
                  right={<span>{relativeTime(n.published_at)}</span>}
                />
              ))
            }
          </DataState>
        </Panel>
      )}

      {tab === 'fixtures' && (
        <Panel className="panel-flush">
          <DataState
            loading={matches.loading}
            error={matches.error}
            data={extractList<FootballMatch>(matches.data)}
            onRetry={matches.reload}
            empty={{ title: 'No fixtures listed' }}
          >
            {(items) =>
              items.map((m) => (
                <Row
                  key={m.id}
                  title={`${labelOf(m.home_team) || m.home_club?.name || 'TBC'} v ${labelOf(m.away_team) || m.away_club?.name || 'TBC'}`}
                  meta={labelOf(m.competition)}
                  right={
                    m.home_score !== null && m.home_score !== undefined ? (
                      <Badge tone="green">{`${m.home_score} – ${m.away_score ?? 0}`}</Badge>
                    ) : (
                      <span>{formatDate(m.kickoff_at, true)}</span>
                    )
                  }
                />
              ))
            }
          </DataState>
        </Panel>
      )}

      {tab === 'polls' && (
        <>
          {vote.error && <p style={{ color: 'var(--error)', fontSize: 14 }}>{vote.error}</p>}
          <DataState
            loading={polls.loading}
            error={polls.error}
            data={extractList<{
              id: number;
              question?: string;
              title?: string;
              options?: { id: number; label?: string; text?: string; votes?: number }[];
            }>(polls.data)}
            onRetry={polls.reload}
            empty={{ title: 'No polls running', body: 'Club polls will appear here when they open.' }}
          >
            {(items) => (
              <div className="stack">
                {items.map((poll) => (
                  <Panel key={poll.id}>
                    <strong style={{ display: 'block', marginBottom: 12 }}>
                      {poll.question ?? poll.title}
                    </strong>
                    <div className="inline">
                      {(poll.options ?? []).map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className="button button-outline button-sm"
                          disabled={vote.pending}
                          onClick={() => void vote.run(poll.id, o.id)}
                        >
                          {o.label ?? o.text}
                          {o.votes !== undefined ? ` · ${formatNumber(o.votes)}` : ''}
                        </button>
                      ))}
                    </div>
                  </Panel>
                ))}
              </div>
            )}
          </DataState>
        </>
      )}

      {tab === 'leaderboard' && (
        <Panel className="panel-flush">
          <DataState
            loading={board.loading}
            error={board.error}
            data={extractList<{ id?: number; name?: string; points?: number; rank?: number }>(board.data)}
            onRetry={board.reload}
            empty={{ title: 'Leaderboard is empty' }}
          >
            {(items) =>
              items.map((l, i) => (
                <Row
                  key={l.id ?? i}
                  media={<span style={{ fontWeight: 800 }}>{l.rank ?? i + 1}</span>}
                  title={l.name ?? 'Supporter'}
                  right={<Badge tone="gold">{formatNumber(l.points)} pts</Badge>}
                />
              ))
            }
          </DataState>
        </Panel>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Standings                                                                   */
/* -------------------------------------------------------------------------- */

export function StandingsPage() {
  const competitions = useApi<unknown>('/competitions');
  const list = extractList<{ id: number; slug?: string; name: string }>(competitions.data);
  const [slug, setSlug] = useState<string>('');

  const active = slug || list[0]?.slug || '';
  const table = useApi<unknown>(active ? `/standings/${active}` : null, [active]);
  const compId = list.find((c) => (c.slug ?? String(c.id)) === active)?.id;
  const teams = useApi<unknown>(compId ? `/competitions/${compId}/teams` : null, [compId]);

  return (
    <>
      <PageHeader title="Standings" subtitle="League tables for the competitions you follow." />

      {list.length > 0 && (
        <div className="field" style={{ maxWidth: 340 }}>
          <select className="field-select" value={active} onChange={(e) => setSlug(e.target.value)}>
            {list.map((c) => (
              <option key={c.id} value={c.slug ?? c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <Section title="Teams">
        <Panel className="panel-flush">
          <DataState
            loading={teams.loading}
            error={teams.error}
            data={extractList<{ id: number; name?: string; short_name?: string }>(teams.data)}
            onRetry={teams.reload}
            skeletonRows={1}
            empty={{ title: 'No teams listed for this competition' }}
          >
            {(rows) =>
              rows.map((t) => <Row key={t.id} title={t.name ?? 'Team'} meta={t.short_name ?? ''} />)
            }
          </DataState>
        </Panel>
      </Section>

      <Section title="Table">
        <Panel className="panel-flush">
          <DataState
            loading={table.loading}
            error={table.error}
            data={extractList<{
              position?: number;
              team?: string | { name?: string };
              played?: number;
              points?: number;
            }>(table.data)}
            onRetry={table.reload}
            empty={{ title: 'No table available', body: 'Standings appear once matches are played.' }}
          >
            {(rows) =>
              rows.map((r, i) => (
                <Row
                  key={i}
                  media={<span style={{ fontWeight: 800 }}>{r.position ?? i + 1}</span>}
                  title={labelOf(r.team) || 'Team'}
                  meta={r.played !== undefined ? `${r.played} played` : ''}
                  right={<Badge tone="green">{formatNumber(r.points)} pts</Badge>}
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}
