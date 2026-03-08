import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface ExplanationPanelProps {
  currentLog: LogEntry | null;
}

export default function ExplanationPanel({ currentLog }: ExplanationPanelProps) {
  return (
    <div className="panel">
      <div className="panel-header">🔍 Instruction Breakdown</div>
      <div className="p-4 min-h-[100px]">
        <AnimatePresence mode="wait">
          {currentLog ? (
            <motion.div
              key={currentLog.explanation}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Phase pipeline */}
              <div className="flex items-center gap-2">
                <PhaseChip label="1. FETCH" color="primary" icon="📥" />
                <motion.span
                  className="text-muted-foreground"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
                <PhaseChip label="2. DECODE" color="warning" icon="🔍" />
                <motion.span
                  className="text-muted-foreground"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                >
                  →
                </motion.span>
                <PhaseChip label="3. EXECUTE" color="success" icon="⚡" />
              </div>

              {/* Explanation text */}
              <div className="rounded-lg bg-muted/30 border p-3">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {currentLog.explanation}
                </p>
              </div>

              {/* Changes summary */}
              {currentLog.changes.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Changes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentLog.changes.map((c, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.1 }}
                        className="inline-flex items-center rounded-full border bg-accent/10 text-accent-foreground px-2.5 py-1 text-[11px] font-mono"
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-4 text-center"
            >
              <span className="text-2xl mb-2">🔬</span>
              <p className="text-sm text-muted-foreground">
                Execute an instruction to see a detailed<br />fetch → decode → execute breakdown.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhaseChip({ label, color, icon }: { label: string; color: string; icon: string }) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    success: "bg-success/10 text-success border-success/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${colorClasses[color]}`}>
      <span>{icon}</span> {label}
    </span>
  );
}
