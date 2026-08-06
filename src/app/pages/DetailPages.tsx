import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList, mediaUrl } from '../../lib/api';
import { goToCheckout, payments } from '../../lib/payments';
import { formatDate, formatMoney, formatNumber, initials, labelOf, relativeTime } from '../../lib/format';
import { Alert, TextField } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';

/* -------------------------------------------------------------------------- */
/* Message thread                                                              */
/* -------------------------------------------------------------------------- */

type Msg = {
  id: number;
  body?: string;
  message?: string;
  sender_id?: number;
  is_mine?: boolean;
  created_at?: string;
};

export function MessagesPage() {
  const { userId = '' } = useParams();
  const thread = useApi<unknown>(`/network/messages/${userId}`, [userId]);
  const person = useApi<{ name?: string; avatar?: string | null }>(`/network/users/${userId}`, [userId]);

  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  const list = extractList<Msg>(thread.data);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [list.length]);

  const send = useMutation(async () => {
    await api.post(`/network/messages/${userId}`, { body: text.trim() });
    setText('');
    thread.reload();
  });

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (text.trim()) await send.run();
  }

  return (
    <>
      <PageHeader
        title={person.data?.name ?? 'Conversation'}
        subtitle="Direct messages with your connection."
        actions={
          <Link className="button button-outline button-sm" to="/app/network">
            Back to network
          </Link>
        }
      />

      {send.error && <Alert>{send.error}</Alert>}

      <Panel className="assistant-panel">
        <div className="assistant-log">
          <DataState
            loading={thread.loading}
            error={thread.error}
            data={list}
            onRetry={thread.reload}
            skeletonRows={2}
            empty={{ title: 'No messages yet', body: 'Say hello to start the conversation.' }}
          >
            {(items) =>
              items.map((m) => (
                <div key={m.id} className={`bubble${m.is_mine ? ' bubble-user' : ' bubble-bot'}`}>
                  <div>
                    <p>{m.body ?? m.message}</p>
                    <span>{relativeTime(m.created_at)}</span>
                  </div>
                </div>
              ))
            }
          </DataState>
          <div ref={endRef} />
        </div>

        <form className="assistant-compose" onSubmit={onSend}>
          <input
            className="field-input"
            placeholder="Write a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Message"
          />
          <button className="button button-green" type="submit" disabled={send.pending || !text.trim()}>
            Send
          </button>
        </form>
      </Panel>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Opportunity detail                                                          */
/* -------------------------------------------------------------------------- */

export function OpportunityPage() {
  const { slug = '' } = useParams();
  const opp = useApi<{
    title?: string;
    summary?: string | null;
    description?: string | null;
    type?: string | null;
    location?: string | null;
    deadline_at?: string | null;
    institution?: { name?: string } | string | null;
  }>(`/opportunities/${slug}`, [slug]);

  const [done, setDone] = useState<string | null>(null);

  const apply = useMutation(async () => {
    await api.post(`/opportunities/${slug}/apply`);
    setDone('Your application has been submitted.');
  });

  const save = useMutation(async () => {
    await api.post(`/opportunities/${slug}/bookmark`);
    setDone('Saved to your list.');
  });

  const o = opp.data;

  return (
    <>
      <PageHeader
        title={o?.title ?? 'Opportunity'}
        subtitle={o?.summary ?? 'Programme details'}
        actions={
          <Link className="button button-outline button-sm" to="/app/opportunities">
            All opportunities
          </Link>
        }
      />

      {(apply.error || save.error) && <Alert>{apply.error ?? save.error}</Alert>}
      {done && <Alert kind="success">{done}</Alert>}

      <DataState
        loading={opp.loading}
        error={opp.error}
        data={o}
        onRetry={opp.reload}
        skeletonRows={2}
        empty={{ title: 'Opportunity not found' }}
      >
        {(item) => (
          <Panel>
            <div className="inline" style={{ marginBottom: 14 }}>
              {item.type && <Badge tone="blue">{item.type}</Badge>}
              {item.location && <Badge>{item.location}</Badge>}
              {item.deadline_at && <Badge tone="gold">Closes {formatDate(item.deadline_at)}</Badge>}
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.65 }}>
              {item.description ?? item.summary ?? 'No description provided.'}
            </p>

            <div className="inline" style={{ marginTop: 18 }}>
              <button
                className="button button-green button-sm"
                type="button"
                disabled={apply.pending}
                onClick={() => void apply.run()}
              >
                {apply.pending ? 'Applying…' : 'Apply now'}
              </button>
              <button
                className="button button-outline button-sm"
                type="button"
                disabled={save.pending}
                onClick={() => void save.run()}
              >
                {save.pending ? 'Saving…' : 'Save for later'}
              </button>
            </div>
          </Panel>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Project detail + donate                                                     */
/* -------------------------------------------------------------------------- */

type PledgeTier = {
  id: number;
  name?: string;
  title?: string;
  amount?: string | number;
  description?: string | null;
};

export function ProjectPage() {
  const { slug = '' } = useParams();
  const project = useApi<{
    title?: string;
    name?: string;
    description?: string | null;
    cover?: string | null;
    cover_image?: string | null;
    goal_amount?: string | number | null;
    raised_amount?: string | number | null;
    progress_percent?: number | null;
    currency?: string;
    pledge_tiers?: PledgeTier[];
  }>(`/projects/${slug}`, [slug]);
  const reports = useApi<unknown>(`/projects/${slug}/reports`, [slug]);

  const [amount, setAmount] = useState('500');
  const [tierId, setTierId] = useState<number | null>(null);
  const [anonymous, setAnonymous] = useState(false);

  /**
   * Mirrors the mobile app: POST the donation, then hand off to Paystack's
   * hosted checkout. A pledge tier sets the amount server-side, so send one or
   * the other, never both.
   */
  const donate = useMutation(async () => {
    const res = await api.post<{ authorization_url?: string; reference?: string }>(
      `/projects/${slug}/donate`,
      tierId
        ? { pledge_tier_id: tierId, is_anonymous: anonymous }
        : { amount: Number(amount), is_anonymous: anonymous },
    );
    if (goToCheckout(res)) return res;
    // Some deployments settle straight from the wallet and return no checkout URL.
    project.reload();
    return res;
  });

  const p = project.data;
  const currency = p?.currency ?? 'KES';
  const goal = Number(p?.goal_amount ?? 0);
  const raised = Number(p?.raised_amount ?? 0);
  const pct =
    p?.progress_percent != null
      ? Math.min(100, Math.round(Number(p.progress_percent)))
      : goal > 0
        ? Math.min(100, Math.round((raised / goal) * 100))
        : 0;

  return (
    <>
      <PageHeader
        title={p?.title ?? p?.name ?? 'Project'}
        subtitle="Community project funded by supporters and partners."
        actions={
          <Link className="button button-outline button-sm" to="/app/projects">
            All projects
          </Link>
        }
      />

      {donate.error && <Alert>{donate.error}</Alert>}

      <DataState
        loading={project.loading}
        error={project.error}
        data={p}
        onRetry={project.reload}
        skeletonRows={2}
        empty={{ title: 'Project not found' }}
      >
        {(item) => (
          <>
            {mediaUrl(item.cover_image ?? item.cover) && (
              <img
                className="event-cover"
                style={{ maxHeight: 280, objectFit: 'cover', marginBottom: 22 }}
                src={mediaUrl(item.cover_image ?? item.cover)!}
                alt=""
              />
            )}

            <div className="grid-3" style={{ marginBottom: 24 }}>
              <Stat label="Raised" value={formatMoney(raised, currency)} />
              <Stat label="Goal" value={formatMoney(goal, currency)} />
              <Stat label="Progress" value={`${pct}%`} />
            </div>

            {goal > 0 && (
              <div className="progress" style={{ marginBottom: 22 }} aria-hidden="true">
                <span style={{ width: `${pct}%` }} />
              </div>
            )}

            <Panel style={{ marginBottom: 24 }}>
              <p style={{ marginTop: 0, fontSize: 15, lineHeight: 1.65 }}>
                {item.description ?? 'No description provided.'}
              </p>
            </Panel>

            <Section title="Support this project">
              <Panel>
                {(item.pledge_tiers ?? []).length > 0 && (
                  <>
                    <span className="stat-tile-label">Pledge tiers</span>
                    <div className="grid-3" style={{ margin: '10px 0 20px' }}>
                      {(item.pledge_tiers ?? []).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`pledge-tier${tierId === t.id ? ' selected' : ''}`}
                          onClick={() => setTierId(tierId === t.id ? null : t.id)}
                        >
                          <strong>{formatMoney(t.amount, currency)}</strong>
                          <span>{t.name ?? t.title}</span>
                          {t.description && <em>{t.description}</em>}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <span className="stat-tile-label">
                  {tierId ? 'Or give a custom amount' : 'Choose an amount'}
                </span>
                <div className="inline" style={{ marginTop: 10 }}>
                  {[200, 500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`chip${!tierId && String(amt) === amount ? ' chip-active' : ''}`}
                      onClick={() => {
                        setTierId(null);
                        setAmount(String(amt));
                      }}
                    >
                      {formatMoney(amt, currency)}
                    </button>
                  ))}
                  <input
                    className="field-input"
                    style={{ maxWidth: 140 }}
                    type="number"
                    min={10}
                    value={amount}
                    onChange={(e) => {
                      setTierId(null);
                      setAmount(e.target.value);
                    }}
                    aria-label="Donation amount"
                  />
                </div>

                <label className="field-check" style={{ marginTop: 16 }}>
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                  />
                  <span>Give anonymously</span>
                </label>

                <button
                  className="button button-green button-sm"
                  type="button"
                  disabled={donate.pending || (!tierId && Number(amount) < 10)}
                  onClick={() => void donate.run()}
                >
                  {donate.pending ? 'Opening checkout…' : 'Donate'}
                </button>
                <span className="field-hint">
                  Minimum {formatMoney(10, currency)}. You will be taken to Paystack to pay
                  securely, then returned here.
                </span>
              </Panel>
            </Section>

            <Section title="Impact reports">
              <Panel className="panel-flush">
                <DataState
                  loading={reports.loading}
                  error={reports.error}
                  data={extractList<{ id: number; title?: string; summary?: string; created_at?: string }>(
                    reports.data,
                  )}
                  onRetry={reports.reload}
                  empty={{ title: 'No reports yet', body: 'Progress updates will be published here.' }}
                >
                  {(items) =>
                    items.map((r) => (
                      <Row
                        key={r.id}
                        title={r.title ?? 'Report'}
                        meta={r.summary ?? ''}
                        right={<span>{formatDate(r.created_at)}</span>}
                      />
                    ))
                  }
                </DataState>
              </Panel>
            </Section>
          </>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Creator studio — create profile and publish posts                           */
/* -------------------------------------------------------------------------- */

export function CreatorStudioPage() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const saveProfile = useMutation(async () => {
    await api.post('/creators/profile', { display_name: displayName.trim(), bio: bio.trim() });
    setNotice('Creator profile saved.');
  });

  const publish = useMutation(async () => {
    await api.post('/creators/posts', { title: postTitle.trim(), body: postBody.trim() });
    setPostTitle('');
    setPostBody('');
    setNotice('Post published.');
  });

  return (
    <>
      <PageHeader
        title="Creator studio"
        subtitle="Set up your creator profile and publish to the community."
        actions={
          <Link className="button button-outline button-sm" to="/app/creators">
            Browse creators
          </Link>
        }
      />

      {(saveProfile.error || publish.error) && (
        <Alert>{saveProfile.error ?? publish.error}</Alert>
      )}
      {notice && <Alert kind="success">{notice}</Alert>}

      <div className="grid-2">
        <Section title="Your creator profile">
          <Panel>
            <TextField
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you appear to the community"
            />
            <label className="field">
              <span className="field-label">Bio</span>
              <textarea
                className="field-input"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What do you cover?"
                style={{ resize: 'vertical' }}
              />
            </label>
            <button
              className="button button-green button-sm"
              type="button"
              disabled={saveProfile.pending || !displayName.trim()}
              onClick={() => void saveProfile.run()}
            >
              {saveProfile.pending ? 'Saving…' : 'Save profile'}
            </button>
          </Panel>
        </Section>

        <Section title="Publish a post">
          <Panel>
            <TextField
              label="Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post title"
            />
            <label className="field">
              <span className="field-label">Body</span>
              <textarea
                className="field-input"
                rows={6}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder="Write your post…"
                style={{ resize: 'vertical' }}
              />
            </label>
            <button
              className="button button-green button-sm"
              type="button"
              disabled={publish.pending || !postTitle.trim() || !postBody.trim()}
              onClick={() => void publish.run()}
            >
              {publish.pending ? 'Publishing…' : 'Publish post'}
            </button>
          </Panel>
        </Section>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Talent profile — create player / scout profile, uploads, linked players      */
/* -------------------------------------------------------------------------- */

export function TalentProfilePage() {
  const profile = useApi<Record<string, unknown>>('/me/talent-profile');
  const linked = useApi<unknown>('/me/linked-players');

  const [position, setPosition] = useState('');
  const [foot, setFoot] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [bio, setBio] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const highlightRef = useRef<HTMLInputElement | null>(null);
  const cvRef = useRef<HTMLInputElement | null>(null);

  const savePlayer = useMutation(async () => {
    await api.post('/talent/player-profile', {
      position: position.trim() || null,
      preferred_foot: foot || null,
      height_cm: heightCm ? Number(heightCm) : null,
      bio: bio.trim() || null,
    });
    setNotice('Player profile saved.');
    profile.reload();
  });

  const saveScout = useMutation(async () => {
    await api.post('/talent/scout-profile', { bio: bio.trim() || null });
    setNotice('Scout profile saved.');
    profile.reload();
  });

  const uploadHighlight = useMutation(async (file: File) => {
    const form = new FormData();
    form.append('video', file);
    await api.post('/talent/player-profile/highlight', form);
    setNotice('Highlight uploaded.');
    profile.reload();
  });

  const uploadCv = useMutation(async (file: File) => {
    const form = new FormData();
    form.append('cv', file);
    await api.post('/talent/player-profile/cv', form);
    setNotice('CV uploaded.');
    profile.reload();
  });

  const unlink = useMutation(async (id: number) => {
    await api.delete(`/me/linked-players/${id}`);
    linked.reload();
  });

  const error =
    savePlayer.error ?? saveScout.error ?? uploadHighlight.error ?? uploadCv.error ?? unlink.error;

  return (
    <>
      <PageHeader
        title="My talent profile"
        subtitle="Be discoverable by scouts, academies and clubs across the continent."
        actions={
          <Link className="button button-outline button-sm" to="/app/talent">
            Browse talent
          </Link>
        }
      />

      {error && <Alert>{error}</Alert>}
      {notice && <Alert kind="success">{notice}</Alert>}

      <div className="grid-2">
        <Section title="Player profile">
          <Panel>
            <TextField
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Left winger"
            />
            <label className="field">
              <span className="field-label">Preferred foot</span>
              <select className="field-select" value={foot} onChange={(e) => setFoot(e.target.value)}>
                <option value="">Not specified</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </label>
            <TextField
              label="Height (cm)"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="175"
            />
            <label className="field">
              <span className="field-label">About you</span>
              <textarea
                className="field-input"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </label>

            <div className="inline">
              <button
                className="button button-green button-sm"
                type="button"
                disabled={savePlayer.pending}
                onClick={() => void savePlayer.run()}
              >
                {savePlayer.pending ? 'Saving…' : 'Save player profile'}
              </button>
              <button
                className="button button-outline button-sm"
                type="button"
                disabled={saveScout.pending}
                onClick={() => void saveScout.run()}
              >
                {saveScout.pending ? 'Saving…' : 'Register as scout'}
              </button>
            </div>
          </Panel>
        </Section>

        <div className="stack">
          <Section title="Highlights & CV">
            <Panel>
              <p className="muted" style={{ marginTop: 0 }}>
                Upload a highlight reel and your football CV so scouts can assess you.
              </p>

              <input
                ref={highlightRef}
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadHighlight.run(f);
                }}
              />
              <input
                ref={cvRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadCv.run(f);
                }}
              />

              <div className="inline">
                <button
                  className="button button-outline button-sm"
                  type="button"
                  disabled={uploadHighlight.pending}
                  onClick={() => highlightRef.current?.click()}
                >
                  {uploadHighlight.pending ? 'Uploading…' : 'Upload highlight'}
                </button>
                <button
                  className="button button-outline button-sm"
                  type="button"
                  disabled={uploadCv.pending}
                  onClick={() => cvRef.current?.click()}
                >
                  {uploadCv.pending ? 'Uploading…' : 'Upload CV'}
                </button>
              </div>
            </Panel>
          </Section>

          <Section title="Linked players">
            <Panel className="panel-flush">
              <DataState
                loading={linked.loading}
                error={linked.error}
                data={extractList<{ id: number; name?: string; position?: string }>(linked.data)}
                onRetry={linked.reload}
                skeletonRows={1}
                empty={{
                  title: 'No linked players',
                  body: 'Parents and guardians can link player profiles here.',
                }}
              >
                {(items) =>
                  items.map((p) => (
                    <Row
                      key={p.id}
                      media={<span style={{ fontWeight: 700, fontSize: 13 }}>{initials(p.name)}</span>}
                      title={p.name ?? 'Player'}
                      meta={p.position ?? ''}
                      right={
                        <button
                          className="button button-outline button-sm"
                          type="button"
                          disabled={unlink.pending}
                          onClick={() => void unlink.run(p.id)}
                        >
                          Unlink
                        </button>
                      }
                    />
                  ))
                }
              </DataState>
            </Panel>
          </Section>
        </div>
      </div>

      {profile.data && Object.keys(profile.data).length > 0 && (
        <Section title="Current profile">
          <Panel className="panel-flush">
            {Object.entries(profile.data)
              .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
              .map(([k, v]) => (
                <Row key={k} title={k.replace(/_/g, ' ')} right={<span>{String(v)}</span>} />
              ))}
          </Panel>
        </Section>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Match detail                                                                */
/* -------------------------------------------------------------------------- */

export function MatchPage() {
  const { id = '' } = useParams();
  const match = useApi<{
    home_team?: unknown;
    away_team?: unknown;
    home_score?: number | null;
    away_score?: number | null;
    kickoff_at?: string | null;
    venue?: string | null;
    status?: string;
  }>(`/matches/${id}`, [id]);
  const h2h = useApi<unknown>(`/matches/${id}/head-to-head`, [id]);

  const m = match.data;

  return (
    <>
      <PageHeader
        title={m ? `${labelOf(m.home_team) || 'TBC'} v ${labelOf(m.away_team) || 'TBC'}` : 'Match'}
        subtitle={[m?.venue, formatDate(m?.kickoff_at, true)].filter(Boolean).join(' · ')}
        actions={
          <Link className="button button-outline button-sm" to="/app/matches">
            Match centre
          </Link>
        }
      />

      <DataState
        loading={match.loading}
        error={match.error}
        data={m}
        onRetry={match.reload}
        skeletonRows={2}
        empty={{ title: 'Match not found' }}
      >
        {(item) => (
          <>
            <Panel style={{ marginBottom: 24, textAlign: 'center' }}>
              <span className="stat-tile-label">{item.status ?? 'Scheduled'}</span>
              <div className="stat-tile-value" style={{ fontSize: 44, margin: '10px 0' }}>
                {item.home_score ?? '–'} : {item.away_score ?? '–'}
              </div>
              <span className="muted">{formatDate(item.kickoff_at, true)}</span>
            </Panel>

            <Section title="Head to head">
              <Panel className="panel-flush">
                <DataState
                  loading={h2h.loading}
                  error={h2h.error}
                  data={extractList<{
                    id: number;
                    home_team?: string;
                    away_team?: string;
                    home_score?: number;
                    away_score?: number;
                    kickoff_at?: string;
                  }>(h2h.data)}
                  onRetry={h2h.reload}
                  empty={{ title: 'No previous meetings' }}
                >
                  {(items) =>
                    items.map((p) => (
                      <Row
                        key={p.id}
                        title={`${labelOf(p.home_team) || 'TBC'} v ${labelOf(p.away_team) || 'TBC'}`}
                        meta={formatDate(p.kickoff_at)}
                        right={
                          <Badge tone="green">
                            {p.home_score ?? 0} – {p.away_score ?? 0}
                          </Badge>
                        }
                      />
                    ))
                  }
                </DataState>
              </Panel>
            </Section>
          </>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Support                                                                     */
/* -------------------------------------------------------------------------- */

export function SupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = useMutation(async () => {
    await api.post('/support/tickets', { subject: subject.trim(), message: message.trim() });
    setSubject('');
    setMessage('');
    setSent(true);
  });

  return (
    <>
      <PageHeader
        title="Contact support"
        subtitle="Raise a ticket and the team will get back to you."
        actions={
          <Link className="button button-outline button-sm" to="/app/help">
            Help articles
          </Link>
        }
      />

      {submit.error && <Alert>{submit.error}</Alert>}
      {sent && <Alert kind="success">Ticket submitted — we&apos;ll be in touch.</Alert>}

      <Panel style={{ maxWidth: 620 }}>
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What do you need help with?"
        />
        <label className="field">
          <span className="field-label">Message</span>
          <textarea
            className="field-input"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue…"
            style={{ resize: 'vertical' }}
          />
        </label>
        <button
          className="button button-green button-sm"
          type="button"
          disabled={submit.pending || !subject.trim() || !message.trim()}
          onClick={() => void submit.run()}
        >
          {submit.pending ? 'Sending…' : 'Submit ticket'}
        </button>
      </Panel>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Payment return                                                              */
/* -------------------------------------------------------------------------- */

/** Paystack sends the browser back here; confirm the charge with the API. */
export function PaymentReturnPage() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'failed'>('checking');
  const [message, setMessage] = useState('Confirming your payment…');
  const [purpose, setPurpose] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let reference = params.get('reference') ?? params.get('trxref') ?? '';
    if (!reference) {
      try {
        reference = window.sessionStorage.getItem('afrisport.payment.reference') ?? '';
      } catch {
        reference = '';
      }
    }

    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference was provided.');
      return;
    }

    payments
      .verify(reference)
      .then((data) => {
        const p = (data as { purpose?: string } | null)?.purpose ?? null;
        setPurpose(p);
        setStatus('ok');
        setMessage(successMessageFor(p));
        try {
          window.sessionStorage.removeItem('afrisport.payment.reference');
        } catch {
          /* ignore */
        }
      })
      .catch((e: unknown) => {
        setStatus('failed');
        setMessage(e instanceof Error ? e.message : 'We could not confirm this payment.');
      });
  }, []);

  return (
    <>
      <PageHeader title="Payment" subtitle="Confirming the result with our payment provider." />

      <Panel style={{ maxWidth: 560 }}>
        {status === 'checking' && <p className="muted">{message}</p>}
        {status === 'ok' && <Alert kind="success">{message}</Alert>}
        {status === 'failed' && <Alert>{message}</Alert>}

        <div className="inline" style={{ marginTop: 14 }}>
          <Link className="button button-green button-sm" to="/app">
            Go to home
          </Link>
          {purpose === 'tourism_booking' ? (
            <Link className="button button-outline button-sm" to="/app/tourism/bookings">
              My tourism bookings
            </Link>
          ) : (
            <Link className="button button-outline button-sm" to="/app/orders">
              My orders
            </Link>
          )}
          <Link className="button button-outline button-sm" to="/app/notifications">
            Notifications
          </Link>
          <Link className="button button-outline button-sm" to="/app/wallet">
            Wallet
          </Link>
        </div>
      </Panel>
    </>
  );
}

function successMessageFor(purpose: string | null): string {
  switch (purpose) {
    case 'tourism_booking':
      return 'Successfully booked! Your tour is confirmed. Check Tourism bookings or Notifications for details.';
    case 'order':
      return 'Order paid successfully. You can track it under My orders.';
    case 'event_ticket':
      return 'Ticket purchased successfully. Find it under My tickets.';
    case 'membership':
      return 'Membership activated successfully. Welcome aboard!';
    case 'donation':
      return 'Donation received — thank you for your support.';
    case 'wallet_topup':
      return 'Wallet topped up successfully.';
    case 'founders':
      return 'Founders package activated successfully.';
    default:
      return 'Payment confirmed successfully. Thank you.';
  }
}

/* -------------------------------------------------------------------------- */
/* Badges                                                                      */
/* -------------------------------------------------------------------------- */

export function BadgesPage() {
  const badges = useApi<unknown>('/badges');
  const list = extractList<{
    id: number;
    name?: string;
    description?: string;
    icon?: string | null;
    earned?: boolean;
  }>(badges.data);

  return (
    <>
      <PageHeader title="Badges" subtitle="Recognition you can earn across the platform." />

      <div className="grid-3" style={{ marginBottom: 26 }}>
        <Stat label="Total badges" value={formatNumber(list.length)} />
        <Stat label="Earned" value={formatNumber(list.filter((b) => b.earned).length)} />
      </div>

      <DataState
        loading={badges.loading}
        error={badges.error}
        data={list}
        onRetry={badges.reload}
        empty={{ title: 'No badges yet' }}
      >
        {(items) => (
          <div className="grid-4">
            {items.map((b) => (
              <Panel key={b.id} style={{ opacity: b.earned ? 1 : 0.6 }}>
                <div className="inline" style={{ gap: 12, marginBottom: 10 }}>
                  <span className="club-card-crest" style={{ width: 44, height: 44 }}>
                    {mediaUrl(b.icon) ? <img src={mediaUrl(b.icon)!} alt="" /> : '★'}
                  </span>
                  {b.earned && <Badge tone="green">Earned</Badge>}
                </div>
                <strong style={{ display: 'block', marginBottom: 4 }}>{b.name}</strong>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
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
