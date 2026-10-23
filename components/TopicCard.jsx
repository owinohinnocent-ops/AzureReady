import { ArrowRight, ListChecks } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';

export default function TopicCard({ topic, progress, onPractice }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onPractice();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Practise all ${progress.total} questions in ${topic.name}`}
      onClick={onPractice}
      onKeyDown={handleKeyDown}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${topic.soft}`}>
          Topic {topic.code}
        </span>
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} text-white`}>
          <ListChecks className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-slate-900">{topic.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{topic.summary}</p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">{progress.total} questions</span>
          <span className="text-slate-500">
            <span className="font-semibold text-slate-800 tabular-nums">{progress.mastered}</span> mastered
          </span>
        </div>
        <ProgressBar className="mt-3" value={progress.percent} tone="blue" />
      </div>

      <span className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition group-hover:border-blue-300 group-hover:bg-blue-50/60 group-hover:text-blue-700">
        Practise all {progress.total} questions
        <ArrowRight className="ml-2 h-4 w-4" />
      </span>
    </article>
  );
}
