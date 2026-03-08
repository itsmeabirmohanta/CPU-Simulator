import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ProgressTracker, {
  getOverallProgress,
  resetProgress,
} from "@/components/learn/LessonProgress";
import {
  BookOpen, Cpu, Rocket, HelpCircle, ArrowRight, GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { modules, getTotalLessonCount, getModuleById } from "@/lib/curriculum";
import { getModuleProgress } from "@/components/learn/LessonProgress";
import ModuleCard from "@/components/learn/ModuleCard";
import GuidedWalkthrough, { useWalkthrough } from "@/components/learn/GuidedWalkthrough";

export default function LearnPage() {
  const [overallProgress, setOverallProgress] = useState(getOverallProgress);
  const { showWalkthrough, dismissWalkthrough, restartWalkthrough } = useWalkthrough();

  const handleReset = useCallback(() => {
    resetProgress();
    setOverallProgress({ completed: 0, total: getTotalLessonCount() });
  }, []);

  const totalLessons = getTotalLessonCount();
  const pct = totalLessons > 0 ? Math.round((overallProgress.completed / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GuidedWalkthrough active={showWalkthrough} onDismiss={dismissWalkthrough} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/4 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,hsl(var(--accent)/0.08),transparent)]" />

        <div className="relative container mx-auto px-4 py-12 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">CPU Architecture Curriculum</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  A comprehensive course — from binary basics to modern CPU design
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{modules.length}</strong> modules
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{totalLessons}</strong> lessons
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{overallProgress.completed}</strong> completed
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{pct}%</strong> progress
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <Button asChild className="rounded-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-5">
                <Link to="/simulator?mode=beginner">
                  <Cpu className="h-4 w-4" /> Open Simulator
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full gap-2 px-5">
                <Link to="/simulator?mode=advanced">
                  <Rocket className="h-4 w-4" /> Advanced Lab
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 text-xs text-muted-foreground ml-auto"
                onClick={restartWalkthrough}
              >
                <HelpCircle className="h-3.5 w-3.5" /> Tour
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Overall Progress */}
        <div className="mb-10" data-tour="progress">
          <ProgressTracker
            totalLessons={totalLessons}
            completedCount={overallProgress.completed}
            onReset={handleReset}
            label="Overall Course Progress"
          />
        </div>

        {/* Module Grid */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Course Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                completedCount={getModuleProgress(mod.id).length}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* Learning Path */}
        <section className="mt-16 mb-8">
          <h2 className="font-display text-2xl font-bold mb-6">Recommended Learning Path</h2>
          <div className="flex flex-wrap items-center gap-3">
            {modules.map((mod, i) => {
              const modCompleted = getModuleProgress(mod.id).length === mod.lessons.length && mod.lessons.length > 0;
              return (
                <div key={mod.id} className="flex items-center gap-3">
                  <Link
                    to={`/learn/${mod.id}`}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-md ${
                      modCompleted
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "bg-card/50 border-border hover:border-primary/30 text-foreground"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground">{mod.number}</span>
                    <span className="hidden sm:inline">{mod.title}</span>
                    <span className="sm:hidden">{mod.title.split(" ").slice(0, 2).join(" ")}</span>
                  </Link>
                  {i < modules.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-8 text-center">
          <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold mb-2">Ready to start learning?</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Begin with Module 1 and work through each module in order, or jump to any topic that interests you.
          </p>
          <Button asChild className="rounded-full gap-2 px-6">
            <Link to="/learn/foundations">
              Start Module 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
