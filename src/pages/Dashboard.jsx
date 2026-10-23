import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BookOpen, Layers, Play, RotateCcw, Shuffle, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import StatCard from '@/components/StatCard';
import TopicCard from '@/components/TopicCard';
import AttemptList from '@/components/AttemptList';
import { MIXED_TOPIC_ID, QUESTIONS_PER_TOPIC, TOPICS } from '@/data/topics';
import { TOTAL_QUESTIONS } from '@/data/questions';
import { clearProgress, computeOverallProgress, computeTopicProgress, loadProgress } from '@/lib/storage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const latest = progress.attempts[0] || null;
  const overall = computeOverallProgress(progress);

  const handleReset = () => {
    if (window.confirm('Reset all saved progress and quiz history? This cannot be undone.')) {
      clearProgress();
      setProgress(loadProgress());
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {progress.issue ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {progress.issue === 'corrupt'
              ? 'We could not read the progress saved in this browser, so AzureReady started from a clean slate. Your new results will still be saved.'
              : 'This browser is blocking local storage, so quiz results and progress cannot be saved here.'}
          </p>
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-7 sm:p-11">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
            #1MillionDevs · AZ-900 challenge
          </span>
          <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Get Azure-ready, one question at a time.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Welcome to AzureReady — {TOTAL_QUESTIONS} original practice questions written for the Microsoft Azure
            Fundamentals (AZ-900) exam, each with a clear explanation you can learn from.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => navigate('/practice')}>
              <Play className="mr-2 h-4 w-4" />
              Start practice quiz
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(`/quiz?topic=${MIXED_TOPIC_ID}&count=10`)}>
              <Shuffle className="mr-2 h-4 w-4" />
              Mixed quiz
            </Button>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Independent study project — not affiliated with or endorsed by Microsoft. Answers and progress are saved in
            this browser, so you can pick up where you left off.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Total questions"
          value={TOTAL_QUESTIONS}
          hint="30 questions in each of 3 exam topics"
          accent="text-blue-600 bg-blue-50 ring-blue-100"
        />
        <StatCard
          icon={Trophy}
          label="Latest quiz score"
          value={latest ? `${latest.percentage}%` : '—'}
          hint={
            latest
              ? `${latest.correct} of ${latest.total} correct · ${latest.topicName}`
              : 'No quiz attempts yet'
          }
          accent="text-cyan-700 bg-cyan-50 ring-cyan-100"
        />
        <StatCard
          icon={Target}
          label="Overall progress"
          value={`${overall.percent}%`}
          hint={`${overall.mastered} of ${overall.total} questions answered correctly`}
          accent="text-indigo-700 bg-indigo-50 ring-indigo-100"
        />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">Exam topics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Each topic has 30 questions — tap a topic to start its 30-question quiz straight away. Mastered means the last
              time you answered a question you got it right.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/practice')}>
            <Layers className="mr-2 h-4 w-4" />
            Build a custom quiz
          </Button>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {TOPICS.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              progress={computeTopicProgress(progress, topic.id)}
              onPractice={() => navigate(`/quiz?topic=${topic.id}&count=${QUESTIONS_PER_TOPIC}`)}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">Recent attempts</h2>
            <p className="mt-1 text-sm text-slate-500">Your last {Math.min(progress.attempts.length, 25) || 0} quizzes, newest first.</p>
          </div>
          {progress.attempts.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset progress
            </Button>
          ) : null}
        </div>

        <div className="mt-5">
          <AttemptList attempts={progress.attempts.slice(0, 6)} onStart={() => navigate('/practice')} />
        </div>
      </section>
    </div>
  );
}
