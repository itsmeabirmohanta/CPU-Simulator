import { useState } from "react";
import { ChevronDown, Rocket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import MiniSimulator from "@/components/learn/MiniSimulator";
import { difficultyConfig, type Lesson } from "@/lib/curriculum";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  isCompleted: boolean;
  onComplete: (id: string) => void;
}

export default function LessonCard({ lesson, index, isCompleted, onComplete }: LessonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const Icon = lesson.icon;
  const dc = difficultyConfig[lesson.difficulty];

  const handleTryInSimulator = () => {
    if (!lesson.code) return;
    const encoded = encodeURIComponent(lesson.code);
    navigate(`/simulator?mode=${lesson.advanced ? "advanced" : "beginner"}&code=${encoded}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={`relative rounded-2xl border bg-card/50 overflow-hidden transition-shadow border-l-4 ${dc.border} ${
        expanded ? "shadow-lg shadow-primary/5" : "hover:shadow-md hover:shadow-primary/5"
      }`}
    >
      {/* Faded number */}
      <div className="absolute top-3 right-5 font-display text-5xl font-black text-foreground/[0.03] select-none pointer-events-none">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4 group relative"
      >
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted ? "bg-accent/15" : "bg-primary/10"
        }`}>
          {isCompleted ? (
            <Rocket className="h-4 w-4 text-accent" />
          ) : (
            <Icon className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display font-bold text-sm">{lesson.title}</h3>
            {isCompleted && (
              <Badge className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/20">
                ✓ Done
              </Badge>
            )}
            {lesson.code && (
              <span className="text-[9px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                interactive
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{lesson.description}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {lesson.concepts.slice(0, 4).map((c) => (
              <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                {c}
              </span>
            ))}
            {lesson.concepts.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{lesson.concepts.length - 4}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">
            ~{lesson.estimatedMinutes}min
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`} />
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t pt-4">
              {/* Theory */}
              <div className="rounded-xl bg-muted/30 border p-4">
                <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Theory
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{lesson.theory}</p>
              </div>

              {/* Mini Simulator */}
              {lesson.code && (
                <div>
                  <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Try it — step through the code
                  </h4>
                  <MiniSimulator code={lesson.code} advanced={lesson.advanced} />
                </div>
              )}

              {/* Challenge */}
              {lesson.challenge && (
                <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/15 p-4">
                  <h4 className="font-display text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1.5">
                    🧩 Challenge
                  </h4>
                  <p className="text-sm text-foreground/70">{lesson.challenge}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                {lesson.code && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-1.5 text-xs"
                    onClick={handleTryInSimulator}
                  >
                    <ExternalLink className="h-3 w-3" /> Open in Simulator
                  </Button>
                )}
                {!isCompleted && (
                  <Button
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => onComplete(lesson.id)}
                  >
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
