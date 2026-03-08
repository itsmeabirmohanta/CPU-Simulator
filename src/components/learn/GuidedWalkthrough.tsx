import TourOverlay, { useTour, type TourStep } from "@/components/tour/TourOverlay";

const LEARN_TOUR_KEY = "cpuverse-learn-tour-done";

const learnSteps: TourStep[] = [
  {
    selector: "[data-tour='progress']",
    title: "Track Your Progress",
    description: "This bar shows how many lessons you've completed across all modules. Your progress is saved automatically.",
    position: "bottom",
  },
  {
    selector: "[data-tour='stats']",
    title: "Course at a Glance",
    description: "See the full scope — modules, lessons, videos, and estimated study time. Everything is self-paced.",
    position: "bottom",
  },
  {
    selector: "[data-tour='module-0']",
    title: "Explore Modules",
    description: "Click any module card to dive into its lessons. Each module covers a core area of CPU architecture with hands-on examples.",
    position: "bottom",
  },
  {
    selector: "[data-tour='learning-path']",
    title: "Follow the Path",
    description: "Modules build on each other. Follow the recommended order for the best experience, or jump to any topic you like.",
    position: "top",
  },
  {
    selector: "[data-tour='open-sim']",
    title: "Open the Simulator",
    description: "Jump into the full CPU simulator to write and run assembly programs. Try Beginner mode to start!",
    position: "bottom",
  },
];

export function useLearnTour() {
  return useTour(LEARN_TOUR_KEY);
}

// Keep backward-compatible export name
export const useWalkthrough = () => {
  const { showTour, dismissTour, restartTour } = useLearnTour();
  return { showWalkthrough: showTour, dismissWalkthrough: dismissTour, restartWalkthrough: restartTour };
};

interface Props {
  active: boolean;
  onDismiss: () => void;
}

export default function GuidedWalkthrough({ active, onDismiss }: Props) {
  return <TourOverlay active={active} steps={learnSteps} onDismiss={onDismiss} />;
}
