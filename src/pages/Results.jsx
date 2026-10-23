import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, Lightbulb, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import ScoreRing from '@/components/ScoreRing';
import StatCard from '@/components/StatCard';
import { MIXED_TOPIC_ID, getTopicName, getTopicShortName } from '@/data/topics';
import { formatAttemptDate } from '@/lib/format';
import { weakestTopic } from '@/lib/quiz';
import { getAttempt } from '@/lib/storage';

export default function Results() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(undefined);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setAttempt(getAttempt(attemptId));
  }, [attemptId]);

  if (attempt === undefined) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-slate-900">We could not find that result</h1>
        <p className="mt-3 text-slate-600">
          Quiz results are saved in the browser you took the quiz in. Start a new quiz to see your score and topic
          breakdown.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate('/practice')}>Start a quiz</Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const weakest = weakestTopic(attempt);
  const headline =
    attempt.percentage >= 80
      ? 'Excellent work — you are close to exam ready.'
      : attempt.percentage >= 60
        ? 'Solid progress — tidy up the gaps below.'
        : 'Good start — focus your revision and try again.';

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center">
          <ScoreRing percentage={attempt.percentage} />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">{attempt.topicName}</p>
            <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {headline}
            </h1>
            <p className="mt-3 text-slate-600">
              You answered <span className="font-semibold text-slate-900">{attempt.correct}</span> of{' '}
              {attempt.total} questions correctly. Completed {formatAttemptDate(attempt.createdAt)}.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={ArrowRight}
            label="Correct answers"
            value={attempt.correct}
            hint="Answered right the first time"
            accent="text-emerald-700 bg-emerald-50 ring-emerald-100"
          />
          <StatCard
            label="Incorrect answers"
            value={attempt.incorrect}
            hint="Worth reviewing below"
            accent="text-rose-700 bg-rose-50 ring-rose-100"
          />
          <StatCard
            label="Score"
            value={`${attempt.percentage}%`}
            hint={`${attempt.total}-question quiz`}
            accent="text-blue-700 bg-blue-50 ring-blue-100"
          />
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">Performance by topic</h2>
        <div className="mt-6 space-y-5">
          {attempt.breakdown.map((entry) => (
            <div key={entry.topicId}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  {getTopicShortName(entry.topicId)}
                  <span className="ml-2 text-xs text-slate-400">{getTopicName(entry.topicId)}</span>
                </span>
                <span className="text-slate-500 tabular-nums">
                  {entry.correct}/{entry.total} · {entry.percentage}%
                </span>
              </div>
              <ProgressBar className="mt-2.5" value={entry.percentage} tone="blue" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-blue-100">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">
              {weakest ? 'Revise this next' : 'Nothing to revise in this quiz'}
            </h2>
            {weakest ? (
              <>
                <p className="mt-2 text-slate-700">
                  Your lowest score was in{' '}
                  <span className="font-semibold text-slate-900">{getTopicName(weakest.topicId)}</span> at{' '}
                  {weakest.percentage}% ({weakest.correct} of {weakest.total} correct). A focused 10-question quiz is
                  the quickest way to lift that score.
                </p>
                <Button className="mt-4" onClick={() => navigate(`/quiz?topic=${weakest.topicId}&count=10`)}>
                  Practise {getTopicShortName(weakest.topicId)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-slate-700">
                  You scored full marks in every topic covered by this quiz. Try a mixed 30-question quiz to check your
                  overall readiness.
                </p>
                <Button className="mt-4" onClick={() => navigate(`/quiz?topic=${MIXED_TOPIC_ID}&count=30`)}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Try a mixed quiz
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {attempt.missed && attempt.missed.length > 0 ? (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() => setShowReview((value) => !value)}
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={showReview}
          >
            <span>
              <span className="block font-heading text-xl font-bold tracking-tight text-slate-900">
                Review {attempt.missed.length} missed question{attempt.missed.length === 1 ? '' : 's'}
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                See your answer, the correct answer and the explanation.
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                showReview ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showReview ? (
            <ul className="mt-6 space-y-4">
              {attempt.missed.map((entry) => (
                <li key={entry.questionId} className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {entry.questionId} · {getTopicShortName(entry.topicId)}
                  </p>
                  <p className="mt-2 font-medium leading-snug text-slate-900">{entry.question}</p>
                  <p className="mt-3 text-sm text-rose-700">Your answer: {entry.selectedText}</p>
                  <p className="mt-1 text-sm text-emerald-700">Correct answer: {entry.correctText}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{entry.explanation}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => navigate('/')}>
          Back to dashboard
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate(`/quiz?topic=${attempt.topicId}&count=${attempt.total}`)}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake this quiz
        </Button>
        {attempt.topicId !== MIXED_TOPIC_ID ? (
          <Button size="lg" variant="ghost" onClick={() => navigate(`/quiz?topic=${MIXED_TOPIC_ID}&count=10`)}>
            Try a mixed quiz
          </Button>
        ) : null}
      </div>
    </div>
  );
}
