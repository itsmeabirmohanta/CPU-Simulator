import { CpuState } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface CpuStatePanelProps {
  state: CpuState;
  previousState?: CpuState;
}

function RegisterCard({ label, value, changed, mono = true }: { label: string; value: string | number; changed: boolean; mono?: boolean }) {
  return (
    <motion.div
      className={changed ? "register-card-active" : "register-card"}
      animate={changed ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={String(value)}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className={`text-lg font-bold ${mono ? "font-mono" : "font-display"} ${changed ? "text-primary" : "text-foreground"}`}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function FlagBadge({ label, active, changed }: { label: string; active: boolean; changed: boolean }) {
  return (
    <motion.div
      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-mono transition-all ${
        active ? "border-primary bg-primary/15 text-primary" : "border-border bg-muted/50 text-muted-foreground"
      }`}
      animate={changed ? { scale: [1, 1.1, 1] } : {}}
    >
      <div className={`h-2 w-2 rounded-full ${active ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/30"}`} />
      <span className="uppercase tracking-wider">{label}</span>
      <span className="font-bold">{active ? "1" : "0"}</span>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: CpuState["status"] }) {
  const styles: Record<string, string> = {
    ready: "bg-secondary text-secondary-foreground",
    running: "bg-primary/15 text-primary border-primary",
    halted: "bg-success/15 text-success border-success",
    error: "bg-destructive/15 text-destructive border-destructive",
    paused: "bg-warning/15 text-warning border-warning",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${styles[status]}`}>
      {status === "running" && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />}
      {status}
    </span>
  );
}

export default function CpuStatePanel({ state, previousState }: CpuStatePanelProps) {
  const prev = previousState || state;
  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <span>CPU State</span>
        <StatusBadge status={state.status} />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <RegisterCard label="Accumulator (A)" value={String(state.accumulator).padStart(2, "0")} changed={state.accumulator !== prev.accumulator} />
          <RegisterCard label="Register B" value={String(state.registerB).padStart(2, "0")} changed={state.registerB !== prev.registerB} />
          <RegisterCard label="Register C" value={String(state.registerC).padStart(2, "0")} changed={state.registerC !== prev.registerC} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <RegisterCard label="Program Counter (PC)" value={String(state.programCounter).padStart(2, "0")} changed={state.programCounter !== prev.programCounter} />
          <RegisterCard label="Instruction Register (IR)" value={state.instructionRegister || "—"} changed={state.instructionRegister !== prev.instructionRegister} mono />
        </div>
        <div className="flex gap-2">
          <FlagBadge label="Zero (Z)" active={state.zeroFlag} changed={state.zeroFlag !== prev.zeroFlag} />
          <FlagBadge label="Carry (CY)" active={state.carryFlag} changed={state.carryFlag !== prev.carryFlag} />
        </div>
        {state.errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive font-mono"
          >
            ⚠ {state.errorMessage}
          </motion.div>
        )}
      </div>
    </div>
  );
}
