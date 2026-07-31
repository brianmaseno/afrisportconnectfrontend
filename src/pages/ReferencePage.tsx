import { PageHero } from '../components/PageHero';
import { Reference } from '../components/Reference';
import { Download } from '../components/Download';

export function ReferencePage() {
  return (
    <>
      <PageHero
        eyebrow="Appendices & reference"
        title="One living enterprise index."
        copy="Strategic frameworks, reference models, checklists and the master implementation sequence—the authoritative knowledge foundation for Afrisport Connect."
        image="/images/reference-library.jpg"
        imagePosition="40%"
        ctaHref="/delivery"
        ctaLabel="Delivery playbook"
        secondaryHref="/governance"
        secondaryLabel="Governance"
      />
      <Reference />
      <Download />
    </>
  );
}
