import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useApi, useMutation } from '../../lib/useApi';
import { api, extractList } from '../../lib/api';
import { formatNumber } from '../../lib/format';
import { Badge, DataState, Media, PageHeader, Panel, Row, Section, Stat } from '../ui';
import type { Course } from '../../lib/types';

/* -------------------------------------------------------------------------- */
/* Learn                                                                       */
/* -------------------------------------------------------------------------- */

export function LearnPage() {
  const courses = useApi<unknown>('/courses', [], { per_page: 24 });
  const mine = useApi<unknown>('/me/courses');

  const list = extractList<Course>(courses.data);

  // /me/courses returns enrolment records with the course nested under
  // `course`, so reading slug/title off the row gave undefined — and links
  // went to /app/learn/undefined.
  const enrolled = extractList<{
    id: number;
    course_id?: number;
    progress_percent?: number;
    progress?: number;
    course?: Course;
  }>(mine.data)
    .map((e) => ({
      ...(e.course ?? {}),
      enrolmentId: e.id,
      progress: e.progress_percent ?? e.progress ?? 0,
    }))
    .filter((c): c is Course & { enrolmentId: number; progress: number } => Boolean(c.slug));

  const navigate = useNavigate();
  // Track which course is enrolling; a single shared `pending` made every card
  // in the grid say "Enrolling…" at once and look stuck.
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const enroll = useMutation(async (slug: string) => {
    setEnrolling(slug);
    try {
      await api.post(`/courses/${slug}/enroll`);
      mine.reload();
      // Land on the course so enrolling visibly leads somewhere.
      navigate(`/app/learn/${slug}`);
    } finally {
      setEnrolling(null);
    }
  });

  return (
    <>
      <PageHeader
        title="Learn"
        subtitle="Courses, certifications and pathways built around football careers."
      />

      {enrolled.length > 0 && (
        <Section title="Continue learning">
          <Panel className="panel-flush">
            {enrolled.map((c) => (
              <Row
                key={c.enrolmentId}
                onClick={() => navigate(`/app/learn/${c.slug}`)}
                title={c.title}
                meta={c.summary ?? c.level ?? ''}
                right={<Badge tone="green">{c.progress}% complete</Badge>}
              />
            ))}
          </Panel>
        </Section>
      )}

      <Section title="Course catalogue">
        {enroll.error && <p style={{ color: 'var(--error)', fontSize: 14 }}>{enroll.error}</p>}
        <DataState
          loading={courses.loading}
          error={courses.error}
          data={list}
          onRetry={courses.reload}
          empty={{ title: 'No courses yet', body: 'New learning content is added regularly.' }}
        >
          {(items) => (
            <div className="grid-3">
              {items.map((c) => (
                <Panel key={c.id}>
                  <Media src={c.cover} alt={c.title} ratio="16 / 9" label="Course" />
                  <div className="inline" style={{ marginBottom: 8 }}>
                    {c.level && <Badge>{c.level}</Badge>}
                    {c.lessons_count ? <Badge tone="blue">{c.lessons_count} lessons</Badge> : null}
                  </div>
                  <strong style={{ display: 'block', marginBottom: 6 }}>{c.title}</strong>
                  <p className="muted" style={{ margin: '0 0 14px', fontSize: 13.5 }}>
                    {c.summary ?? c.description ?? ''}
                  </p>
                  <div className="inline">
                    {c.slug && (
                      <Link className="button button-outline button-sm" to={`/app/learn/${c.slug}`}>
                        Open course
                      </Link>
                    )}
                    <button
                      className="button button-green button-sm"
                      type="button"
                      disabled={enrolling !== null}
                      onClick={() => void enroll.run(c.slug)}
                    >
                      {enrolling === c.slug ? 'Enrolling…' : 'Enrol'}
                    </button>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </DataState>
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Impact                                                                      */
/* -------------------------------------------------------------------------- */

export function ImpactPage() {
  const { user } = useAuth();
  const score = useApi<{ score?: number; total?: number; breakdown?: Record<string, number> }>(
    '/me/impact-score',
  );
  const summary = useApi<Record<string, unknown>>('/impact/summary');
  const challenges = useApi<unknown>('/challenges/mine');

  const myChallenges = extractList<{ id: number; title?: string; name?: string; status?: string }>(
    challenges.data,
  );
  const breakdown = score.data?.breakdown ?? {};

  return (
    <>
      <PageHeader
        title="Impact"
        subtitle="What your participation adds up to — beyond the scoreline."
      />

      <div className="grid-3" style={{ marginBottom: 30 }}>
        <Stat
          label="Impact score"
          value={score.loading ? '—' : formatNumber(score.data?.score ?? score.data?.total ?? 0)}
        />
        <Stat label="Loyalty points" value={formatNumber(user?.loyalty_points)} hint={user?.loyalty_level ?? undefined} />
        <Stat label="Active challenges" value={formatNumber(myChallenges.length)} />
      </div>

      {Object.keys(breakdown).length > 0 && (
        <Section title="Where it comes from">
          <Panel className="panel-flush">
            {Object.entries(breakdown).map(([key, value]) => (
              <Row
                key={key}
                title={key.replace(/_/g, ' ')}
                right={<Badge tone="green">{formatNumber(value)}</Badge>}
              />
            ))}
          </Panel>
        </Section>
      )}

      <Section title="My challenges">
        <Panel className="panel-flush">
          <DataState
            loading={challenges.loading}
            error={challenges.error}
            data={myChallenges}
            onRetry={challenges.reload}
            empty={{
              title: 'No challenges joined',
              body: 'Join a challenge in the app to start earning impact.',
            }}
          >
            {(items) =>
              items.map((c) => (
                <Row
                  key={c.id}
                  title={c.title ?? c.name ?? 'Challenge'}
                  right={<Badge>{c.status ?? 'In progress'}</Badge>}
                />
              ))
            }
          </DataState>
        </Panel>
      </Section>

      {summary.error && (
        <p className="muted" style={{ fontSize: 13.5 }}>
          Platform impact summary unavailable: {summary.error}
        </p>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Help                                                                        */
/* -------------------------------------------------------------------------- */

export function HelpPage() {
  const articles = useApi<unknown>('/help/articles');
  const list = extractList<{ id: number; title: string; excerpt?: string; category?: string }>(
    articles.data,
  );

  return (
    <>
      <PageHeader
        title="Help"
        subtitle="Answers to common questions, and how to reach the team."
        actions={
          <a className="button button-green button-sm" href="mailto:support@clubconnect.africa">
            Contact support
          </a>
        }
      />

      <Panel className="panel-flush">
        <DataState
          loading={articles.loading}
          error={articles.error}
          data={list}
          onRetry={articles.reload}
          empty={{
            title: 'No articles yet',
            body: 'Email support@clubconnect.africa and the team will help.',
          }}
        >
          {(items) =>
            items.map((a) => <Row key={a.id} title={a.title} meta={a.excerpt ?? a.category ?? ''} />)
          }
        </DataState>
      </Panel>
    </>
  );
}
