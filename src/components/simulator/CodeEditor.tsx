import { SAMPLE_PROGRAMS } from "@/lib/cpu";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  currentPC: number;
  isRunning: boolean;
  onLoadSample: (code: string) => void;
}

export default function CodeEditor({ code, onChange, currentPC, isRunning, onLoadSample }: CodeEditorProps) {
  const lines = code.split("\n");

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header flex items-center justify-between">
        <span>Assembly Editor</span>
        <div className="flex gap-1">
          {Object.entries(SAMPLE_PROGRAMS).map(([key, prog]) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className="text-[10px] h-6 px-2 normal-case tracking-normal"
              onClick={() => onLoadSample(prog.code)}
              disabled={isRunning}
              title={prog.description}
            >
              {prog.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 relative">
        {isRunning ? (
          <div className="p-0 font-mono text-sm">
            {lines.map((line, i) => {
              const lineAddr = line.trim().match(/^(\d{2}):/);
              const addr = lineAddr ? parseInt(lineAddr[1], 10) : -1;
              const isActive = addr === currentPC;
              return (
                <div key={i} className={isActive ? "code-line-active" : "code-line"}>
                  {line || "\u00A0"}
                </div>
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
