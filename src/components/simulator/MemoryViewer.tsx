import { MemoryCell } from "@/lib/cpu";
import { motion } from "framer-motion";

interface MemoryViewerProps {
  memory: MemoryCell[];
  currentPC: number;
}

export default function MemoryViewer({ memory, currentPC }: MemoryViewerProps) {
  return (
    <div className="panel">
      <div className="panel-header">Memory</div>
      <div className="p-3 max-h-[400px] overflow-y-auto">
        <div className="grid grid-cols-4 gap-1">
          {memory.map((cell) => {
            const isPC = cell.address === currentPC;
            const isEmpty = cell.value === 0 && cell.type === "data";
            let cellClass = "memory-cell";
            if (isPC) cellClass = "memory-cell-active";
            else if (cell.changed) cellClass = "memory-cell-changed";

            return (
              <motion.div
                key={cell.address}
                className={`${cellClass} flex flex-col items-center ${isEmpty ? "opacity-40" : ""}`}
                animate={cell.changed ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[9px] text-muted-foreground">
                  {String(cell.address).padStart(2, "0")}
                </span>
                <span className={`text-xs font-semibold ${cell.type === "instruction" ? "text-primary" : "text-foreground"}`}>
                  {typeof cell.value === "string" ? cell.value.split(" ")[0] : String(cell.value).padStart(2, "0")}
                </span>
                {isPC && (
                  <motion.div
                    className="h-0.5 w-full bg-primary rounded mt-0.5"
                    layoutId="pc-indicator"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
