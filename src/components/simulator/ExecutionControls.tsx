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

function ControlBtn({ onClick, disabled, children, variant = "default" }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          : "bg-muted hover:bg-muted/80 text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function ExecutionControls({
  status, onLoad, onStep, onRun, onPause, onReset, hasProgram,
}: ExecutionControlsProps) {
  const isHaltedOrError = status === "halted" || status === "error";
  const isRunning = status === "running";

  return (
    <div className="flex items-center gap-1.5">
      <ControlBtn onClick={onLoad} disabled={isRunning}>
        <Upload className="h-3.5 w-3.5" /> Load
      </ControlBtn>
      <ControlBtn onClick={onStep} disabled={!hasProgram || isHaltedOrError || isRunning}>
        <SkipForward className="h-3.5 w-3.5" /> Step
      </ControlBtn>
      {isRunning ? (
        <ControlBtn onClick={onPause}>
          <Pause className="h-3.5 w-3.5" /> Pause
        </ControlBtn>
      ) : (
        <ControlBtn onClick={onRun} disabled={!hasProgram || isHaltedOrError} variant="primary">
          <Play className="h-3.5 w-3.5" /> Run
        </ControlBtn>
      )}
      <ControlBtn onClick={onReset}>
        <RotateCcw className="h-3.5 w-3.5" />
      </ControlBtn>
    </div>
  );
}
