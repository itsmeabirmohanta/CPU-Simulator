import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, PlayCircle, Video, BookOpen } from "lucide-react";
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
  const hasStarted = completedCount > 0;
  const dc = difficultyConfig[module.difficulty];
  const Icon = module.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="h-full"
    >
      <Link
        to={`/learn/${module.id}`}
        className={`flex flex-col h-full group relative rounded-2xl border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 ${
          isComplete ? "border-accent/30" : hasStarted ? "border-primary/20" : "border-border"
        }`}
      >
        {/* Top accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${
          isComplete ? "from-accent to-accent/60" :
          module.difficulty === "beginner" ? "from-accent/60 to-accent/20" :
          module.difficulty === "intermediate" ? "from-yellow-500/60 to-yellow-500/20" :
          "from-primary/60 to-primary/20"
        }`} />

        {/* Background module number */}
        <div className="absolute top-8 right-4 font-display text-8xl font-black text-foreground/[0.025] select-none pointer-events-none leading-none">
          {module.number}
        </div>

        <div className="flex flex-col flex-1 p-5 relative">
          {/* Header */}
          <div className="flex items-start gap-3.5 mb-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isComplete ? "bg-accent/15" : "bg-primary/10 group-hover:bg-primary/15"
            }`}>
              {isComplete ? (
                <CheckCircle2 className="h-5.5 w-5.5 text-accent" />
              ) : (
                <Icon className="h-5.5 w-5.5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Module {module.number}
                </span>
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${dc.color}`}>
                  {module.difficulty}
                </Badge>
              </div>
              <h3 className="font-display font-bold text-base leading-snug">
                {module.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
            {module.description}
          </p>

          {/* Meta chips */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <BookOpen className="h-3 w-3" /> {totalLessons} lessons
            </span>
            {module.videos.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                <Video className="h-3 w-3" /> {module.videos.length} video{module.videos.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground font-medium">
                {completedCount}/{totalLessons} completed
              </span>
              <span className="font-mono text-muted-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>

          {/* Footer action */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            {module.prerequisites.length > 0 ? (
              <span className="text-[9px] text-muted-foreground/70 truncate max-w-[60%]">
                Requires: {module.prerequisites.join(", ")}
              </span>
            ) : (
              <span className="text-[9px] text-muted-foreground/70">No prerequisites</span>
            )}
            <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
              {completedCount > 0 && !isComplete ? (
                <>Continue <ArrowRight className="h-3 w-3" /></>
              ) : isComplete ? (
                <>Review <ArrowRight className="h-3 w-3" /></>
              ) : (
                <>Start <PlayCircle className="h-3 w-3" /></>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
