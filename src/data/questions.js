
import { cloudConceptsQuestions } from './cloudConcepts';
import { azureArchitectureQuestions } from './azureArchitecture';
import { managementGovernanceQuestions } from './managementGovernance';
import { MIXED_TOPIC_ID } from '@/data/topics';

export const QUESTIONS = [
  ...cloudConceptsQuestions,
  ...azureArchitectureQuestions,
  ...managementGovernanceQuestions,
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

const questionsById = new Map(
  QUESTIONS.map((question) => [question.id, question])
);

export function getQuestionById(id) {
  return questionsById.get(id) || null;
}

export function getQuestionsByTopic(topicId) {
  if (topicId === MIXED_TOPIC_ID) return QUESTIONS;
  return QUESTIONS.filter((question) => question.topic === topicId);
}

export function countQuestionsByTopic() {
  return QUESTIONS.reduce((acc, question) => {
    acc[question.topic] = (acc[question.topic] || 0) + 1;
    return acc;
  }, {});
}
