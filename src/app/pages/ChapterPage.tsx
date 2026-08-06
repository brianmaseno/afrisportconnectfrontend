import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { formatDate, formatNumber, labelOf, relativeTime } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Stat } from '../ui';
import type { Chapter, EventItem } from '../../lib/types';

type Tab = 'about' | 'chat' | 'announcements' | 'events' | 'members' | 'elections';

type ChapterMessage = {
  id: number;
  body?: string;
  created_at?: string;
  user?: { id?: number; name?: string; avatar?: string | null };
};

export function ChapterPage() {
  const { slug = '' } = useParams();
  const [tab, setTab] = useState<Tab>('about');
  const [notice, setNotice] = useState<string | null>(null);
  const [chatBody, setChatBody] = useState('');
  const [chatMessages, setChatMessages] = useState<ChapterMessage[]>([]);

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
  const chat = useApi<unknown>(
    tab === 'chat' && Boolean((chapter.data as Chapter & { is_member?: boolean })?.is_member)
      ? `/chapters/${slug}/messages`
      : null,
    [slug, tab, (chapter.data as Chapter & { is_member?: boolean })?.is_member],
  );

  useEffect(() => {
    if (chat.data) {
      setChatMessages(extractList<ChapterMessage>(chat.data));
    }
  }, [chat.data]);

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

  const sendChat = useMutation(async () => {
    const body = chatBody.trim();
    if (!body) return;
    const msg = await api.post<ChapterMessage>(`/chapters/${slug}/messages`, { body });
    setChatMessages((prev) => [...prev, msg]);
    setChatBody('');
  });

  const c = chapter.data as (Chapter & { is_member?: boolean }) | null;
  const error = join.error ?? leave.error ?? vote.error ?? sendChat.error ?? chat.error;

  return (
    <>
      <PageHeader
        title={c?.name ?? 'Chapter'}
        subtitle={c?.description ?? labelOf(c?.city) ?? 'Supporter chapter'}
        actions={
          <>
            {!c?.is_member ? (
              <button
                className="button button-green button-sm"
                type="button"
                disabled={join.pending}
                onClick={() => void join.run()}
              >
                {join.pending ? 'Joining…' : 'Join'}
              </button>
            ) : (
              <button
                className="button button-outline button-sm"
                type="button"
                disabled={leave.pending}
                onClick={() => void leave.run()}
              >
                {leave.pending ? 'Leaving…' : 'Leave'}
              </button>
            )}
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
        <Stat label="Status" value={c?.is_member ? 'Member' : 'Visitor'} />
      </div>

      <div className="segmented" role="group" aria-label="Chapter sections">
        {(['about', 'chat', 'announcements', 'events', 'members', 'elections'] as Tab[]).map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <Panel>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            {c?.description ??
              'This chapter has not added a description yet. Join to chat with fellow supporters.'}
          </p>
        </Panel>
      )}

      {tab === 'chat' && (
        <Panel>
          {!c?.is_member ? (
            <div>
              <p style={{ marginTop: 0 }}>Chapter chat is for members only.</p>
              <button className="button button-green button-sm" type="button" onClick={() => void join.run()}>
                Join to chat
              </button>
            </div>
          ) : (
            <div className="stack">
              <DataState
                loading={chat.loading}
                error={chat.error}
                data={chatMessages}
                onRetry={chat.reload}
                empty={{ title: 'No messages yet', body: 'Say hello to your chapter.' }}
              >
                {(items) => (
                  <div className="stack" style={{ maxHeight: 420, overflow: 'auto' }}>
                    {items.map((m) => (
                      <div key={m.id} style={{ display: 'flex', gap: 10 }}>
                        {mediaUrl(m.user?.avatar) ? (
                          <img
                            src={mediaUrl(m.user?.avatar)!}
                            alt=""
                            width={36}
                            height={36}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: 'var(--surface-2, #12304f)',
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 700,
                            }}
                          >
                            {(m.user?.name ?? '?')[0]}
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div className="inline" style={{ justifyContent: 'space-between', gap: 8 }}>
                            <strong>{m.user?.name ?? 'Member'}</strong>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                              {relativeTime(m.created_at)}
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0', lineHeight: 1.45 }}>{m.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DataState>
              <form
                className="inline"
                style={{ gap: 8, alignItems: 'flex-end' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendChat.run();
                }}
              >
                <label style={{ flex: 1 }}>
                  Message
                  <input
                    value={chatBody}
                    onChange={(e) => setChatBody(e.target.value)}
                    placeholder="Message the chapter…"
                    maxLength={4000}
                  />
                </label>
                <button
                  className="button button-green"
                  type="submit"
                  disabled={sendChat.pending || !chatBody.trim()}
                >
                  {sendChat.pending ? 'Sending…' : 'Send'}
                </button>
              </form>
            </div>
          )}
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
