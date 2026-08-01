import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatDate, formatNumber, labelOf, relativeTime } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Stat } from '../ui';
import type { Chapter, EventItem } from '../../lib/types';

type Tab = 'about' | 'announcements' | 'events' | 'members' | 'elections';

export function ChapterPage() {
  const { slug = '' } = useParams();
  const [tab, setTab] = useState<Tab>('about');
  const [notice, setNotice] = useState<string | null>(null);

  const chapter = useApi<Chapter>(`/chapters/${slug}`, [slug]);
  const announcements = useApi<unknown>(
    tab === 'announcements' ? `/chapters/${slug}/announcements` : null,
    [slug, tab],
  );
  const events = useApi<unknown>(tab === 'events' ? `/chapters/${slug}/events` : null, [slug, tab]);
  const members = useApi<unknown>(tab === 'members' ? `/chapters/${slug}/members` : null, [slug, tab]);
  const elections = useApi<unknown>(
    tab === 'elections' ? `/chapters/${slug}/elections` : null,
    [slug, tab],
  );

  const join = useMutation(async () => {
    await api.post(`/chapters/${slug}/join`);
    setNotice('You have joined this chapter.');
    chapter.reload();
  });

  const leave = useMutation(async () => {
    await api.post(`/chapters/${slug}/leave`);
    setNotice('You have left this chapter.');
    chapter.reload();
  });

  const vote = useMutation(async (electionId: number, candidateId: number) => {
    await api.post(`/chapters/${slug}/elections/${electionId}/vote`, { candidate_id: candidateId });
    setNotice('Your vote has been recorded.');
    elections.reload();
  });

  const c = chapter.data;
  const error = join.error ?? leave.error ?? vote.error;

  return (
    <>
      <PageHeader
        title={c?.name ?? 'Chapter'}
        subtitle={c?.description ?? labelOf(c?.city) ?? 'Supporter chapter'}
        actions={
          <>
            <button
              className="button button-green button-sm"
              type="button"
              disabled={join.pending}
              onClick={() => void join.run()}
            >
              {join.pending ? 'Joining…' : 'Join'}
            </button>
            <button
              className="button button-outline button-sm"
              type="button"
              disabled={leave.pending}
              onClick={() => void leave.run()}
            >
              {leave.pending ? 'Leaving…' : 'Leave'}
            </button>
            <Link className="button button-outline button-sm" to="/app/chapters">
              All chapters
            </Link>
          </>
        }
      />

      {error && <Alert>{error}</Alert>}
      {notice && <Alert kind="success">{notice}</Alert>}

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <Stat label="Members" value={formatNumber(c?.members_count ?? c?.member_count ?? 0)} />
        <Stat label="City" value={labelOf(c?.city) || '—'} />
        <Stat label="Chapter" value={c?.name ?? '—'} />
      </div>

      <div className="segmented" role="group" aria-label="Chapter sections">
        {(['about', 'announcements', 'events', 'members', 'elections'] as Tab[]).map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <Panel>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            {c?.description ?? 'This chapter has not added a description yet.'}
          </p>
        </Panel>
      )}

      {tab === 'announcements' && (
        <Panel className="panel-flush">
          <DataState
            loading={announcements.loading}
            error={announcements.error}
            data={extractList<{ id: number; title?: string; body?: string; created_at?: string }>(
              announcements.data,
            )}
            onRetry={announcements.reload}
            empty={{ title: 'No announcements', body: 'Chapter updates will appear here.' }}
          >
            {(items) =>
              items.map((a) => (
                <Row
                  key={a.id}
                  title={a.title ?? 'Announcement'}
                  meta={a.body ?? ''}
                  right={<span>{relativeTime(a.created_at)}</span>}
                />
              ))
            }
          </DataState>
        </Panel>
      )}

      {tab === 'events' && (
        <Panel className="panel-flush">
          <DataState
            loading={events.loading}
            error={events.error}
            data={extractList<EventItem>(events.data)}
            onRetry={events.reload}
            empty={{ title: 'No chapter events', body: 'Meet-ups will be listed here.' }}
          >
            {(items) =>
              items.map((e) => (
                <Row
                  key={e.id}
                  title={e.title}
                  meta={e.location ?? ''}
                  right={<span>{formatDate(e.starts_at, true)}</span>}
                />
              ))
            }
          </DataState>
        </Panel>
      )}

      {tab === 'members' && (
        <Panel className="panel-flush">
          <DataState
            loading={members.loading}
            error={members.error}
            data={extractList<{ id: number; name?: string; avatar?: string | null; role?: string }>(
              members.data,
            )}
            onRetry={members.reload}
            empty={{ title: 'No members listed' }}
          >
            {(items) =>
              items.map((m) => (
                <Row
                  key={m.id}
                  media={
                    mediaUrl(m.avatar) ? <img src={mediaUrl(m.avatar)!} alt="" loading="lazy" /> : null
                  }
                  title={m.name ?? 'Member'}
                  right={m.role ? <Badge>{m.role}</Badge> : null}
                />
              ))
            }
          </DataState>
        </Panel>
      )}

      {tab === 'elections' && (
        <DataState
          loading={elections.loading}
          error={elections.error}
          data={extractList<{
            id: number;
            title?: string;
            status?: string;
            candidates?: { id: number; name?: string; votes?: number }[];
          }>(elections.data)}
          onRetry={elections.reload}
          empty={{ title: 'No elections running', body: 'Chapter elections will appear here.' }}
        >
          {(items) => (
            <div className="stack">
              {items.map((el) => (
                <Panel key={el.id}>
                  <div className="inline" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                    <strong>{el.title ?? 'Election'}</strong>
                    <Badge tone={el.status === 'open' ? 'green' : 'neutral'}>
                      {el.status ?? 'Closed'}
                    </Badge>
                  </div>
                  <div className="inline">
                    {(el.candidates ?? []).map((cand) => (
                      <button
                        key={cand.id}
                        type="button"
                        className="button button-outline button-sm"
                        disabled={vote.pending || el.status !== 'open'}
                        onClick={() => void vote.run(el.id, cand.id)}
                      >
                        {cand.name ?? 'Candidate'}
                        {cand.votes !== undefined ? ` · ${formatNumber(cand.votes)}` : ''}
                      </button>
                    ))}
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      )}
    </>
  );
}
