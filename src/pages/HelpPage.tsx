import Navbar from "@/components/Navbar";

const instructions = [
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
          <h2 className="font-display text-lg font-semibold mb-4">Supported Instructions</h2>
          <div className="space-y-3">
            {instructions.map((inst) => (
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
