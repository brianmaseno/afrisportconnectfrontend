import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { TextField, SelectField, Alert } from '../components/Field';
import { PasswordField, passwordProblem } from '../components/PasswordField';
import { useAuth } from '../lib/auth';
import { useApi, useMutation } from '../lib/useApi';
import { api, extractList, mediaUrl } from '../lib/api';
import { goToCheckout } from '../lib/payments';
import { formatMembershipUsd } from '../lib/format';
import { media } from '../lib/media';
import type { Club, Country, MembershipCategory, MembershipTier } from '../lib/types';

type Competition = {
  id: number;
  name: string;
  code?: string | null;
  country?: string | null;
  logo?: string | null;
};

type Team = {
  id: number;
  name: string;
  logo?: string | null;
  short_name?: string | null;
  tla?: string | null;
};

const STEPS = ['Your details', 'Location', 'Membership', 'Your team'] as const;

function tierCategory(t: MembershipTier): MembershipCategory {
  return t.category === 'corporate' ? 'corporate' : 'individual';
}

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  /* Step 1 */
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  /* Step 2 */
  const [countryId, setCountryId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [cityId, setCityId] = useState('');
  const [occupation, setOccupation] = useState('');
  const [referral, setReferral] = useState('');

  /* Step 3 — membership category + tier from API */
  const [membershipCategory, setMembershipCategory] = useState<MembershipCategory>('individual');
  const [tierId, setTierId] = useState('');

  /* Step 4 — competition then team, mirroring the mobile onboarding */
  const [competitionId, setCompetitionId] = useState('');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [clubId, setClubId] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const countries = useApi<Country[]>('/countries');
  const tiers = useApi<MembershipTier[]>('/membership/tiers');
  const competitions = useApi<unknown>('/competitions');
  const teams = useApi<unknown>(
    competitionId ? `/competitions/${competitionId}/teams` : null,
    [competitionId],
  );
  // Fallback when a competition has no synced squad list yet.
  const clubs = useApi<unknown>('/clubs', [], { per_page: 200 });

  const countryList = countries.data ?? [];
  const tierList = useMemo(
    () =>
      (tiers.data ?? [])
        .filter((t) => t.is_visible !== false && tierCategory(t) === membershipCategory)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id),
    [tiers.data, membershipCategory],
  );
  const competitionList = useMemo(
    () => extractList<Competition>(competitions.data),
    [competitions.data],
  );
  const teamList = useMemo(() => extractList<Team>(teams.data), [teams.data]);
  const clubList = useMemo(() => extractList<Club>(clubs.data), [clubs.data]);

  const regions = useMemo(
    () => countryList.find((c) => String(c.id) === countryId)?.regions ?? [],
    [countryList, countryId],
  );
  const cities = useMemo(
    () => regions.find((r) => String(r.id) === regionId)?.cities ?? [],
    [regions, regionId],
  );

  const visibleTeams = teamSearch
    ? teamList.filter((t) => t.name.toLowerCase().includes(teamSearch.toLowerCase()))
    : teamList;

  // A competition is picked but the backend has no teams for it yet.
  const noTeams = Boolean(competitionId) && !teams.loading && teamList.length === 0;

  const createAccount = useMutation(async () => {
    let preferredClubId: number | null = clubId ? Number(clubId) : null;

    // Turn the chosen team into (or find) its Afrisport Connect club hub —
    // the same POST /clubs/from-team the mobile app uses.
    if (!preferredClubId && teamId) {
      const linked = await api.post<{ club?: { id?: number } }>(
        '/clubs/from-team',
        {
          team_id: teamId,
          ...(countryId ? { country_id: Number(countryId) } : null),
          ...(cityId ? { city_id: Number(cityId) } : null),
        },
        { anonymous: true },
      );
      preferredClubId = linked?.club?.id ?? null;
      if (!preferredClubId) throw new Error('We could not link that team to a club hub.');
    }

    return register({
      name: name.trim(),
      email: identity.trim(),
      password,
      password_confirmation: confirm,
      country_id: Number(countryId),
      preferred_club_id: preferredClubId,
      ...(regionId ? { region_id: Number(regionId) } : null),
      ...(cityId ? { city_id: Number(cityId) } : null),
      ...(occupation.trim() ? { occupation: occupation.trim() } : null),
      ...(tierId ? { membership_tier_id: Number(tierId) } : null),
      ...(referral.trim() ? { referral_code: referral.trim().toUpperCase() } : null),
      accept_terms: true,
      accept_privacy: true,
    });
  });

  /* ---- validation ---- */
  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!name.trim()) return 'Please enter your full name.';
      if (!identity.trim()) return 'Please enter your email address.';
      if (!/^\S+@\S+\.\S+$/.test(identity.trim()))
        return 'That email address does not look right.';
      const pwProblem = passwordProblem(password);
      if (pwProblem) return pwProblem;
      if (password !== confirm) return 'Passwords do not match.';
      return null;
    }
    if (current === 1) {
      if (!countryId) return 'Please choose your country.';
      return null;
    }
    if (current === 2) {
      // Free / no selection is allowed for individuals; corporates must pick a plan when listed.
      if (membershipCategory === 'corporate' && tierList.length > 0 && !tierId) {
        return 'Please choose a corporate membership plan.';
      }
      return null;
    }
    return null;
  }

  function selectCategory(next: MembershipCategory) {
    setMembershipCategory(next);
    setTierId('');
    setLocalError(null);
  }

  function goNext(e: FormEvent) {
    e.preventDefault();
    const err = validateStep(step);
    setLocalError(err);
    if (!err) setStep((s) => s + 1);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!teamId && !clubId) {
      setLocalError('Choose the team or club you support.');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      setLocalError('Please accept the Terms and Privacy Policy to continue.');
      return;
    }

    const result = await createAccount.run();
    if (!result) return;

    // A paid tier leaves the account on Free until payment clears, and the API
    // returns a Paystack session. Hand off to it; if anything is missing the
    // account still exists, so go straight to the app rather than stranding
    // the user on the form.
    if (result.requires_payment && result.payment && goToCheckout(result.payment)) return;

    navigate('/app', { replace: true });
  }

  const error = localError ?? createAccount.error;

  return (
    <AuthShell
      title="Join the movement."
      subtitle="Create your account to claim your Fan Passport, follow your club and take part."
      image={media.fansCelebrate}
      footer={
        <span>
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      }
    >
      <div className="stepper" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`stepper-dot${i < step ? ' done' : ''}${i === step ? ' active' : ''}`}
          />
        ))}
      </div>
      <p className="step-label">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      {error && <Alert>{error}</Alert>}

      {/* ---------------- Step 1 — details ---------------- */}
      {step === 0 && (
        <form onSubmit={goNext} noValidate>
          <TextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Amina Otieno"
            required
            autoFocus
          />

          <TextField
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            required
          />

          <PasswordField
            label="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showStrength
            required
          />
          <PasswordField
            label="Confirm password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={confirm && confirm !== password ? 'Passwords do not match.' : undefined}
            required
          />

          <button className="button button-green auth-submit" type="submit">
            Continue <span aria-hidden="true">→</span>
          </button>
        </form>
      )}

      {/* ---------------- Step 2 — location ---------------- */}
      {step === 1 && (
        <form onSubmit={goNext} noValidate>
          <SelectField
            label="Country"
            value={countryId}
            onChange={(e) => {
              setCountryId(e.target.value);
              setRegionId('');
              setCityId('');
            }}
            disabled={countries.loading}
            required
          >
            <option value="">{countries.loading ? 'Loading…' : 'Select your country'}</option>
            {countryList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag_emoji ? `${c.flag_emoji}  ` : ''}
                {c.name}
              </option>
            ))}
          </SelectField>

          {regions.length > 0 && (
            <div className="field-row">
              <SelectField
                label="Region"
                value={regionId}
                onChange={(e) => {
                  setRegionId(e.target.value);
                  setCityId('');
                }}
              >
                <option value="">Optional</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="City"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                disabled={!cities.length}
              >
                <option value="">Optional</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
            </div>
          )}

          <TextField
            label="Occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Optional"
          />

          <TextField
            label="Referral code"
            value={referral}
            onChange={(e) => setReferral(e.target.value.toUpperCase())}
            placeholder="Optional"
            maxLength={12}
          />

          <div className="step-actions">
            <button className="button button-outline" type="button" onClick={() => setStep(0)}>
              Back
            </button>
            <button className="button button-green" type="submit">
              Continue <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ---------------- Step 3 — membership (individuals / corporates) ---------------- */}
      {step === 2 && (
        <form onSubmit={goNext} noValidate>
          <div className="field">
            <span className="field-label">Membership</span>
            <p className="field-hint" style={{ marginTop: 0, marginBottom: 10 }}>
              Choose whether you are joining as an individual fan or as a corporate / organisation.
              Plans are loaded from Afrisport Connect.
            </p>

            <div className="tier-category" role="tablist" aria-label="Membership type">
              <button
                type="button"
                role="tab"
                aria-selected={membershipCategory === 'individual'}
                className={`tier-category-btn${membershipCategory === 'individual' ? ' selected' : ''}`}
                onClick={() => selectCategory('individual')}
              >
                Individuals
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={membershipCategory === 'corporate'}
                className={`tier-category-btn${membershipCategory === 'corporate' ? ' selected' : ''}`}
                onClick={() => selectCategory('corporate')}
              >
                Corporates
              </button>
            </div>

            {tiers.loading && <p className="muted">Loading membership plans…</p>}
            {tiers.error && <Alert>{tiers.error}</Alert>}

            {!tiers.loading && !tiers.error && (
              <div
                className="tier-choice"
                role="radiogroup"
                aria-label={
                  membershipCategory === 'corporate'
                    ? 'Corporate membership plans'
                    : 'Individual membership plans'
                }
              >
                {membershipCategory === 'individual' && (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={tierId === ''}
                    className={`tier-option${tierId === '' ? ' selected' : ''}`}
                    onClick={() => setTierId('')}
                  >
                    <span className="tier-option-head">
                      <strong>Free</strong>
                      <em>No charge</em>
                    </span>
                    <ul>
                      <li>Club news and match centre</li>
                      <li>Fan Passport and community</li>
                    </ul>
                  </button>
                )}

                {tierList
                  .filter((t) => membershipCategory === 'corporate' || Number(t.price) > 0)
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={tierId === String(t.id)}
                      className={`tier-option${tierId === String(t.id) ? ' selected' : ''}`}
                      onClick={() => setTierId(String(t.id))}
                    >
                      <span className="tier-option-head">
                        <strong>{t.name}</strong>
                        <em>
                          {Number(t.price) > 0
                            ? formatMembershipUsd(t.price, t.currency ?? 'KES')
                            : 'No charge'}
                        </em>
                      </span>
                      {Array.isArray(t.benefits) && t.benefits.length > 0 ? (
                        <ul>
                          {t.benefits.slice(0, 4).map((b) => (
                            <li key={b}>{String(b).replace(/_/g, ' ')}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul>
                          <li>{t.description ?? 'Full membership benefits'}</li>
                        </ul>
                      )}
                    </button>
                  ))}

                {!tierList.filter((t) => membershipCategory === 'corporate' || Number(t.price) > 0)
                  .length && membershipCategory === 'corporate' && (
                  <p className="muted">
                    No corporate plans are published yet. Switch to Individuals, or check back
                    shortly.
                  </p>
                )}
              </div>
            )}

            <span className="field-hint">
              Paid plans are charged after your account is created. If payment does not go through
              you stay on Free and can upgrade any time.
            </span>
          </div>

          <div className="step-actions">
            <button className="button button-outline" type="button" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="button button-green" type="submit">
              Continue <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ---------------- Step 4 — competition then team ---------------- */}
      {step === 3 && (
        <form onSubmit={onSubmit} noValidate>
          <SelectField
            label="Competition"
            value={competitionId}
            onChange={(e) => {
              setCompetitionId(e.target.value);
              setTeamId(null);
              setClubId('');
              setTeamSearch('');
            }}
            disabled={competitions.loading}
            hint="Pick the league your team plays in."
          >
            <option value="">
              {competitions.loading ? 'Loading competitions…' : 'Select a competition'}
            </option>
            {competitionList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.country ? ` — ${c.country}` : ''}
              </option>
            ))}
          </SelectField>

          {competitionId && !noTeams && (
            <>
              {teamList.length > 8 && (
                <TextField
                  label="Find your team"
                  type="search"
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Start typing a team name…"
                />
              )}

              <div className="team-grid" role="radiogroup" aria-label="Your team">
                {teams.loading && <p className="muted">Loading teams…</p>}

                {visibleTeams.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={teamId === t.id}
                    className={`team-option${teamId === t.id ? ' selected' : ''}`}
                    onClick={() => setTeamId(t.id)}
                  >
                    <span className="team-crest">
                      {mediaUrl(t.logo) ? (
                        <img src={mediaUrl(t.logo)!} alt="" loading="lazy" />
                      ) : (
                        (t.tla ?? t.name.slice(0, 3)).toUpperCase()
                      )}
                    </span>
                    <span className="team-name">{t.name}</span>
                  </button>
                ))}

                {!teams.loading && visibleTeams.length === 0 && teamSearch && (
                  <p className="muted">No team matches “{teamSearch}”.</p>
                )}
              </div>
            </>
          )}

          {noTeams && (
            <>
              <Alert kind="info">
                No teams are synced for that competition yet — pick an Afrisport Connect club hub
                instead.
              </Alert>
              <SelectField
                label="Club hub"
                value={clubId}
                onChange={(e) => {
                  setClubId(e.target.value);
                  setTeamId(null);
                }}
                disabled={clubs.loading}
              >
                <option value="">{clubs.loading ? 'Loading clubs…' : 'Select a club'}</option>
                {clubList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
            </>
          )}

          <label className="field-check" style={{ marginTop: 18 }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              I accept the{' '}
              <Link to="/terms" target="_blank">
                Terms of Service
              </Link>
              .
            </span>
          </label>

          <label className="field-check">
            <input
              type="checkbox"
              checked={acceptPrivacy}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
            />
            <span>
              I accept the{' '}
              <Link to="/privacy" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <div className="step-actions">
            <button
              className="button button-outline"
              type="button"
              onClick={() => setStep(2)}
              disabled={createAccount.pending}
            >
              Back
            </button>
            <button className="button button-green" type="submit" disabled={createAccount.pending}>
              {createAccount.pending ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
