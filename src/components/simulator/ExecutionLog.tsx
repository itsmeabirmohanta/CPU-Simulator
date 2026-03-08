import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <span>Execution Log</span>
        <span className="text-[10px] font-mono text-muted-foreground normal-case tracking-normal">{logs.length} steps</span>
      </div>
      <ScrollArea className="h-[250px]">
        <div ref={scrollRef} className="p-3 space-y-2">
          {logs.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-8">
              No execution steps yet. Load a program and click Step or Run.
            </div>
          )}
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-md border bg-muted/30 p-2 text-xs font-mono space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/15 text-primary text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-foreground">{log.instruction}</span>
                </div>
                {log.changes.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-7">
                    {log.changes.map((c, j) => (
                      <span key={j} className="inline-block rounded bg-accent/15 text-accent-foreground px-1.5 py-0.5 text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
