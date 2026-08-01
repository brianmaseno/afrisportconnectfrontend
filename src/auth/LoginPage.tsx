import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { TextField, Alert } from '../components/Field';
import { PasswordField } from '../components/PasswordField';
import { useAuth } from '../lib/auth';
import { useMutation } from '../lib/useApi';
import { media } from '../lib/media';

export function LoginPage() {
  const { login, verifyMfa } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/app';

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');

  // Populated when the account has MFA switched on.
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaChannel, setMfaChannel] = useState<string>('');
  const [code, setCode] = useState('');

  // Phone sign-in is not enabled yet, so the form is email only.
  const signIn = useMutation(async () => login({ email: identity.trim(), password }));

  const confirmMfa = useMutation(async () => verifyMfa(mfaToken!, code.trim()));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await signIn.run();
    if (!result) return;

    if (result.requires_mfa && result.mfa_token) {
      setMfaToken(result.mfa_token);
      setMfaChannel(result.channel ?? '');
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  async function onConfirmMfa(e: FormEvent) {
    e.preventDefault();
    const result = await confirmMfa.run();
    if (result) navigate(redirectTo, { replace: true });
  }

  /* ---- MFA step ---- */
  if (mfaToken) {
    return (
      <AuthShell
        title="Confirm it's you"
        subtitle={`Enter the 6-digit code we sent to your ${mfaChannel === 'phone' ? 'phone' : 'email'}.`}
        image={media.stadiumTunnel}
      >
        <form onSubmit={onConfirmMfa} noValidate>
          {confirmMfa.error && <Alert>{confirmMfa.error}</Alert>}

          <TextField
            label="Verification code"
            className="otp-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="······"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
            autoFocus
          />

          <button
            className="button button-green auth-submit"
            type="submit"
            disabled={confirmMfa.pending || code.length < 6}
          >
            {confirmMfa.pending ? 'Verifying…' : 'Verify and sign in'}
          </button>

          <div className="step-actions">
            <button
              className="button button-outline"
              type="button"
              onClick={() => {
                setMfaToken(null);
                setCode('');
              }}
            >
              Back to sign in
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  /* ---- Credentials step ---- */
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to your Fan Passport, membership, tickets and community."
    >
      <form onSubmit={onSubmit} noValidate>
        {signIn.error && <Alert>{signIn.error}</Alert>}

        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          error={signIn.fieldErrors?.email?.[0]}
          required
          autoFocus
        />

        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={signIn.fieldErrors?.password?.[0]}
          required
        />

        <button
          className="button button-green auth-submit"
          type="submit"
          disabled={signIn.pending}
        >
          {signIn.pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <AuthFooter />
    </AuthShell>
  );
}

function AuthFooter() {
  return (
    <div className="auth-footer">
      <span>
        New here? <Link to="/signup">Create an account</Link>
      </span>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
}
