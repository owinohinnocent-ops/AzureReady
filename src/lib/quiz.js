
import { TOPICS, getTopicName } from '@/data/topics';
import {
  QUESTIONS,
  getQuestionsByTopic,
} from '@/data/questions';

export function shuffleArray(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function availableQuestionCount(topicId) {
  return getQuestionsByTopic(topicId).length;
}

export function createQuiz({
  topicId,
  questionCount = 10,
  shuffleQuestions = true,
  shuffleOptions = true,
} = {}) {
  const topicQuestions = getQuestionsByTopic(topicId);

  const selectedQuestions = shuffleQuestions
    ? shuffleArray(topicQuestions)
    : [...topicQuestions];

  const limitedQuestions = selectedQuestions.slice(
    0,
    Math.min(questionCount, selectedQuestions.length)
  );

  return limitedQuestions.map((question) => {
    const options = shuffleOptions
      ? shuffleArray(question.options)
      : [...question.options];

    return {
      ...question,
      options,
    };
  });
}

export function isAnswered(answer) {
  if (Array.isArray(answer)) {
    return answer.length > 0;
  }

  return answer !== undefined && answer !== null && answer !== '';
}

export function isQuizComplete(questions, answers) {
  return questions.every((question) =>
    isAnswered(answers[question.id])
  );
}

export function optionText(question, optionKey) {
  const option = question.options.find(
    (item) => item.key === optionKey || item.value === optionKey
  );

  return option?.text ?? option?.label ?? '';
}

export function gradeQuiz(questions, answers) {
  let correct = 0;

  const results = questions.map((question) => {
    const selected = answers[question.id];
    const correctKey = question.correctKey;

    const isCorrect = Array.isArray(selected)
      ? [...selected].sort().join(',') ===
        [...(Array.isArray(correctKey) ? correctKey : [correctKey])]
          .sort()
          .join(',')
      : selected === correctKey;

    if (isCorrect) correct += 1;

    return {
      questionId: question.id,
      topic: question.topic,
      selectedAnswer: selected ?? null,
      correctAnswer: correctKey,
      isCorrect,
      explanation: question.explanation ?? '',
      optionFeedback: question.optionFeedback ?? {},
    };
  });

  const total = questions.length;

  return {
    correct,
    total,
    incorrect: total - correct,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    results,
  };
}

export function buildAttempt({
  topicId,
  questions,
  answers,
  startedAt,
  completedAt = new Date().toISOString(),
}) {
  const grade = gradeQuiz(questions, answers);

  return {
    id: `attempt-${Date.now()}`,
    topicId,
    topicName: getTopicName(topicId),
    startedAt,
    completedAt,
    questionCount: questions.length,
    score: grade.correct,
    total: grade.total,
    percentage: grade.percentage,
    results: grade.results,
  };
}

export function weakestTopic(attempts) {
  const topicScores = {};

  attempts.forEach((attempt) => {
    (attempt.results ?? []).forEach((result) => {
      if (!topicScores[result.topic]) {
        topicScores[result.topic] = {
          correct: 0,
          total: 0,
        };
      }

      topicScores[result.topic].total += 1;

      if (result.isCorrect) {
        topicScores[result.topic].correct += 1;
      }
    });
  });

  const entries = Object.entries(topicScores);

  if (entries.length === 0) return null;

  entries.sort((a, b) => {
    const scoreA = a[1].correct / a[1].total;
    const scoreB = b[1].correct / b[1].total;
    return scoreA - scoreB;
  });

  const [topicId, scores] = entries[0];

  return {
    topicId,
    topicName: getTopicName(topicId),
    correct: scores.correct,
    total: scores.total,
    percentage: Math.round(
      (scores.correct / scores.total) * 100
    ),
  };
}
