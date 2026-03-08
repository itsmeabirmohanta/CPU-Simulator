import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "cpuverse-learn-progress";

export interface LessonMeta {
  id: string;
  title: string;
}

export function getCompletedLessons(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function markLessonComplete(id: string) {
  const completed = getCompletedLessons();
  if (!completed.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed, id]));
  }
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

interface ProgressTrackerProps {
  lessons: LessonMeta[];
  completed: string[];
  onReset: () => void;
}

export default function ProgressTracker({ lessons, completed, onReset }: ProgressTrackerProps) {
  const pct = lessons.length > 0 ? Math.round((completed.length / lessons.length) * 100) : 0;

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span className="font-display text-sm font-semibold">Your Progress</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {completed.length}/{lessons.length} lessons
        </span>
      </div>
      <Progress value={pct} className="h-2" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{pct}% complete</span>
        {completed.length > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Reset progress
          </button>
        )}
      </div>
    </div>
  );
}
