import { PageHero } from '../components/PageHero';
import { Roadmap } from '../components/Roadmap';
import { Download } from '../components/Download';

export function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap & rollout"
        title="Execute the continental plan."
        copy="Eight phases from mobilisation to continuous optimisation—pilots, national waves and benefits realisation for Africa's football digital ecosystem."
        image="/images/pitch-aerial.jpg"
        imagePosition="40%"
        ctaHref="/download"
        ctaLabel="Start the journey"
        secondaryHref="/governance"
        secondaryLabel="Governance & PMO"
      />
      <Roadmap />
      <Download />
    </>
  );
}
