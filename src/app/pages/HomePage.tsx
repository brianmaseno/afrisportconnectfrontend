import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useApi } from '../../lib/useApi';
import { extractList, mediaUrl } from '../../lib/api';
import { brand } from '../../lib/media';
import { formatDate, formatMoney, formatNumber, labelOf, relativeTime } from '../../lib/format';
import { DataState, Panel, Row, Section, Stat, Badge } from '../ui';
import { SponsoredBanner } from '../SponsoredBanner';
import type { FootballMatch, NewsItem, EventItem } from '../../lib/types';

export function AppHomePage() {
  const { user } = useAuth();

  const feed = useApi<unknown>('/home');
  const fixtures = useApi<unknown>('/fixtures', [], { per_page: 5 });
  const news = useApi<unknown>('/news', [], { per_page: 5 });
  const events = useApi<unknown>('/events/public', [], { per_page: 4 });

  const fixtureList = extractList<FootballMatch>(fixtures.data);
  const newsList = extractList<NewsItem>(news.data);
  const eventList = extractList<EventItem>(events.data);

  const tier = user?.membership?.tier?.name ?? 'Free';
  const clubName = user?.preferred_club?.name;
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <>
      {/* Dashboard hero — the one place in the app that carries the brand
          plate, so signing in feels like arriving somewhere. */}
      <section className="dash-hero grain">
        <div className="dash-hero-copy">
          <p className="eyebrow">{clubName ? `${clubName} supporter` : 'Your account'}</p>
          <h1 className="display">
            Welcome back, <span className="accent">{firstName}.</span>
          </h1>
          <p>
            {clubName
              ? `Matches, community and everything on your passport — all in one place.`
              : 'Your home across matches, community and membership.'}
          </p>
          <div className="inline">
            <Link className="button button-gold button-sm" to="/app/passport">
              View Fan Passport <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-ghost button-sm" to="/app/matches">
              Match centre
            </Link>
          </div>
        </div>

        <div className="dash-hero-badge" aria-hidden="true">
          <img src={brand.mark} alt="" />
        </div>
      </section>

      <div className="grid-4 dash-stats">
        <Stat label="Loyalty points" value={formatNumber(user?.loyalty_points)} hint={user?.loyalty_level ?? undefined} />
        <Stat label="Membership" value={tier} hint={user?.passport?.member_number ?? undefined} />
        <Stat label="Wallet" value={formatMoney(user?.wallet_balance, user?.country?.currency ?? 'KES')} />
        <Stat label="Club" value={clubName ?? '—'} hint={user?.country?.name ?? undefined} />
      </div>

      <SponsoredBanner />

      <div className="grid-2">
        <Section
          title="Upcoming fixtures"
          action={
            <Link className="link-arrow" to="/app/matches">
              All matches <span aria-hidden="true">→</span>
            </Link>
          }
        >
          <Panel className="panel-flush">
            <DataState
              loading={fixtures.loading}
              error={fixtures.error}
              data={fixtureList}
              onRetry={fixtures.reload}
              empty={{ title: 'No fixtures scheduled', body: 'Upcoming matches will appear here.' }}
            >
              {(list) =>
                list.map((m) => (
                  <Row
                    key={m.id}
                    title={`${labelOf(m.home_team) || m.home_club?.name || 'TBC'} v ${labelOf(m.away_team) || m.away_club?.name || 'TBC'}`}
                    meta={[labelOf(m.competition), m.venue].filter(Boolean).join(' · ')}
                    right={<span>{formatDate(m.kickoff_at, true)}</span>}
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>

        <Section
          title="Latest news"
          action={
            <Link className="link-arrow" to="/app/discover">
              Discover <span aria-hidden="true">→</span>
            </Link>
          }
        >
          <Panel className="panel-flush">
            <DataState
              loading={news.loading}
              error={news.error}
              data={newsList}
              onRetry={news.reload}
              empty={{ title: 'No news yet', body: 'Club and platform updates will show here.' }}
            >
              {(list) =>
                list.map((n) => (
                  <Row
                    key={n.id}
                    media={
                      mediaUrl(n.image) ? <img src={mediaUrl(n.image)!} alt="" loading="lazy" /> : null
                    }
                    title={n.title}
                    meta={n.club?.name ?? relativeTime(n.published_at)}
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>
      </div>

      <Section
        title="Events near you"
        action={
          <Link className="link-arrow" to="/app/events">
            All events <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <DataState
          loading={events.loading}
          error={events.error}
          data={eventList}
          onRetry={events.reload}
          empty={{ title: 'No events listed', body: 'Chapter meet-ups and match events appear here.' }}
        >
          {(list) => (
            <div className="grid-4">
              {list.map((ev) => (
                <Panel key={ev.id}>
                  <div className="inline" style={{ marginBottom: 10 }}>
                    <Badge tone={ev.is_free ? 'green' : 'gold'}>
                      {ev.is_free ? 'Free' : formatMoney(ev.price)}
                    </Badge>
                  </div>
                  <strong style={{ display: 'block', marginBottom: 6 }}>{ev.title}</strong>
                  <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
                    {formatDate(ev.starts_at, true)}
                    {ev.location ? ` · ${ev.location}` : ''}
                  </p>
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      </Section>

      {/* The /home feed is a composite endpoint; surface whatever it returns
          that we haven't already rendered above. */}
      {feed.error && (
        <p className="muted" style={{ fontSize: 13.5 }}>
          Some personalised content could not load: {feed.error}
        </p>
      )}
    </>
  );
}
