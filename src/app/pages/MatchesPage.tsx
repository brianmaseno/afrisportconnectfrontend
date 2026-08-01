import { useState } from 'react';
import { useApi } from '../../lib/useApi';
import { extractList } from '../../lib/api';
import { formatDate, labelOf } from '../../lib/format';
import { Badge, DataState, PageHeader, Panel, Row, Section } from '../ui';
import type { FootballMatch } from '../../lib/types';

type Tab = 'fixtures' | 'results';

function scoreOf(m: FootballMatch) {
  if (m.home_score === null || m.home_score === undefined) return null;
  return `${m.home_score} – ${m.away_score ?? 0}`;
}

export function MatchesPage() {
  const [tab, setTab] = useState<Tab>('fixtures');

  const fixtures = useApi<unknown>('/fixtures', [], { per_page: 25 });
  const results = useApi<unknown>('/matches', [], { per_page: 25, status: 'finished' });

  const active = tab === 'fixtures' ? fixtures : results;
  const list = extractList<FootballMatch>(active.data);

  return (
    <>
      <PageHeader
        title="Match centre"
        subtitle="Fixtures, results and the competitions your club is playing in."
      />

      <div className="segmented" role="group" aria-label="Match view">
        <button type="button" aria-pressed={tab === 'fixtures'} onClick={() => setTab('fixtures')}>
          Fixtures
        </button>
        <button type="button" aria-pressed={tab === 'results'} onClick={() => setTab('results')}>
          Results
        </button>
      </div>

      <Panel className="panel-flush">
        <DataState
          loading={active.loading}
          error={active.error}
          data={list}
          onRetry={active.reload}
          empty={{
            title: tab === 'fixtures' ? 'No upcoming fixtures' : 'No results yet',
            body: 'Check back once the next round is scheduled.',
          }}
        >
          {(items) =>
            items.map((m) => {
              const score = scoreOf(m);
              return (
                <Row
                  key={m.id}
                  title={`${labelOf(m.home_team) || m.home_club?.name || 'TBC'} v ${labelOf(m.away_team) || m.away_club?.name || 'TBC'}`}
                  meta={[labelOf(m.competition), m.venue].filter(Boolean).join(' · ')}
                  right={
                    score ? (
                      <Badge tone="green">{score}</Badge>
                    ) : (
                      <span>{formatDate(m.kickoff_at, true)}</span>
                    )
                  }
                />
              );
            })
          }
        </DataState>
      </Panel>

      <Section title="Competitions">
        <CompetitionList />
      </Section>
    </>
  );
}

function CompetitionList() {
  const competitions = useApi<unknown>('/competitions');
  const list = extractList<{ id: number; name: string; country?: string; season?: string }>(
    competitions.data,
  );

  return (
    <Panel className="panel-flush">
      <DataState
        loading={competitions.loading}
        error={competitions.error}
        data={list}
        onRetry={competitions.reload}
        empty={{ title: 'No competitions listed' }}
      >
        {(items) =>
          items.map((c) => (
            <Row key={c.id} title={c.name} meta={[c.country, c.season].filter(Boolean).join(' · ')} />
          ))
        }
      </DataState>
    </Panel>
  );
}
