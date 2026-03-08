import { CpuState, MemoryCell, LogEntry } from "@/lib/cpu";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Cpu, HardDrive, Calculator, ArrowRight, ArrowDown, Lightbulb, BookOpen, ChevronDown, ChevronUp, Sparkles, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface BeginnerVisualCPUProps {
  state: CpuState;
  previousState: CpuState;
  memory: MemoryCell[];
  activeFlow: "fetch" | "decode" | "execute" | "idle";
  currentLog: LogEntry | null;
  logs: LogEntry[];
}

const conceptCards = [
  { term: "Program Counter (PC)", emoji: "📍", desc: "Points to the next instruction to execute.", detail: "The PC automatically increments after each instruction unless a jump (JMP, JZ) changes it. It's like a bookmark telling the CPU where to read next." },
  { term: "Accumulator (A)", emoji: "🧮", desc: "The main working register for math results.", detail: "Most arithmetic operations (ADD, SUB) use the Accumulator as one operand and store the result back in it. Think of it as the CPU's scratchpad." },
  { term: "ALU", emoji: "⚡", desc: "Arithmetic Logic Unit — the calculator.", detail: "The ALU performs all math (addition, subtraction) and logic (AND, OR, comparisons). It also sets flags based on results." },
  { term: "Memory", emoji: "📦", desc: "Storage for instructions and data.", detail: "Memory holds both the program instructions and data values. Each cell has an address (like a street address) and a value." },
  { term: "Instruction Register", emoji: "📋", desc: "Holds the current instruction.", detail: "After fetching, the instruction is loaded into the IR where the Control Unit decodes it to figure out what operation to perform." },
  { term: "Flags", emoji: "🚩", desc: "Indicators for zero results and overflow.", detail: "The Zero flag (Z) is set when a result equals 0. The Carry flag (CY) is set on overflow/underflow. Conditional jumps like JZ check these flags." },
];

function simpleExplanation(log: LogEntry | null): string {
  if (!log) return "Press 'Load' then 'Next' to begin executing the program!";
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

// Count total instructions in memory for progress
function countInstructions(memory: MemoryCell[]): number {
  return memory.filter(m => m.type === "instruction").length;
}

// Interactive tooltip wrapper for CPU blocks
function BlockTooltip({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative group">
          {children}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info className="h-3 w-3 text-muted-foreground/50" />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px]">
        <p className="font-display font-bold text-xs mb-0.5">{title}</p>
        <p className="text-[10px] text-muted-foreground leading-snug">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// SVG Data Flow connector (horizontal on desktop)
function DataFlowArrow({ active, direction = "right" }: { active: boolean; direction?: "right" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center py-1">
        <svg width="24" height="32" viewBox="0 0 24 32">
          <motion.line
            x1="12" y1="0" x2="12" y2="26"
            stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
            strokeWidth={active ? 2 : 1}
            strokeDasharray={active ? "4 3" : "none"}
            animate={active ? { strokeDashoffset: [20, 0] } : {}}
            transition={{ duration: 0.8, repeat: active ? Infinity : 0 }}
          />
          <polygon
            points="8,26 12,32 16,26"
            fill={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="hidden sm:flex items-center justify-center px-1">
      <svg width="32" height="24" viewBox="0 0 32 24">
        <motion.line
          x1="0" y1="12" x2="26" y2="12"
          stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
          strokeWidth={active ? 2 : 1}
          strokeDasharray={active ? "4 3" : "none"}
          animate={active ? { strokeDashoffset: [20, 0] } : {}}
          transition={{ duration: 0.8, repeat: active ? Infinity : 0 }}
        />
        <polygon
          points="26,8 32,12 26,16"
          fill={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
        />
        {active && (
          <motion.circle
            cx="12" cy="12" r="3"
            fill="hsl(var(--primary))"
            animate={{ cx: [0, 26], opacity: [1, 0.6, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </svg>
    </div>
  );
}

export default function BeginnerVisualCPU({ state, previousState, memory, activeFlow, currentLog, logs }: BeginnerVisualCPUProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const phases = [
    { id: "fetch", label: "Fetch", emoji: "📥", desc: "Get instruction from memory" },
    { id: "decode", label: "Decode", emoji: "🔍", desc: "Understand the instruction" },
    { id: "execute", label: "Execute", emoji: "⚡", desc: "Perform the action" },
  ];

  const totalInstr = countInstructions(memory);
  const progress = totalInstr > 0 ? Math.min((logs.length / totalInstr) * 100, 100) : 0;
  const isCompleted = state.status === "halted";

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Progress Indicator */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-display font-bold text-xs">Progress</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            Step {logs.length} of ~{totalInstr} instructions
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-[11px] text-success font-medium flex items-center gap-1.5"
          >
            ✅ Program completed successfully!
          </motion.div>
        )}
      </div>

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
              {i < 2 && (
                <DataFlowArrow active={activeFlow !== "idle" && (
                  (i === 0 && (activeFlow === "decode" || activeFlow === "execute")) ||
                  (i === 1 && activeFlow === "execute")
                )} />
              )}
              {i < 2 && (
                <div className="sm:hidden">
                  <ArrowRight className={`h-3 w-3 shrink-0 transition-colors ${activeFlow !== "idle" ? "text-primary" : "text-muted-foreground/30"}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Visual CPU Blocks with SVG data flow */}
      <div className="glass-card p-3 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-0 sm:gap-0 items-stretch">
          {/* Memory Block */}
          <BlockTooltip title="Memory" description="Stores both program instructions and data values. The PC points to the next instruction to fetch.">
            <motion.div
              animate={activeFlow === "fetch" ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.8, repeat: activeFlow === "fetch" ? Infinity : 0 }}
              className={`visual-block h-full ${activeFlow === "fetch" ? "border-primary bg-primary/5 visual-block-active" : "border-border"}`}
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
          </BlockTooltip>

          {/* Data flow: Memory → CU */}
          <DataFlowArrow active={activeFlow === "fetch"} />
          <div className="sm:hidden">
            <DataFlowArrow active={activeFlow === "fetch"} direction="down" />
          </div>

          {/* Center: Control + ALU */}
          <div className="flex flex-col gap-3">
            <BlockTooltip title="Control Unit" description="Decodes the fetched instruction and coordinates all other components to execute it.">
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
            </BlockTooltip>

            <BlockTooltip title="ALU (Arithmetic Logic Unit)" description="Performs all math operations (ADD, SUB) and sets flags based on the result.">
              <motion.div
                animate={activeFlow === "execute" ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.8, repeat: activeFlow === "execute" ? Infinity : 0 }}
                className={`visual-block ${activeFlow === "execute" ? "border-accent bg-accent/5 visual-block-active" : "border-border"}`}
              >
                <Calculator className={`h-6 w-6 sm:h-7 sm:w-7 mx-auto mb-2 ${activeFlow === "execute" ? "text-accent" : "text-muted-foreground"}`} />
                <div className="font-display font-bold text-sm mb-1">ALU</div>
                <div className="text-[10px] text-muted-foreground">Arithmetic & Logic</div>
              </motion.div>
            </BlockTooltip>
          </div>

          {/* Data flow: CU → Registers */}
          <DataFlowArrow active={activeFlow === "execute"} />
          <div className="sm:hidden">
            <DataFlowArrow active={activeFlow === "execute"} direction="down" />
          </div>

          {/* Registers + Status */}
          <div className="space-y-3">
            <BlockTooltip title="Registers" description="Fast storage inside the CPU. The Accumulator (A) is the primary working register.">
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
            </BlockTooltip>

            <BlockTooltip title="Status & Flags" description="PC tracks the next instruction. Flags indicate conditions: Zero (Z) and Carry (CY).">
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
            </BlockTooltip>
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
            <p className="text-sm leading-relaxed text-foreground/90 font-body">
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

        {/* Try it yourself prompt */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/20"
          >
            <p className="text-xs text-accent font-medium">
              🎯 <strong>Try it yourself!</strong> Edit the data values in the code editor (e.g., change the numbers at addresses 10-11) and re-run to see different results.
            </p>
          </motion.div>
        )}
      </div>

      {/* Step History */}
      {logs.length > 0 && (
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step History</span>
            <span className="text-[10px] font-mono text-muted-foreground ml-auto">{logs.length} steps</span>
          </div>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className={`flex items-center gap-2 text-[11px] font-mono py-0.5 px-1.5 rounded ${i === logs.length - 1 ? "bg-primary/5" : ""}`}>
                <span className="text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                <span className="text-foreground">{log.instruction}</span>
                {i === logs.length - 1 && <span className="text-[9px] text-primary ml-auto">← current</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Concept Cards */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="font-display font-bold text-sm">CPU Concepts</span>
          <span className="text-[10px] text-muted-foreground ml-auto">Click to expand</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {conceptCards.map((card) => {
            const isExpanded = expandedCard === card.term;
            return (
              <motion.button
                key={card.term}
                onClick={() => setExpandedCard(isExpanded ? null : card.term)}
                className="text-left rounded-xl bg-muted/30 border p-2.5 sm:p-3 hover:bg-muted/50 transition-all card-glow"
                layout
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">{card.emoji}</span>
                    <span className="font-display font-semibold text-[10px] sm:text-[11px]">{card.term}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                  )}
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground leading-snug mt-1">{card.desc}</div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pt-2 border-t border-border/50 text-[10px] text-foreground/80 leading-relaxed font-body">
                        {card.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
