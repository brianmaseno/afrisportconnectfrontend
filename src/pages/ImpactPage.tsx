import { PageHero } from '../components/PageHero';
import { Impact } from '../components/Impact';
import { ImpactFramework } from '../components/ImpactFramework';
import { Testimonial } from '../components/Testimonial';
import { Download } from '../components/Download';

export function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact & ESG"
        title="Measure what matters."
        copy="Fan impact, football development and ESG outcomes—tracked through MEL so Afrisport Connect learns continuously and reports transparently."
        image="/images/grassroots-huddle.jpg"
        imagePosition="32%"
        ctaHref="/analytics"
        ctaLabel="Analytics & intelligence"
        secondaryHref="/download"
        secondaryLabel="Be part of it"
      />
      <Impact />
      <ImpactFramework />
      <Testimonial />
      <Download />
    </>
  );
}
