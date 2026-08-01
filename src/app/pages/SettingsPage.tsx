import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useApi, useMutation } from '../../lib/useApi';
import { api, API_BASE_URL, getToken } from '../../lib/api';
import { Alert } from '../../components/Field';
import { PageHeader, Panel, Section } from '../ui';

type Prefs = Record<string, boolean>;

const LABELS: Record<string, string> = {
  match_alerts: 'Match alerts',
  club_news: 'Club news',
  chapter_updates: 'Chapter updates',
  events: 'Events and meet-ups',
  marketplace: 'Marketplace and offers',
  learning: 'Learning and courses',
  rewards: 'Rewards and points',
  email: 'Email notifications',
  push: 'Push notifications',
  sms: 'SMS notifications',
};

export function SettingsPage() {
  const { user, logout } = useAuth();
  const stored = useApi<Prefs | { preferences?: Prefs }>('/notification-preferences');

  const [prefs, setPrefs] = useState<Prefs>({});
  const [saved, setSaved] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    const raw = stored.data as (Prefs & { preferences?: Prefs }) | null;
    if (!raw) return;
    const source = raw.preferences ?? raw;
    const next: Prefs = {};
    for (const [k, v] of Object.entries(source)) {
      if (typeof v === 'boolean') next[k] = v;
    }
    // Fall back to a sensible default set if the API returns nothing usable.
    setPrefs(
      Object.keys(next).length
        ? next
        : { match_alerts: true, club_news: true, chapter_updates: true, events: true },
    );
  }, [stored.data]);

  const save = useMutation(async () => {
    await api.put('/notification-preferences', prefs);
    setSaved(true);
  });

  const exportData = useMutation(async () => {
    // Hits the API directly so the browser receives the file as a download.
    const res = await fetch(`${API_BASE_URL}/auth/export-data`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${getToken() ?? ''}` },
    });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'afrisport-connect-data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  const deleteAccount = useMutation(async () => {
    await api.delete('/auth/account');
    await logout();
  });

  return (
    <>
      <PageHeader title="Settings" subtitle="Notifications, your data and account controls." />

      <Section title="Notifications">
        <Panel>
          {save.error && <Alert>{save.error}</Alert>}
          {saved && <Alert kind="success">Preferences saved.</Alert>}

          {stored.loading ? (
            <p className="muted" style={{ margin: 0 }}>
              Loading preferences…
            </p>
          ) : (
            <>
              <div className="stack" style={{ marginBottom: 18 }}>
                {Object.entries(prefs).map(([key, value]) => (
                  <label key={key} className="field-check" style={{ marginBottom: 0 }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => {
                        setSaved(false);
                        setPrefs((p) => ({ ...p, [key]: e.target.checked }));
                      }}
                    />
                    <span>{LABELS[key] ?? key.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
              <button
                className="button button-green button-sm"
                type="button"
                onClick={() => void save.run()}
                disabled={save.pending}
              >
                {save.pending ? 'Saving…' : 'Save preferences'}
              </button>
            </>
          )}
        </Panel>
      </Section>

      <Section title="Your data">
        <Panel>
          <p className="muted" style={{ marginTop: 0 }}>
            Download everything Afrisport Connect holds about your account.
          </p>
          {exportData.error && <Alert>{exportData.error}</Alert>}
          <button
            className="button button-outline button-sm"
            type="button"
            onClick={() => void exportData.run()}
            disabled={exportData.pending}
          >
            {exportData.pending ? 'Preparing…' : 'Export my data'}
          </button>
        </Panel>
      </Section>

      <Section title="Delete account">
        <Panel style={{ borderColor: 'rgba(217, 48, 37, 0.3)' }}>
          <p className="muted" style={{ marginTop: 0 }}>
            This permanently deletes your account, Fan Passport and history. It cannot be undone.
            Type <strong>DELETE</strong> below to confirm.
          </p>
          {deleteAccount.error && <Alert>{deleteAccount.error}</Alert>}
          <div className="inline">
            <input
              className="field-input"
              style={{ maxWidth: 200 }}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              aria-label="Type DELETE to confirm"
            />
            <button
              className="button button-sm"
              type="button"
              style={{ background: 'var(--error)', color: '#fff' }}
              disabled={confirmText !== 'DELETE' || deleteAccount.pending}
              onClick={() => void deleteAccount.run()}
            >
              {deleteAccount.pending ? 'Deleting…' : 'Delete my account'}
            </button>
          </div>
        </Panel>
      </Section>

      <p className="muted" style={{ fontSize: 13 }}>
        Signed in as {user?.email ?? user?.phone}.
      </p>
    </>
  );
}
