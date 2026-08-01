import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList } from '../../lib/api';
import { relativeTime } from '../../lib/format';
import { Alert } from '../../components/Field';
import { DataState, PageHeader, Panel, Row } from '../ui';
import { brand } from '../../lib/media';
import './assistant.css';

type Message = {
  id?: number | string;
  role?: string;
  sender?: string;
  content?: string;
  message?: string;
  body?: string;
  created_at?: string;
};

const textOf = (m: Message) => m.content ?? m.message ?? m.body ?? '';
const isUser = (m: Message) => (m.role ?? m.sender ?? '').toLowerCase() === 'user';

export function AssistantPage() {
  const history = useApi<unknown>('/assistant/history');
  const briefing = useApi<{ summary?: string; headline?: string }>('/assistant/briefing');

  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [local, setLocal] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const stored = extractList<Message>(history.data);
  const messages = [...stored, ...local];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const send = useMutation(async (text: string) => {
    const reply = await api.post<Message | { reply?: string; message?: string }>('/assistant/chat', {
      message: text,
    });
    const answer =
      (reply as { reply?: string }).reply ??
      (reply as { message?: string }).message ??
      textOf(reply as Message);
    setLocal((m) => [...m, { role: 'assistant', content: answer || 'No response.' }]);
    return reply;
  });

  const rate = useMutation(async (messageId: number | string | undefined, helpful: boolean) => {
    await api.post("/assistant/feedback", { message_id: messageId ?? null, helpful });
  });

  const lookup = useApi<unknown>(search ? "/assistant/search" : null, [search], { q: search });

  const clear = useMutation(async () => {
    await api.delete('/assistant/history');
    setLocal([]);
    history.reload();
  });

  async function onSend(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setLocal((m) => [...m, { role: 'user', content: text }]);
    await send.run(text);
  }

  return (
    <>
      <PageHeader
        title="Assistant"
        subtitle="Ask about fixtures, your membership, chapters or anything on the platform."
        actions={
          <button
            className="button button-outline button-sm"
            type="button"
            onClick={() => void clear.run()}
            disabled={clear.pending || messages.length === 0}
          >
            {clear.pending ? 'Clearing…' : 'Clear history'}
          </button>
        }
      />

      {briefing.data?.summary && (
        <Panel style={{ marginBottom: 20 }}>
          <span className="stat-tile-label">Today&apos;s briefing</span>
          <p style={{ margin: '8px 0 0', fontSize: 15, lineHeight: 1.55 }}>
            {briefing.data.headline ?? briefing.data.summary}
          </p>
        </Panel>
      )}

      {send.error && <Alert>{send.error}</Alert>}

      {/* Knowledge search across help articles and platform content */}
      <form
        className="discover-search"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchDraft.trim());
        }}
      >
        <input
          className="field-input"
          type="search"
          placeholder="Search the knowledge base…"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          aria-label="Search the knowledge base"
        />
        <button className="button button-outline" type="submit">
          Search
        </button>
      </form>

      {search && (
        <Panel className="panel-flush" style={{ marginBottom: 20 }}>
          <DataState
            loading={lookup.loading}
            error={lookup.error}
            data={extractList<{ id?: number; title?: string; excerpt?: string }>(lookup.data)}
            onRetry={lookup.reload}
            skeletonRows={1}
            empty={{ title: 'No matches', body: 'Try different wording, or just ask below.' }}
          >
            {(items) =>
              items.map((r, i) => (
                <Row key={r.id ?? i} title={r.title ?? 'Result'} meta={r.excerpt ?? ''} />
              ))
            }
          </DataState>
        </Panel>
      )}

      <Panel className="assistant-panel">
        <div className="assistant-log">
          {history.loading && <p className="muted">Loading conversation…</p>}

          {!history.loading && messages.length === 0 && (
            <div className="assistant-empty">
              <img src={brand.mark} alt="" width={44} height={44} />
              <strong>How can I help?</strong>
              <p>
                Try “When does my club play next?”, “What does my membership include?” or “Find a
                chapter near me”.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={m.id ?? `${i}-${textOf(m).slice(0, 12)}`}
              className={`bubble${isUser(m) ? ' bubble-user' : ' bubble-bot'}`}
            >
              {!isUser(m) && <img className="bubble-mark" src={brand.mark} alt="" width={22} height={22} />}
              <div>
                <p>{textOf(m)}</p>
                {m.created_at && <span>{relativeTime(m.created_at)}</span>}
                {!isUser(m) && (
                  <span className="bubble-rate">
                    <button
                      type="button"
                      onClick={() => void rate.run(m.id, true)}
                      aria-label="Mark as helpful"
                    >
                      Helpful
                    </button>
                    <button
                      type="button"
                      onClick={() => void rate.run(m.id, false)}
                      aria-label="Mark as not helpful"
                    >
                      Not helpful
                    </button>
                  </span>
                )}
              </div>
            </div>
          ))}

          {send.pending && (
            <div className="bubble bubble-bot">
              <img className="bubble-mark" src={brand.mark} alt="" width={22} height={22} />
              <div>
                <p className="assistant-typing" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <form className="assistant-compose" onSubmit={onSend}>
          <input
            className="field-input"
            type="text"
            placeholder="Ask the assistant…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message"
          />
          <button className="button button-green" type="submit" disabled={send.pending || !draft.trim()}>
            Send
          </button>
        </form>
      </Panel>
    </>
  );
}
