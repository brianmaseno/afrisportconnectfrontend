import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi, useMutation } from '../../lib/useApi';
import { api, mediaUrl } from '../../lib/api';
import { formatNumber } from '../../lib/format';
import { Alert } from '../../components/Field';
import { Badge, DataState, PageHeader, Panel, Row, Section, Stat } from '../ui';
import type { Course } from '../../lib/types';

type Lesson = {
  id: number;
  title?: string;
  summary?: string | null;
  duration_minutes?: number | null;
  completed?: boolean;
  is_completed?: boolean;
};

type CourseDetail = Course & {
  lessons?: Lesson[];
  enrolled?: boolean;
  is_enrolled?: boolean;
  progress?: number;
};

type Question = {
  id: number;
  question?: string;
  text?: string;
  options?: string[];
  choices?: string[];
};

export function CoursePage() {
  const { slug = '' } = useParams();

  const course = useApi<CourseDetail>(`/courses/${slug}`, [slug]);
  const quiz = useApi<{ id?: number; title?: string; questions?: Question[] }>(
    `/courses/${slug}/quiz`,
    [slug],
  );

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score?: number; passed?: boolean } | null>(null);
  const [certUrl, setCertUrl] = useState<string | null>(null);

  const data = course.data;
  const lessons = data?.lessons ?? [];
  const enrolled = data?.enrolled ?? data?.is_enrolled ?? false;
  const questions = quiz.data?.questions ?? [];

  const enroll = useMutation(async () => {
    await api.post(`/courses/${slug}/enroll`);
    course.reload();
  });

  const complete = useMutation(async (lessonId: number) => {
    await api.post(`/courses/${slug}/lessons/${lessonId}/complete`);
    course.reload();
  });

  const submitQuiz = useMutation(async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selected]) => ({
        question_id: Number(questionId),
        selected_index: selected,
      })),
    };
    const res = await api.post<{ score?: number; passed?: boolean }>(
      `/courses/${slug}/quiz/submit`,
      payload,
    );
    setResult(res ?? {});
    course.reload();
    return res;
  });

  const getCertificate = useMutation(async () => {
    const res = await api.get<{ url?: string }>(`/courses/${slug}/certificate`);
    const url = mediaUrl(res?.url);
    if (!url) throw new Error('Certificate is not available yet.');
    setCertUrl(url);
    window.open(url, '_blank', 'noopener');
    return res;
  });

  const doneCount = lessons.filter((l) => l.completed ?? l.is_completed).length;
  const progress = data?.progress ?? (lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0);

  return (
    <>
      <PageHeader
        title={data?.title ?? 'Course'}
        subtitle={data?.summary ?? data?.description ?? 'Course details'}
        actions={
          <Link className="button button-outline button-sm" to="/app/learn">
            All courses
          </Link>
        }
      />

      {(enroll.error || complete.error || submitQuiz.error || getCertificate.error) && (
        <Alert>
          {enroll.error ?? complete.error ?? submitQuiz.error ?? getCertificate.error}
        </Alert>
      )}

      <DataState
        loading={course.loading}
        error={course.error}
        data={data}
        onRetry={course.reload}
        skeletonRows={2}
        empty={{ title: 'Course not found' }}
      >
        {(item) => (
          <>
            {mediaUrl(item.cover) && (
              <img
                className="event-cover"
                style={{ maxHeight: 280, objectFit: 'cover', marginBottom: 22 }}
                src={mediaUrl(item.cover)!}
                alt=""
              />
            )}

            <div className="grid-3" style={{ marginBottom: 26 }}>
              <Stat label="Progress" value={`${progress}%`} />
              <Stat label="Lessons" value={formatNumber(lessons.length || item.lessons_count || 0)} />
              <Stat label="Level" value={item.level ?? '—'} />
            </div>

            {!enrolled && (
              <Panel style={{ marginBottom: 24 }}>
                <p className="muted" style={{ marginTop: 0 }}>
                  Enrol to track your progress, take the assessment and earn a certificate.
                </p>
                <button
                  className="button button-green button-sm"
                  type="button"
                  disabled={enroll.pending}
                  onClick={() => void enroll.run()}
                >
                  {enroll.pending ? 'Enrolling…' : 'Enrol on this course'}
                </button>
              </Panel>
            )}

            <Section title="Lessons">
              <Panel className="panel-flush">
                <DataState
                  loading={false}
                  error={null}
                  data={lessons}
                  empty={{ title: 'No lessons published yet' }}
                >
                  {(items) =>
                    items.map((l, i) => {
                      const done = l.completed ?? l.is_completed ?? false;
                      return (
                        <Row
                          key={l.id}
                          media={<span style={{ fontWeight: 800 }}>{i + 1}</span>}
                          title={l.title ?? `Lesson ${i + 1}`}
                          meta={l.summary ?? (l.duration_minutes ? `${l.duration_minutes} min` : '')}
                          right={
                            done ? (
                              <Badge tone="green">Completed</Badge>
                            ) : (
                              <button
                                className="button button-outline button-sm"
                                type="button"
                                disabled={!enrolled || complete.pending}
                                onClick={() => void complete.run(l.id)}
                              >
                                {complete.pending ? '…' : 'Mark complete'}
                              </button>
                            )
                          }
                        />
                      );
                    })
                  }
                </DataState>
              </Panel>
            </Section>

            {questions.length > 0 && (
              <Section title={quiz.data?.title ?? 'Assessment'}>
                <Panel>
                  {result && (
                    <Alert kind={result.passed ? 'success' : 'error'}>
                      {result.passed
                        ? `Passed with ${formatNumber(result.score)}%.`
                        : `Scored ${formatNumber(result.score)}%. Review the lessons and try again.`}
                    </Alert>
                  )}

                  <div className="stack">
                    {questions.map((q, qi) => {
                      const options = q.options ?? q.choices ?? [];
                      return (
                        <div key={q.id}>
                          <strong style={{ display: 'block', marginBottom: 8 }}>
                            {qi + 1}. {q.question ?? q.text}
                          </strong>
                          <div className="stack" style={{ gap: 6 }}>
                            {options.map((opt, oi) => (
                              <label key={oi} className="field-check" style={{ marginBottom: 0 }}>
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  checked={answers[q.id] === oi}
                                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="button button-green button-sm"
                    type="button"
                    style={{ marginTop: 18 }}
                    disabled={
                      submitQuiz.pending || Object.keys(answers).length < questions.length
                    }
                    onClick={() => void submitQuiz.run()}
                  >
                    {submitQuiz.pending ? 'Submitting…' : 'Submit answers'}
                  </button>
                </Panel>
              </Section>
            )}

            <Section title="Certificate">
              <Panel>
                <p className="muted" style={{ marginTop: 0 }}>
                  {progress >= 100
                    ? 'You have completed this course — download your certificate.'
                    : 'Complete every lesson and pass the assessment to unlock your certificate.'}
                </p>
                <div className="inline">
                  <button
                    className="button button-outline button-sm"
                    type="button"
                    disabled={getCertificate.pending}
                    onClick={() => void getCertificate.run()}
                  >
                    {getCertificate.pending ? 'Checking…' : 'Get certificate'}
                  </button>
                  {certUrl && (
                    <a className="link-arrow" href={certUrl} target="_blank" rel="noreferrer">
                      Open certificate <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </Panel>
            </Section>
          </>
        )}
      </DataState>
    </>
  );
}
