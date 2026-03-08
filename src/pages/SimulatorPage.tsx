import { useState, useCallback, useRef, useEffect } from "react";
import {
  CpuState,
  MemoryCell,
  LogEntry,
  createInitialState,
  createMemory,
  parseProgram,
  executeStep,
  resetStack,
  SAMPLE_PROGRAMS,
} from "@/lib/cpu";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/simulator/CodeEditor";
import CpuStatePanel from "@/components/simulator/CpuStatePanel";
import CpuDiagram from "@/components/simulator/CpuDiagram";
import MemoryViewer from "@/components/simulator/MemoryViewer";
import ExecutionLog from "@/components/simulator/ExecutionLog";
import ExecutionControls from "@/components/simulator/ExecutionControls";
import ExplanationPanel from "@/components/simulator/ExplanationPanel";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Zap } from "lucide-react";

export default function SimulatorPage() {
  const [code, setCode] = useState(SAMPLE_PROGRAMS.addition.code);
  const [cpuState, setCpuState] = useState<CpuState>(createInitialState());
  const [prevState, setPrevState] = useState<CpuState>(createInitialState());
  const [memory, setMemory] = useState<MemoryCell[]>(createMemory());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [hasProgram, setHasProgram] = useState(false);
  const [activeFlow, setActiveFlow] = useState<"fetch" | "decode" | "execute" | "idle">("idle");
  const [advanced, setAdvanced] = useState(false);
  const runTimerRef = useRef<number | null>(null);

  const memSize = advanced ? 64 : 32;

  const loadProgram = useCallback(() => {
    const { memory: parsedMem, errors } = parseProgram(code, advanced);
    if (errors.length > 0) {
      errors.forEach((e) => toast.error(e));
      return;
    }
    const initial = createInitialState();
    setCpuState(initial);
    setPrevState(initial);
    setMemory(parsedMem);
    setLogs([]);
    setHasProgram(true);
    setActiveFlow("idle");
    resetStack();
    toast.success("Program loaded successfully");
  }, [code, advanced]);

  const step = useCallback(() => {
    if (cpuState.status === "halted" || cpuState.status === "error") return;
    
    setActiveFlow("fetch");
    setTimeout(() => setActiveFlow("decode"), 150);
    setTimeout(() => setActiveFlow("execute"), 300);
    setTimeout(() => setActiveFlow("idle"), 600);

    setPrevState(cpuState);
    const result = executeStep(cpuState, memory, advanced);
    result.log.step = logs.length + 1;
    setCpuState(result.state);
    setMemory(result.memory);
    setLogs((prev) => [...prev, result.log]);

    if (result.state.status === "halted") {
      toast.success("Program halted successfully");
    } else if (result.state.status === "error") {
      toast.error(result.state.errorMessage || "Execution error");
    }
  }, [cpuState, memory, logs.length, advanced]);

  const run = useCallback(() => {
    setCpuState((s) => ({ ...s, status: "running" }));
  }, []);

  useEffect(() => {
    if (cpuState.status === "running") {
      runTimerRef.current = window.setInterval(() => {
        setCpuState((currentState) => {
          if (currentState.status !== "running") {
            if (runTimerRef.current) clearInterval(runTimerRef.current);
            return currentState;
          }
          return currentState;
        });
        step();
      }, 600);
      return () => {
        if (runTimerRef.current) clearInterval(runTimerRef.current);
      };
    }
  }, [cpuState.status, step]);

  const pause = useCallback(() => {
    if (runTimerRef.current) clearInterval(runTimerRef.current);
    setCpuState((s) => ({ ...s, status: s.status === "running" ? "paused" : s.status }));
    setActiveFlow("idle");
  }, []);

  const reset = useCallback(() => {
    if (runTimerRef.current) clearInterval(runTimerRef.current);
    const initial = createInitialState();
    setCpuState(initial);
    setPrevState(initial);
    setMemory(createMemory(memSize));
    setLogs([]);
    setHasProgram(false);
    setActiveFlow("idle");
    resetStack();
  }, [memSize]);

  const handleToggleAdvanced = useCallback((checked: boolean) => {
    setAdvanced(checked);
    // Reset everything when switching modes
    if (runTimerRef.current) clearInterval(runTimerRef.current);
    const initial = createInitialState();
    setCpuState(initial);
    setPrevState(initial);
    setMemory(createMemory(checked ? 64 : 32));
    setLogs([]);
    setHasProgram(false);
    setActiveFlow("idle");
    resetStack();
    setCode(checked ? SAMPLE_PROGRAMS.bitwiseOps.code : SAMPLE_PROGRAMS.addition.code);
    toast.info(checked ? "Advanced mode: 14 extra instructions + 64 memory cells" : "Basic mode: 10 core instructions + 32 memory cells");
  }, []);

  const currentLog = logs.length > 0 ? logs[logs.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Header with controls */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-display text-xl font-bold">Simulator</h1>
              <p className="text-xs text-muted-foreground">8-bit Accumulator-Based CPU</p>
            </div>
            {/* Advanced Mode Toggle */}
            <div className="flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1.5">
              <span className={`text-[11px] font-medium transition-colors ${!advanced ? "text-foreground" : "text-muted-foreground"}`}>Basic</span>
              <Switch
                checked={advanced}
                onCheckedChange={handleToggleAdvanced}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-[11px] font-medium flex items-center gap-1 transition-colors ${advanced ? "text-primary" : "text-muted-foreground"}`}>
                <Zap className="h-3 w-3" />
                Advanced
              </span>
            </div>
          </div>
          <ExecutionControls
            status={cpuState.status}
            onLoad={loadProgram}
            onStep={step}
            onRun={run}
            onPause={pause}
            onReset={reset}
            hasProgram={hasProgram}
          />
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Code Editor */}
          <div className="lg:col-span-3">
            <CodeEditor
              code={code}
              onChange={setCode}
              currentPC={cpuState.programCounter}
              isRunning={hasProgram && cpuState.status !== "ready"}
              onLoadSample={(c) => { setCode(c); reset(); }}
              advanced={advanced}
            />
          </div>

          {/* Center: CPU Diagram + State + Explanation */}
          <div className="lg:col-span-5 space-y-4">
            <CpuDiagram state={cpuState} previousState={prevState} activeFlow={activeFlow} />
            <CpuStatePanel state={cpuState} previousState={prevState} />
            <ExplanationPanel currentLog={currentLog} />
          </div>

          {/* Right: Memory + Log */}
          <div className="lg:col-span-4 space-y-4">
            <MemoryViewer memory={memory} currentPC={cpuState.programCounter} />
            <ExecutionLog logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
