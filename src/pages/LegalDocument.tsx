import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import './LegalDocument.css';

type LegalDocumentProps = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

export function LegalDocument({ title, updatedAt, children }: LegalDocumentProps) {
  return (
    <section className="legal-doc">
      <div className="shell legal-doc-shell">
        <Reveal className="legal-doc-head">
          <p className="eyebrow">Legal</p>
          <h1 className="display">{title}</h1>
          <p className="legal-doc-meta">Last updated {updatedAt}</p>
        </Reveal>
        <Reveal as="article" className="legal-doc-body">
          {children}
        </Reveal>
        <Reveal className="legal-doc-foot">
          <p>
            Questions?{' '}
            <a href="mailto:support@clubconnect.africa">support@clubconnect.africa</a>
          </p>
          <div className="legal-doc-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/legal">Legal framework</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
