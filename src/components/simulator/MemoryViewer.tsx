import { MemoryCell } from "@/lib/cpu";
import { motion } from "framer-motion";

interface MemoryViewerProps {
  memory: MemoryCell[];
  currentPC: number;
}

export default function MemoryViewer({ memory, currentPC }: MemoryViewerProps) {
  return (
    <div className="sim-panel">
      <div className="sim-panel-header">
        <span className="sim-panel-title">Memory</span>
        <span className="text-[10px] font-mono text-muted-foreground">{memory.length} cells</span>
      </div>
      <div className="p-2 max-h-[320px] overflow-y-auto">
        {/* Header */}
        <div className="grid grid-cols-8 gap-0.5 mb-1">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="text-center text-[8px] font-mono text-muted-foreground/50 uppercase">+{i}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-8 gap-0.5">
          {memory.map((cell) => {
            const isPC = cell.address === currentPC;
            const isEmpty = cell.value === 0 && cell.type === "data";
            const isInstr = cell.type === "instruction";

            return (
              <motion.div
                key={cell.address}
                className={`relative flex flex-col items-center justify-center rounded px-0.5 py-1 font-mono transition-all duration-200 cursor-default ${
                  isPC ? "bg-primary/15 ring-1 ring-primary/50" :
                  cell.changed ? "bg-warning/10 ring-1 ring-warning/40" :
                  isInstr ? "bg-primary/[0.04]" :
                  isEmpty ? "opacity-25" : ""
                }`}
                animate={cell.changed ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.25 }}
                title={`[${String(cell.address).padStart(2, "0")}] = ${cell.value} (${cell.type})`}
              >
                <span className="text-[7px] text-muted-foreground/50 leading-none mb-0.5">
                  {String(cell.address).padStart(2, "0")}
                </span>
                <span className={`text-[10px] font-semibold leading-none ${
                  isPC ? "text-primary" :
                  cell.changed ? "text-warning" :
                  isInstr ? "text-primary/80" : "text-foreground/70"
                }`}>
                  {typeof cell.value === "string"
                    ? cell.value.length > 3 ? cell.value.substring(0, 3) : cell.value
                    : String(cell.value).padStart(2, "0")
                  }
                </span>
                {isPC && (
                  <motion.div
                    className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary rounded-full"
                    layoutId="mem-pc"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t text-[9px] text-muted-foreground/60">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> PC</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded bg-primary/30" /> Code</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded bg-warning/50" /> Modified</span>
        </div>
      </div>
    </div>
  );
}
