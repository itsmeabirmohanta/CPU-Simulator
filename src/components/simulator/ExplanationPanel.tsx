import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ExplanationPanelProps {
  currentLog: LogEntry | null;
}

export default function ExplanationPanel({ currentLog }: ExplanationPanelProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Explanation</span>
        {currentLog && (
          <div className="flex items-center gap-1">
            <PhaseDot label="F" active />
            <span className="text-muted-foreground/30 text-[8px]">→</span>
            <PhaseDot label="D" active />
            <span className="text-muted-foreground/30 text-[8px]">→</span>
            <PhaseDot label="E" active />
          </div>
        )}
      </div>
      <div className="p-4 min-h-[60px]">
        <AnimatePresence mode="wait">
          {currentLog ? (
            <motion.div
              key={currentLog.explanation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              <p className="text-[12px] text-foreground/90 leading-relaxed whitespace-pre-line font-mono">
                {currentLog.explanation}
              </p>
              {currentLog.changes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {currentLog.changes.map((c, j) => (
                    <span key={j} className="inline-block rounded-lg bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-mono font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground/50">
              <Lightbulb className="h-3.5 w-3.5" />
              <p className="text-[11px]">Step through code to see instruction explanations</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhaseDot({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center h-4.5 w-4.5 rounded-full text-[8px] font-bold font-mono ${
      active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/40"
    }`}>
      {label}
    </span>
  );
}
