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
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Execution Trace</span>
        <span className="text-[10px] font-mono text-muted-foreground">{logs.length} steps</span>
      </div>
      <div ref={scrollRef} className="max-h-[200px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground/60">
            Execute instructions to see trace output
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.15 }}
                  className="px-3.5 py-2 font-mono text-[11px] flex items-start gap-2.5"
                >
                  <span className="text-muted-foreground/40 shrink-0 w-5 text-right tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground font-medium">{log.instruction}</span>
                    {log.changes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {log.changes.map((c, j) => (
                          <span key={j} className="text-[10px] text-primary/80 bg-primary/5 rounded px-1.5 py-0.5">{c}</span>
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
