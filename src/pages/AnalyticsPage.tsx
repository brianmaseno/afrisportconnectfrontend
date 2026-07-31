import { PageHero } from '../components/PageHero';
import { Analytics } from '../components/Analytics';
import { Download } from '../components/Download';

export function AnalyticsPage() {
  return (
    <>
      <PageHero
        eyebrow="Analytics & intelligence"
        title="See the game behind the numbers."
        copy="Enterprise dashboards, KPIs and decision support turn Afrisport Connect data into clarity for executives, clubs, sponsors and federations."
        image="/images/stadium-wide.jpg"
        imagePosition="35%"
        ctaHref="/technology"
        ctaLabel="Platform technology"
        secondaryHref="/impact"
        secondaryLabel="Strategic impact"
      />
      <Analytics />
      <Download />
    </>
  );
}
