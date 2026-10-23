import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, LogOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ProgressBar from '@/components/ProgressBar';
import QuizOption from '@/components/QuizOption';
import AnswerFeedback from '@/components/AnswerFeedback';
import { MIXED_TOPIC_ID, getTopicName } from '@/data/topics';
import { getQuestionById } from '@/data/questions';
import { availableQuestionCount, buildAttempt, createQuiz, isQuizComplete } from '@/lib/quiz';
import { clearSession, loadSession, recordAttempt, saveSession } from '@/lib/storage';

const LETTERS = ['A', 'B', 'C', 'D'];
const DIFFICULTY_STYLE = {
  easy: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  medium: 'bg-amber-50 text-amber-700 ring-amber-100',
  hard: 'bg-rose-50 text-rose-700 ring-rose-100',
};

function optionState(key, item, question) {
  if (!item.submitted) return item.selectedKey === key ? 'selected' : 'idle';
  if (key === question.correctKey) return 'correct';
  if (key === item.selectedKey) return 'incorrect';
  return 'muted';
}

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const topicId = searchParams.get('topic') || MIXED_TOPIC_ID;
  const available = availableQuestionCount(topicId);
  const requestedCount = Math.max(1, Math.min(Number(searchParams.get('count')) || 10, available || 1));

  const [status, setStatus] = useState('loading');
  const [quiz, setQuiz] = useState(null);
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    if (available === 0) {
      setStatus('error');
      return undefined;
    }

    let active = true;
    const existing = loadSession();
    const resumable =
      existing &&
      existing.topicId === topicId &&
      existing.items.length === requestedCount &&
      existing.items.every((item) => !!getQuestionById(item.questionId));

    const next = resumable
      ? { ...existing, index: Math.min(existing.index || 0, existing.items.length - 1) }
      : createQuiz({ topicId, count: requestedCount });

    const timer = setTimeout(() => {
      if (!active) return;
      setQuiz(next);
      setResumed(Boolean(resumable));
      setStatus('ready');
      saveSession(next);
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [topicId, requestedCount, available]);

  const updateQuiz = useCallback((updater) => {
    setQuiz((current) => {
      if (!current) return current;
      const next = typeof updater === 'function' ? updater(current) : updater;
      saveSession(next);
      return next;
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-5 font-heading text-lg font-bold text-slate-900">Preparing your quiz…</p>
        <p className="mt-1 text-sm text-slate-500">Shuffling questions and answer options.</p>
      </div>
    );
  }

  if (status === 'error' || !quiz || quiz.items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-slate-900">This quiz has no questions</h1>
        <p className="mt-3 text-slate-600">
          We could not load practice questions for this topic. Choose another topic and try again.
        </p>
        <Button className="mt-6" onClick={() => navigate('/practice')}>
          Back to quiz setup
        </Button>
      </div>
    );
  }

  const item = quiz.items[quiz.index];
  const question = getQuestionById(item.questionId);
  const answeredCount = quiz.items.filter((entry) => entry.submitted).length;
  const complete = isQuizComplete(quiz);
  const isLast = quiz.index === quiz.items.length - 1;
  const isCorrect = item.selectedKey === question.correctKey;

  const handleSelect = (key) => {
    if (item.submitted) return;
    updateQuiz((current) => ({
      ...current,
      items: current.items.map((entry, index) =>
        index === current.index ? { ...entry, selectedKey: key } : entry,
      ),
    }));
  };

  const handleSubmit = () => {
    if (item.submitted || !item.selectedKey) return;
    updateQuiz((current) => ({
      ...current,
      items: current.items.map((entry, index) => (index === current.index ? { ...entry, submitted: true } : entry)),
    }));
  };

  const goTo = (index) => updateQuiz((current) => ({ ...current, index }));

  const handleQuit = () => {
    if (window.confirm('Leave this quiz? This attempt will not be saved.')) {
      clearSession();
      navigate('/practice');
    }
  };

  const handleFinish = () => {
    const attempt = buildAttempt(quiz);
    recordAttempt(attempt);
    clearSession();
    navigate(`/results/${attempt.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              {getTopicName(quiz.topicId)}
            </p>
            <p className="mt-1 font-heading text-sm font-bold text-slate-900">
              Question {quiz.index + 1} of {quiz.items.length}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleQuit}>
            <LogOut className="mr-2 h-4 w-4" />
            Quit
          </Button>
        </div>

        <ProgressBar className="mt-4" value={(answeredCount / quiz.items.length) * 100} tone="blue" />
        <p className="mt-2 text-xs text-slate-500">
          {answeredCount} of {quiz.items.length} answered · {quiz.items.length - answeredCount} left
        </p>

        {resumed ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <RotateCcw className="h-3.5 w-3.5" />
            We restored your unfinished quiz, including your previous answers.
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${
              DIFFICULTY_STYLE[question.difficulty] || DIFFICULTY_STYLE.medium
            }`}
          >
            {question.difficulty}
          </span>
          <span className="text-xs text-slate-400">{question.id}</span>
        </div>

        <h2 className="mt-4 font-heading text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {question.question}
        </h2>

        <div className="mt-5 space-y-2.5">
          {item.optionKeys.map((key, index) => {
            const option = question.options.find((entry) => entry.key === key);
            return (
              <QuizOption
                key={key}
                label={LETTERS[index] || '?'}
                text={option ? option.text : ''}
                state={optionState(key, item, question)}
                disabled={item.submitted}
                onClick={() => handleSelect(key)}
              />
            );
          })}
        </div>

        {item.submitted ? (
          <AnswerFeedback question={question} selectedKey={item.selectedKey} isCorrect={isCorrect} />
        ) : (
          <p className="mt-5 text-xs text-slate-500">
            Select one answer, then submit it. Each question can only be submitted once.
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" onClick={() => goTo(quiz.index - 1)} disabled={quiz.index === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {complete ? (
              <Button onClick={handleFinish}>See my results</Button>
            ) : (
              <>
                {!item.submitted ? (
                  <Button onClick={handleSubmit} disabled={!item.selectedKey}>
                    Submit answer
                  </Button>
                ) : null}
                {item.submitted && !isLast ? (
                  <Button onClick={() => goTo(quiz.index + 1)}>
                    Next question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : null}
                {item.submitted && isLast ? (
                  <p className="max-w-xs text-sm text-slate-500 sm:text-right">
                    Answer the remaining {quiz.items.length - answeredCount} question
                    {quiz.items.length - answeredCount === 1 ? '' : 's'} to see your results.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
