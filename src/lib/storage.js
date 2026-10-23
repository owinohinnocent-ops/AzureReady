

// AzureReady — safe browser storage for quiz attempts, scores and topic progress.
// All reads are defensive: a missing, empty or damaged value falls back to a clean state.

import { QUESTIONS_PER_TOPIC } from '@/data/topics';
import { TOTAL_QUESTIONS, getQuestionById } from '@/data/questions';

const PROGRESS_KEY = 'azureready:progress:v1';
const SESSION_KEY = 'azureready:session:v1';
const MAX_ATTEMPTS = 25;

export function emptyProgress() {
  return { version: 1, attempts: [], mastery: {} };
}

export function storageAvailable() {
  try {
    const probe = '__azureready_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function sanitizeMastery(value) {
  if (!value || typeof value !== 'object') return {};
  const clean = {};
  Object.keys(value).forEach((id) => {
    if (typeof value[id] === 'boolean' && getQuestionById(id)) clean[id] = value[id];
  });
  return clean;
}

function isValidAttempt(attempt) {
  return (
    attempt &&
    typeof attempt === 'object' &&
    typeof attempt.id === 'string' &&
    typeof attempt.percentage === 'number' &&
    typeof attempt.total === 'number' &&
    Array.isArray(attempt.breakdown)
  );
}

export function loadProgress() {
  if (!storageAvailable()) {
    return { ...emptyProgress(), issue: 'unavailable' };
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...emptyProgress(), issue: null };

    const parsed = JSON.parse(raw);
    const looksValid =
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.attempts) &&
      parsed.mastery &&
      typeof parsed.mastery === 'object';

    if (!looksValid) return { ...emptyProgress(), issue: 'corrupt' };

    return {
      version: 1,
      attempts: parsed.attempts.filter(isValidAttempt).slice(0, MAX_ATTEMPTS),
      mastery: sanitizeMastery(parsed.mastery),
      issue: null,
    };
  } catch {
    return { ...emptyProgress(), issue: 'corrupt' };
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        version: 1,
        attempts: progress.attempts.slice(0, MAX_ATTEMPTS),
        mastery: progress.mastery,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export function recordAttempt(attempt) {
  const progress = loadProgress();
  const attempts = [attempt, ...progress.attempts].slice(0, MAX_ATTEMPTS);
  const mastery = { ...progress.mastery };

  (attempt.answers || []).forEach((answer) => {
    if (answer && answer.questionId) mastery[answer.questionId] = !!answer.isCorrect;
  });

  const next = { version: 1, attempts, mastery };
  saveProgress(next);
  return { ...next, issue: progress.issue };
}

export function getAttempt(attemptId) {
  if (!attemptId) return null;
  return loadProgress().attempts.find((attempt) => attempt.id === attemptId) || null;
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* nothing else we can do when storage is blocked */
  }
}

export function computeTopicProgress(progress, topicId) {
  const mastery = progress?.mastery || {};
  let mastered = 0;

  Object.keys(mastery).forEach((id) => {
    const question = getQuestionById(id);
    if (question && question.topic === topicId && mastery[id] === true) mastered += 1;
  });

  const total = QUESTIONS_PER_TOPIC;
  return { mastered, total, percent: total ? Math.round((mastered / total) * 100) : 0 };
}

export function computeOverallProgress(progress) {
  const mastery = progress?.mastery || {};
  let mastered = 0;

  Object.keys(mastery).forEach((id) => {
    if (mastery[id] === true && getQuestionById(id)) mastered += 1;
  });

  const total = TOTAL_QUESTIONS;
  return { mastered, total, percent: total ? Math.round((mastered / total) * 100) : 0 };
}

// --- In-progress quiz session (so a refresh does not lose an unfinished quiz) ---

export function saveSession(session) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* session persistence is best effort */
  }
}

export function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const valid =
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.topicId === 'string' &&
      Array.isArray(parsed.items) &&
      parsed.items.length > 0 &&
      parsed.items.every((item) => item && typeof item.questionId === 'string' && Array.isArray(item.optionKeys));

    return valid ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
