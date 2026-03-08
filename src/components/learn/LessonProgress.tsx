import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { modules } from "@/lib/curriculum";

const STORAGE_PREFIX = "cpuverse-progress-";
const LEGACY_KEY = "cpuverse-learn-progress";

export interface LessonMeta {
  id: string;
  title: string;
}

/* ── Per-module progress ─────────────────────────────── */

export function getModuleProgress(moduleId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${moduleId}`) || "[]");
  } catch {
    return [];
  }
}

export function markLessonComplete(moduleId: string, lessonId: string) {
  const completed = getModuleProgress(moduleId);
  if (!completed.includes(lessonId)) {
    localStorage.setItem(`${STORAGE_PREFIX}${moduleId}`, JSON.stringify([...completed, lessonId]));
  }
  // Also write to legacy key for backward compat
  const legacy = getCompletedLessons();
  if (!legacy.includes(lessonId)) {
    localStorage.setItem(LEGACY_KEY, JSON.stringify([...legacy, lessonId]));
  }
}

/* ── Global progress ─────────────────────────────────── */

export function getCompletedLessons(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getOverallProgress(): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  for (const mod of modules) {
    const modCompleted = getModuleProgress(mod.id);
    completed += modCompleted.length;
    total += mod.lessons.length;
  }
  return { completed, total };
}

export function resetProgress() {
  localStorage.removeItem(LEGACY_KEY);
  for (const mod of modules) {
    localStorage.removeItem(`${STORAGE_PREFIX}${mod.id}`);
  }
}

export function resetModuleProgress(moduleId: string) {
  localStorage.removeItem(`${STORAGE_PREFIX}${moduleId}`);
}

/* ── UI Component ────────────────────────────────────── */

interface ProgressTrackerProps {
  totalLessons: number;
  completedCount: number;
  onReset: () => void;
  label?: string;
}

export default function ProgressTracker({ totalLessons, completedCount, onReset, label = "Your Progress" }: ProgressTrackerProps) {
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span className="font-display text-sm font-semibold">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {completedCount}/{totalLessons} lessons
        </span>
      </div>
      <Progress value={pct} className="h-2" />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{pct}% complete</span>
        {completedCount > 0 && (
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
