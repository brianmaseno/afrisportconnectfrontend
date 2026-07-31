import { PageHero } from '../components/PageHero';
import { Platform } from '../components/Platform';
import { Capabilities } from '../components/Capabilities';
import { Experience } from '../components/Experience';
import { Journeys } from '../components/Journeys';
import { Download } from '../components/Download';

export function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Product platform"
        title="Everything matchday needs—in one place."
        copy="From fixtures and clubs to learning, marketplace and community journeys, Afrisport Connect is built for how African football actually lives."
        image="/images/match-action.jpg"
        imagePosition="28%"
        ctaHref="/download"
        ctaLabel="Get the app"
        secondaryHref="/ecosystem"
        secondaryLabel="Meet the ecosystem"
      />
      <Platform />
      <Capabilities />
      <Experience />
      <Journeys />
      <Download />
    </>
  );
}
