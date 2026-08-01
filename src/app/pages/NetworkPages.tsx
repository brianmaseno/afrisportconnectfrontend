import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { initials, relativeTime } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row } from '../ui';

type Person = {
  id: number | string;
  user_id?: number;
  name?: string;
  avatar?: string | null;
  occupation?: string | null;
  headline?: string | null;
  status?: string | null;
  /** Set on connection rows: who sent the request. */
  direction?: 'incoming' | 'outgoing';
};

type Tab = 'connections' | 'find' | 'inbox';

export function NetworkPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('connections');
  const [term, setTerm] = useState('');
  const [query, setQuery] = useState('');

  const connections = useApi<unknown>(tab === 'connections' ? '/network/connections' : null, [tab]);
  const inbox = useApi<unknown>(tab === 'inbox' ? '/network/inbox' : null, [tab]);
  const search = useApi<unknown>(tab === 'find' && query ? '/network/search' : null, [tab, query], {
    q: query,
  });

  const connect = useMutation(async (userId: number | string) => {
    await api.post(`/network/connect/${userId}`);
    connections.reload();
  });

  const respond = useMutation(async (id: number | string, accept: boolean) => {
    await api.post(`/network/connections/${id}/respond`, { action: accept ? 'accept' : 'decline' });
    connections.reload();
  });

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setQuery(term.trim());
  }

  const avatarOf = (p: Person) =>
    mediaUrl(p.avatar) ? (
      <img src={mediaUrl(p.avatar)!} alt="" loading="lazy" />
    ) : (
      <span style={{ fontWeight: 700, fontSize: 13 }}>{initials(p.name)}</span>
    );

  return (
    <>
      <PageHeader
        title="Network"
        subtitle="Connect with players, coaches, scouts, officials and supporters across the game."
      />

      <div className="segmented" role="group" aria-label="Network sections">
        <button type="button" aria-pressed={tab === 'connections'} onClick={() => setTab('connections')}>
          Connections
        </button>
        <button type="button" aria-pressed={tab === 'find'} onClick={() => setTab('find')}>
          Find people
        </button>
        <button type="button" aria-pressed={tab === 'inbox'} onClick={() => setTab('inbox')}>
          Messages
        </button>
      </div>

      {(connect.error || respond.error) && <Alert>{connect.error ?? respond.error}</Alert>}

      {tab === 'connections' && (
        <Panel className="panel-flush">
          <DataState
            loading={connections.loading}
            error={connections.error}
            data={extractList<Person>(connections.data)}
            onRetry={connections.reload}
            empty={{
              title: 'No connections yet',
              body: 'Find people to start building your football network.',
            }}
          >
            {(items) =>
              items.map((p) => {
                const pending = p.status === 'pending';
                // Accept/Decline belong only on requests sent *to* you.
                const incoming = pending && p.direction !== 'outgoing';

                return (
                  <Row
                    key={p.id}
                    media={avatarOf(p)}
                    title={p.name ?? 'Member'}
                    meta={
                      pending
                        ? incoming
                          ? 'Wants to connect with you'
                          : 'Request sent — waiting for a reply'
                        : (p.occupation ?? p.headline ?? 'Connected')
                    }
                    right={
                      incoming ? (
                        <>
                          <button
                            className="button button-green button-sm"
                            type="button"
                            disabled={respond.pending}
                            onClick={() => void respond.run(p.id, true)}
                          >
                            Accept
                          </button>
                          <button
                            className="button button-outline button-sm"
                            type="button"
                            disabled={respond.pending}
                            onClick={() => void respond.run(p.id, false)}
                          >
                            Decline
                          </button>
                        </>
                      ) : pending ? (
                        <Badge tone="gold">Pending</Badge>
                      ) : (
                        <>
                          <Badge tone="green">Connected</Badge>
                          {p.user_id && (
                            <Link
                              className="button button-outline button-sm"
                              to={`/app/network/messages/${p.user_id}`}
                            >
                              Message
                            </Link>
                          )}
                        </>
                      )
                    }
                  />
                );
              })
            }
          </DataState>
        </Panel>
      )}

      {tab === 'find' && (
        <>
          <form className="discover-search" onSubmit={onSearch}>
            <input
              className="field-input"
              type="search"
              placeholder="Search by name, role or club…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search people"
            />
            <button className="button button-green" type="submit">
              Search
            </button>
          </form>

          {query && (
            <Panel className="panel-flush">
              <DataState
                loading={search.loading}
                error={search.error}
                data={extractList<Person>(search.data)}
                onRetry={search.reload}
                empty={{ title: 'No people found', body: 'Try a different name or role.' }}
              >
                {(items) =>
                  items.map((p) => (
                    <Row
                      key={p.id}
                      media={avatarOf(p)}
                      title={p.name ?? 'Member'}
                      meta={p.occupation ?? p.headline ?? ''}
                      right={
                        <>
                          <Link
                            className="button button-outline button-sm"
                            to={`/app/network/messages/${p.user_id ?? p.id}`}
                          >
                            Message
                          </Link>
                          <button
                            className="button button-green button-sm"
                            type="button"
                            disabled={connect.pending}
                            onClick={() => void connect.run(p.user_id ?? p.id)}
                          >
                            {connect.pending ? 'Sending…' : 'Connect'}
                          </button>
                        </>
                      }
                    />
                  ))
                }
              </DataState>
            </Panel>
          )}
        </>
      )}

      {tab === 'inbox' && (
        <Panel className="panel-flush">
          <DataState
            loading={inbox.loading}
            error={inbox.error}
            data={extractList<Person & { last_message?: string; updated_at?: string }>(inbox.data)}
            onRetry={inbox.reload}
            empty={{ title: 'No messages', body: 'Conversations with your connections appear here.' }}
          >
            {(items) =>
              items.map((c) => (
                <Row
                  key={c.id}
                  media={avatarOf(c)}
                  title={c.name ?? 'Conversation'}
                  meta={c.last_message ?? ''}
                  onClick={() => navigate(`/app/network/messages/${c.user_id ?? c.id}`)}
                  right={<span>{relativeTime(c.updated_at)}</span>}
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
/* Creators                                                                    */
/* -------------------------------------------------------------------------- */

export function CreatorsPage() {
  const creators = useApi<unknown>('/creators', [], { per_page: 30 });
  const list = extractList<Person & { followers_count?: number; bio?: string }>(creators.data);

  const follow = useMutation(async (userId: number | string) => {
    await api.post(`/creators/${userId}/follow`);
    creators.reload();
  });

  return (
    <>
      <PageHeader
        title="Creators"
        subtitle="Storytellers, analysts and content makers building the football conversation."
      />

      {follow.error && <Alert>{follow.error}</Alert>}

      <DataState
        loading={creators.loading}
        error={creators.error}
        data={list}
        onRetry={creators.reload}
        empty={{ title: 'No creators yet', body: 'Creator profiles will appear here.' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((c) => (
              <Panel key={c.id}>
                <div className="inline" style={{ gap: 12, marginBottom: 12 }}>
                  <span className="club-card-crest" style={{ width: 46, height: 46 }}>
                    {mediaUrl(c.avatar) ? (
                      <img src={mediaUrl(c.avatar)!} alt="" loading="lazy" />
                    ) : (
                      initials(c.name)
                    )}
                  </span>
                  <div>
                    <strong style={{ display: 'block' }}>{c.name ?? 'Creator'}</strong>
                    {c.followers_count !== undefined && (
                      <span className="muted" style={{ fontSize: 12.5 }}>
                        {c.followers_count} followers
                      </span>
                    )}
                  </div>
                </div>
                <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>
                  {c.bio ?? c.headline ?? ''}
                </p>
                <div className="inline">
                  <Link
                    className="button button-outline button-sm"
                    to={`/app/network/messages/${c.user_id ?? c.id}`}
                  >
                    Message
                  </Link>
                  <button
                    className="button button-green button-sm"
                    type="button"
                    disabled={follow.pending}
                    onClick={() => void follow.run(c.user_id ?? c.id)}
                  >
                    {follow.pending ? 'Following…' : 'Follow'}
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
/* Community feed                                                              */
/* -------------------------------------------------------------------------- */

export function FeedPage() {
  const feed = useApi<unknown>('/feed', [], { per_page: 30 });
  const [body, setBody] = useState('');

  const list = extractList<{
    id: number;
    body?: string;
    content?: string;
    author?: Person;
    created_at?: string;
    reactions_count?: number;
    comments_count?: number;
  }>(feed.data);

  const post = useMutation(async () => {
    await api.post('/feed', { body: body.trim() });
    setBody('');
    feed.reload();
  });

  const react = useMutation(async (id: number) => {
    await api.post(`/feed/${id}/react`, { type: 'like' });
    feed.reload();
  });

  const report = useMutation(async (id: number) => {
    await api.post(`/feed/${id}/report`, { reason: 'inappropriate' });
  });

  const [openComments, setOpenComments] = useState<number | null>(null);

  async function onPost(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    await post.run();
  }

  return (
    <>
      <PageHeader title="Feed" subtitle="What supporters, clubs and creators are talking about." />

      <Panel style={{ marginBottom: 24 }}>
        <form onSubmit={onPost}>
          {post.error && <Alert>{post.error}</Alert>}
          <textarea
            className="field-input"
            rows={3}
            placeholder="Share something with the community…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="New post"
            style={{ resize: 'vertical', marginBottom: 12 }}
          />
          <button
            className="button button-green button-sm"
            type="submit"
            disabled={post.pending || !body.trim()}
          >
            {post.pending ? 'Posting…' : 'Post'}
          </button>
        </form>
      </Panel>

      <DataState
        loading={feed.loading}
        error={feed.error}
        data={list}
        onRetry={feed.reload}
        empty={{ title: 'Nothing in the feed yet', body: 'Be the first to post something.' }}
      >
        {(items) => (
          <div className="stack">
            {items.map((item) => (
              <Panel key={item.id}>
                <div className="inline" style={{ gap: 11, marginBottom: 10 }}>
                  <span className="club-card-crest" style={{ width: 38, height: 38 }}>
                    {mediaUrl(item.author?.avatar) ? (
                      <img src={mediaUrl(item.author?.avatar)!} alt="" loading="lazy" />
                    ) : (
                      initials(item.author?.name)
                    )}
                  </span>
                  <div>
                    <strong style={{ display: 'block', fontSize: 14.5 }}>
                      {item.author?.name ?? 'Member'}
                    </strong>
                    <span className="muted" style={{ fontSize: 12.5 }}>
                      {relativeTime(item.created_at)}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.55 }}>
                  {item.body ?? item.content}
                </p>
                <div className="inline">
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    disabled={react.pending}
                    onClick={() => void react.run(item.id)}
                  >
                    ♥ {item.reactions_count ?? 0}
                  </button>
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    onClick={() => setOpenComments((v) => (v === item.id ? null : item.id))}
                  >
                    {item.comments_count ?? 0} comments
                  </button>
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    disabled={report.pending}
                    onClick={() => void report.run(item.id)}
                    title="Report this post"
                  >
                    Report
                  </button>
                </div>

                {openComments === item.id && <Comments postId={item.id} onPosted={feed.reload} />}
              </Panel>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}

/** Inline comment thread for a feed post. */
function Comments({ postId, onPosted }: { postId: number; onPosted: () => void }) {
  const comments = useApi<unknown>(`/feed/${postId}/comments`, [postId]);
  const [text, setText] = useState('');

  const list = extractList<{
    id: number;
    body?: string;
    content?: string;
    author?: Person;
    created_at?: string;
  }>(comments.data);

  const add = useMutation(async () => {
    await api.post(`/feed/${postId}/comments`, { body: text.trim() });
    setText('');
    comments.reload();
    onPosted();
  });

  return (
    <div className="comments">
      <DataState
        loading={comments.loading}
        error={comments.error}
        data={list}
        onRetry={comments.reload}
        skeletonRows={1}
        empty={{ title: 'No comments yet', body: 'Be the first to reply.' }}
      >
        {(items) => (
          <div className="stack" style={{ gap: 10 }}>
            {items.map((c) => (
              <div key={c.id} className="comment">
                <strong>{c.author?.name ?? 'Member'}</strong>
                <p>{c.body ?? c.content}</p>
                <span>{relativeTime(c.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </DataState>

      {add.error && <Alert>{add.error}</Alert>}

      <form
        className="discover-search"
        style={{ marginTop: 12, marginBottom: 0 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) void add.run();
        }}
      >
        <input
          className="field-input"
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Comment"
        />
        <button className="button button-green button-sm" type="submit" disabled={add.pending || !text.trim()}>
          {add.pending ? 'Posting…' : 'Reply'}
        </button>
      </form>
    </div>
  );
}
