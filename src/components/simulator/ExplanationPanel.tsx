import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface ExplanationPanelProps {
  currentLog: LogEntry | null;
}

export default function ExplanationPanel({ currentLog }: ExplanationPanelProps) {
  return (
    <div className="panel">
      <div className="panel-header">Instruction Explanation</div>
      <div className="p-4 min-h-[80px]">
        <AnimatePresence mode="wait">
          {currentLog ? (
            <motion.div
              key={currentLog.explanation}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-primary/15 text-primary px-2.5 py-0.5 font-semibold uppercase tracking-wider">
                  Fetch
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-full bg-warning/15 text-warning px-2.5 py-0.5 font-semibold uppercase tracking-wider">
                  Decode
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded-full bg-success/15 text-success px-2.5 py-0.5 font-semibold uppercase tracking-wider">
                  Execute
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {currentLog.explanation}
              </p>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground text-center"
            >
              Execute an instruction to see a detailed explanation of the fetch → decode → execute cycle.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
