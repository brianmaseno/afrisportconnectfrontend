import { PageHero } from '../components/PageHero';
import { Architecture } from '../components/Architecture';
import { Services } from '../components/Services';
import { Data } from '../components/Data';
import { Intelligence } from '../components/Intelligence';
import { Operations } from '../components/Operations';
import { Integration } from '../components/Integration';
import { Download } from '../components/Download';

export function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="The digital backbone of African football."
        copy="Navigation architecture, cloud services, data, responsible AI, operations and partner integrations—engineered to scale with the game."
        image="/images/technology-code.jpg"
        imagePosition="35%"
        ctaHref="/trust"
        ctaLabel="How we protect it"
        secondaryHref="/platform"
        secondaryLabel="Back to product"
      />
      <Architecture />
      <Services />
      <Data />
      <Intelligence />
      <Operations />
      <Integration />
      <Download />
    </>
  );
}
