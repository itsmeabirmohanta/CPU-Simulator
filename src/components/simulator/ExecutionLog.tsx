import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface ExecutionLogProps {
  logs: LogEntry[];
}

export default function ExecutionLog({ logs }: ExecutionLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  return (
    <div className="sim-panel">
      <div className="sim-panel-header">
        <span className="sim-panel-title">Trace</span>
        <span className="text-[10px] font-mono text-muted-foreground">{logs.length} steps</span>
      </div>
      <div ref={scrollRef} className="max-h-[200px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground/60">
            Execute instructions to see trace output
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.15 }}
                  className="px-3 py-1.5 font-mono text-[11px] flex items-start gap-2"
                >
                  <span className="text-muted-foreground/50 shrink-0 w-5 text-right">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground font-medium">{log.instruction}</span>
                    {log.changes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {log.changes.map((c, j) => (
                          <span key={j} className="text-[10px] text-primary/80">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
