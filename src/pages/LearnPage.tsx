import Navbar from "@/components/Navbar";
import { BookOpen, Cpu, Zap, HardDrive, Flag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const basicInstructions = [
  { opcode: "LDA addr", desc: "Load the value at memory address into the Accumulator.", example: "LDA 10", simple: "Read a number from memory." },
  { opcode: "STA addr", desc: "Store the Accumulator value into memory address.", example: "STA 12", simple: "Save a number to memory." },
  { opcode: "ADD addr", desc: "Add the value at memory address to the Accumulator. Updates Z and CY flags.", example: "ADD 11", simple: "Add a number to the accumulator." },
  { opcode: "SUB addr", desc: "Subtract the value at memory address from the Accumulator. Updates Z and CY flags.", example: "SUB 11", simple: "Subtract a number." },
  { opcode: "MOV dst,src", desc: "Copy value from source register to destination register. Registers: A, B, C.", example: "MOV B,A", simple: "Copy data between registers." },
  { opcode: "INR reg", desc: "Increment the specified register by 1. Updates Z flag.", example: "INR A", simple: "Add 1 to a register." },
  { opcode: "DCR reg", desc: "Decrement the specified register by 1. Updates Z flag.", example: "DCR A", simple: "Subtract 1 from a register." },
  { opcode: "JMP addr", desc: "Unconditional jump — sets PC to the given address.", example: "JMP 00", simple: "Go to a different instruction." },
  { opcode: "JZ addr", desc: "Jump to address if the Zero flag is set (Z=1).", example: "JZ 05", simple: "Jump only if result was zero." },
  { opcode: "HLT", desc: "Halt execution. The CPU stops processing.", example: "HLT", simple: "Stop the program." },
];

const advancedInstructions = [
  { opcode: "AND addr", desc: "Bitwise AND of Accumulator with memory value. Resets CY.", example: "AND 10" },
  { opcode: "OR addr", desc: "Bitwise OR of Accumulator with memory value. Resets CY.", example: "OR 10" },
  { opcode: "XOR addr", desc: "Bitwise XOR of Accumulator with memory value. Resets CY.", example: "XOR 10" },
  { opcode: "CMP addr", desc: "Compare Accumulator with memory value. Sets Z and CY flags. A unchanged.", example: "CMP 10" },
  { opcode: "JNZ addr", desc: "Jump if Zero flag is clear (Z=0).", example: "JNZ 05" },
  { opcode: "JC addr", desc: "Jump if Carry flag is set (CY=1).", example: "JC 05" },
  { opcode: "PUSH", desc: "Push Accumulator value onto the stack.", example: "PUSH" },
  { opcode: "POP", desc: "Pop top of stack into Accumulator.", example: "POP" },
  { opcode: "CALL addr", desc: "Call subroutine. Pushes return address onto stack.", example: "CALL 10" },
  { opcode: "RET", desc: "Return from subroutine. Pops return address from stack.", example: "RET" },
  { opcode: "NOP", desc: "No operation. Just advances the program counter.", example: "NOP" },
  { opcode: "CMA", desc: "Complement (bitwise NOT) the Accumulator.", example: "CMA" },
  { opcode: "RAL", desc: "Rotate Accumulator left through Carry flag.", example: "RAL" },
  { opcode: "RAR", desc: "Rotate Accumulator right through Carry flag.", example: "RAR" },
];

const concepts = [
  {
    icon: Cpu,
    title: "What is a CPU?",
    content: "A CPU (Central Processing Unit) is the brain of a computer. It reads instructions from memory, figures out what they mean, and carries them out. CPUverse simulates a simple 8-bit CPU so you can see exactly how this works.",
  },
  {
    icon: ArrowRight,
    title: "The Fetch-Decode-Execute Cycle",
    content: "Every instruction goes through three stages: FETCH (read the instruction from memory), DECODE (understand what it means), and EXECUTE (perform the action). This cycle repeats for every single instruction.",
  },
  {
    icon: Zap,
    title: "What is the ALU?",
    content: "The Arithmetic Logic Unit handles all math and logic operations — addition, subtraction, comparisons, and bitwise operations. When you see ADD or SUB instructions, the ALU is doing the work.",
  },
  {
    icon: HardDrive,
    title: "Memory & Addresses",
    content: "Memory is like a grid of numbered boxes. Each box has an address (00, 01, 02...) and can hold a number (0-255) or an instruction. The CPU reads from and writes to specific addresses.",
  },
  {
    icon: Flag,
    title: "Flags & Conditional Jumps",
    content: "Flags are special indicators. The Zero flag (Z) is set when a calculation result is 0. The Carry flag (CY) is set when a result overflows. JZ and JC use these flags to decide whether to jump.",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Learn</h1>
            <p className="text-sm text-muted-foreground">Understanding how a CPU works, step by step</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 mb-10">
          <Button asChild className="rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/simulator?mode=beginner">Try Beginner Mode →</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl gap-2">
            <Link to="/simulator?mode=advanced">Open Advanced Lab →</Link>
          </Button>
        </div>

        {/* Core Concepts */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-5">Core Concepts</h2>
          <div className="space-y-4">
            {concepts.map((c) => (
              <div key={c.title} className="glass-card p-5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <c.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Memory Format */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Memory Format</h2>
          <div className="glass-card p-5">
            <p className="text-sm text-muted-foreground mb-3">
              Programs are written as address-value pairs. Each line starts with a two-digit address followed by a colon:
            </p>
            <pre className="rounded-xl bg-muted/50 p-4 font-mono text-sm text-foreground">
{`00: LDA 10    ← instruction at address 00
01: ADD 11    ← instruction at address 01
10: 05        ← data value at address 10`}
            </pre>
          </div>
        </section>

        {/* Basic Instructions */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Basic Instructions</h2>
          <div className="space-y-2">
            {basicInstructions.map((inst) => (
              <div key={inst.opcode} className="glass-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-mono font-bold text-primary text-sm">{inst.opcode}</code>
                  <code className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{inst.example}</code>
                </div>
                <p className="text-sm text-muted-foreground">{inst.desc}</p>
                <p className="text-xs text-accent mt-1">💡 Simply: {inst.simple}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Instructions */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">
            Advanced Instructions
            <span className="text-xs font-normal text-muted-foreground ml-2">(Advanced mode only)</span>
          </h2>
          <div className="space-y-2">
            {advancedInstructions.map((inst) => (
              <div key={inst.opcode} className="glass-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-mono font-bold text-primary text-sm">{inst.opcode}</code>
                  <code className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{inst.example}</code>
                </div>
                <p className="text-sm text-muted-foreground">{inst.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flags & Registers */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold mb-4">Flags</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4">
              <code className="font-mono font-bold text-primary">Z (Zero)</code>
              <p className="text-sm text-muted-foreground mt-1">Set to 1 when the result of an arithmetic operation is zero.</p>
            </div>
            <div className="glass-card p-4">
              <code className="font-mono font-bold text-warning">CY (Carry)</code>
              <p className="text-sm text-muted-foreground mt-1">Set to 1 when an ADD overflows beyond 255 or SUB results in a borrow.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-4">Registers</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "A (Accumulator)", desc: "Main register for arithmetic and data operations." },
              { name: "B", desc: "General-purpose register for temporary storage." },
              { name: "C", desc: "General-purpose register for temporary storage." },
            ].map((r) => (
              <div key={r.name} className="glass-card p-4">
                <code className="font-mono font-bold text-primary">{r.name}</code>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
