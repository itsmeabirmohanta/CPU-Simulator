import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw, Upload } from "lucide-react";
import { CpuStatus } from "@/lib/cpu";

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
        className="gap-1.5"
      >
        <Upload className="h-3.5 w-3.5" />
        Load
      </Button>
      <Button
        onClick={onStep}
        disabled={!hasProgram || isHaltedOrError || isRunning}
        variant="outline"
        size="sm"
        className="gap-1.5"
      >
        <SkipForward className="h-3.5 w-3.5" />
        Step
      </Button>
      {isRunning ? (
        <Button onClick={onPause} variant="outline" size="sm" className="gap-1.5">
          <Pause className="h-3.5 w-3.5" />
          Pause
        </Button>
      ) : (
        <Button
          onClick={onRun}
          disabled={!hasProgram || isHaltedOrError}
          size="sm"
          className="gap-1.5"
        >
          <Play className="h-3.5 w-3.5" />
          Run
        </Button>
      )}
      <Button onClick={onReset} variant="ghost" size="sm" className="gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
