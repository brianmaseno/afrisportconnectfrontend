import { PageHero } from '../components/PageHero';
import { Legal } from '../components/Legal';
import { Download } from '../components/Download';

export function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal & standards"
        title="Compliance that builds trust."
        copy="Privacy, intellectual property, contracts and international standards—so Afrisport Connect can operate responsibly across jurisdictions."
        image="/images/legal-justice.jpg"
        imagePosition="42%"
        ctaHref="/trust"
        ctaLabel="Trust architecture"
        secondaryHref="/governance"
        secondaryLabel="Governance & PMO"
      />
      <Legal />
      <Download />
    </>
  );
}
