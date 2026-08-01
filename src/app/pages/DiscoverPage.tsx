import { useState, type FormEvent } from 'react';
import { useApi } from '../../lib/useApi';
import { extractList, mediaUrl } from '../../lib/api';
import { relativeTime } from '../../lib/format';
import { DataState, PageHeader, Panel, Row, Section } from '../ui';
import type { Club, NewsItem } from '../../lib/types';

export function DiscoverPage() {
  const [term, setTerm] = useState('');
  const [query, setQuery] = useState('');

  const search = useApi<unknown>(query ? '/search' : null, [query], { q: query });
  const clubs = useApi<unknown>('/clubs', [], { per_page: 24 });
  const news = useApi<unknown>('/news', [], { per_page: 10 });

  const clubList = extractList<Club>(clubs.data);
  const newsList = extractList<NewsItem>(news.data);
  const results = extractList<Record<string, unknown>>(search.data);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setQuery(term.trim());
  }

  return (
    <>
      <PageHeader
        title="Discover"
        subtitle="Search across clubs, news, events, courses and the marketplace."
      />

      <form className="discover-search" onSubmit={onSearch}>
        <input
          className="field-input"
          type="search"
          placeholder="Search clubs, news, events…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Search"
        />
        <button className="button button-green" type="submit">
          Search
        </button>
      </form>

      {query && (
        <Section title={`Results for “${query}”`}>
          <Panel className="panel-flush">
            <DataState
              loading={search.loading}
              error={search.error}
              data={results}
              onRetry={search.reload}
              empty={{ title: 'No matches', body: 'Try a different word or check the spelling.' }}
            >
              {(items) =>
                items.map((r, i) => (
                  <Row
                    key={String(r.id ?? i)}
                    title={String(r.title ?? r.name ?? 'Result')}
                    meta={String(r.type ?? r.category ?? '')}
                  />
                ))
              }
            </DataState>
          </Panel>
        </Section>
      )}

      <Section title="Clubs">
        <DataState
          loading={clubs.loading}
          error={clubs.error}
          data={clubList}
          onRetry={clubs.reload}
          empty={{ title: 'No clubs listed' }}
        >
          {(items) => (
            <div className="grid-4">
              {items.map((c) => (
                <Panel key={c.id} className="club-card">
                  <span
                    className="club-card-crest"
                    style={{ borderColor: c.primary_color ?? 'var(--line)' }}
                  >
                    {mediaUrl(c.logo) ? (
                      <img src={mediaUrl(c.logo)!} alt="" loading="lazy" />
                    ) : (
                      c.name.slice(0, 2).toUpperCase()
                    )}
                  </span>
                  <strong>{c.name}</strong>
                  {c.impact_pillar && <span className="muted">{c.impact_pillar}</span>}
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      </Section>

      <Section title="Latest news">
        <Panel className="panel-flush">
          <DataState
            loading={news.loading}
            error={news.error}
            data={newsList}
            onRetry={news.reload}
            empty={{ title: 'No news yet' }}
          >
            {(items) =>
              items.map((n) => (
                <Row
                  key={n.id}
                  media={mediaUrl(n.image) ? <img src={mediaUrl(n.image)!} alt="" loading="lazy" /> : null}
                  title={n.title}
                  meta={n.excerpt ?? n.club?.name ?? ''}
                  right={<span>{relativeTime(n.published_at)}</span>}
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}
