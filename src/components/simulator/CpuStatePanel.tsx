import { CpuState } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface CpuStatePanelProps {
  state: CpuState;
  previousState?: CpuState;
}

function Reg({ label, shortLabel, value, changed }: { label: string; shortLabel: string; value: string; changed: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg transition-all duration-200 ${
      changed ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/30"
    }`}>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[11px] font-bold w-5 ${changed ? "text-primary" : "text-muted-foreground"}`}>{shortLabel}</span>
        <span className="text-[10px] text-muted-foreground/70">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          className={`font-mono text-sm font-bold tabular-nums ${changed ? "text-primary" : "text-foreground"}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Flag({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
      active ? "bg-primary/12 ring-1 ring-primary/20" : "bg-muted/20"
    }`}>
      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-primary animate-pulse-dot" : "bg-muted-foreground/25"}`} />
      <span className={`font-mono text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground/60"}`}>{label}</span>
      <span className={`font-mono text-[11px] font-bold ml-auto ${active ? "text-primary" : "text-muted-foreground/40"}`}>{active ? "1" : "0"}</span>
    </div>
  );
}

export default function CpuStatePanel({ state, previousState }: CpuStatePanelProps) {
  const prev = previousState || state;

  const statusConfig: Record<string, { color: string; dot: string }> = {
    ready: { color: "text-muted-foreground", dot: "bg-muted-foreground/40" },
    running: { color: "text-primary", dot: "bg-primary animate-pulse-dot" },
    halted: { color: "text-success", dot: "bg-success" },
    error: { color: "text-destructive", dot: "bg-destructive" },
    paused: { color: "text-warning", dot: "bg-warning" },
  };
  const cfg = statusConfig[state.status] || statusConfig.ready;

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Registers</span>
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          <span className={`text-[9px] font-mono font-semibold uppercase ${cfg.color}`}>{state.status}</span>
        </div>
      </div>
      <div className="p-2 space-y-0.5 flex-1 overflow-y-auto">
        <Reg label="Accumulator" shortLabel="A" value={String(state.accumulator).padStart(3, " ")} changed={state.accumulator !== prev.accumulator} />
        <Reg label="Register B" shortLabel="B" value={String(state.registerB).padStart(3, " ")} changed={state.registerB !== prev.registerB} />
        <Reg label="Register C" shortLabel="C" value={String(state.registerC).padStart(3, " ")} changed={state.registerC !== prev.registerC} />
        <div className="border-t my-1" />
        <Reg label="Program Counter" shortLabel="PC" value={String(state.programCounter).padStart(2, "0")} changed={state.programCounter !== prev.programCounter} />
        <Reg label="Instruction Reg" shortLabel="IR" value={state.instructionRegister || "---"} changed={state.instructionRegister !== prev.instructionRegister} />
        <div className="border-t my-1" />
        <div className="grid grid-cols-2 gap-1.5">
          <Flag label="ZERO" active={state.zeroFlag} />
          <Flag label="CARRY" active={state.carryFlag} />
        </div>
      </div>
      {state.errorMessage && (
        <div className="px-2.5 pb-2 shrink-0">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-[10px] font-mono text-destructive">
            {state.errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
