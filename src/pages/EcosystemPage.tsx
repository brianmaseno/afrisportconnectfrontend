import { PageHero } from '../components/PageHero';
import { Ecosystem } from '../components/Ecosystem';
import { Download } from '../components/Download';

export function EcosystemPage() {
  return (
    <>
      <PageHero
        eyebrow="Stakeholders"
        title="Built for every role in the game."
        copy="Supporters, players, coaches, clubs, sponsors and institutions share one digital home—with journeys tailored to what each needs."
        image="/images/night-match.jpg"
        imagePosition="40%"
        ctaHref="/platform"
        ctaLabel="See the platform"
        secondaryHref="/download"
        secondaryLabel="Join Afrisport Connect"
      />
      <Ecosystem />
      <Download />
    </>
  );
}
