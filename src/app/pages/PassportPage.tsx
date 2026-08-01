import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useApi, useMutation } from '../../lib/useApi';
import { api, mediaUrl } from '../../lib/api';
import { Alert } from '../../components/Field';
import { formatDate, formatNumber, initials } from '../../lib/format';
import { DataState, PageHeader, Panel, Section, Stat } from '../ui';
import { brand } from '../../lib/media';
import type { FanPassport } from '../../lib/types';
import './passport.css';

type PassportPayload = FanPassport & {
  member_number?: string;
  qr_url?: string | null;
  tier?: { name?: string } | null;
};

export function PassportPage() {
  const { user } = useAuth();
  const passport = useApi<PassportPayload>('/passport');
  const impact = useApi<{ score?: number; total?: number }>('/me/impact-score');

  // Only ask for the QR once a passport exists — guests and members without one
  // get a 404 from this endpoint.
  const hasPassport = Boolean(passport.data?.member_number);
  const qr = useApi<{ url?: string; qr_url?: string }>(
    hasPassport && !passport.data?.qr_url ? '/passport/qr' : null,
    [hasPassport, passport.data?.qr_url],
  );

  const [qrFailed, setQrFailed] = useState(false);

  const download = useMutation(async () => {
    const data = await api.get<{ url?: string }>('/passport/download');
    const url = mediaUrl(data?.url);
    if (!url) throw new Error('Your passport file is not ready yet.');
    window.open(url, '_blank', 'noopener');
    return data;
  });

  const theme = user?.passport_theme;
  const accent = theme?.accent ?? '#0b6e4f';
  const primary = theme?.primary ?? '#0b1f3a';
  const avatar = mediaUrl(user?.avatar);

  return (
    <>
      <PageHeader
        title="Fan Passport"
        subtitle="Your verified identity across Afrisport Connect — membership, club and impact in one place."
        actions={
          <button
            className="button button-outline button-sm"
            type="button"
            disabled={download.pending}
            onClick={() => void download.run()}
          >
            {download.pending ? 'Preparing…' : 'Download passport'}
          </button>
        }
      />

      {download.error && <Alert>{download.error}</Alert>}

      <div className="passport-layout">
        <DataState
          loading={passport.loading}
          error={passport.error}
          data={passport.data}
          onRetry={passport.reload}
          skeletonRows={1}
          empty={{
            title: 'No passport issued yet',
            body: 'Your Fan Passport is created with your membership.',
          }}
        >
          {(data) => (
            <article
              className="passport-card"
              style={{
                background: `linear-gradient(145deg, ${primary} 0%, #081527 70%)`,
              }}
            >
              <span className="passport-glow" style={{ background: accent }} aria-hidden="true" />

              <header className="passport-top">
                <img src={brand.mark} alt="" width={34} height={34} />
                <span className="passport-issuer">
                  <strong>Afrisport Connect</strong>
                  <span>Fan Passport</span>
                </span>
                <span className="passport-tier" style={{ borderColor: accent, color: accent }}>
                  {theme?.badge ?? user?.membership?.tier?.name ?? 'FREE'}
                </span>
              </header>

              <div className="passport-body">
                <div className="passport-identity">
                  {avatar ? (
                    <img className="passport-avatar" src={avatar} alt="" />
                  ) : (
                    <span className="passport-avatar passport-avatar-fallback">
                      {initials(user?.name)}
                    </span>
                  )}
                  <div>
                    <strong>{user?.name}</strong>
                    <span>{theme?.label ?? 'Member'}</span>
                  </div>
                </div>

                <dl className="passport-meta">
                  <div>
                    <dt>Member number</dt>
                    <dd className="passport-number">{data.member_number ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Club</dt>
                    <dd>{user?.preferred_club?.name ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Country</dt>
                    <dd>
                      {user?.country?.flag_emoji ? `${user.country.flag_emoji} ` : ''}
                      {user?.country?.name ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Issued</dt>
                    <dd>{formatDate(data.issued_at)}</dd>
                  </div>
                </dl>

                {/* QR comes from /passport, or /passport/qr when generated lazily. */}
                {(() => {
                  const src = mediaUrl(data.qr_url ?? qr.data?.qr_url ?? qr.data?.url);
                  // The stored QR is often missing (the file is generated from
                  // APP_URL, which drifts between environments), so a broken
                  // image must degrade to the placeholder rather than a blank box.
                  const showQr = Boolean(src) && !qrFailed;

                  return (
                    <div className="passport-qr">
                      {showQr ? (
                        <img
                          src={src!}
                          alt="Fan Passport QR code"
                          onError={() => setQrFailed(true)}
                        />
                      ) : (
                        <span className="passport-qr-empty">No QR yet</span>
                      )}
                      <div>
                        <strong>{showQr ? 'Scan to verify' : 'QR pending'}</strong>
                        <span>
                          {showQr
                            ? 'Present this at events, club venues and partner locations to verify your membership.'
                            : 'Your verification code is generated shortly after your passport is issued. Your member number above works in the meantime.'}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <footer className="passport-foot">
                <span>Issued by Afrisport Connect</span>
                <span>{user?.referral_code ?? ''}</span>
              </footer>
            </article>
          )}
        </DataState>

        <div className="passport-side">
          <Section title="Your standing">
            <div className="stack">
              <Stat
                label="Loyalty points"
                value={formatNumber(user?.loyalty_points)}
                hint={user?.loyalty_level ?? undefined}
              />
              <Stat
                label="Impact score"
                value={
                  impact.loading
                    ? '—'
                    : formatNumber(impact.data?.score ?? impact.data?.total ?? 0)
                }
                hint="Contribution beyond the scoreline"
              />
              <Stat label="Referral code" value={user?.referral_code ?? '—'} hint="Share to earn rewards" />
            </div>
          </Section>

          <Section title="Membership">
            <Panel>
              <p className="muted" style={{ marginTop: 0 }}>
                {user?.membership?.tier?.description ??
                  'You are on the Free tier. Upgrade for more benefits across the platform.'}
              </p>
              <a className="button button-green button-sm" href="/app/membership">
                Manage membership <span aria-hidden="true">→</span>
              </a>
            </Panel>
          </Section>
        </div>
      </div>
    </>
  );
}
