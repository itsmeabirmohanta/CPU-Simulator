import { MemoryCell } from "@/lib/cpu";
import { motion } from "framer-motion";
import { useState } from "react";

interface MemoryViewerProps {
  memory: MemoryCell[];
  currentPC: number;
}

export default function MemoryViewer({ memory, currentPC }: MemoryViewerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const usedCells = memory.filter((c) => c.value !== 0 || c.type === "instruction");

  return (
    <div className="panel">
      <div className="panel-header flex items-center justify-between">
        <span>🧠 Memory ({memory.length} cells)</span>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`text-[10px] px-2 py-0.5 rounded normal-case tracking-normal transition-colors ${viewMode === "grid" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`text-[10px] px-2 py-0.5 rounded normal-case tracking-normal transition-colors ${viewMode === "table" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Table
          </button>
        </div>
      </div>
      <div className="p-3 max-h-[350px] overflow-y-auto">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-8 gap-1">
            {memory.map((cell) => {
              const isPC = cell.address === currentPC;
              const isEmpty = cell.value === 0 && cell.type === "data";
              const isInstr = cell.type === "instruction";
              
              return (
                <motion.div
                  key={cell.address}
                  className={`relative flex flex-col items-center rounded-md border p-1 transition-all duration-300 cursor-default ${
                    isPC ? "border-primary bg-primary/10 ring-1 ring-primary/30" :
                    cell.changed ? "border-accent bg-accent/10" :
                    isInstr ? "border-primary/30 bg-primary/5" :
                    isEmpty ? "border-border/50 opacity-30" : "border-border"
                  }`}
                  animate={cell.changed ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  title={`Address: ${String(cell.address).padStart(2, "0")}\nValue: ${cell.value}\nType: ${cell.type}`}
                >
                  <span className="text-[7px] text-muted-foreground font-mono leading-none">
                    {String(cell.address).padStart(2, "0")}
                  </span>
                  <span className={`text-[10px] font-mono font-bold leading-tight ${
                    isPC ? "text-primary" : isInstr ? "text-primary" : "text-foreground"
                  }`}>
                    {typeof cell.value === "string" ? cell.value.split(" ")[0] : String(cell.value).padStart(2, "0")}
                  </span>
                  {isPC && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="grid grid-cols-4 gap-2 text-[9px] font-mono text-muted-foreground uppercase tracking-wider px-2 py-1 border-b">
              <span>Addr</span>
              <span>Value</span>
              <span>Type</span>
              <span>Status</span>
            </div>
            {(usedCells.length > 0 ? usedCells : memory.slice(0, 16)).map((cell) => {
              const isPC = cell.address === currentPC;
              return (
                <motion.div
                  key={cell.address}
                  className={`grid grid-cols-4 gap-2 text-xs font-mono px-2 py-1.5 rounded transition-all ${
                    isPC ? "bg-primary/10 border border-primary/30" :
                    cell.changed ? "bg-accent/10 border border-accent/30" : "hover:bg-muted/50"
                  }`}
                  animate={cell.changed ? { x: [0, 4, 0] } : {}}
                >
                  <span className="text-muted-foreground">{String(cell.address).padStart(2, "0")}</span>
                  <span className={`font-bold ${isPC ? "text-primary" : ""}`}>{String(cell.value)}</span>
                  <span className={`text-[10px] ${cell.type === "instruction" ? "text-primary" : "text-muted-foreground"}`}>
                    {cell.type === "instruction" ? "INSTR" : "DATA"}
                  </span>
                  <span>
                    {isPC && <span className="text-primary text-[10px]">← PC</span>}
                    {cell.changed && <span className="text-accent text-[10px]">★</span>}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="px-3 pb-2 flex gap-3 text-[9px] text-muted-foreground border-t pt-2">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> PC</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-primary/30" /> Instruction</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-accent/50" /> Changed</span>
      </div>
    </div>
  );
}
