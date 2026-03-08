import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ExplanationPanelProps {
  currentLog: LogEntry | null;
}

export default function ExplanationPanel({ currentLog }: ExplanationPanelProps) {
  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-3 w-3 text-warning" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Explanation</span>
        </div>
        {currentLog && (
          <div className="flex items-center gap-1">
            <PhaseDot label="F" active />
            <span className="text-muted-foreground/20 text-[7px]">→</span>
            <PhaseDot label="D" active />
            <span className="text-muted-foreground/20 text-[7px]">→</span>
            <PhaseDot label="E" active />
          </div>
        )}
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentLog ? (
            <motion.div
              key={currentLog.explanation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <p className="text-[11px] text-foreground/85 leading-relaxed whitespace-pre-line font-mono">
                {currentLog.explanation}
              </p>
              {currentLog.changes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {currentLog.changes.map((c, j) => (
                    <span key={j} className="inline-block rounded-md bg-primary/8 text-primary px-1.5 py-0.5 text-[9px] font-mono font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <p className="text-[10px] text-muted-foreground/40 text-center py-4">
              Step through code to see explanations
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhaseDot({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-[7px] font-bold font-mono ${
      active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/30"
    }`}>
      {label}
    </span>
  );
}
