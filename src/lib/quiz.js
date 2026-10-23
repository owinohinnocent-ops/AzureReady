// AzureReady — quiz building, shuffling and scoring.

import { TOPICS, getTopicName } from '@/data/topics';
import { getQuestionById, getQuestionsByTopic } from '@/data/questions';

export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function availableQuestionCount(topicId) {
  return getQuestionsByTopic(topicId).length;
}

// Creates a quiz with shuffled question order and shuffled options.
// The correct answer travels with the option key, so shuffling can never change the answer.
export function createQuiz({ topicId, count }) {
  const pool = getQuestionsByTopic(topicId);
  const requested = Math.max(1, Math.min(Number(count) || pool.length, pool.length));

  const items = shuffleArray(pool)
    .slice(0, requested)
    .map((question) => ({
      questionId: question.id,
      optionKeys: shuffleArray(question.options.map((option) => option.key)),
      selectedKey: null,
      submitted: false,
    }));

  return {
    topicId,
    count: items.length,
    items,
    index: 0,
    startedAt: new Date().toISOString(),
  };
}

export function isAnswered(quiz) {
  return quiz.items.filter((item) => item.submitted).length;
}

export function isQuizComplete(quiz) {
  return quiz.items.length > 0 && quiz.items.every((item) => item.submitted);
}

export function optionText(question, key) {
  if (!question || !key) return 'No answer selected';
  const option = question.options.find((item) => item.key === key);
  return option ? option.text : 'No answer selected';
}

export function gradeQuiz(quiz) {
  const results = quiz.items.map((item) => {
    const question = getQuestionById(item.questionId);
    return {
      questionId: item.questionId,
      topicId: question ? question.topic : null,
      selectedKey: item.selectedKey,
      isCorrect: !!question && item.selectedKey === question.correctKey,
    };
  });

  const total = results.length;
  const correct = results.filter((result) => result.isCorrect).length;
  const incorrect = total - correct;
  const percentage = total ? Math.round((correct / total) * 100) : 0;

  const breakdown = TOPICS.map((topic) => {
    const forTopic = results.filter((result) => result.topicId === topic.id);
    const topicCorrect = forTopic.filter((result) => result.isCorrect).length;
    return {
      topicId: topic.id,
      topicName: topic.shortName,
      total: forTopic.length,
      correct: topicCorrect,
      percentage: forTopic.length ? Math.round((topicCorrect / forTopic.length) * 100) : 0,
    };
  }).filter((entry) => entry.total > 0);

  const missed = results
    .filter((result) => !result.isCorrect)
    .map((result) => {
      const question = getQuestionById(result.questionId);
      return {
        questionId: result.questionId,
        topicId: result.topicId,
        question: question ? question.question : 'Question unavailable',
        selectedText: optionText(question, result.selectedKey),
        correctText: optionText(question, question ? question.correctKey : null),
        explanation: question ? question.explanation : '',
      };
    });

  return { total, correct, incorrect, percentage, results, breakdown, missed };
}

export function buildAttempt(quiz) {
  const graded = gradeQuiz(quiz);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    topicId: quiz.topicId,
    topicName: getTopicName(quiz.topicId),
    total: graded.total,
    correct: graded.correct,
    incorrect: graded.incorrect,
    percentage: graded.percentage,
    breakdown: graded.breakdown,
    missed: graded.missed,
    answers: graded.results.map((result) => ({ questionId: result.questionId, isCorrect: result.isCorrect })),
  };
}

// The topic that deserves the most revision in a finished attempt.
export function weakestTopic(attempt) {
  if (!attempt || !Array.isArray(attempt.breakdown) || attempt.breakdown.length === 0) return null;
  const sorted = [...attempt.breakdown].sort((a, b) => a.percentage - b.percentage);
  const lowest = sorted[0];
  return lowest.percentage < 100 ? lowest : null;
}
