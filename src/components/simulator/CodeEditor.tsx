import { SAMPLE_PROGRAMS, validateLine, getValidOpcodes, INSTRUCTION_HINTS } from "@/lib/cpu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { AlertCircle, BookOpen, ChevronDown } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  currentPC: number;
  isRunning: boolean;
  onLoadSample: (code: string) => void;
  advanced: boolean;
}

function SyntaxLine({ line, isActive }: { line: string; isActive: boolean }) {
  const trimmed = line.trim();
  if (!trimmed) return <span>&nbsp;</span>;
  if (trimmed.startsWith(";") || trimmed.startsWith("//")) {
    return <span className="text-muted-foreground/60 italic">{line}</span>;
  }

  const addrMatch = trimmed.match(/^(\d{2}):\s*(.*)/);
  if (!addrMatch) return <span className="text-destructive">{line}</span>;

  const addr = addrMatch[1];
  const rest = addrMatch[2];

  if (/^\d+$/.test(rest)) {
    return (
      <span>
        <span className="text-muted-foreground">{addr}:</span>{" "}
        <span className="text-accent font-semibold">{rest}</span>
      </span>
    );
  }

  const parts = rest.split(/\s+/);
  const opcode = parts[0];
  const operand = parts.slice(1).join(" ");

  return (
    <span>
      <span className="text-muted-foreground">{addr}:</span>{" "}
      <span className="text-primary font-bold">{opcode}</span>
      {operand && <span className="text-foreground/80"> {operand}</span>}
    </span>
  );
}

export default function CodeEditor({ code, onChange, currentPC, isRunning, onLoadSample, advanced }: CodeEditorProps) {
  const lines = code.split("\n");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showRef, setShowRef] = useState(false);
  const [cursorLine, setCursorLine] = useState(0);
  const [showSamples, setShowSamples] = useState(false);
  const memSize = advanced ? 64 : 32;

  // Line-by-line validation
  const lineErrors = lines.map((line) => validateLine(line, advanced, memSize));
  const errorCount = lineErrors.filter(Boolean).length;

  // Detect current opcode for hint
  const currentLineText = lines[cursorLine]?.trim() || "";
  const currentOpMatch = currentLineText.match(/^\d{2}:\s*(\w+)/);
  const currentOp = currentOpMatch ? currentOpMatch[1].toUpperCase() : null;
  const hint = currentOp ? INSTRUCTION_HINTS[currentOp] : null;

  const handleCursorChange = useCallback(() => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      const beforeCursor = code.substring(0, pos);
      const lineNum = beforeCursor.split("\n").length - 1;
      setCursorLine(lineNum);
    }
  }, [code]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab inserts spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      onChange(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
    // Enter auto-inserts next address
    if (e.key === "Enter") {
      const ta = textareaRef.current!;
      const pos = ta.selectionStart;
      const currentLine = code.substring(0, pos).split("\n").pop() || "";
      const addrMatch = currentLine.match(/^(\d{2}):/);
      if (addrMatch) {
        const nextAddr = String(parseInt(addrMatch[1], 10) + 1).padStart(2, "0");
        e.preventDefault();
        const before = code.substring(0, pos);
        const after = code.substring(ta.selectionEnd);
        const insert = `\n${nextAddr}: `;
        onChange(before + insert + after);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = pos + insert.length; }, 0);
      }
    }
  }, [code, onChange]);

  const filteredSamples = Object.entries(SAMPLE_PROGRAMS).filter(([, p]) => !p.advanced || advanced);
  const validOps = getValidOpcodes(advanced);

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>✏️ Assembly Editor</span>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-destructive normal-case tracking-normal">
              <AlertCircle className="h-3 w-3" />
              {errorCount} error{errorCount > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => setShowRef(!showRef)}
            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded normal-case tracking-normal transition-colors ${showRef ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BookOpen className="h-3 w-3" /> Ref
          </button>
        </div>
      </div>

      {/* Quick Reference Panel */}
      <AnimatePresence>
        {showRef && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
          >
            <div className="p-2 bg-muted/30 max-h-[160px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-0.5">
                {validOps.map((op) => {
                  const info = INSTRUCTION_HINTS[op];
                  return (
                    <div key={op} className="flex items-baseline gap-1.5 px-1.5 py-0.5 rounded text-[10px] hover:bg-muted/50">
                      <code className="text-primary font-bold font-mono shrink-0">{op}</code>
                      <span className="text-muted-foreground truncate">{info?.desc || ""}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Programs Dropdown */}
      <div className="px-3 py-2 border-b">
        <button
          onClick={() => setShowSamples(!showSamples)}
          disabled={isRunning}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <span className="font-medium">Sample Programs</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${showSamples ? "rotate-180" : ""}`} />
          <span className="ml-auto text-[10px]">{filteredSamples.length} available</span>
        </button>
        <AnimatePresence>
          {showSamples && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 flex flex-wrap gap-1.5">
                {filteredSamples.map(([key, prog]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-auto py-1 px-2.5 normal-case tracking-normal rounded-full"
                    onClick={() => { onLoadSample(prog.code); setShowSamples(false); }}
                    disabled={isRunning}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{prog.name}</span>
                      <span className="text-muted-foreground text-[9px]">{prog.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Area */}
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
                  <span className="w-7 text-[10px] text-muted-foreground/40 select-none shrink-0 text-right pr-2">{i + 1}</span>
                  {isActive && (
                    <motion.span className="text-primary mr-1 text-xs" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>▶</motion.span>
                  )}
                  <SyntaxLine line={line} isActive={isActive} />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="relative flex h-full">
            {/* Line numbers + error indicators */}
            <div className="shrink-0 pt-3 pb-3 pr-0 select-none border-r bg-muted/20">
              {lines.map((_, i) => (
                <div key={i} className="flex items-center h-[21px]">
                  {lineErrors[i] ? (
                    <span className="w-7 text-center" title={lineErrors[i]!}>
                      <AlertCircle className="h-3 w-3 text-destructive mx-auto" />
                    </span>
                  ) : (
                    <span className="w-7 text-[10px] text-muted-foreground/40 text-right pr-2">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={handleCursorChange}
              onKeyUp={handleCursorChange}
              className="w-full h-full min-h-[280px] bg-transparent font-mono text-sm p-3 pl-2 resize-none focus:outline-none focus:ring-0 border-0 text-foreground leading-[21px]"
              placeholder={`; Write your assembly program here\n00: LDA 10\n01: ADD 11\n02: STA 12\n03: HLT\n10: 05\n11: 03\n12: 00`}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="px-3 py-1.5 border-t bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>Line {cursorLine + 1}</span>
          <span>{lines.filter((l) => l.trim()).length} lines</span>
          <span>Memory: {memSize} cells</span>
        </div>
        {hint && (
          <motion.div
            key={currentOp}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <code className="text-primary font-bold">{hint.syntax}</code>
            <span className="text-muted-foreground">— {hint.desc}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
