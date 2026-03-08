import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import BeginnerVisualCPU from "@/components/simulator/BeginnerVisualCPU";
import { toast } from "sonner";
import { GraduationCap, Cpu, Play, Pause, SkipForward, RotateCcw, Upload } from "lucide-react";

export default function SimulatorPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "advanced" ? "advanced" : "beginner";
  const [mode, setMode] = useState<"beginner" | "advanced">(initialMode);
  const advanced = mode === "advanced";

  const [code, setCode] = useState(SAMPLE_PROGRAMS.addition.code);
  const [cpuState, setCpuState] = useState<CpuState>(createInitialState());
  const [prevState, setPrevState] = useState<CpuState>(createInitialState());
  const [memory, setMemory] = useState<MemoryCell[]>(createMemory());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [hasProgram, setHasProgram] = useState(false);
  const [activeFlow, setActiveFlow] = useState<"fetch" | "decode" | "execute" | "idle">("idle");
  const runTimerRef = useRef<number | null>(null);
  const memSize = advanced ? 64 : 32;

  const [beginnerSample, setBeginnerSample] = useState("addition");

  const beginnerSamples = [
    { key: "addition", label: "➕ Add Two Numbers", code: SAMPLE_PROGRAMS.addition.code },
    { key: "subtraction", label: "➖ Subtract Values", code: SAMPLE_PROGRAMS.subtraction.code },
    { key: "conditionalJump", label: "🔀 Conditional Jump", code: SAMPLE_PROGRAMS.conditionalJump.code },
    { key: "countdown", label: "🔄 Countdown Loop", code: SAMPLE_PROGRAMS.countdown.code },
    { key: "registerMove", label: "📋 Register Transfer", code: SAMPLE_PROGRAMS.registerMove.code },
  ];

  const loadProgram = useCallback(() => {
    const { memory: parsedMem, errors } = parseProgram(code, advanced);
    if (errors.length > 0) { errors.forEach((e) => toast.error(e)); return; }
    const initial = createInitialState();
    setCpuState(initial); setPrevState(initial); setMemory(parsedMem);
    setLogs([]); setHasProgram(true); setActiveFlow("idle"); resetStack();
    toast.success("Program loaded — ready to execute!");
  }, [code, advanced]);

  const step = useCallback(() => {
    if (cpuState.status === "halted" || cpuState.status === "error") return;
    setActiveFlow("fetch");
    setTimeout(() => setActiveFlow("decode"), 200);
    setTimeout(() => setActiveFlow("execute"), 400);
    setTimeout(() => setActiveFlow("idle"), 800);
    setPrevState(cpuState);
    const result = executeStep(cpuState, memory, advanced);
    result.log.step = logs.length + 1;
    setCpuState(result.state); setMemory(result.memory);
    setLogs((prev) => [...prev, result.log]);
    if (result.state.status === "halted") toast.success("✅ Program completed!");
    else if (result.state.status === "error") toast.error(result.state.errorMessage || "Error");
  }, [cpuState, memory, logs.length, advanced]);

  const run = useCallback(() => { setCpuState((s) => ({ ...s, status: "running" })); }, []);

  useEffect(() => {
    if (cpuState.status === "running") {
      const speed = mode === "beginner" ? 800 : 500;
      runTimerRef.current = window.setInterval(() => {
        setCpuState((s) => { if (s.status !== "running") { if (runTimerRef.current) clearInterval(runTimerRef.current); } return s; });
        step();
      }, speed);
      return () => { if (runTimerRef.current) clearInterval(runTimerRef.current); };
    }
  }, [cpuState.status, step, mode]);

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

  const handleModeSwitch = useCallback((newMode: "beginner" | "advanced") => {
    setMode(newMode);
    if (newMode === "beginner" && advanced) {
      setCode(SAMPLE_PROGRAMS.addition.code);
      reset();
    }
  }, [advanced, reset]);

  const handleBeginnerSample = useCallback((key: string) => {
    const sample = beginnerSamples.find(s => s.key === key);
    if (sample) {
      setCode(sample.code);
      setBeginnerSample(key);
      reset();
    }
  }, [beginnerSamples, reset]);

  const currentLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const isHaltedOrError = cpuState.status === "halted" || cpuState.status === "error";
  const isRunning = cpuState.status === "running";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Toolbar */}
      <div className="border-b bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl bg-muted/50 p-0.5">
              <button
                onClick={() => handleModeSwitch("beginner")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                  mode === "beginner"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Beginner
              </button>
              <button
                onClick={() => handleModeSwitch("advanced")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                  mode === "advanced"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                Advanced
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <CtrlBtn onClick={loadProgram} disabled={isRunning}>
              <Upload className="h-3.5 w-3.5" /> Load
            </CtrlBtn>
            <CtrlBtn onClick={step} disabled={!hasProgram || isHaltedOrError || isRunning}>
              <SkipForward className="h-3.5 w-3.5" /> {mode === "beginner" ? "Next Step" : "Step"}
            </CtrlBtn>
            {isRunning ? (
              <CtrlBtn onClick={pause}>
                <Pause className="h-3.5 w-3.5" /> Pause
              </CtrlBtn>
            ) : (
              <CtrlBtn onClick={run} disabled={!hasProgram || isHaltedOrError} variant="primary">
                <Play className="h-3.5 w-3.5" /> {mode === "beginner" ? "Auto Play" : "Run"}
              </CtrlBtn>
            )}
            <CtrlBtn onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" />
            </CtrlBtn>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        {mode === "beginner" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3" style={{ height: "calc(100vh - 140px)" }}>
            <div className="lg:col-span-3 flex flex-col gap-2 min-h-0 overflow-y-auto">
              <div className="glass-card p-4">
                <div className="font-display font-bold text-sm mb-3">📝 Choose a Program</div>
                <div className="space-y-1.5">
                  {beginnerSamples.map((sample) => (
                    <button
                      key={sample.key}
                      onClick={() => handleBeginnerSample(sample.key)}
                      disabled={isRunning}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                        beginnerSample === sample.key
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "hover:bg-muted/50 text-muted-foreground border border-transparent"
                      } disabled:opacity-40`}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass-card flex-1 min-h-0 flex flex-col overflow-hidden">
                <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider">✏️ Edit Code</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{code.split("\n").filter(l => l.trim()).length} lines</span>
                </div>
                <div className="flex-1 min-h-0 relative">
                  {hasProgram && cpuState.status !== "ready" ? (
                    <div className="h-full overflow-y-auto p-3">
                      {code.split("\n").map((line, i) => {
                        const lineAddr = line.trim().match(/^(\d{2}):/);
                        const addr = lineAddr ? parseInt(lineAddr[1], 10) : -1;
                        const isActive = addr === cpuState.programCounter;
                        return (
                          <div key={i} className={`font-mono text-[12px] leading-6 px-2 rounded ${isActive ? "bg-primary/10 text-primary font-bold" : "text-foreground/70"}`}>
                            {isActive && <span className="text-primary mr-1">▸</span>}
                            {line}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="absolute inset-0 w-full h-full bg-transparent font-mono text-[12px] leading-6 p-3 resize-none focus:outline-none border-0 text-foreground"
                      spellCheck={false}
                      placeholder="Write assembly code here..."
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-9 min-h-0 overflow-y-auto">
              <BeginnerVisualCPU
                state={cpuState} previousState={prevState} memory={memory}
                activeFlow={activeFlow} currentLog={currentLog} logs={logs}
              />
            </div>
          </div>
        ) : (
          /* ===== ADVANCED MODE ===== */
          <div className="overflow-y-auto" style={{ height: "calc(100vh - 140px)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Left: Editor */}
              <div className="min-h-[500px]">
                <CodeEditor
                  code={code} onChange={setCode} currentPC={cpuState.programCounter}
                  isRunning={hasProgram && cpuState.status !== "ready"}
                  onLoadSample={(c) => { setCode(c); reset(); }}
                  advanced={advanced}
                />
              </div>

              {/* Right: CPU Diagram + Registers + Explanation */}
              <div className="flex flex-col gap-3">
                <CpuDiagram state={cpuState} previousState={prevState} activeFlow={activeFlow} />
                <div className="grid grid-cols-2 gap-3">
                  <CpuStatePanel state={cpuState} previousState={prevState} />
                  <ExplanationPanel currentLog={currentLog} />
                </div>
              </div>
            </div>

            {/* Bottom: Memory + Execution Trace */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MemoryViewer memory={memory} currentPC={cpuState.programCounter} />
              <ExecutionLog logs={logs} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, disabled, children, variant = "default" }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
        variant === "primary"
          ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
          : "bg-muted hover:bg-muted/80 text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
