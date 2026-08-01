import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList } from '../../lib/api';
import { formatDate, formatMoney, formatNumber, labelOf } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, Media, PageHeader, Panel, Row, Section } from '../ui';
import type { Chapter, EventItem } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* Community                                                                   */
/* -------------------------------------------------------------------------- */

export function CommunityPage() {
  const navigate = useNavigate();
  const chapters = useApi<unknown>('/chapters', [], { per_page: 8 });
  const events = useApi<unknown>('/events/public', [], { per_page: 6 });
  const periods = useApi<unknown>("/leaderboards/periods");
  const [period, setPeriod] = useState("");
  const leaderboard = useApi<unknown>("/leaderboards", [period], period ? { period } : undefined);

  const chapterList = extractList<Chapter>(chapters.data);
  const eventList = extractList<EventItem>(events.data);
  const leaders = extractList<{ id?: number; name?: string; points?: number; rank?: number }>(
    leaderboard.data,
  );

  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Chapters near you, upcoming meet-ups and where you stand among supporters."
      />

      <div className="grid-2">
        <Section title="Chapters">
          <Panel className="panel-flush">
            <DataState
              loading={chapters.loading}
              error={chapters.error}
              data={chapterList}
              onRetry={chapters.reload}
              empty={{ title: 'No chapters yet', body: 'Supporter chapters will appear here.' }}
            >
              {(items) =>
                items.map((c) => (
                  <Row
                    key={c.id}
                    onClick={() => navigate(`/app/chapters/${c.slug}`)}
                    title={c.name}
                    meta={labelOf(c.city) || c.description || ''}
                    right={
                      <Badge>{formatNumber(c.members_count ?? c.member_count ?? 0)} members</Badge>
                    }
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>

        <Section
          title="Leaderboard"
          action={
            extractList<{ id?: string; label?: string; slug?: string }>(periods.data).length > 0 ? (
              <select
                className="field-select"
                style={{ maxWidth: 170, padding: "8px 34px 8px 12px" }}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                aria-label="Leaderboard period"
              >
                <option value="">All time</option>
                {extractList<{ id?: string; label?: string; slug?: string }>(periods.data).map((p, i) => (
                  <option key={p.slug ?? p.id ?? i} value={p.slug ?? p.id ?? ""}>
                    {p.label ?? p.slug ?? p.id}
                  </option>
                ))}
              </select>
            ) : null
          }
        >
          <Panel className="panel-flush">
            <DataState
              loading={leaderboard.loading}
              error={leaderboard.error}
              data={leaders}
              onRetry={leaderboard.reload}
              empty={{ title: 'Leaderboard is empty', body: 'Earn points to appear here.' }}
            >
              {(items) =>
                items.slice(0, 10).map((l, i) => (
                  <Row
                    key={l.id ?? i}
                    media={<span style={{ fontWeight: 800 }}>{l.rank ?? i + 1}</span>}
                    title={l.name ?? 'Member'}
                    right={<Badge tone="gold">{formatNumber(l.points)} pts</Badge>}
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>
      </div>

      <Section title="Upcoming events">
        <EventGrid loading={events.loading} error={events.error} data={eventList} onRetry={events.reload} />
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Chapters                                                                    */
/* -------------------------------------------------------------------------- */

export function ChaptersPage() {
  const chapters = useApi<unknown>('/chapters', [], { per_page: 50 });
  const list = extractList<Chapter>(chapters.data);

  const [joined, setJoined] = useState<string | null>(null);

  const join = useMutation(async (slug: string, name: string) => {
    await api.post(`/chapters/${slug}/join`);
    setJoined(name);
    chapters.reload();
  });

  return (
    <>
      <PageHeader
        title="Chapters"
        subtitle="Supporter chapters organise meet-ups, viewing parties and community projects."
      />

      {join.error && <Alert>{join.error}</Alert>}
      {joined && <Alert kind="success">You have joined {joined}.</Alert>}

      <DataState
        loading={chapters.loading}
        error={chapters.error}
        data={list}
        onRetry={chapters.reload}
        empty={{ title: 'No chapters yet' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((c) => (
              <Panel key={c.id}>
                <strong style={{ display: 'block', marginBottom: 6 }}>{c.name}</strong>
                <p className="muted" style={{ margin: '0 0 14px', fontSize: 14 }}>
                  {c.description ?? labelOf(c.city) ?? 'Supporter chapter'}
                </p>
                <div className="inline">
                  <Badge>{formatNumber(c.members_count ?? c.member_count ?? 0)} members</Badge>
                  <Link className="button button-outline button-sm" to={`/app/chapters/${c.slug}`}>
                    View chapter
                  </Link>
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    disabled={join.pending}
                    onClick={() => void join.run(c.slug, c.name)}
                  >
                    {join.pending ? 'Joining…' : 'Join'}
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
/* Events                                                                      */
/* -------------------------------------------------------------------------- */

export function EventsPage() {
  const events = useApi<unknown>('/events', [], { per_page: 30 });
  const list = extractList<EventItem>(events.data);

  return (
    <>
      <PageHeader title="Events" subtitle="Match days, chapter meet-ups, clinics and community projects." />
      <EventGrid loading={events.loading} error={events.error} data={list} onRetry={events.reload} />
    </>
  );
}

function EventGrid({
  loading,
  error,
  data,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  data: EventItem[];
  onRetry: () => void;
}) {
  const [rsvped, setRsvped] = useState<string | null>(null);

  const rsvp = useMutation(async (slug: string, title: string) => {
    await api.post(`/events/${slug}/rsvp`);
    setRsvped(title);
  });

  return (
    <>
      {rsvp.error && <Alert>{rsvp.error}</Alert>}
      {rsvped && <Alert kind="success">You are on the list for {rsvped}.</Alert>}
      <DataState
        loading={loading}
        error={error}
        data={data}
        onRetry={onRetry}
        empty={{ title: 'No events listed', body: 'New events will appear here as they are announced.' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((ev) => (
              <Panel key={ev.id} className="event-card">
                <Media src={ev.cover} alt={ev.title} ratio="16 / 9" label="Event" />
                <div className="inline" style={{ marginBottom: 10 }}>
                  <Badge tone={ev.is_free ? 'green' : 'gold'}>
                    {ev.is_free ? 'Free' : formatMoney(ev.price)}
                  </Badge>
                </div>
                <strong style={{ display: 'block', marginBottom: 6 }}>{ev.title}</strong>
                <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>
                  {formatDate(ev.starts_at, true)}
                  {ev.location ? ` · ${ev.location}` : ''}
                </p>
                <div className="inline">
                  <Link className="button button-outline button-sm" to={`/app/events/${ev.slug}`}>
                    View details
                  </Link>
                  <button
                    className="button button-green button-sm"
                    type="button"
                    disabled={rsvp.pending}
                    onClick={() => void rsvp.run(ev.slug, ev.title)}
                  >
                    {rsvp.pending ? 'Saving…' : 'RSVP'}
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
