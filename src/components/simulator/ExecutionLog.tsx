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
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <span>📜 Execution Trace</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground normal-case tracking-normal">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {logs.length} steps
        </span>
      </div>
      <div ref={scrollRef} className="max-h-[280px] overflow-y-auto p-3 space-y-1.5">
        {logs.length === 0 && (
          <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
            <span className="text-2xl mb-2">📝</span>
            <p className="text-xs">No execution steps yet.<br />Load a program and click Step or Run.</p>
          </div>
        )}
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border bg-muted/20 p-2.5 text-xs font-mono space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-primary/15 text-primary text-[10px] font-bold px-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-foreground">{log.instruction}</span>
              </div>
              {log.changes.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-7">
                  {log.changes.map((c, j) => (
                    <span key={j} className="inline-block rounded-md bg-accent/10 border border-accent/20 text-accent-foreground px-1.5 py-0.5 text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
