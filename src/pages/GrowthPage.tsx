import { PageHero } from '../components/PageHero';
import { Growth } from '../components/Growth';
import { Download } from '../components/Download';

export function GrowthPage() {
  return (
    <>
      <PageHero
        eyebrow="Growth & community"
        title="Build Africa's largest football community."
        copy="Discover, join, activate, engage, retain and advocate—Afrisport Connect grows through value, trust and belonging across the continent."
        image="/images/fans-celebrate.jpg"
        imagePosition="42%"
        ctaHref="/download"
        ctaLabel="Join the movement"
        secondaryHref="/ecosystem"
        secondaryLabel="Meet stakeholders"
      />
      <Growth />
      <Download />
    </>
  );
}
