import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import type { Module } from "@/lib/curriculum";
import { difficultyConfig } from "@/lib/curriculum";

interface ModuleCardProps {
  module: Module;
  completedCount: number;
  index: number;
}

export default function ModuleCard({ module, completedCount, index }: ModuleCardProps) {
  const totalLessons = module.lessons.length;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isComplete = completedCount === totalLessons && totalLessons > 0;
  const dc = difficultyConfig[module.difficulty];
  const Icon = module.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link
        to={`/learn/${module.id}`}
        className={`block group relative rounded-2xl border bg-card/50 overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 border-l-4 ${dc.border}`}
      >
        {/* Background module number */}
        <div className="absolute top-4 right-5 font-display text-7xl font-black text-foreground/[0.03] select-none pointer-events-none">
          {String(module.number).padStart(2, "0")}
        </div>

        <div className="p-6 relative">
          <div className="flex items-start gap-4 mb-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
              isComplete ? "bg-accent/15" : "bg-primary/10"
            }`}>
              {isComplete ? (
                <CheckCircle2 className="h-6 w-6 text-accent" />
              ) : (
                <Icon className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Module {module.number}
                </span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${dc.color}`}>
                  {module.difficulty}
                </Badge>
              </div>
              <h3 className="font-display font-bold text-lg leading-tight">
                {module.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
            {module.description}
          </p>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {completedCount}/{totalLessons} lessons
              </span>
              <span className="font-mono text-muted-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{module.videos.length} video{module.videos.length !== 1 ? "s" : ""}</span>
              <span>•</span>
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
              {completedCount > 0 && !isComplete ? (
                <>Continue <ArrowRight className="h-3.5 w-3.5" /></>
              ) : isComplete ? (
                <>Review <ArrowRight className="h-3.5 w-3.5" /></>
              ) : (
                <>Start <PlayCircle className="h-3.5 w-3.5" /></>
              )}
            </div>
          </div>

          {/* Prerequisites */}
          {module.prerequisites.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-[10px] text-muted-foreground">
                Requires: {module.prerequisites.join(", ")}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
