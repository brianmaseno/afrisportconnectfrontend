import { PageHero } from '../components/PageHero';
import { DesignSystem } from '../components/DesignSystem';
import { Download } from '../components/Download';

export function DesignPage() {
  return (
    <>
      <PageHero
        eyebrow="Design system"
        title="Emerald. Gold. Built for belonging."
        copy="The Afrisport Connect Unified Design System keeps every screen clear, accessible and unmistakably African football—on mobile and on the web."
        image="/images/design-ui.jpg"
        imagePosition="30%"
        ctaHref="/platform"
        ctaLabel="See it in product"
        secondaryHref="/download"
        secondaryLabel="Get the app"
      />
      <DesignSystem />
      <Download />
    </>
  );
}
