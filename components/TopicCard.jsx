
import { BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TopicCard({ topic, progress, onPractice }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-heading text-lg font-bold text-slate-900">
        {topic.name}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {topic.summary}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <BookOpen className="h-4 w-4" />
        <span>{progress?.total ?? 30} questions</span>
      </div>

      <Button className="mt-5 w-full" onClick={onPractice}>
        <Play className="mr-2 h-4 w-4" />
        Practice this topic
      </Button>
    </div>
  );
}
