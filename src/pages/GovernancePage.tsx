import { PageHero } from '../components/PageHero';
import { Governance } from '../components/Governance';
import { Download } from '../components/Download';

export function GovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="Governance & PMO"
        title="Lead with accountability."
        copy="The Afrisport Connect Enterprise Governance Framework™ aligns board oversight, executive leadership, digital governance and a Programme Management Office for Africa's football digital ecosystem."
        image="/images/governance-meeting.jpg"
        imagePosition="45%"
        ctaHref="/download"
        ctaLabel="Build with us"
        secondaryHref="/trust"
        secondaryLabel="Trust architecture"
      />
      <Governance />
      <Download />
    </>
  );
}
