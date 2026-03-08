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
import ExplanationPanel from "@/components/simulator/ExplanationPanel";
import BeginnerVisualCPU from "@/components/simulator/BeginnerVisualCPU";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import {
  GraduationCap, Cpu, Play, Pause, SkipForward, RotateCcw, Upload,
  Keyboard, ChevronRight, Gauge, Share2, Download,
} from "lucide-react";

const SPEED_LABELS: Record<number, string> = { 0: "0.25×", 1: "0.5×", 2: "1×", 3: "2×", 4: "4×" };
const SPEED_MS: Record<number, number> = { 0: 3200, 1: 1600, 2: 800, 3: 400, 4: 200 };

// localStorage helpers
function loadSaved<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function SimulatorPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "advanced" ? "advanced" : "beginner";

  // Load shared program from URL if present
  const sharedCode = searchParams.get("code") ? decodeURIComponent(searchParams.get("code")!) : null;

  const [mode, setMode] = useState<"beginner" | "advanced">(loadSaved("cpuverse-mode", initialMode) as "beginner" | "advanced");
  const advanced = mode === "advanced";

  const [code, setCode] = useState(sharedCode || loadSaved("cpuverse-code", SAMPLE_PROGRAMS.addition.code));
  const [cpuState, setCpuState] = useState<CpuState>(createInitialState());
  const [prevState, setPrevState] = useState<CpuState>(createInitialState());
  const [memory, setMemory] = useState<MemoryCell[]>(createMemory());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [hasProgram, setHasProgram] = useState(false);
  const [activeFlow, setActiveFlow] = useState<"fetch" | "decode" | "execute" | "idle">("idle");
  const runTimerRef = useRef<number | null>(null);
  const memSize = advanced ? 64 : 32;

  const [beginnerSample, setBeginnerSample] = useState("addition");
  const [speedLevel, setSpeedLevel] = useState(loadSaved("cpuverse-speed", 2));
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Persist code, mode, speed
  useEffect(() => { save("cpuverse-code", code); }, [code]);
  useEffect(() => { save("cpuverse-mode", mode); }, [mode]);
  useEffect(() => { save("cpuverse-speed", speedLevel); }, [speedLevel]);

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
      const speed = SPEED_MS[speedLevel] || 800;
      runTimerRef.current = window.setInterval(() => {
        setCpuState((s) => { if (s.status !== "running") { if (runTimerRef.current) clearInterval(runTimerRef.current); } return s; });
        step();
      }, speed);
      return () => { if (runTimerRef.current) clearInterval(runTimerRef.current); };
    }
  }, [cpuState.status, step, speedLevel]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      if (e.key === " " && !e.shiftKey) {
        e.preventDefault();
        if (hasProgram && !isHaltedOrError && !isRunning) step();
      }
      if (e.key === " " && e.shiftKey) {
        e.preventDefault();
        if (isRunning) pause();
        else if (hasProgram && !isHaltedOrError) run();
      }
      if (e.key === "r" || e.key === "R") {
        if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); reset(); }
      }
      if (e.key === "l" || e.key === "L") {
        if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); loadProgram(); }
      }
      if (e.key === "?") {
        setShowShortcuts(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasProgram, isRunning, isHaltedOrError, step, pause, run, reset, loadProgram]);

  // Status breadcrumb
  const statusLabel = !hasProgram
    ? "Ready"
    : cpuState.status === "halted"
      ? "Halted"
      : cpuState.status === "error"
        ? "Error"
        : cpuState.status === "running"
          ? `Running (Step ${logs.length})`
          : cpuState.status === "paused"
            ? `Paused (Step ${logs.length})`
            : `Loaded (Step ${logs.length})`;

  const statusColor = !hasProgram
    ? "text-muted-foreground"
    : cpuState.status === "halted"
      ? "text-success"
      : cpuState.status === "error"
        ? "text-destructive"
        : cpuState.status === "running"
          ? "text-primary"
          : "text-warning";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Toolbar */}
        <div className="border-b bg-card/60 backdrop-blur-sm sticky top-14 z-40">
          <div className="container mx-auto px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
            {/* Left: Mode Toggle + Status */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center rounded-xl bg-muted/50 p-0.5 relative">
                <button
                  onClick={() => handleModeSwitch("beginner")}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                    mode === "beginner"
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Beginner</span>
                </button>
                <button
                  onClick={() => handleModeSwitch("advanced")}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                    mode === "advanced"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Advanced</span>
                </button>
              </div>

              {/* Status breadcrumb */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono">
                <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
                <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
              {/* Speed control */}
              <div className="hidden md:flex items-center gap-2 mr-2 px-2 border-r border-border/50">
                <Gauge className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[speedLevel]}
                  onValueChange={([v]) => setSpeedLevel(v)}
                  min={0}
                  max={4}
                  step={1}
                  className="w-20"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-8">{SPEED_LABELS[speedLevel]}</span>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <CtrlBtn onClick={loadProgram} disabled={isRunning} shortcut="L">
                    <Upload className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Load</span>
                  </CtrlBtn>
                </TooltipTrigger>
                <TooltipContent>Load program (L)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <CtrlBtn onClick={step} disabled={!hasProgram || isHaltedOrError || isRunning} shortcut="Space">
                    <SkipForward className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{mode === "beginner" ? "Next" : "Step"}</span>
                  </CtrlBtn>
                </TooltipTrigger>
                <TooltipContent>Step forward (Space)</TooltipContent>
              </Tooltip>

              {isRunning ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CtrlBtn onClick={pause} shortcut="⇧Space">
                      <Pause className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Pause</span>
                    </CtrlBtn>
                  </TooltipTrigger>
                  <TooltipContent>Pause (Shift+Space)</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CtrlBtn onClick={run} disabled={!hasProgram || isHaltedOrError} variant="primary" shortcut="⇧Space">
                      <Play className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{mode === "beginner" ? "Play" : "Run"}</span>
                    </CtrlBtn>
                  </TooltipTrigger>
                  <TooltipContent>Run (Shift+Space)</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <CtrlBtn onClick={reset} shortcut="R">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </CtrlBtn>
                </TooltipTrigger>
                <TooltipContent>Reset (R)</TooltipContent>
              </Tooltip>

              {/* Share + Export */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/simulator?mode=${mode}&code=${encodeURIComponent(code)}`;
                      navigator.clipboard.writeText(url);
                      toast.success("Share link copied to clipboard!");
                    }}
                    className="hidden sm:inline-flex items-center p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Copy share link</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      const blob = new Blob([code], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = "program.asm"; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="hidden sm:inline-flex items-center p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Export as .asm</TooltipContent>
              </Tooltip>

              {/* Step counter */}
              {logs.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/5 border border-primary/10 ml-1">
                  <span className="text-[10px] font-mono text-primary font-bold">{logs.length}</span>
                  <span className="text-[9px] text-muted-foreground">steps</span>
                </div>
              )}

              {/* Keyboard shortcut toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowShortcuts(prev => !prev)}
                    className="hidden md:inline-flex items-center p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors ml-1"
                  >
                    <Keyboard className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Mobile status bar */}
          <div className="sm:hidden border-t px-3 py-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
            <div className="flex items-center gap-2">
              <Gauge className="h-3 w-3 text-muted-foreground" />
              <Slider
                value={[speedLevel]}
                onValueChange={([v]) => setSpeedLevel(v)}
                min={0}
                max={4}
                step={1}
                className="w-16"
              />
              <span className="text-muted-foreground w-6">{SPEED_LABELS[speedLevel]}</span>
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts overlay */}
        {showShortcuts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
            <div className="glass-card-glow p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-display font-bold text-base mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                {[
                  { key: "Space", desc: "Step forward" },
                  { key: "Shift + Space", desc: "Run / Pause" },
                  { key: "L", desc: "Load program" },
                  { key: "R", desc: "Reset" },
                  { key: "?", desc: "Toggle shortcuts" },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground font-body">{s.desc}</span>
                    <kbd className="px-2 py-1 rounded-md bg-muted border text-[11px] font-mono font-bold">{s.key}</kbd>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="mt-4 w-full py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {mode === "beginner" ? (
            /* ===== BEGINNER MODE ===== */
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:min-h-[calc(100vh-160px)]">
              {/* Left sidebar */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                <div className="glass-card p-3 sm:p-4">
                  <div className="font-display font-bold text-sm mb-2 sm:mb-3">📝 Choose a Program</div>
                  <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
                    {beginnerSamples.map((sample) => (
                      <button
                        key={sample.key}
                        onClick={() => handleBeginnerSample(sample.key)}
                        disabled={isRunning}
                        className={`whitespace-nowrap lg:whitespace-normal text-left px-3 py-2 sm:py-2.5 rounded-xl text-[12px] font-medium transition-all shrink-0 lg:shrink lg:w-full ${
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

                <div className="glass-card flex flex-col overflow-hidden min-h-[200px] lg:flex-1">
                  <div className="px-3 sm:px-4 py-2 border-b bg-muted/20 flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider">✏️ Edit Code</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{code.split("\n").filter(l => l.trim()).length} lines</span>
                  </div>
                  <div className="flex-1 min-h-[160px] relative">
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

              {/* Visual CPU */}
              <div className="lg:col-span-9 overflow-y-auto">
                <BeginnerVisualCPU
                  state={cpuState} previousState={prevState} memory={memory}
                  activeFlow={activeFlow} currentLog={currentLog} logs={logs}
                />
              </div>
            </div>
          ) : (
            /* ===== ADVANCED MODE ===== */
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="min-h-[350px] sm:min-h-[450px]">
                  <CodeEditor
                    code={code} onChange={setCode} currentPC={cpuState.programCounter}
                    isRunning={hasProgram && cpuState.status !== "ready"}
                    onLoadSample={(c) => { setCode(c); reset(); }}
                    advanced={advanced}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <CpuDiagram state={cpuState} previousState={prevState} activeFlow={activeFlow} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CpuStatePanel state={cpuState} previousState={prevState} />
                    <ExplanationPanel currentLog={currentLog} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MemoryViewer memory={memory} currentPC={cpuState.programCounter} />
                <ExecutionLog logs={logs} />
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

function CtrlBtn({ onClick, disabled, children, variant = "default", shortcut }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: "default" | "primary"; shortcut?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 ${
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm glow-primary"
          : "bg-muted hover:bg-muted/80 text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
