import { LegalDocument } from './LegalDocument';

export function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updatedAt="13 July 2026">
      <p>
        Afrisport Connect (“we”, “us”, “our”) operates the Afrisport Connect mobile application and
        website. This Privacy Policy explains how we collect, use, store, and share personal
        information when you use our services.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — name, email, phone, password (hashed), preferred
          club/chapter, country and city.
        </li>
        <li>
          <strong>Profile &amp; engagement</strong> — Fan Passport details, loyalty points,
          predictions, tickets, orders, donations, and community activity.
        </li>
        <li>
          <strong>Device &amp; security data</strong> — device tokens for push notifications,
          approximate login IP/user agent, MFA status, and biometric preference stored on your
          device.
        </li>
        <li>
          <strong>Payment data</strong> — processed by Paystack; we store payment references and
          status, not full card numbers.
        </li>
        <li>
          <strong>Optional content</strong> — photos, messages, support tickets, and feedback you
          submit.
        </li>
      </ul>

      <h2>2. How we use information</h2>
      <ul>
        <li>
          Provide memberships, tickets, marketplace, predictions, AI assistant answers, and
          community features.
        </li>
        <li>Secure accounts (OTP, MFA, login monitoring) and prevent fraud or abuse.</li>
        <li>
          Send transactional messages (tickets, receipts, security codes) and optional marketing if
          you opt in.
        </li>
        <li>Improve the product with analytics and crash reporting (e.g. Firebase).</li>
        <li>Comply with legal obligations and enforce our Terms.</li>
      </ul>

      <h2>3. Legal bases</h2>
      <p>
        We process data to perform our contract with you, with your consent (where required), and
        for legitimate interests such as security, service improvement, and preventing misuse —
        balanced against your rights.
      </p>

      <h2>4. Sharing</h2>
      <p>We may share data with:</p>
      <ul>
        <li>
          Service providers (hosting, email/SMS via Brevo, payments via Paystack, Firebase
          push/analytics).
        </li>
        <li>
          Football clubs / chapters when needed to deliver memberships, events, or chapter benefits
          you join.
        </li>
        <li>Authorities when required by law.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>5. International transfers</h2>
      <p>
        Data may be processed in countries where our providers operate. We use contractual and
        technical safeguards appropriate for such transfers.
      </p>

      <h2>6. Retention</h2>
      <p>
        We retain account data while your account is active and for a reasonable period afterward
        for security, audits, and legal requirements. You may request deletion as described below.
      </p>

      <h2>7. Your rights</h2>
      <ul>
        <li>
          Access and download a copy of your personal data from the app (Security &amp; privacy →
          Download my data).
        </li>
        <li>Update profile details and notification preferences.</li>
        <li>Delete your account from Profile settings (subject to legal holds).</li>
        <li>Withdraw marketing consent at any time.</li>
      </ul>

      <h2>8. Children</h2>
      <p>
        Afrisport Connect is intended for users who can form a valid account under applicable law.
        Parental/guardian features may apply for youth talent tools. Contact us if you believe a
        child provided data without consent.
      </p>

      <h2>9. Security</h2>
      <p>
        We use HTTPS, encrypted token storage on devices, optional certificate pinning, and
        role-based access on the server. No method of transmission is 100% secure; please keep your
        credentials safe and enable MFA where available.
      </p>

      <h2>10. Contact</h2>
      <p>
        For privacy requests email{' '}
        <a href="mailto:support@clubconnect.africa">support@clubconnect.africa</a>.
      </p>
    </LegalDocument>
  );
}
