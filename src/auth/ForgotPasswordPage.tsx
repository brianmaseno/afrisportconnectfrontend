import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from './AuthShell';
import { TextField, Alert } from '../components/Field';
import { useMutation } from '../lib/useApi';
import { api } from '../lib/api';
import { media } from '../lib/media';

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const requestCode = useMutation(async () => {
    const res = await api.post<{ debug_code?: string }>(
      '/auth/forgot-password',
      { email: email.trim() },
      { anonymous: true },
    );
    setDebugCode(res?.debug_code ?? null);
    setStage('reset');
    return res;
  });

  const resetPassword = useMutation(async () =>
    api.post(
      '/auth/reset-password',
      {
        email: email.trim(),
        otp_code: code.trim(),
        password,
        password_confirmation: confirm,
      },
      { anonymous: true },
    ),
  );

  async function onRequest(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setLocalError('Enter the email address on your account.');
      return;
    }
    await requestCode.run();
  }

  async function onReset(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (code.trim().length !== 6) {
      setLocalError('Enter the 6-digit code from your email.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    const result = await resetPassword.run();
    if (result !== null) {
      setDone(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    }
  }

  const error = localError ?? requestCode.error ?? resetPassword.error;

  return (
    <AuthShell
      title={stage === 'request' ? 'Reset your password' : 'Choose a new password'}
      subtitle={
        stage === 'request'
          ? "Enter your email and we'll send you a 6-digit reset code."
          : `Enter the code we sent to ${email} and pick a new password.`
      }
      image={media.stadiumEmpty}
      footer={
        <span>
          Remembered it? <Link to="/login">Back to sign in</Link>
        </span>
      }
    >
      {done ? (
        <Alert kind="success">Password updated. Taking you to sign in…</Alert>
      ) : (
        <>
          {error && <Alert>{error}</Alert>}

          {stage === 'request' ? (
            <form onSubmit={onRequest} noValidate>
              <TextField
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button
                className="button button-green auth-submit"
                type="submit"
                disabled={requestCode.pending}
              >
                {requestCode.pending ? 'Sending…' : 'Send reset code'}
              </button>
            </form>
          ) : (
            <form onSubmit={onReset} noValidate>
              {debugCode && (
                <Alert kind="info">
                  Test mode — your reset code is <strong>{debugCode}</strong>.
                </Alert>
              )}

              <TextField
                label="Reset code"
                className="otp-input"
                inputMode="numeric"
                maxLength={6}
                placeholder="······"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                hint={
                  <button
                    type="button"
                    className="otp-resend"
                    onClick={() => void requestCode.run()}
                    disabled={requestCode.pending}
                  >
                    {requestCode.pending ? 'Sending…' : 'Resend code'}
                  </button>
                }
              />
              <TextField
                label="New password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="At least 8 characters."
                required
              />
              <TextField
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button
                className="button button-green auth-submit"
                type="submit"
                disabled={resetPassword.pending}
              >
                {resetPassword.pending ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </>
      )}
    </AuthShell>
  );
}
