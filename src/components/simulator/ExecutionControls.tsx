import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw, Upload, Zap } from "lucide-react";
import { CpuStatus } from "@/lib/cpu";
import { motion } from "framer-motion";

interface ExecutionControlsProps {
  status: CpuStatus;
  onLoad: () => void;
  onStep: () => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  hasProgram: boolean;
}

export default function ExecutionControls({
  status,
  onLoad,
  onStep,
  onRun,
  onPause,
  onReset,
  hasProgram,
}: ExecutionControlsProps) {
  const isHaltedOrError = status === "halted" || status === "error";
  const isRunning = status === "running";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        onClick={onLoad}
        disabled={isRunning}
        variant="outline"
        size="sm"
        className="gap-1.5 rounded-full"
      >
        <Upload className="h-3.5 w-3.5" />
        Load
      </Button>
      <Button
        onClick={onStep}
        disabled={!hasProgram || isHaltedOrError || isRunning}
        variant="outline"
        size="sm"
        className="gap-1.5 rounded-full"
      >
        <SkipForward className="h-3.5 w-3.5" />
        Step
      </Button>
      {isRunning ? (
        <Button onClick={onPause} variant="outline" size="sm" className="gap-1.5 rounded-full">
          <Pause className="h-3.5 w-3.5" />
          Pause
        </Button>
      ) : (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRun}
            disabled={!hasProgram || isHaltedOrError}
            size="sm"
            className="gap-1.5 rounded-full"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
        </motion.div>
      )}
      <Button onClick={onReset} variant="ghost" size="sm" className="gap-1.5 rounded-full">
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>

      {/* Status indicator */}
      {hasProgram && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-2 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground"
        >
          <Zap className="h-3 w-3" />
          {status === "running" ? "Executing..." : status === "halted" ? "Complete" : status === "error" ? "Error" : status === "paused" ? "Paused" : "Ready"}
        </motion.div>
      )}
    </div>
  );
}
