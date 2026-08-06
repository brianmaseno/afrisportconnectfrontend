import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { AuthProvider } from './lib/auth';
import { APP_ENABLED } from './lib/api';

/* Marketing */
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
import { ImpactPage as MarketingImpactPage } from './pages/ImpactPage';
import { DownloadPage } from './pages/DownloadPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

/* Auth */
import { LoginPage } from './auth/LoginPage';
import { SignupPage } from './auth/SignupPage';
import { ForgotPasswordPage } from './auth/ForgotPasswordPage';

/* Authenticated app */
import { RequireAuth } from './app/AppLayout';
import { AppHomePage } from './app/pages/HomePage';
import { MatchesPage } from './app/pages/MatchesPage';
import { DiscoverPage } from './app/pages/DiscoverPage';
import { PassportPage } from './app/pages/PassportPage';
import { CommunityPage, ChaptersPage, EventsPage } from './app/pages/CommunityPages';
import { TourismPage, TourismDetailPage, TourismBookingsPage } from './app/pages/TourismPages';
import { LearnPage, ImpactPage, HelpPage } from './app/pages/ExplorePages';
import { ShopPage, ProductPage, OrderPage } from './app/pages/ShopPages';
import { CoursePage } from './app/pages/CoursePage';
import { ChapterPage } from './app/pages/ChapterPage';
import {
  MessagesPage,
  OpportunityPage,
  ProjectPage,
  CreatorStudioPage,
  TalentProfilePage,
  MatchPage,
  SupportPage,
  PaymentReturnPage,
  BadgesPage,
} from './app/pages/DetailPages';
import {
  ProfilePage,
  SecurityPage,
  NotificationsPage,
  WalletPage,
  MembershipPage,
} from './app/pages/AccountPages';
import { ClubsPage, ClubHubPage, StandingsPage } from './app/pages/ClubPages';
import { NewsPage, TvPage, AwardsPage } from './app/pages/MediaPages';
import { PlayzonePage } from './app/pages/PlayzonePage';
import { NetworkPage, CreatorsPage, FeedPage } from './app/pages/NetworkPages';
import {
  OpportunitiesPage,
  TalentPage,
  ProjectsPage,
  ChallengesPage,
} from './app/pages/OpportunityPages';
import { CartPage, OrdersPage } from './app/pages/CommercePages';
import {
  FoundersPage,
  PartnersPage,
  StakeholdersPage,
  GrowthPage as AppGrowthPage,
} from './app/pages/ProgrammePages';
import { AssistantPage } from './app/pages/AssistantPage';
import { SettingsPage } from './app/pages/SettingsPage';
import {
  EventPage,
  InstitutionsPage,
  VerifyPage,
  SponsorPage,
} from './app/pages/ExtraPages';

export default function App() {
  // Retire the static splash from index.html as soon as React has painted.
  // It must happen here rather than in <Loader>, which only renders on the
  // marketing routes — otherwise /login and /app stay covered by it.
  useEffect(() => {
    const boot = document.getElementById('boot');
    if (!boot) return;
    boot.classList.add('done');
    const timer = window.setTimeout(() => boot.remove(), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ---------- Public marketing site (unchanged) ---------- */}
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
            <Route path="impact" element={<MarketingImpactPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="download" element={<DownloadPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
          </Route>

          {/* ---------- Account ---------- */}
          {APP_ENABLED && (
            <>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />

              <Route path="app" element={<RequireAuth />}>
                {/* Main */}
                <Route index element={<AppHomePage />} />
                <Route path="matches" element={<MatchesPage />} />
                <Route path="matches/:id" element={<MatchPage />} />
                <Route path="standings" element={<StandingsPage />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="assistant" element={<AssistantPage />} />

                {/* Football */}
                <Route path="clubs" element={<ClubsPage />} />
                <Route path="clubs/:slug" element={<ClubHubPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="tv" element={<TvPage />} />
                <Route path="playzone" element={<PlayzonePage />} />

                {/* Identity */}
                <Route path="passport" element={<PassportPage />} />
                <Route path="membership" element={<MembershipPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="impact" element={<ImpactPage />} />
                <Route path="challenges" element={<ChallengesPage />} />
                <Route path="awards" element={<AwardsPage />} />
                <Route path="badges" element={<BadgesPage />} />

                {/* Community */}
                <Route path="community" element={<CommunityPage />} />
                <Route path="feed" element={<FeedPage />} />
                <Route path="chapters" element={<ChaptersPage />} />
                <Route path="chapters/:slug" element={<ChapterPage />} />
                <Route path="tourism" element={<TourismPage />} />
                <Route path="tourism/bookings" element={<TourismBookingsPage />} />
                <Route path="tourism/:slug" element={<TourismDetailPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="events/:slug" element={<EventPage />} />
                <Route path="network" element={<NetworkPage />} />
                <Route path="network/messages/:userId" element={<MessagesPage />} />
                <Route path="creators" element={<CreatorsPage />} />
                <Route path="creators/studio" element={<CreatorStudioPage />} />

                {/* Opportunity */}
                <Route path="learn" element={<LearnPage />} />
                <Route path="learn/:slug" element={<CoursePage />} />
                <Route path="opportunities" element={<OpportunitiesPage />} />
                <Route path="opportunities/:slug" element={<OpportunityPage />} />
                <Route path="talent" element={<TalentPage />} />
                <Route path="talent/me" element={<TalentProfilePage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:slug" element={<ProjectPage />} />
                <Route path="growth" element={<AppGrowthPage />} />

                {/* Marketplace */}
                <Route path="shop" element={<ShopPage />} />
                <Route path="shop/:slug" element={<ProductPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderPage />} />
                <Route path="payment/return" element={<PaymentReturnPage />} />

                {/* Ecosystem */}
                <Route path="founders" element={<FoundersPage />} />
                <Route path="partners" element={<PartnersPage />} />
                <Route path="stakeholders" element={<StakeholdersPage />} />
                <Route path="institutions" element={<InstitutionsPage />} />
                <Route path="sponsor" element={<SponsorPage />} />
                <Route path="verify" element={<VerifyPage />} />

                {/* Account */}
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="support" element={<SupportPage />} />
              </Route>
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
