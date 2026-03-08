import { MemoryCell } from "@/lib/cpu";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search } from "lucide-react";

interface MemoryViewerProps {
  memory: MemoryCell[];
  currentPC: number;
}

type ValueFormat = "dec" | "hex" | "bin";

function formatCellValue(value: number | string, format: ValueFormat): string {
  if (typeof value === "string") {
    return value.length > 4 ? value.substring(0, 4) : value;
  }
  if (format === "hex") return value.toString(16).toUpperCase().padStart(2, "0");
  if (format === "bin") return value.toString(2).padStart(8, "0").slice(-4);
  return String(value).padStart(2, "0");
}

export default function MemoryViewer({ memory, currentPC }: MemoryViewerProps) {
  const [format, setFormat] = useState<ValueFormat>("dec");
  const [searchAddr, setSearchAddr] = useState("");

  const jumpAddr = parseInt(searchAddr, 10);
  const isValidJump = !isNaN(jumpAddr) && jumpAddr >= 0 && jumpAddr < memory.length;

  const formats: ValueFormat[] = ["dec", "hex", "bin"];

  return (
    <div className="glass-card overflow-hidden h-full flex flex-col">
      <div className="px-4 py-2 border-b bg-muted/20 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Memory</span>
        <div className="flex items-center gap-2">
          {/* Search / jump to address */}
          <div className="flex items-center gap-1 rounded-md bg-muted/50 px-1.5 py-0.5">
            <Search className="h-2.5 w-2.5 text-muted-foreground/50" />
            <input
              type="text"
              value={searchAddr}
              onChange={e => setSearchAddr(e.target.value)}
              placeholder="Addr"
              className="bg-transparent text-[9px] font-mono w-8 focus:outline-none text-foreground placeholder:text-muted-foreground/30"
            />
          </div>
          {/* Format toggle */}
          <div className="flex items-center rounded-md bg-muted/50 p-0.5">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition-all ${
                  format === f ? "bg-primary/15 text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{memory.length} cells</span>
        </div>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="grid grid-cols-8 gap-1 mb-1.5">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="text-center text-[8px] font-mono text-muted-foreground/40 uppercase">+{i}</div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-8 gap-1">
          {memory.map((cell) => {
            const isPC = cell.address === currentPC;
            const isEmpty = cell.value === 0 && cell.type === "data";
            const isInstr = cell.type === "instruction";
            const isSearched = isValidJump && cell.address === jumpAddr;

            return (
              <motion.div
                key={cell.address}
                className={`relative flex flex-col items-center justify-center rounded-lg px-0.5 py-1.5 font-mono transition-all duration-200 cursor-default ${
                  isSearched ? "bg-warning/20 ring-2 ring-warning/50 shadow-sm" :
                  isPC ? "bg-primary/15 ring-1 ring-primary/40 shadow-sm" :
                  cell.changed ? "bg-warning/10 ring-1 ring-warning/30" :
                  isInstr ? "bg-primary/[0.04]" :
                  isEmpty ? "opacity-20" : ""
                }`}
                animate={cell.changed ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.25 }}
                title={`[${String(cell.address).padStart(2, "0")}] = ${cell.value} (${cell.type})`}
              >
                <span className="text-[7px] text-muted-foreground/40 leading-none mb-0.5">
                  {String(cell.address).padStart(2, "0")}
                </span>
                <span className={`text-[10px] font-semibold leading-none ${
                  isPC ? "text-primary" :
                  cell.changed ? "text-warning" :
                  isInstr ? "text-primary/70" : "text-foreground/60"
                } ${format === "bin" ? "text-[8px]" : ""}`}>
                  {formatCellValue(cell.value, format)}
                </span>
                {isPC && (
                  <motion.div
                    className="absolute -bottom-px left-1 right-1 h-[2px] bg-primary rounded-full"
                    layoutId="mem-pc"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-2 border-t text-[9px] text-muted-foreground/50">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> PC</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded bg-primary/30" /> Code</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded bg-warning/50" /> Modified</span>
        </div>
      </div>
    </div>
  );
}
