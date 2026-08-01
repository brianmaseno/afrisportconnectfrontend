import { useApi } from '../../lib/useApi';
import { extractList } from '../../lib/api';
import { relativeTime } from '../../lib/format';
import { Badge, DataState, Media, PageHeader, Panel, Row, Section } from '../ui';
import type { NewsItem } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* News                                                                        */
/* -------------------------------------------------------------------------- */

export function NewsPage() {
  const news = useApi<unknown>('/news', [], { per_page: 40 });
  const list = extractList<NewsItem>(news.data);

  return (
    <>
      <PageHeader title="News" subtitle="Club, competition and platform stories from across the continent." />

      <DataState
        loading={news.loading}
        error={news.error}
        data={list}
        onRetry={news.reload}
        empty={{ title: 'No news yet', body: 'Stories will appear here as they are published.' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((n) => (
              <Panel key={n.id}>
                <Media src={n.image} alt={n.title} ratio="16 / 9" label="News" />
                {n.club?.name && (
                  <div className="inline" style={{ marginBottom: 8 }}>
                    <Badge>{n.club.name}</Badge>
                  </div>
                )}
                <strong style={{ display: 'block', marginBottom: 6 }}>{n.title}</strong>
                <p className="muted" style={{ margin: '0 0 8px', fontSize: 13.5 }}>
                  {n.excerpt ?? ''}
                </p>
                <span className="muted" style={{ fontSize: 12.5 }}>
                  {relativeTime(n.published_at)}
                </span>
              </Panel>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* TV / video hub                                                              */
/* -------------------------------------------------------------------------- */

type Video = {
  id: number;
  title: string;
  slug?: string;
  thumbnail?: string | null;
  cover?: string | null;
  duration?: number | string | null;
  category?: string | null;
  published_at?: string | null;
};

export function TvPage() {
  const videos = useApi<unknown>('/videos', [], { per_page: 30 });
  const hub = useApi<unknown>('/media-hub');

  const list = extractList<Video>(videos.data);
  const hubItems = extractList<{ id: number; title?: string; type?: string; url?: string }>(hub.data);

  return (
    <>
      <PageHeader title="Afrisport TV" subtitle="Highlights, features and original video from across the game." />

      <Section title="Latest video">
        <DataState
          loading={videos.loading}
          error={videos.error}
          data={list}
          onRetry={videos.reload}
          empty={{ title: 'No videos yet', body: 'Video content will appear here.' }}
        >
          {(items) => (
            <div className="grid-3">
              {items.map((v, i) => (
                <Panel key={`${v.id}-${i}`}>
                  <Media src={v.thumbnail ?? v.cover} alt={v.title} ratio="16 / 9" label="Video" />
                  <div className="inline" style={{ marginBottom: 6 }}>
                    {v.category && <Badge>{v.category}</Badge>}
                    {v.duration ? <Badge tone="neutral">{String(v.duration)}</Badge> : null}
                  </div>
                  <strong style={{ display: 'block' }}>{v.title}</strong>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {relativeTime(v.published_at)}
                  </span>
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      </Section>

      {hubItems.length > 0 && (
        <Section title="Media hub">
          <Panel className="panel-flush">
            {hubItems.map((m, i) => (
              <Row key={`hub-${m.id}-${i}`} title={m.title ?? 'Item'} meta={m.type ?? ''} />
            ))}
          </Panel>
        </Section>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Awards                                                                      */
/* -------------------------------------------------------------------------- */

type Award = {
  id: number;
  title?: string;
  name?: string;
  slug: string;
  description?: string | null;
  status?: string | null;
  category?: string | null;
};

export function AwardsPage() {
  const awards = useApi<unknown>('/awards');
  const list = extractList<Award>(awards.data);

  return (
    <>
      <PageHeader title="Awards" subtitle="Recognition for players, clubs, chapters and contributors." />

      <DataState
        loading={awards.loading}
        error={awards.error}
        data={list}
        onRetry={awards.reload}
        empty={{ title: 'No awards open', body: 'Award programmes will appear here when they launch.' }}
      >
        {(items) => (
          <div className="grid-3">
            {items.map((a) => (
              <Panel key={a.id}>
                <div className="inline" style={{ marginBottom: 8 }}>
                  {a.category && <Badge tone="gold">{a.category}</Badge>}
                  {a.status && <Badge>{a.status}</Badge>}
                </div>
                <strong style={{ display: 'block', marginBottom: 6 }}>{a.title ?? a.name}</strong>
                <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
                  {a.description ?? ''}
                </p>
              </Panel>
            ))}
          </div>
        )}
      </DataState>
    </>
  );
}
