import { LegalDocument } from './LegalDocument';

export function TermsPage() {
  return (
    <LegalDocument title="Terms & Conditions" updatedAt="13 July 2026">
      <p>
        These Terms &amp; Conditions (“Terms”) govern your use of Afrisport Connect mobile apps,
        websites, and related services (the “Service”). By creating an account, tapping “I agree”,
        or using the Service, you accept these Terms.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Afrisport Connect provides a football fan engagement platform including Fan Passport, clubs,
        chapters, events, memberships, marketplace, predictions, community tools, and an AI
        assistant.
      </p>

      <h2>2. Eligibility &amp; accounts</h2>
      <ul>
        <li>You must provide accurate registration information and keep it updated.</li>
        <li>
          You are responsible for safeguarding your login credentials and device unlock methods
          (including biometrics).
        </li>
        <li>We may suspend or terminate accounts that are abusive, fraudulent, or breach these Terms.</li>
      </ul>

      <h2>3. Fan Passport, memberships &amp; clubs</h2>
      <ul>
        <li>Digital Fan Passport and membership benefits may vary by club, country, and tier.</li>
        <li>
          Clubs and chapter leaders may set additional rules for events and community spaces you
          join.
        </li>
        <li>
          Loyalty points, badges, and rewards have no cash value unless expressly stated and may be
          adjusted to correct errors or abuse.
        </li>
      </ul>

      <h2>4. Payments</h2>
      <ul>
        <li>
          Paid features (memberships, tickets, shop, donations) are processed through Paystack or
          other shown providers.
        </li>
        <li>
          Prices, currency, and taxes are shown at checkout. Refunds follow our support policy and
          applicable law.
        </li>
        <li>Failed or incomplete payments may delay activation of paid benefits.</li>
      </ul>

      <h2>5. Events, tickets &amp; scanning</h2>
      <p>
        Tickets and QR codes are personal unless transferable as stated for a specific event. Misuse,
        resale against event rules, or fraudulent scanning may void tickets and lead to account
        action.
      </p>

      <h2>6. Community, messaging &amp; content</h2>
      <ul>
        <li>
          Do not post illegal, hateful, harassing, sexually explicit involving minors, or infringing
          content.
        </li>
        <li>
          You grant us a licence to host and display content you upload as needed to operate the
          Service.
        </li>
        <li>We may moderate, remove content, or restrict features to keep communities safe.</li>
      </ul>

      <h2>7. Predictions, play &amp; AI</h2>
      <ul>
        <li>
          Predictions and challenges are for entertainment and loyalty engagement unless otherwise
          stated.
        </li>
        <li>
          AI Assistant answers may be incomplete or incorrect — verify important fixtures, payments,
          and legal information independently.
        </li>
      </ul>

      <h2>8. Acceptable use</h2>
      <p>
        You agree not to reverse engineer the Service without permission, scrape in abusive ways,
        attempt unauthorised access, or interfere with other users.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        Afrisport Connect branding, software, and content we create are our property or licensed to us.
        Club crests and third-party marks belong to their owners and are used for identification
        where permitted.
      </p>

      <h2>10. Disclaimers &amp; liability</h2>
      <p>
        The Service is provided “as is”. To the fullest extent permitted by law, we are not liable
        for indirect or consequential losses, fixture data inaccuracies from third-party providers,
        or outages beyond our reasonable control. Nothing in these Terms limits liability that cannot
        be limited by law.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may delete your account in the app. We may end access for breach of Terms or extended
        inactivity. Provisions that should survive (IP, liability limits, dispute language) will
        survive termination.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms. Material changes will be reflected by the “Last updated” date and,
        where appropriate, in-app notice. Continued use after changes constitutes acceptance.
      </p>

      <h2>13. Contact</h2>
      <p>
        For Terms questions email{' '}
        <a href="mailto:support@clubconnect.africa">support@clubconnect.africa</a>.
      </p>
    </LegalDocument>
  );
}
