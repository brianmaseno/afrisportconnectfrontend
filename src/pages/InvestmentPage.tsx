import { PageHero } from '../components/PageHero';
import { Investment } from '../components/Investment';
import { Download } from '../components/Download';

export function InvestmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Investment & funding"
        title="Capital for continental scale."
        copy="Diversified funding, disciplined financial governance and impact-ready reporting—so Afrisport Connect grows sustainably across Africa."
        image="/images/investment-capital.jpg"
        imagePosition="48%"
        ctaHref="/download"
        ctaLabel="Partner with us"
        secondaryHref="/roadmap"
        secondaryLabel="See the roadmap"
      />
      <Investment />
      <Download />
    </>
  );
}
