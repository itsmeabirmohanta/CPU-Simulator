import { CpuState } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface CpuStatePanelProps {
  state: CpuState;
  previousState?: CpuState;
}

function Reg({ label, shortLabel, value, changed }: { label: string; shortLabel: string; value: string; changed: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 px-3 rounded transition-all duration-200 ${
      changed ? "bg-primary/10" : "hover:bg-muted/40"
    }`}>
      <div className="flex items-center gap-2">
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
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded transition-all ${
      active ? "bg-primary/15" : "bg-muted/30"
    }`}>
      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-primary animate-pulse-dot" : "bg-muted-foreground/25"}`} />
      <span className={`font-mono text-[11px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
      <span className={`font-mono text-xs font-bold ml-auto ${active ? "text-primary" : "text-muted-foreground/60"}`}>{active ? "1" : "0"}</span>
    </div>
  );
}

export default function CpuStatePanel({ state, previousState }: CpuStatePanelProps) {
  const prev = previousState || state;

  const statusColors: Record<string, string> = {
    ready: "text-muted-foreground",
    running: "text-primary",
    halted: "text-success",
    error: "text-destructive",
    paused: "text-warning",
  };

  return (
    <div className="sim-panel">
      <div className="sim-panel-header">
        <span className="sim-panel-title">Registers</span>
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${
            state.status === "running" ? "bg-primary animate-pulse-dot" :
            state.status === "halted" ? "bg-success" :
            state.status === "error" ? "bg-destructive" : "bg-muted-foreground/40"
          }`} />
          <span className={`text-[10px] font-mono font-semibold uppercase ${statusColors[state.status]}`}>{state.status}</span>
        </div>
      </div>
      <div className="p-2 space-y-0.5">
        <Reg label="Accumulator" shortLabel="A" value={String(state.accumulator).padStart(3, " ")} changed={state.accumulator !== prev.accumulator} />
        <Reg label="Register B" shortLabel="B" value={String(state.registerB).padStart(3, " ")} changed={state.registerB !== prev.registerB} />
        <Reg label="Register C" shortLabel="C" value={String(state.registerC).padStart(3, " ")} changed={state.registerC !== prev.registerC} />
        <div className="border-t my-1" />
        <Reg label="Program Counter" shortLabel="PC" value={String(state.programCounter).padStart(2, "0")} changed={state.programCounter !== prev.programCounter} />
        <Reg label="Instruction Reg" shortLabel="IR" value={state.instructionRegister || "---"} changed={state.instructionRegister !== prev.instructionRegister} />
        <div className="border-t my-1" />
        <div className="grid grid-cols-2 gap-1.5 px-1">
          <Flag label="ZERO" active={state.zeroFlag} changed={state.zeroFlag !== prev.zeroFlag} />
          <Flag label="CARRY" active={state.carryFlag} changed={state.carryFlag !== prev.carryFlag} />
        </div>
      </div>
      {state.errorMessage && (
        <div className="px-3 pb-2">
          <div className="rounded border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-[11px] font-mono text-destructive">
            {state.errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
