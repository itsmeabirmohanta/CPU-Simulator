import { useState, useCallback, useRef, useEffect } from "react";
import {
  CpuState, MemoryCell, LogEntry,
  createInitialState, createMemory, parseProgram, executeStep, resetStack, SAMPLE_PROGRAMS,
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
    if (errors.length > 0) { errors.forEach((e) => toast.error(e)); return; }
    const initial = createInitialState();
    setCpuState(initial); setPrevState(initial); setMemory(parsedMem);
    setLogs([]); setHasProgram(true); setActiveFlow("idle"); resetStack();
    toast.success("Program loaded");
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
    setCpuState(result.state); setMemory(result.memory);
    setLogs((prev) => [...prev, result.log]);
    if (result.state.status === "halted") toast.success("Program halted");
    else if (result.state.status === "error") toast.error(result.state.errorMessage || "Error");
  }, [cpuState, memory, logs.length, advanced]);

  const run = useCallback(() => { setCpuState((s) => ({ ...s, status: "running" })); }, []);

  useEffect(() => {
    if (cpuState.status === "running") {
      runTimerRef.current = window.setInterval(() => {
        setCpuState((s) => { if (s.status !== "running") { if (runTimerRef.current) clearInterval(runTimerRef.current); } return s; });
        step();
      }, 500);
      return () => { if (runTimerRef.current) clearInterval(runTimerRef.current); };
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
    setCpuState(initial); setPrevState(initial); setMemory(createMemory(memSize));
    setLogs([]); setHasProgram(false); setActiveFlow("idle"); resetStack();
  }, [memSize]);

  const handleToggleAdvanced = useCallback((checked: boolean) => {
    setAdvanced(checked);
    if (runTimerRef.current) clearInterval(runTimerRef.current);
    const initial = createInitialState();
    setCpuState(initial); setPrevState(initial);
    setMemory(createMemory(checked ? 64 : 32));
    setLogs([]); setHasProgram(false); setActiveFlow("idle"); resetStack();
    setCode(checked ? SAMPLE_PROGRAMS.bitwiseOps.code : SAMPLE_PROGRAMS.addition.code);
  }, []);

  const currentLog = logs.length > 0 ? logs[logs.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Toolbar */}
      <div className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-bold font-display">Simulator</h1>
              <p className="text-[10px] text-muted-foreground">8-bit CPU · {advanced ? "Advanced" : "Basic"}</p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className={`font-medium ${!advanced ? "text-foreground" : "text-muted-foreground"}`}>Basic</span>
              <Switch checked={advanced} onCheckedChange={handleToggleAdvanced} className="data-[state=checked]:bg-primary h-4 w-7" />
              <span className={`font-medium ${advanced ? "text-primary" : "text-muted-foreground"}`}>Advanced</span>
            </div>
          </div>
          <ExecutionControls
            status={cpuState.status} onLoad={loadProgram} onStep={step}
            onRun={run} onPause={pause} onReset={reset} hasProgram={hasProgram}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3" style={{ height: "calc(100vh - 120px)" }}>
          {/* Left: Editor */}
          <div className="lg:col-span-4 min-h-0">
            <CodeEditor
              code={code} onChange={setCode} currentPC={cpuState.programCounter}
              isRunning={hasProgram && cpuState.status !== "ready"}
              onLoadSample={(c) => { setCode(c); reset(); }}
              advanced={advanced}
            />
          </div>

          {/* Center: CPU Diagram + Registers */}
          <div className="lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
            <CpuDiagram state={cpuState} previousState={prevState} activeFlow={activeFlow} />
            <CpuStatePanel state={cpuState} previousState={prevState} />
            <ExplanationPanel currentLog={currentLog} />
          </div>

          {/* Right: Memory + Log */}
          <div className="lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
            <MemoryViewer memory={memory} currentPC={cpuState.programCounter} />
            <ExecutionLog logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
