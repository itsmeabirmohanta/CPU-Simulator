import { LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Terminal, Download, Filter } from "lucide-react";

interface ExecutionLogProps {
  logs: LogEntry[];
}

export default function ExecutionLog({ logs }: ExecutionLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  const filteredLogs = filter
    ? logs.filter(l => l.instruction.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  const handleExport = () => {
    const text = logs.map((l, i) =>
      `Step ${String(i + 1).padStart(2, "0")}: ${l.instruction}${l.changes.length > 0 ? ` [${l.changes.join(", ")}]` : ""}`
    ).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "execution-trace.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Execution Trace</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center gap-1 rounded-md bg-muted/50 px-1.5 py-0.5">
            <Filter className="h-2.5 w-2.5 text-muted-foreground/50" />
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter..."
              className="bg-transparent text-[9px] font-mono w-12 focus:outline-none text-foreground placeholder:text-muted-foreground/30"
            />
          </div>
          {/* Export */}
          {logs.length > 0 && (
            <button
              onClick={handleExport}
              className="p-1 rounded hover:bg-muted/50 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              title="Export trace as text"
            >
              <Download className="h-3 w-3" />
            </button>
          )}
          <span className="text-[10px] font-mono text-muted-foreground">{logs.length} steps</span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground/40">
            {logs.length === 0 ? "Execute instructions to see trace output" : "No matching instructions"}
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            <AnimatePresence>
              {filteredLogs.map((log, i) => {
                const originalIndex = logs.indexOf(log);
                return (
                  <motion.div
                    key={originalIndex}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.15 }}
                    className="px-4 py-2 font-mono text-[11px] flex items-start gap-3"
                  >
                    <span className="text-muted-foreground/30 shrink-0 w-5 text-right tabular-nums">{String(originalIndex + 1).padStart(2, "0")}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-foreground font-medium">{log.instruction}</span>
                      {log.changes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {log.changes.map((c, j) => (
                            <span key={j} className="text-[10px] text-primary/70 bg-primary/5 rounded-md px-1.5 py-0.5">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
