import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface ExplanationPanelProps {
  currentLog: LogEntry | null;
}

export default function ExplanationPanel({ currentLog }: ExplanationPanelProps) {
  return (
    <div className="sim-panel">
      <div className="sim-panel-header">
        <span className="sim-panel-title">Explanation</span>
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
      <div className="p-3 min-h-[60px]">
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
              <p className="text-[12px] text-foreground/90 leading-relaxed whitespace-pre-line font-mono">
                {currentLog.explanation}
              </p>
              {currentLog.changes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {currentLog.changes.map((c, j) => (
                    <span key={j} className="inline-block rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <p className="text-[11px] text-muted-foreground/50 text-center">
              Step through code to see instruction explanations
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhaseDot({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-[8px] font-bold font-mono ${
      active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/40"
    }`}>
      {label}
    </span>
  );
}
