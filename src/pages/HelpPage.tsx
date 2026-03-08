import Navbar from "@/components/Navbar";

const basicInstructions = [
  { opcode: "LDA addr", desc: "Load the value at memory address into the Accumulator.", example: "LDA 10" },
  { opcode: "STA addr", desc: "Store the Accumulator value into memory address.", example: "STA 12" },
  { opcode: "ADD addr", desc: "Add the value at memory address to the Accumulator. Updates Z and CY flags.", example: "ADD 11" },
  { opcode: "SUB addr", desc: "Subtract the value at memory address from the Accumulator. Updates Z and CY flags.", example: "SUB 11" },
  { opcode: "MOV dst,src", desc: "Copy value from source register to destination register. Registers: A, B, C.", example: "MOV B,A" },
  { opcode: "INR reg", desc: "Increment the specified register by 1. Updates Z flag.", example: "INR A" },
  { opcode: "DCR reg", desc: "Decrement the specified register by 1. Updates Z flag.", example: "DCR A" },
  { opcode: "JMP addr", desc: "Unconditional jump — sets PC to the given address.", example: "JMP 00" },
  { opcode: "JZ addr", desc: "Jump to address if the Zero flag is set (Z=1).", example: "JZ 05" },
  { opcode: "HLT", desc: "Halt execution. The CPU stops processing.", example: "HLT" },
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

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-6">Instruction Set Reference</h1>

        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-3">Memory Format</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Programs are written as address-value pairs. Each line starts with a two-digit address followed by a colon:
          </p>
          <pre className="panel p-4 font-mono text-sm text-foreground">
{`00: LDA 10    ← instruction at address 00
01: ADD 11    ← instruction at address 01
10: 05        ← data value at address 10`}
          </pre>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-4">Basic Instructions</h2>
          <div className="space-y-3">
            {basicInstructions.map((inst) => (
              <div key={inst.opcode} className="panel p-4">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-mono font-bold text-primary">{inst.opcode}</code>
                  <code className="font-mono text-xs text-muted-foreground">{inst.example}</code>
                </div>
                <p className="text-sm text-muted-foreground">{inst.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-4">Advanced Instructions <span className="text-xs font-normal text-muted-foreground">(Advanced mode only)</span></h2>
          <div className="space-y-3">
            {advancedInstructions.map((inst) => (
              <div key={inst.opcode} className="panel p-4">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-mono font-bold text-primary">{inst.opcode}</code>
                  <code className="font-mono text-xs text-muted-foreground">{inst.example}</code>
                </div>
                <p className="text-sm text-muted-foreground">{inst.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-3">Flags</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="panel p-4">
              <code className="font-mono font-bold text-primary">Z (Zero)</code>
              <p className="text-sm text-muted-foreground mt-1">Set to 1 when the result of an arithmetic operation is zero.</p>
            </div>
            <div className="panel p-4">
              <code className="font-mono font-bold text-primary">CY (Carry)</code>
              <p className="text-sm text-muted-foreground mt-1">Set to 1 when an ADD overflows beyond 255 or SUB results in a borrow.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Registers</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "A (Accumulator)", desc: "Main register for arithmetic and data operations." },
              { name: "B", desc: "General-purpose register for temporary storage." },
              { name: "C", desc: "General-purpose register for temporary storage." },
            ].map((r) => (
              <div key={r.name} className="panel p-4">
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
