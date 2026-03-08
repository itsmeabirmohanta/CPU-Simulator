import { CpuState } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";

interface CpuStatePanelProps {
  state: CpuState;
  previousState?: CpuState;
}

function RegisterCard({ label, value, changed, icon }: { label: string; value: string | number; changed: boolean; icon?: string }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border p-3 transition-all duration-300 ${
        changed ? "border-primary bg-primary/5 glow-primary" : "bg-card border-border"
      }`}
      animate={changed ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 0.35 }}
    >
      {changed && (
        <motion.div
          className="absolute inset-0 bg-primary/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 0.8 }}
        />
      )}
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-xs">{icon}</span>}
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={String(value)}
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`text-xl font-bold font-mono tabular-nums ${changed ? "text-primary" : "text-foreground"}`}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function FlagBadge({ label, fullLabel, active, changed }: { label: string; fullLabel: string; active: boolean; changed: boolean }) {
  return (
    <motion.div
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-mono transition-all ${
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground"
      }`}
      animate={changed ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`h-2.5 w-2.5 rounded-full ${active ? "bg-primary" : "bg-muted-foreground/20"}`}
        animate={active ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 2, repeat: active ? Infinity : 0 }}
      />
      <div className="flex flex-col">
        <span className="font-bold text-xs">{label}</span>
        <span className="text-[9px] text-muted-foreground">{fullLabel}</span>
      </div>
      <span className={`ml-auto text-lg font-bold tabular-nums ${active ? "text-primary" : ""}`}>{active ? "1" : "0"}</span>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: CpuState["status"] }) {
  const config: Record<string, { bg: string; dot: string; icon: string }> = {
    ready: { bg: "bg-secondary text-secondary-foreground border-border", dot: "bg-muted-foreground", icon: "⏸" },
    running: { bg: "bg-primary/10 text-primary border-primary", dot: "bg-primary", icon: "▶" },
    halted: { bg: "bg-success/10 text-success border-success", dot: "bg-success", icon: "✓" },
    error: { bg: "bg-destructive/10 text-destructive border-destructive", dot: "bg-destructive", icon: "✕" },
    paused: { bg: "bg-warning/10 text-warning border-warning", dot: "bg-warning", icon: "⏯" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${c.bg}`}>
      <motion.span
        className={`h-2 w-2 rounded-full ${c.dot}`}
        animate={status === "running" ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1, repeat: status === "running" ? Infinity : 0 }}
      />
      {status}
    </span>
  );
}

export default function CpuStatePanel({ state, previousState }: CpuStatePanelProps) {
  const prev = previousState || state;
  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <span>⚡ CPU Registers</span>
        <StatusBadge status={state.status} />
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <RegisterCard icon="📊" label="Accumulator (A)" value={String(state.accumulator).padStart(2, "0")} changed={state.accumulator !== prev.accumulator} />
          <RegisterCard icon="📦" label="Register B" value={String(state.registerB).padStart(2, "0")} changed={state.registerB !== prev.registerB} />
          <RegisterCard icon="📦" label="Register C" value={String(state.registerC).padStart(2, "0")} changed={state.registerC !== prev.registerC} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <RegisterCard icon="📍" label="Program Counter" value={String(state.programCounter).padStart(2, "0")} changed={state.programCounter !== prev.programCounter} />
          <RegisterCard icon="📋" label="Instruction Reg" value={state.instructionRegister || "—"} changed={state.instructionRegister !== prev.instructionRegister} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FlagBadge label="Z" fullLabel="Zero Flag" active={state.zeroFlag} changed={state.zeroFlag !== prev.zeroFlag} />
          <FlagBadge label="CY" fullLabel="Carry Flag" active={state.carryFlag} changed={state.carryFlag !== prev.carryFlag} />
        </div>
        {state.errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive font-mono"
          >
            ⚠ {state.errorMessage}
          </motion.div>
        )}
      </div>
    </div>
  );
}
