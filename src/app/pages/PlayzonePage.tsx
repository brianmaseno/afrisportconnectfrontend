import { useState } from 'react';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList } from '../../lib/api';
import { formatDate, formatNumber, labelOf } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';
import type { FootballMatch } from '../../lib/types';

type Tab = 'predictions' | 'fantasy';

export function PlayzonePage() {
  const [tab, setTab] = useState<Tab>('predictions');

  return (
    <>
      <PageHeader
        title="Play zone"
        subtitle="Predict results, build your fantasy squad and climb the rankings."
      />

      <div className="segmented" role="group" aria-label="Play zone sections">
        <button type="button" aria-pressed={tab === 'predictions'} onClick={() => setTab('predictions')}>
          Predictions
        </button>
        <button type="button" aria-pressed={tab === 'fantasy'} onClick={() => setTab('fantasy')}>
          Fantasy
        </button>
      </div>

      {tab === 'predictions' ? <Predictions /> : <Fantasy />}
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Predictions() {
  const fixtures = useApi<unknown>('/fixtures', [], { per_page: 12 });
  const mine = useApi<unknown>('/predictions/mine');
  const rules = useApi<unknown>('/predictions/rules');

  // /fixtures includes past matches, and the API closes predictions once a
  // match kicks off — only offer fixtures that can still be predicted.
  const list = extractList<FootballMatch>(fixtures.data).filter((m) => {
    if (!m.kickoff_at) return true;
    const kickoff = new Date(m.kickoff_at).getTime();
    return Number.isNaN(kickoff) || kickoff > Date.now();
  });
  const myPredictions = extractList<{
    id: number;
    match_id?: number;
    predicted_home_score?: number;
    predicted_away_score?: number;
    predicted_winner?: string;
    type?: string;
    points?: number;
    points_awarded?: number;
    status?: string;
  }>(mine.data);

  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});

  /**
   * PredictionController::store expects a prediction `type` plus `predicted_*`
   * fields — a scoreline is an `exact_score` prediction, and the winner is
   * derived from it so the winner rule can score too.
   */
  const submit = useMutation(async (matchId: number, home: number, away: number) => {
    await api.post('/predictions', {
      match_id: matchId,
      type: 'exact_score',
      predicted_home_score: home,
      predicted_away_score: away,
      predicted_winner: home > away ? 'home' : away > home ? 'away' : 'draw',
    });
    mine.reload();
  });

  // Scoring rules come back as a list of { type, points }.
  const ruleList = extractList<{ type?: string; points?: number }>(rules.data);
  const pointsFor = (type: string) => ruleList.find((r) => r.type === type)?.points ?? 0;

  const predictedIds = new Set(myPredictions.map((p) => p.match_id));

  return (
    <>
      {submit.error && <Alert>{submit.error}</Alert>}

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <Stat label="Exact score" value={formatNumber(pointsFor('exact_score'))} hint="points" />
        <Stat label="Match winner" value={formatNumber(pointsFor('winner'))} hint="points" />
        <Stat label="Predictions made" value={formatNumber(myPredictions.length)} />
      </div>

      <Section title="Open fixtures">
        <DataState
          loading={fixtures.loading}
          error={fixtures.error}
          data={list}
          onRetry={fixtures.reload}
          empty={{
            title: 'No fixtures open for prediction',
            body: 'Predictions close at kick-off. Come back when the next round is scheduled.',
          }}
        >
          {(items) => (
            <div className="stack">
              {items.map((m) => {
                const entry = scores[m.id] ?? { home: '', away: '' };
                const done = predictedIds.has(m.id);
                return (
                  <Panel key={m.id}>
                    <div className="predict-row">
                      <div>
                        <strong style={{ display: 'block' }}>
                          {labelOf(m.home_team) || m.home_club?.name || 'TBC'} v{' '}
                          {labelOf(m.away_team) || m.away_club?.name || 'TBC'}
                        </strong>
                        <span className="muted" style={{ fontSize: 13 }}>
                          {[labelOf(m.competition), formatDate(m.kickoff_at, true)]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </div>

                      {done ? (
                        <Badge tone="green">Predicted</Badge>
                      ) : (
                        <div className="predict-inputs">
                          <input
                            className="field-input"
                            type="number"
                            min={0}
                            max={20}
                            inputMode="numeric"
                            aria-label="Home score"
                            value={entry.home}
                            onChange={(e) =>
                              setScores((s) => ({ ...s, [m.id]: { ...entry, home: e.target.value } }))
                            }
                          />
                          <span aria-hidden="true">–</span>
                          <input
                            className="field-input"
                            type="number"
                            min={0}
                            max={20}
                            inputMode="numeric"
                            aria-label="Away score"
                            value={entry.away}
                            onChange={(e) =>
                              setScores((s) => ({ ...s, [m.id]: { ...entry, away: e.target.value } }))
                            }
                          />
                          <button
                            className="button button-green button-sm"
                            type="button"
                            disabled={submit.pending || entry.home === '' || entry.away === ''}
                            onClick={() =>
                              void submit.run(m.id, Number(entry.home), Number(entry.away))
                            }
                          >
                            {submit.pending ? '…' : 'Predict'}
                          </button>
                        </div>
                      )}
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </DataState>
      </Section>

      <Section title="My predictions">
        <Panel className="panel-flush">
          <DataState
            loading={mine.loading}
            error={mine.error}
            data={myPredictions}
            onRetry={mine.reload}
            empty={{ title: 'No predictions yet', body: 'Predict a fixture above to get started.' }}
          >
            {(items) =>
              items.map((p) => (
                <Row
                  key={p.id}
                  title={`${p.predicted_home_score ?? 0} – ${p.predicted_away_score ?? 0}`}
                  meta={[p.type, p.status].filter(Boolean).join(' · ') || 'Submitted'}
                  right={
                    <Badge tone="gold">{formatNumber(p.points ?? p.points_awarded ?? 0)} pts</Badge>
                  }
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Fantasy() {
  const squad = useApi<{
    players?: { id: number; name?: string; position?: string; points?: number }[];
    points?: number;
    rank?: number;
  }>('/fantasy/squad');

  const players = squad.data?.players ?? [];

  const rescore = useMutation(async () => {
    await api.post("/fantasy/score");
    squad.reload();
  });

  return (
    <>
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <Stat label="Squad points" value={formatNumber(squad.data?.points ?? 0)} />
        <Stat label="Rank" value={squad.data?.rank ? `#${formatNumber(squad.data.rank)}` : '—'} />
        <Stat label="Players" value={formatNumber(players.length)} />
      </div>

      {rescore.error && <Alert>{rescore.error}</Alert>}

      <Section
        title="My squad"
        action={
          <button
            className="button button-outline button-sm"
            type="button"
            disabled={rescore.pending}
            onClick={() => void rescore.run()}
          >
            {rescore.pending ? "Updating…" : "Refresh score"}
          </button>
        }
      >
        <Panel className="panel-flush">
          <DataState
            loading={squad.loading}
            error={squad.error}
            data={players}
            onRetry={squad.reload}
            empty={{
              title: 'No squad yet',
              body: 'Build your fantasy squad in the mobile app, then track it here.',
            }}
          >
            {(items) =>
              items.map((p) => (
                <Row
                  key={p.id}
                  title={p.name ?? 'Player'}
                  meta={p.position ?? ''}
                  right={<Badge tone="green">{formatNumber(p.points)} pts</Badge>}
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>
    </>
  );
}
