import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from 'react';

type Common = {
  label: string;
  error?: string;
  hint?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  className = '',
  ...props
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field${error ? ' field-invalid' : ''}`}>
      <span className="field-label">{label}</span>
      <input
        className={`field-input ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <span className="field-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  error,
  hint,
  children,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={`field${error ? ' field-invalid' : ''}`}>
      <span className="field-label">{label}</span>
      <select className="field-select" aria-invalid={error ? true : undefined} {...props}>
        {children}
      </select>
      {error && <span className="field-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function Alert({
  kind = 'error',
  children,
}: {
  kind?: 'error' | 'success' | 'info';
  children: ReactNode;
}) {
  return (
    <div className={`alert alert-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
    </div>
  );
}
