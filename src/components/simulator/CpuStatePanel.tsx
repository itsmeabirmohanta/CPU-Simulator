import { CpuState } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Binary } from "lucide-react";

interface CpuStatePanelProps {
  state: CpuState;
  previousState?: CpuState;
}

type ValueFormat = "dec" | "hex" | "bin";

function formatValue(val: number, format: ValueFormat): string {
  if (format === "hex") return "0x" + val.toString(16).toUpperCase().padStart(2, "0");
  if (format === "bin") return val.toString(2).padStart(8, "0");
  return String(val).padStart(3, " ");
}

function Reg({ label, shortLabel, value, changed, format }: { label: string; shortLabel: string; value: number; changed: boolean; format: ValueFormat }) {
  const display = formatValue(value, format);
  return (
    <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg transition-all duration-200 ${
      changed ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/30"
    }`}>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[11px] font-bold w-5 ${changed ? "text-primary" : "text-muted-foreground"}`}>{shortLabel}</span>
        <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">{label}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          className={`font-mono text-sm font-bold tabular-nums ${changed ? "text-primary" : "text-foreground"} ${format === "bin" ? "text-[10px]" : ""}`}
        >
          {display}
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
  const [format, setFormat] = useState<ValueFormat>("dec");

  const statusConfig: Record<string, { color: string; dot: string }> = {
    ready: { color: "text-muted-foreground", dot: "bg-muted-foreground/40" },
    running: { color: "text-primary", dot: "bg-primary animate-pulse-dot" },
    halted: { color: "text-success", dot: "bg-success" },
    error: { color: "text-destructive", dot: "bg-destructive" },
    paused: { color: "text-warning", dot: "bg-warning" },
  };
  const cfg = statusConfig[state.status] || statusConfig.ready;

  const formats: ValueFormat[] = ["dec", "hex", "bin"];

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Registers</span>
        <div className="flex items-center gap-2">
          {/* Format toggle */}
          <div className="flex items-center rounded-md bg-muted/50 p-0.5">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition-all ${
                  format === f ? "bg-primary/15 text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            <span className={`text-[9px] font-mono font-semibold uppercase ${cfg.color}`}>{state.status}</span>
          </div>
        </div>
      </div>
      <div className="p-2 space-y-0.5 flex-1 overflow-y-auto">
        <Reg label="Accumulator" shortLabel="A" value={state.accumulator} changed={state.accumulator !== prev.accumulator} format={format} />
        <Reg label="Register B" shortLabel="B" value={state.registerB} changed={state.registerB !== prev.registerB} format={format} />
        <Reg label="Register C" shortLabel="C" value={state.registerC} changed={state.registerC !== prev.registerC} format={format} />
        <div className="border-t my-1" />
        <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg transition-all duration-200 ${
          state.programCounter !== prev.programCounter ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/30"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[11px] font-bold w-5 ${state.programCounter !== prev.programCounter ? "text-primary" : "text-muted-foreground"}`}>PC</span>
            <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">Program Counter</span>
          </div>
          <span className={`font-mono text-sm font-bold tabular-nums ${state.programCounter !== prev.programCounter ? "text-primary" : "text-foreground"}`}>
            {String(state.programCounter).padStart(2, "0")}
          </span>
        </div>
        <div className={`flex items-center justify-between py-1.5 px-3 rounded-lg transition-all duration-200 ${
          state.instructionRegister !== prev.instructionRegister ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/30"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[11px] font-bold w-5 ${state.instructionRegister !== prev.instructionRegister ? "text-primary" : "text-muted-foreground"}`}>IR</span>
            <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">Instruction Reg</span>
          </div>
          <span className={`font-mono text-sm font-bold ${state.instructionRegister !== prev.instructionRegister ? "text-primary" : "text-foreground"}`}>
            {state.instructionRegister || "---"}
          </span>
        </div>
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
