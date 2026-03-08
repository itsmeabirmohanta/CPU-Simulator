import { CpuState, MemoryCell, LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, HardDrive, Calculator, ArrowRight, ArrowDown, Lightbulb, BookOpen } from "lucide-react";

interface BeginnerVisualCPUProps {
  state: CpuState;
  previousState: CpuState;
  memory: MemoryCell[];
  activeFlow: "fetch" | "decode" | "execute" | "idle";
  currentLog: LogEntry | null;
  logs: LogEntry[];
}

const conceptCards = [
  { term: "Program Counter (PC)", emoji: "📍", desc: "Points to the next instruction to execute." },
  { term: "Accumulator (A)", emoji: "🧮", desc: "The main working register for math results." },
  { term: "ALU", emoji: "⚡", desc: "Arithmetic Logic Unit — the calculator." },
  { term: "Memory", emoji: "📦", desc: "Storage for instructions and data." },
  { term: "Instruction Register", emoji: "📋", desc: "Holds the current instruction." },
  { term: "Flags", emoji: "🚩", desc: "Indicators for zero results and overflow." },
];

function simpleExplanation(log: LogEntry | null): string {
  if (!log) return "Press 'Next Step' to begin executing the program!";
  const expl = log.explanation;
  if (expl.includes("LDA")) return `📦 The CPU is reading a number from memory and putting it in the Accumulator.`;
  if (expl.includes("STA")) return `💾 The CPU is saving the Accumulator value back into memory.`;
  if (expl.includes("ADD")) return `➕ The CPU is adding a number from memory to the Accumulator.`;
  if (expl.includes("SUB")) return `➖ The CPU is subtracting a number from memory from the Accumulator.`;
  if (expl.includes("MOV")) return `🔄 The CPU is copying a value from one register to another.`;
  if (expl.includes("INR")) return `⬆️ Adding 1 to the register value.`;
  if (expl.includes("DCR")) return `⬇️ Subtracting 1 from the register value.`;
  if (expl.includes("JMP")) return `🔀 The CPU is jumping to a different instruction.`;
  if (expl.includes("JZ") && expl.includes("taken")) return `🔀 Result was zero — jumping to a different address!`;
  if (expl.includes("JZ") && expl.includes("not taken")) return `➡️ Result was NOT zero — continuing to next instruction.`;
  if (expl.includes("HLT")) return `🛑 The program is done! The CPU has stopped.`;
  return `🔧 ${expl}`;
}

export default function BeginnerVisualCPU({ state, previousState, memory, activeFlow, currentLog, logs }: BeginnerVisualCPUProps) {
  const phases = [
    { id: "fetch", label: "Fetch", emoji: "📥", desc: "Get instruction" },
    { id: "decode", label: "Decode", emoji: "🔍", desc: "Understand it" },
    { id: "execute", label: "Execute", emoji: "⚡", desc: "Perform action" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Phase Timeline */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex items-center gap-1 sm:gap-2 flex-1">
              <motion.div
                animate={activeFlow === phase.id ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.6, repeat: activeFlow === phase.id ? Infinity : 0 }}
                className={`flex-1 rounded-xl p-2 sm:p-3 text-center transition-all duration-300 ${
                  activeFlow === phase.id
                    ? "bg-primary/15 border-2 border-primary shadow-sm glow-primary"
                    : "bg-muted/30 border-2 border-transparent"
                }`}
              >
                <div className="text-lg sm:text-xl mb-0.5 sm:mb-1">{phase.emoji}</div>
                <div className={`font-display font-bold text-[10px] sm:text-xs ${activeFlow === phase.id ? "text-primary" : "text-muted-foreground"}`}>{phase.label}</div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{phase.desc}</div>
              </motion.div>
              {i < 2 && <ArrowRight className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 transition-colors ${activeFlow !== "idle" ? "text-primary" : "text-muted-foreground/30"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Visual CPU Blocks — stacks vertically on mobile */}
      <div className="glass-card p-3 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Memory Block */}
          <motion.div
            animate={activeFlow === "fetch" ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.8, repeat: activeFlow === "fetch" ? Infinity : 0 }}
            className={`visual-block ${activeFlow === "fetch" ? "border-primary bg-primary/5 visual-block-active" : "border-border"}`}
          >
            <HardDrive className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${activeFlow === "fetch" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="font-display font-bold text-sm mb-1">Memory</div>
            <div className="text-[10px] text-muted-foreground mb-2">Data & Instructions</div>
            <div className="space-y-1">
              {memory.slice(0, 6).map((cell) => {
                const isPC = cell.address === state.programCounter;
                return (
                  <motion.div
                    key={cell.address}
                    animate={isPC && activeFlow === "fetch" ? { backgroundColor: "hsl(var(--primary) / 0.15)" } : {}}
                    className={`rounded-lg px-2 py-1 font-mono text-[11px] flex justify-between transition-all ${
                      isPC ? "bg-primary/10 ring-1 ring-primary/40 font-bold" : "bg-muted/40"
                    }`}
                  >
                    <span className="text-muted-foreground">[{String(cell.address).padStart(2, "0")}]</span>
                    <span className={isPC ? "text-primary" : "text-foreground/70"}>
                      {typeof cell.value === "string" ? cell.value : cell.value}
                    </span>
                  </motion.div>
                );
              })}
              {memory.length > 6 && (
                <div className="text-[10px] text-muted-foreground/40 text-center">+{memory.filter(m => m.value !== 0 || m.type !== "data").length - 6} more</div>
              )}
            </div>
          </motion.div>

          {/* Arrow down on mobile between blocks */}
          <div className="flex sm:hidden justify-center -my-1">
            <ArrowDown className={`h-4 w-4 ${activeFlow !== "idle" ? "text-primary" : "text-muted-foreground/30"}`} />
          </div>

          {/* Center: Control + ALU */}
          <div className="flex flex-col gap-3">
            <motion.div
              animate={activeFlow === "decode" ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.8, repeat: activeFlow === "decode" ? Infinity : 0 }}
              className={`visual-block ${activeFlow === "decode" ? "border-primary bg-primary/5 visual-block-active" : "border-border"}`}
            >
              <Cpu className={`h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-2 ${activeFlow === "decode" ? "text-primary" : "text-muted-foreground"}`} />
              <div className="font-display font-bold text-sm mb-1">Control Unit</div>
              <div className="text-[10px] text-muted-foreground mb-2">Decodes instructions</div>
              <div className="rounded-lg bg-muted/40 px-3 py-2 font-mono text-xs">
                <div className="text-muted-foreground text-[10px]">Current Instruction</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state.instructionRegister || "empty"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="text-primary font-bold text-sm mt-0.5"
                  >
                    {state.instructionRegister || "—"}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              animate={activeFlow === "execute" ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.8, repeat: activeFlow === "execute" ? Infinity : 0 }}
              className={`visual-block ${activeFlow === "execute" ? "border-accent bg-accent/5 visual-block-active" : "border-border"}`}
            >
              <Calculator className={`h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-2 ${activeFlow === "execute" ? "text-accent" : "text-muted-foreground"}`} />
              <div className="font-display font-bold text-sm mb-1">ALU</div>
              <div className="text-[10px] text-muted-foreground">Arithmetic & Logic</div>
            </motion.div>
          </div>

          <div className="flex sm:hidden justify-center -my-1">
            <ArrowDown className={`h-4 w-4 ${activeFlow !== "idle" ? "text-primary" : "text-muted-foreground/30"}`} />
          </div>

          {/* Registers + Status */}
          <div className="space-y-3">
            <div className="visual-block border-border">
              <div className="font-display font-bold text-sm mb-2">Registers</div>
              {[
                { label: "A (Accumulator)", value: state.accumulator, changed: state.accumulator !== previousState.accumulator },
                { label: "B", value: state.registerB, changed: state.registerB !== previousState.registerB },
                { label: "C", value: state.registerC, changed: state.registerC !== previousState.registerC },
              ].map((reg) => (
                <motion.div
                  key={reg.label}
                  animate={reg.changed ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg px-3 py-1.5 flex justify-between items-center font-mono text-xs mb-1.5 ${
                    reg.changed ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/40"
                  }`}
                >
                  <span className="text-muted-foreground text-[10px]">{reg.label}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={reg.value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`font-bold text-sm ${reg.changed ? "text-primary" : "text-foreground"}`}
                    >
                      {reg.value}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="visual-block border-border p-3">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">PC</span>
                <span className="font-mono font-bold text-primary">{String(state.programCounter).padStart(2, "0")}</span>
              </div>
              <div className="flex gap-2">
                <div className={`flex-1 rounded-lg px-2 py-1 text-center text-[10px] font-bold ${state.zeroFlag ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground"}`}>
                  Z={state.zeroFlag ? "1" : "0"}
                </div>
                <div className={`flex-1 rounded-lg px-2 py-1 text-center text-[10px] font-bold ${state.carryFlag ? "bg-warning/15 text-warning" : "bg-muted/40 text-muted-foreground"}`}>
                  CY={state.carryFlag ? "1" : "0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Happening Now */}
      <div className="glass-card p-3 sm:p-5">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Lightbulb className="h-4 w-4 text-warning" />
          <span className="font-display font-bold text-sm">What's Happening Now?</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLog?.explanation || "start"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm leading-relaxed text-foreground/90">
              {simpleExplanation(currentLog)}
            </p>
            {currentLog && currentLog.changes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-3">
                {currentLog.changes.map((c, i) => (
                  <span key={i} className="inline-flex items-center rounded-lg bg-primary/10 text-primary px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-mono font-medium">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step History */}
      {logs.length > 0 && (
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step History</span>
          </div>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-mono py-0.5">
                <span className="text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <span className="text-foreground">{log.instruction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concept Cards */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="font-display font-bold text-sm">CPU Concepts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {conceptCards.map((card) => (
            <div key={card.term} className="rounded-xl bg-muted/30 border p-2.5 sm:p-3 hover:bg-muted/50 transition-colors">
              <div className="text-base sm:text-lg mb-0.5 sm:mb-1">{card.emoji}</div>
              <div className="font-display font-semibold text-[10px] sm:text-[11px] mb-0.5">{card.term}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground leading-snug">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
