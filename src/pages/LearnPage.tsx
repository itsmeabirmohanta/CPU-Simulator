import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ProgressTracker, {
  getOverallProgress,
  resetProgress,
} from "@/components/learn/LessonProgress";
import {
  BookOpen, Cpu, Rocket, HelpCircle, ArrowRight, GraduationCap,
  Clock, Video, Layers, CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { modules, getTotalLessonCount } from "@/lib/curriculum";
import { getModuleProgress } from "@/components/learn/LessonProgress";
import ModuleCard from "@/components/learn/ModuleCard";
import GuidedWalkthrough, { useWalkthrough } from "@/components/learn/GuidedWalkthrough";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: EASE } }),
};

export default function LearnPage() {
  const [overallProgress, setOverallProgress] = useState(getOverallProgress);
  const { showWalkthrough, dismissWalkthrough, restartWalkthrough } = useWalkthrough();

  const handleReset = useCallback(() => {
    resetProgress();
    setOverallProgress({ completed: 0, total: getTotalLessonCount() });
  }, []);

  const totalLessons = getTotalLessonCount();
  const totalVideos = modules.reduce((acc, m) => acc + m.videos.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GuidedWalkthrough active={showWalkthrough} onDismiss={dismissWalkthrough} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(var(--accent)/0.1),transparent)]" />

        <div className="relative container mx-auto px-4 pt-14 pb-16 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-5"
              >
                <GraduationCap className="h-7 w-7 text-primary" />
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
                CPU Architecture Curriculum
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                A comprehensive, university-level course — from binary basics to modern processor design.
                Learn by reading, watching, and building.
              </p>
            </div>

            {/* Stat chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="flex items-center justify-center gap-3 md:gap-4 flex-wrap mb-8"
              data-tour="stats"
            >
              {[
                { icon: Layers, label: `${modules.length} Modules`, color: "bg-primary/10 text-primary" },
                { icon: BookOpen, label: `${totalLessons} Lessons`, color: "bg-accent/10 text-accent" },
                { icon: Video, label: `${totalVideos} Videos`, color: "bg-muted text-muted-foreground" },
                { icon: Clock, label: `~${Math.round(totalLessons * 9)} min`, color: "bg-muted text-muted-foreground" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.3 }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium ${stat.color}`}
                >
                  <stat.icon className="h-3.5 w-3.5" />
                  {stat.label}
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" className="rounded-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6">
                  <Link to="/learn/foundations">
                    <Rocket className="h-4 w-4" /> Start Learning
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" variant="outline" className="rounded-full gap-2 px-6" data-tour="open-sim">
                  <Link to="/simulator?mode=beginner">
                    <Cpu className="h-4 w-4" /> Open Simulator
                  </Link>
                </Button>
              </motion.div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={restartWalkthrough}
              >
                <HelpCircle className="h-3.5 w-3.5" /> Tour
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
          data-tour="progress"
        >
          <ProgressTracker
            totalLessons={totalLessons}
            completedCount={overallProgress.completed}
            onReset={handleReset}
            label="Overall Course Progress"
          />
        </motion.div>

        {/* ── Module Grid ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Course Modules</h2>
              <p className="text-sm text-muted-foreground mt-1">Follow the recommended path or jump to any module</p>
            </div>
            <span className="hidden md:block text-xs text-muted-foreground font-mono">
              {overallProgress.completed}/{totalLessons} completed
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                data-tour={i === 0 ? "module-0" : undefined}
              >
                <ModuleCard
                  module={mod}
                  completedCount={getModuleProgress(mod.id).length}
                  index={i}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Learning Path ── */}
        <section className="mt-20" data-tour="learning-path">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Recommended Learning Path</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Each module builds on the previous — follow this path for the best experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {modules.map((mod, i) => {
              const modProgress = getModuleProgress(mod.id);
              const modComplete = modProgress.length === mod.lessons.length && mod.lessons.length > 0;
              const modStarted = modProgress.length > 0;
              const Icon = mod.icon;

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    to={`/learn/${mod.id}`}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all hover:shadow-md group ${
                      modComplete
                        ? "bg-accent/5 border-accent/30"
                        : modStarted
                          ? "bg-primary/5 border-primary/20"
                          : "bg-card/50 border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                      modComplete ? "bg-accent/15" : "bg-primary/10 group-hover:bg-primary/15"
                    }`}>
                      <Icon className={`h-5 w-5 ${modComplete ? "text-accent" : "text-primary"}`} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground mb-0.5">Module {mod.number}</span>
                    <span className="text-xs font-semibold leading-tight">
                      {mod.title.length > 20 ? mod.title.split(" ").slice(0, 3).join(" ") : mod.title}
                    </span>
                    {modComplete && (
                      <span className="text-[9px] text-accent font-medium mt-1.5 flex items-center gap-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Complete
                      </span>
                    )}
                    {modStarted && !modComplete && (
                      <span className="text-[9px] text-primary font-medium mt-1.5">{modProgress.length}/{mod.lessons.length}</span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-20 mb-8 relative overflow-hidden rounded-3xl border group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-accent/6 to-primary/8" />
          <div className="relative px-8 py-12 md:py-14 text-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <BookOpen className="h-10 w-10 text-primary mx-auto" />
            </motion.div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">Ready to master CPU architecture?</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              Start from the foundations and build your way up to advanced topics.
              Every lesson includes interactive simulations you can experiment with.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" className="rounded-full gap-2 px-8">
                  <Link to="/learn/foundations">
                    Begin Module 1 <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" variant="outline" className="rounded-full gap-2 px-6">
                  <Link to="/simulator?mode=advanced">
                    <Rocket className="h-4 w-4" /> Advanced Lab
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
