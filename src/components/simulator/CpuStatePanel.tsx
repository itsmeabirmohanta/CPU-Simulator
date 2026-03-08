import { CpuState } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface CpuStatePanelProps {
  state: CpuState;
  previousState?: CpuState;
}

function Reg({ label, shortLabel, value, changed }: { label: string; shortLabel: string; value: string; changed: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 px-3.5 rounded-lg transition-all duration-200 ${
      changed ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/40"
    }`}>
      <div className="flex items-center gap-2.5">
        <span className={`font-mono text-[11px] font-bold w-6 ${changed ? "text-primary" : "text-muted-foreground"}`}>{shortLabel}</span>
        <span className="text-[10px] text-muted-foreground hidden lg:inline">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className={`font-mono text-sm font-bold tabular-nums ${changed ? "text-primary" : "text-foreground"}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Flag({ label, active, changed }: { label: string; active: boolean; changed: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
      active ? "bg-primary/15 ring-1 ring-primary/20" : "bg-muted/30"
    }`}>
      <div className={`h-2 w-2 rounded-full transition-colors ${active ? "bg-primary animate-pulse-dot" : "bg-muted-foreground/25"}`} />
      <span className={`font-mono text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
      <span className={`font-mono text-xs font-bold ml-auto ${active ? "text-primary" : "text-muted-foreground/60"}`}>{active ? "1" : "0"}</span>
    </div>
  );
}

export default function CpuStatePanel({ state, previousState }: CpuStatePanelProps) {
  const prev = previousState || state;

  const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
    ready: { color: "text-muted-foreground", dot: "bg-muted-foreground/40", label: "READY" },
    running: { color: "text-primary", dot: "bg-primary animate-pulse-dot", label: "RUNNING" },
    halted: { color: "text-success", dot: "bg-success", label: "HALTED" },
    error: { color: "text-destructive", dot: "bg-destructive", label: "ERROR" },
    paused: { color: "text-warning", dot: "bg-warning", label: "PAUSED" },
  };

  const cfg = statusConfig[state.status] || statusConfig.ready;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Registers</span>
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          <span className={`text-[10px] font-mono font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="p-2.5 space-y-0.5">
        <Reg label="Accumulator" shortLabel="A" value={String(state.accumulator).padStart(3, " ")} changed={state.accumulator !== prev.accumulator} />
        <Reg label="Register B" shortLabel="B" value={String(state.registerB).padStart(3, " ")} changed={state.registerB !== prev.registerB} />
        <Reg label="Register C" shortLabel="C" value={String(state.registerC).padStart(3, " ")} changed={state.registerC !== prev.registerC} />
        <div className="border-t my-1.5" />
        <Reg label="Program Counter" shortLabel="PC" value={String(state.programCounter).padStart(2, "0")} changed={state.programCounter !== prev.programCounter} />
        <Reg label="Instruction Reg" shortLabel="IR" value={state.instructionRegister || "---"} changed={state.instructionRegister !== prev.instructionRegister} />
        <div className="border-t my-1.5" />
        <div className="grid grid-cols-2 gap-2 px-0.5">
          <Flag label="ZERO" active={state.zeroFlag} changed={state.zeroFlag !== prev.zeroFlag} />
          <Flag label="CARRY" active={state.carryFlag} changed={state.carryFlag !== prev.carryFlag} />
        </div>
      </div>
      {state.errorMessage && (
        <div className="px-3 pb-2.5">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[11px] font-mono text-destructive">
            {state.errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
