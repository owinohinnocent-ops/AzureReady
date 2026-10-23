
import { formatAttemptDate } from '@/lib/format';

export default function AttemptList({ attempts = [] }) {
  if (!attempts.length) {
    return (
      <p className="py-3 text-sm text-slate-500">
        No quiz attempts yet. Start a practice quiz to see your results here.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {attempts.map((attempt, index) => (
        <div
          key={attempt.id ?? index}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div>
            <p className="font-semibold text-slate-900">
              {attempt.topicName ?? attempt.topicTitle ?? attempt.topic ?? 'Quiz attempt'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {formatAttemptDate(attempt.createdAt ?? attempt.date)}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-900">
              {attempt.percentage ?? attempt.score ?? 0}%
            </p>
            <p className="text-xs text-slate-500">
              {attempt.correct ?? 0} of {attempt.total ?? 0} correct
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
