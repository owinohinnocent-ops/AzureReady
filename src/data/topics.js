

export const QUESTIONS_PER_TOPIC = 30;

export const TOPICS = [
  {
    id: 'cloud-concepts',
    code: 'A',
    name: 'Describe cloud concepts',
    shortName: 'Cloud concepts',
    summary: 'Cloud computing, deployment and service models, the shared responsibility model, and the benefits of moving to the cloud.',
    accent: 'from-blue-600 to-sky-400',
    soft: 'bg-blue-50 text-blue-700 ring-blue-100',
  },
  {
    id: 'architecture-services',
    code: 'B',
    name: 'Describe Azure architecture and services',
    shortName: 'Architecture & services',
    summary: 'Regions, availability zones, the resource hierarchy, compute, networking, storage, databases and identities.',
    accent: 'from-cyan-600 to-teal-400',
    soft: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  },
  {
    id: 'management-governance',
    code: 'C',
    name: 'Describe Azure management and governance',
    shortName: 'Management & governance',
    summary: 'Governance controls, cost management, monitoring, security posture, compliance, and deployment tools.',
    accent: 'from-indigo-600 to-violet-400',
    soft: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  },
];

export const MIXED_TOPIC_ID = 'mixed';

export const MIXED_TOPIC = {
  id: 'mixed',
  code: 'M',
  name: 'Mixed quiz',
  shortName: 'Mixed',
  summary: 'Questions drawn at random from all three topics — the best way to check your overall readiness.',
  accent: 'from-slate-800 to-slate-500',
  soft: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export const TOPIC_BY_ID = TOPICS.reduce((acc, topic) => {
  acc[topic.id] = topic;
  return acc;
}, {});

export function getTopicName(topicId) {
  if (topicId === 'mixed') return MIXED_TOPIC.name;
  return TOPIC_BY_ID[topicId]?.name || 'Practice quiz';
}

export function getTopicShortName(topicId) {
  if (topicId === 'mixed') return MIXED_TOPIC.shortName;
  return TOPIC_BY_ID[topicId]?.shortName || 'Practice';
}

export const QUIZ_LENGTHS = [10, 20, 30];
