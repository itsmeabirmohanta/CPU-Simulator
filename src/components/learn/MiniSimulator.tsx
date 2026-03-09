import { useState, useCallback } from "react";
import { createInitialState, createMemory, parseProgram, executeStep, resetStack } from "@/lib/cpu";
import type { CpuState, MemoryCell, LogEntry } from "@/lib/cpu";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, StepForward, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MiniSimulatorProps {
  code: string;
  advanced?: boolean;
}

export default function MiniSimulator({ code, advanced = false }: MiniSimulatorProps) {
  const [state, setState] = useState<CpuState>(createInitialState());
  const [memory, setMemory] = useState<MemoryCell[]>(() => {
    const { memory: mem } = parseProgram(code, advanced);
    return mem;
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    resetStack();
    const { memory: mem } = parseProgram(code, advanced);
    setState(createInitialState());
    setMemory(mem);
    setLogs([]);
    setLoaded(true);
  }, [code, advanced]);

  const step = useCallback(() => {
    if (state.status === "halted" || state.status === "error") return;
    const s = { ...state, status: "running" as const };
    const result = executeStep(s, memory.map(c => ({ ...c })), advanced);
    setState(result.state);
    setMemory(result.memory);
    setLogs(prev => [...prev, result.log]);
  }, [state, memory, advanced]);

  const reset = useCallback(() => {
    resetStack();
    const { memory: mem } = parseProgram(code, advanced);
    setState(createInitialState());
    setMemory(mem);
    setLogs([]);
    setLoaded(false);
  }, [code, advanced]);

  const isHalted = state.status === "halted" || state.status === "error";

  return (
    <div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden">
      {/* Code display */}
      <div className="bg-muted/30 px-4 py-3 border-b">
        <pre className="font-mono text-xs leading-relaxed text-muted-foreground overflow-x-auto">
          {code.split("\n").map((line, i) => {
            const addr = parseInt(line.split(":")[0]?.trim());
            const isActive = loaded && !isHalted && addr === state.programCounter;
            return (
              <div
                key={i}
                className={`px-2 rounded transition-colors ${
                  isActive ? "bg-primary/15 text-foreground font-medium" : ""
                }`}
              >
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Controls + State */}
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          {!loaded ? (
            <Button size="sm" onClick={load} className="gap-1.5 text-xs rounded-lg">
              <Play className="h-3 w-3" /> Load & Run
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={step}
                disabled={isHalted}
                className="gap-1.5 text-xs rounded-lg"
              >
                <StepForward className="h-3 w-3" /> Step
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={reset}
                className="gap-1.5 text-xs rounded-lg"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            </>
          )}
          {isHalted && (
            <span className="text-xs font-mono text-accent ml-auto">
              ✓ Program complete
            </span>
          )}
        </div>

        {/* Registers */}
        {loaded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-4 gap-2"
          >
            {[
              { label: "A", value: state.accumulator },
              { label: "B", value: state.registerB },
              { label: "C", value: state.registerC },
              { label: "PC", value: state.programCounter },
            ].map((r) => (
              <div
                key={r.label}
                className="rounded-lg bg-muted/50 px-2 py-1.5 text-center"
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {r.label}
                </div>
                <div className="font-mono text-sm font-bold text-foreground">
                  {r.value}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Log */}
        <AnimatePresence mode="popLayout">
          {logs.slice(-3).map((log, i) => (
            <motion.div
              key={log.step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono text-muted-foreground truncate"
            >
              <span className="text-primary/70">#{log.step}</span>{" "}
              {log.instruction} → {log.changes.join(", ")}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
