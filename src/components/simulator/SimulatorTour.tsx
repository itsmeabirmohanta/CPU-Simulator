import TourOverlay, { useTour, type TourStep } from "@/components/tour/TourOverlay";

const BEGINNER_TOUR_KEY = "cpuverse-sim-beginner-tour-done";
const ADVANCED_TOUR_KEY = "cpuverse-sim-advanced-tour-done";

const beginnerSteps: TourStep[] = [
  {
    selector: "[data-tour='sim-mode-toggle']",
    title: "Choose Your Mode",
    description: "Switch between Beginner (visual, guided) and Advanced (full code editor, memory inspector, execution trace).",
    position: "bottom",
  },
  {
    selector: "[data-tour='sim-samples']",
    title: "Pick a Program",
    description: "Select a sample program to explore. Each one demonstrates a different CPU concept like addition, loops, or sorting.",
    position: "right",
  },
  {
    selector: "[data-tour='sim-controls']",
    title: "Control Execution",
    description: "Load your program, then Step through one instruction at a time or Run to auto-execute. Adjust speed with the slider.",
    position: "bottom",
  },
  {
    selector: "[data-tour='sim-visual']",
    title: "Watch the CPU",
    description: "See registers, memory, and data flow update in real time as each instruction executes. This is your visual CPU!",
    position: "left",
  },
];

const advancedSteps: TourStep[] = [
  {
    selector: "[data-tour='sim-mode-toggle']",
    title: "Choose Your Mode",
    description: "You're in Advanced mode — full access to the code editor, memory inspector, and execution trace.",
    position: "bottom",
  },
  {
    selector: "[data-tour='sim-editor']",
    title: "Write Assembly Code",
    description: "Write your own assembly programs or load samples. The editor highlights syntax and validates your code in real time.",
    position: "right",
  },
  {
    selector: "[data-tour='sim-controls']",
    title: "Control Execution",
    description: "Load, Step, Run, Pause, or Reset. Use keyboard shortcuts: L to load, Space to step, Shift+Space to run, R to reset.",
    position: "bottom",
  },
  {
    selector: "[data-tour='sim-diagram']",
    title: "CPU Diagram & State",
    description: "See data flow between registers, ALU, and memory. Switch tabs to view detailed state, explanations, or memory contents.",
    position: "left",
  },
  {
    selector: "[data-tour='sim-memory']",
    title: "Inspect Memory & Trace",
    description: "View all 256 memory cells and the full execution log. Search by address and export your trace for review.",
    position: "top",
  },
];

export function useSimulatorTour(mode: "beginner" | "advanced") {
  return useTour(mode === "beginner" ? BEGINNER_TOUR_KEY : ADVANCED_TOUR_KEY);
}

interface Props {
  active: boolean;
  mode: "beginner" | "advanced";
  onDismiss: () => void;
}

export default function SimulatorTour({ active, mode, onDismiss }: Props) {
  const steps = mode === "beginner" ? beginnerSteps : advancedSteps;
  return <TourOverlay active={active} steps={steps} onDismiss={onDismiss} />;
}
