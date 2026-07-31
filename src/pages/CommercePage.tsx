import { PageHero } from '../components/PageHero';
import { Commerce } from '../components/Commerce';
import { Download } from '../components/Download';

export function CommercePage() {
  return (
    <>
      <PageHero
        eyebrow="Commerce & marketplace"
        title="Trade that grows the game."
        copy="From kick-off tickets to coaching courses and club shops, Afrisport Connect powers a trusted football marketplace with sustainable revenue for the ecosystem."
        image="/images/commerce-merch.jpg"
        imagePosition="40%"
        ctaHref="/download"
        ctaLabel="Shop in the app"
        secondaryHref="/platform"
        secondaryLabel="See the platform"
      />
      <Commerce />
      <Download />
    </>
  );
}
