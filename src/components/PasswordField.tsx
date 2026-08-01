import { useState, type InputHTMLAttributes } from 'react';
import './password.css';

/**
 * Rules mirror the backend exactly (AppServiceProvider):
 *   PasswordRule::min(8)->mixedCase()->numbers()->max(72)
 * Checking them here means the form fails before a round-trip, and the user is
 * told which rule is missing rather than getting a generic 422.
 */
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { id: 'lower', label: 'A lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { id: 'upper', label: 'An uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'number', label: 'A number', test: (v: string) => /\d/.test(v) },
] as const;

/** Returns the first unmet requirement, or null when the password is valid. */
export function passwordProblem(value: string): string | null {
  if (value.length > 72) return 'Password must be 72 characters or fewer.';
  const missing = PASSWORD_RULES.find((r) => !r.test(value));
  return missing ? `Password needs: ${missing.label.toLowerCase()}.` : null;
}

type Props = {
  label: string;
  value: string;
  error?: string;
  /** Show the rule checklist and strength bar. */
  showStrength?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'>;

export function PasswordField({
  label,
  value,
  error,
  showStrength = false,
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);

  const met = PASSWORD_RULES.filter((r) => r.test(value)).length;
  const strength = value ? met / PASSWORD_RULES.length : 0;
  const level = strength === 1 ? 'strong' : strength >= 0.5 ? 'medium' : 'weak';

  return (
    <label className={`field${error ? ' field-invalid' : ''}`}>
      <span className="field-label">{label}</span>

      <span className="pw-wrap">
        <input
          className="field-input pw-input"
          type={visible ? 'text' : 'password'}
          value={value}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.4 5.4A9.5 9.5 0 0112 5c5 0 9 4.5 9 7a11 11 0 01-2.4 3.4M6.2 6.6A11.6 11.6 0 003 12c0 2.5 4 7 9 7 1.4 0 2.7-.3 3.8-.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          )}
        </button>
      </span>

      {showStrength && value.length > 0 && (
        <span className="pw-meta">
          <span className={`pw-bar pw-${level}`} aria-hidden="true">
            <i style={{ width: `${strength * 100}%` }} />
          </span>
          <span className="pw-rules">
            {PASSWORD_RULES.map((r) => (
              <span key={r.id} className={r.test(value) ? 'ok' : ''}>
                {r.test(value) ? '✓' : '○'} {r.label}
              </span>
            ))}
          </span>
        </span>
      )}

      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
