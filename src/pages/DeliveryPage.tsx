import { PageHero } from '../components/PageHero';
import { Delivery } from '../components/Delivery';
import { Download } from '../components/Download';

export function DeliveryPage() {
  return (
    <>
      <PageHero
        eyebrow="Delivery playbook"
        title="Build with one handbook."
        copy="The Afrisport Connect Enterprise Delivery System™ aligns product, engineering, DevSecOps and operations—so Africa's football super app ships with quality, security and pace."
        image="/images/delivery-team.jpg"
        imagePosition="45%"
        ctaHref="/technology"
        ctaLabel="Technology stack"
        secondaryHref="/roadmap"
        secondaryLabel="Implementation roadmap"
      />
      <Delivery />
      <Download />
    </>
  );
}
