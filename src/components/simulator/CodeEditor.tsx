import { SAMPLE_PROGRAMS } from "@/lib/cpu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  currentPC: number;
  isRunning: boolean;
  onLoadSample: (code: string) => void;
}

function SyntaxLine({ line, isActive, lineIndex }: { line: string; isActive: boolean; lineIndex: number }) {
  // Simple syntax coloring
  const trimmed = line.trim();
  if (!trimmed) return <span>&nbsp;</span>;

  const addrMatch = trimmed.match(/^(\d{2}):\s*(.*)/);
  if (!addrMatch) return <span className="text-muted-foreground">{line}</span>;

  const addr = addrMatch[1];
  const rest = addrMatch[2];

  // Check if it's data (pure number)
  if (/^\d+$/.test(rest)) {
    return (
      <span>
        <span className="text-muted-foreground">{addr}:</span>{" "}
        <span className="text-accent">{rest}</span>
      </span>
    );
  }

  // It's an instruction
  const parts = rest.split(/\s+/);
  const opcode = parts[0];
  const operand = parts.slice(1).join(" ");

  return (
    <span>
      <span className="text-muted-foreground">{addr}:</span>{" "}
      <span className="text-primary font-semibold">{opcode}</span>
      {operand && <span className="text-foreground"> {operand}</span>}
    </span>
  );
}

export default function CodeEditor({ code, onChange, currentPC, isRunning, onLoadSample }: CodeEditorProps) {
  const lines = code.split("\n");

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>✏️ Assembly Editor</span>
      </div>
      {/* Sample programs */}
      <div className="px-3 py-2 border-b flex flex-wrap gap-1.5">
        {Object.entries(SAMPLE_PROGRAMS).map(([key, prog]) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="text-[10px] h-6 px-2.5 normal-case tracking-normal rounded-full"
            onClick={() => onLoadSample(prog.code)}
            disabled={isRunning}
            title={prog.description}
          >
            {prog.name}
          </Button>
        ))}
      </div>
      <div className="flex-1 relative">
        {isRunning ? (
          <div className="p-0 font-mono text-sm">
            {lines.map((line, i) => {
              const lineAddr = line.trim().match(/^(\d{2}):/);
              const addr = lineAddr ? parseInt(lineAddr[1], 10) : -1;
              const isActive = addr === currentPC;
              return (
                <motion.div
                  key={i}
                  className={`flex items-center ${isActive ? "code-line-active" : "code-line"}`}
                  animate={isActive ? { backgroundColor: ["hsl(var(--primary) / 0.1)", "hsl(var(--primary) / 0.2)", "hsl(var(--primary) / 0.1)"] } : {}}
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                >
                  <span className="w-6 text-[10px] text-muted-foreground/50 select-none shrink-0">{i + 1}</span>
                  {isActive && (
                    <motion.span
                      className="text-primary mr-1"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ▶
                    </motion.span>
                  )}
                  <SyntaxLine line={line} isActive={isActive} lineIndex={i} />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full min-h-[300px] bg-transparent font-mono text-sm p-3 resize-none focus:outline-none focus:ring-0 border-0 text-foreground"
            placeholder={`Enter assembly code...\n\nExample:\n00: LDA 10\n01: ADD 11\n02: STA 12\n03: HLT\n10: 05\n11: 03\n12: 00`}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
