import { SAMPLE_PROGRAMS, validateLine, getValidOpcodes, INSTRUCTION_HINTS } from "@/lib/cpu";
import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { Code2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  currentPC: number;
  isRunning: boolean;
  onLoadSample: (code: string) => void;
  advanced: boolean;
}

function SyntaxHighlight({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return <span> </span>;
  if (trimmed.startsWith(";") || trimmed.startsWith("//")) {
    return <span className="text-muted-foreground/50 italic">{text}</span>;
  }

  const m = trimmed.match(/^(\d{2}):\s*(.*)/);
  if (!m) return <span className="text-destructive/70">{text}</span>;

  const [, addr, rest] = m;
  if (/^\d+$/.test(rest.trim())) {
    return <><span className="text-muted-foreground/60">{addr}: </span><span className="text-warning">{rest.trim()}</span></>;
  }

  const parts = rest.trim().split(/\s+/);
  return (
    <>
      <span className="text-muted-foreground/60">{addr}: </span>
      <span className="text-primary font-semibold">{parts[0]}</span>
      {parts.length > 1 && <span className="text-foreground/70"> {parts.slice(1).join(" ")}</span>}
    </>
  );
}

export default function CodeEditor({ code, onChange, currentPC, isRunning, onLoadSample, advanced }: CodeEditorProps) {
  const lines = code.split("\n");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [cursorLine, setCursorLine] = useState(0);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const memSize = advanced ? 64 : 32;

  const lineErrors = lines.map((line) => validateLine(line, advanced, memSize));
  const errorCount = lineErrors.filter(Boolean).length;

  const currentLineText = lines[cursorLine]?.trim() || "";
  const currentOpMatch = currentLineText.match(/^\d{2}:\s*(\w+)/);
  const currentOp = currentOpMatch ? currentOpMatch[1].toUpperCase() : null;
  const hint = currentOp ? INSTRUCTION_HINTS[currentOp] : null;

  const handleCursorChange = useCallback(() => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      setCursorLine(code.substring(0, pos).split("\n").length - 1);
    }
  }, [code]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      onChange(code.substring(0, start) + "  " + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
    if (e.key === "Enter") {
      const ta = textareaRef.current!;
      const pos = ta.selectionStart;
      const currentLine = code.substring(0, pos).split("\n").pop() || "";
      const addrMatch = currentLine.match(/^(\d{2}):/);
      if (addrMatch) {
        const nextAddr = String(parseInt(addrMatch[1], 10) + 1).padStart(2, "0");
        e.preventDefault();
        const insert = `\n${nextAddr}: `;
        onChange(code.substring(0, pos) + insert + code.substring(ta.selectionEnd));
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = pos + insert.length; }, 0);
      }
    }
  }, [code, onChange]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const filteredSamples = Object.entries(SAMPLE_PROGRAMS).filter(([, p]) => !p.advanced || advanced);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="text-[10px] text-destructive font-mono bg-destructive/10 px-1.5 py-0.5 rounded">{errorCount} err</span>
          )}
          <span className="text-[10px] text-muted-foreground font-mono">{lines.filter(l => l.trim()).length} lines</span>
        </div>
      </div>

      {/* Sample programs tabs */}
      <div className="flex items-center gap-0 border-b bg-muted/10 overflow-x-auto">
        {filteredSamples.map(([key, prog]) => (
          <button
            key={key}
            onClick={() => { onLoadSample(prog.code); setActiveSample(key); }}
            disabled={isRunning}
            className={`px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeSample === key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            } disabled:opacity-40`}
            title={prog.description}
          >
            {prog.name}
          </button>
        ))}
      </div>

      {/* Code area */}
      <div className="flex-1 relative sim-editor-bg overflow-hidden">
        {isRunning ? (
          <div className="h-full overflow-y-auto">
            {lines.map((line, i) => {
              const lineAddr = line.trim().match(/^(\d{2}):/);
              const addr = lineAddr ? parseInt(lineAddr[1], 10) : -1;
              const isActive = addr === currentPC;
              return (
                <div
                  key={i}
                  className={`flex items-stretch font-mono text-[13px] leading-6 ${
                    isActive ? "bg-primary/10" : ""
                  }`}
                >
                  <div className={`w-10 shrink-0 text-right pr-3 select-none sim-gutter text-[11px] leading-6 ${
                    isActive ? "!text-primary font-bold" : ""
                  }`}>
                    {i + 1}
                  </div>
                  <div className={`flex-1 pl-3 ${isActive ? "border-l-2 border-primary" : "border-l-2 border-transparent"}`}>
                    {isActive && (
                      <motion.span
                        className="text-primary mr-1.5 inline-block"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >▸</motion.span>
                    )}
                    <SyntaxHighlight text={line} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative h-full min-h-[320px]">
            {/* Syntax overlay */}
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none overflow-hidden"
              aria-hidden
            >
              {lines.map((line, i) => (
                <div key={i} className="flex items-stretch font-mono text-[13px] leading-6">
                  <div className={`w-10 shrink-0 text-right pr-3 select-none sim-gutter text-[11px] leading-6 ${
                    lineErrors[i] ? "!text-destructive" : ""
                  }`}>
                    {lineErrors[i] ? "●" : (i + 1)}
                  </div>
                  <div className={`flex-1 pl-3 border-l-2 ${
                    i === cursorLine ? "border-primary/40 bg-primary/[0.03]" : "border-transparent"
                  }`}>
                    <SyntaxHighlight text={line} />
                  </div>
                </div>
              ))}
            </div>
            {/* Actual textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={handleCursorChange}
              onKeyUp={handleCursorChange}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full bg-transparent font-mono text-[13px] leading-6 pl-[52px] pr-3 pt-0 resize-none focus:outline-none border-0 text-transparent caret-foreground selection:bg-primary/20"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3.5 py-1.5 border-t bg-muted/20 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
        <span>Ln {cursorLine + 1} · {advanced ? "ADV" : "BASIC"} · {memSize} cells</span>
        {hint && (
          <span className="text-primary/80">
            {hint.syntax} <span className="text-muted-foreground">— {hint.desc}</span>
          </span>
        )}
      </div>
    </div>
  );
}
