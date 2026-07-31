import { PageHero } from '../components/PageHero';
import { Download } from '../components/Download';

export function DownloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Get the app"
        title="Your club is waiting."
        copy="Download Afrisport Connect and step into matches, community, learning and opportunity—wherever you are."
        image="/images/phone-app.jpg"
        imagePosition="40%"
        ctaHref="#download"
        ctaLabel="Download options"
        secondaryHref="/platform"
        secondaryLabel="Explore features"
      />
      <Download />
    </>
  );
}
