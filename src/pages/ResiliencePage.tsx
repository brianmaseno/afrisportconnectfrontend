import { PageHero } from '../components/PageHero';
import { Resilience } from '../components/Resilience';
import { Download } from '../components/Download';

export function ResiliencePage() {
  return (
    <>
      <PageHero
        eyebrow="Resilience & continuity"
        title="Built to withstand disruption."
        copy="Enterprise risk, business continuity, disaster recovery and crisis leadership—so Afrisport Connect stays mission-critical when conditions change."
        image="/images/stadium-tunnel.jpg"
        imagePosition="38%"
        ctaHref="/trust"
        ctaLabel="Trust & security"
        secondaryHref="/governance"
        secondaryLabel="Governance"
      />
      <Resilience />
      <Download />
    </>
  );
}
