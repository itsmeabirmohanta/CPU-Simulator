import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Video, Clock,
  Cpu, Layers, PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import VideoEmbed from "@/components/learn/VideoEmbed";
import LessonCard from "@/components/learn/LessonCard";
import ProgressTracker, {
  getModuleProgress,
  markLessonComplete,
  resetModuleProgress,
} from "@/components/learn/LessonProgress";
import { modules, getModuleById, difficultyConfig } from "@/lib/curriculum";
import { useState, useCallback } from "react";

export default function LearnModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = getModuleById(moduleId || "");

  const [completed, setCompleted] = useState<string[]>(() =>
    getModuleProgress(moduleId || "")
  );

  const handleComplete = useCallback(
    (lessonId: string) => {
      if (!moduleId) return;
      markLessonComplete(moduleId, lessonId);
      setCompleted(getModuleProgress(moduleId));
    },
    [moduleId]
  );

  const handleReset = useCallback(() => {
    if (!moduleId) return;
    resetModuleProgress(moduleId);
    setCompleted([]);
  }, [moduleId]);

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Module Not Found</h1>
          <Button asChild>
            <Link to="/learn">Back to Curriculum</Link>
          </Button>
        </div>
      </div>
    );
  }

  const dc = difficultyConfig[module.difficulty];
  const Icon = module.icon;
  const currentIndex = modules.findIndex((m) => m.id === module.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  const allComplete = completed.length === module.lessons.length && module.lessons.length > 0;
  const totalMinutes = module.lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0);
  const interactiveLessons = module.lessons.filter((l) => l.code).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(var(--accent)/0.08),transparent)]" />

        <div className="relative container mx-auto px-4 pt-8 pb-12 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Back link */}
            <Link
              to="/learn"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 group"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
              Back to Curriculum
            </Link>

            <div className="flex items-start gap-5">
              {/* Icon */}
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${
                allComplete ? "bg-accent/15" : "bg-primary/10"
              }`}>
                {allComplete ? (
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                ) : (
                  <Icon className="h-8 w-8 text-primary" />
                )}
              </div>

              {/* Title block */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Module {module.number}
                  </span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${dc.color}`}>
                    {module.difficulty}
                  </Badge>
                  {allComplete && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/20">
                      ✓ Complete
                    </Badge>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {module.title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {module.description}
                </p>

                {/* Stat chips */}
                <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                    <Layers className="h-3 w-3" /> {module.lessons.length} lessons
                  </span>
                  {module.videos.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                      <Video className="h-3 w-3" /> {module.videos.length} video{module.videos.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {interactiveLessons > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                      <Cpu className="h-3 w-3" /> {interactiveLessons} interactive
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
                    <Clock className="h-3 w-3" /> ~{totalMinutes} min
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ────────────────────────────────── */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Progress */}
        <div className="mb-12">
          <ProgressTracker
            totalLessons={module.lessons.length}
            completedCount={completed.length}
            onReset={handleReset}
            label={`Module ${module.number} Progress`}
          />
        </div>

        {/* ── Videos Section ──────────────────────── */}
        {module.videos.length > 0 && (
          <section className="mb-14">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
                  <BookOpen className="h-5.5 w-5.5 text-primary" /> Watch & Learn
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Watch these videos before diving into the lessons
                </p>
              </div>
              <span className="hidden md:block text-xs text-muted-foreground font-mono">
                {module.videos.length} video{module.videos.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className={`grid gap-5 ${
              module.videos.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-3xl"
            }`}>
              {module.videos.map((video) => (
                <VideoEmbed key={video.youtubeId} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* ── Lessons Section ─────────────────────── */}
        <section className="mb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold">Lessons</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Work through each lesson in order — expand to read theory and try the simulator
              </p>
            </div>
            <span className="hidden md:block text-xs text-muted-foreground font-mono">
              {completed.length}/{module.lessons.length} completed
            </span>
          </div>
          <div className="space-y-4">
            {module.lessons.map((lesson, i) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={i}
                isCompleted={completed.includes(lesson.id)}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </section>

        {/* ── Completion Banner ───────────────────── */}
        {allComplete && (
          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-14 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center"
          >
            <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold mb-2">Module Complete! 🎉</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              You've finished all {module.lessons.length} lessons in this module.
              {nextModule ? " Continue to the next module to keep learning." : " You've completed the entire curriculum!"}
            </p>
            {nextModule && (
              <Button asChild className="rounded-full gap-2 px-6">
                <Link to={`/learn/${nextModule.id}`}>
                  Next: {nextModule.title} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </motion.section>
        )}

        {/* ── Module Navigation ───────────────────── */}
        <nav className="grid grid-cols-2 gap-4 pt-8 border-t">
          {prevModule ? (
            <Link
              to={`/learn/${prevModule.id}`}
              className="group flex items-center gap-3 p-4 rounded-xl border bg-card/50 hover:bg-card/80 hover:shadow-md transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Previous Module</div>
                <div className="text-sm font-semibold truncate">{prevModule.title}</div>
              </div>
            </Link>
          ) : (
            <Link
              to="/learn"
              className="group flex items-center gap-3 p-4 rounded-xl border bg-card/50 hover:bg-card/80 hover:shadow-md transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Back</div>
                <div className="text-sm font-semibold">Course Overview</div>
              </div>
            </Link>
          )}
          {nextModule ? (
            <Link
              to={`/learn/${nextModule.id}`}
              className="group flex items-center justify-end gap-3 p-4 rounded-xl border bg-card/50 hover:bg-card/80 hover:shadow-md transition-all text-right"
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Next Module</div>
                <div className="text-sm font-semibold truncate">{nextModule.title}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          ) : (
            <Link
              to="/learn"
              className="group flex items-center justify-end gap-3 p-4 rounded-xl border bg-card/50 hover:bg-card/80 hover:shadow-md transition-all text-right"
            >
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Complete</div>
                <div className="text-sm font-semibold">Back to Curriculum</div>
              </div>
              <PlayCircle className="h-5 w-5 text-accent shrink-0" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
