import { PageHero } from '../components/PageHero';
import { Trust } from '../components/Trust';
import { Download } from '../components/Download';

export function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust & security"
        title="Security people can feel without friction."
        copy="Identity, privacy, layered controls and zero-trust principles protect fans, clubs and partners across the Afrisport Connect ecosystem."
        image="/images/trust-security.jpg"
        imagePosition="45%"
        ctaHref="/privacy"
        ctaLabel="Privacy policy"
        secondaryHref="/technology"
        secondaryLabel="Platform technology"
      />
      <Trust />
      <Download />
    </>
  );
}
