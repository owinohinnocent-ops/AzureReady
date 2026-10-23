import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Play, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MIXED_TOPIC, QUIZ_LENGTHS, TOPICS } from '@/data/topics';
import { availableQuestionCount } from '@/lib/quiz';
import { loadSession } from '@/lib/storage';

export default function Practice() {
  const navigate = useNavigate();
  const [unfinished] = useState(() => loadSession());
  const [count, setCount] = useState(10);

  const choices = [...TOPICS, MIXED_TOPIC];

  const startTopic = (topicId) => {
    const available = availableQuestionCount(topicId);
    if (available === 0) return;
    navigate(`/quiz?topic=${topicId}&count=${Math.min(count, available)}`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Build your quiz</p>
      <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Choose what to practise
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Pick how many questions you want, then tap a topic to start straight away. Question order and answer options are
        shuffled every time, so you learn the ideas rather than the position of the right answer.
      </p>

      {unfinished ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
          <div className="flex items-start gap-3 text-sm text-blue-900">
            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              You have an unfinished quiz with{' '}
              {unfinished.items.filter((item) => item.submitted).length} of {unfinished.items.length} questions
              answered.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/quiz?topic=${unfinished.topicId}&count=${unfinished.items.length}`)}
          >
            Resume it
          </Button>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="font-heading text-base font-bold text-slate-900">1. How many questions?</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUIZ_LENGTHS.map((length) => {
            const selected = count === length;
            return (
              <button
                key={length}
                type="button"
                onClick={() => setCount(length)}
                aria-pressed={selected}
                className={`rounded-2xl border px-5 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  selected
                    ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                }`}
              >
                <span className="block font-heading text-lg font-extrabold tabular-nums text-slate-900">{length}</span>
                <span className="block text-xs text-slate-500">questions</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-slate-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Every topic below starts a quiz of {count} questions the moment you tap it.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-base font-bold text-slate-900">2. Tap a topic to start</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {choices.map((topic) => {
            const available = availableQuestionCount(topic.id);
            const isMixed = topic.id === MIXED_TOPIC.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => startTopic(topic.id)}
                disabled={available === 0}
                className={`group flex h-full flex-col rounded-2xl border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  available === 0
                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
                    : 'cursor-pointer border-slate-200 bg-white hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${topic.soft}`}
                  >
                    {isMixed ? 'All topics' : `Topic ${topic.code}`}
                  </span>
                  {isMixed ? <Shuffle className="h-4 w-4 text-slate-400" /> : null}
                </div>

                <p className="mt-3 font-heading text-sm font-bold text-slate-900">{topic.name}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{topic.summary}</p>
                <p className="mt-3 text-xs font-medium text-slate-600">{available} questions available</p>

                <span
                  className={`mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                    available === 0 ? 'bg-slate-400' : 'bg-blue-600 group-hover:bg-blue-700'
                  }`}
                >
                  <Play className="mr-2 h-3.5 w-3.5" />
                  {available === 0 ? 'No questions yet' : `Start ${Math.min(count, available)} questions`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-9">
        <Button size="lg" variant="ghost" onClick={() => navigate('/')}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
