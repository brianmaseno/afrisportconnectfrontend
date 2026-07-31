import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { HomePage } from './pages/HomePage';
import { PlatformPage } from './pages/PlatformPage';
import { CommercePage } from './pages/CommercePage';
import { EcosystemPage } from './pages/EcosystemPage';
import { GrowthPage } from './pages/GrowthPage';
import { GovernancePage } from './pages/GovernancePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { InvestmentPage } from './pages/InvestmentPage';
import { LegalPage } from './pages/LegalPage';
import { ResiliencePage } from './pages/ResiliencePage';
import { DeliveryPage } from './pages/DeliveryPage';
import { ReferencePage } from './pages/ReferencePage';
import { TechnologyPage } from './pages/TechnologyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TrustPage } from './pages/TrustPage';
import { DesignPage } from './pages/DesignPage';
import { ImpactPage } from './pages/ImpactPage';
import { DownloadPage } from './pages/DownloadPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="platform" element={<PlatformPage />} />
          <Route path="commerce" element={<CommercePage />} />
          <Route path="ecosystem" element={<EcosystemPage />} />
          <Route path="growth" element={<GrowthPage />} />
          <Route path="governance" element={<GovernancePage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="investment" element={<InvestmentPage />} />
          <Route path="legal" element={<LegalPage />} />
          <Route path="resilience" element={<ResiliencePage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="reference" element={<ReferencePage />} />
          <Route path="technology" element={<TechnologyPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="trust" element={<TrustPage />} />
          <Route path="design" element={<DesignPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="download" element={<DownloadPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
