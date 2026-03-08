import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const WALKTHROUGH_KEY = "cpuverse-walkthrough-done";

interface WalkthroughStep {
  selector: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const steps: WalkthroughStep[] = [
  {
    selector: "[data-tour='progress']",
    title: "Track Your Progress",
    description: "This bar shows how many lessons you've completed. Your progress is saved automatically.",
    position: "bottom",
  },
  {
    selector: "[data-tour='lesson-0']",
    title: "Your First Lesson",
    description: "Click any lesson card to expand it. Each one teaches a core CPU concept with hands-on examples.",
    position: "bottom",
  },
  {
    selector: "[data-tour='open-sim']",
    title: "Jump to the Simulator",
    description: "Use this button to open the full simulator where you can write and run your own programs.",
    position: "bottom",
  },
  {
    selector: "[data-tour='lesson-0']",
    title: "Try It Now!",
    description: "Expand the first lesson to see the mini-simulator, step through code, and mark it complete when you're ready.",
    position: "bottom",
  },
];

function getTooltipStyle(rect: DOMRect, position: string) {
  const gap = 12;
  const base: React.CSSProperties = { position: "fixed", zIndex: 10002 };
  switch (position) {
    case "bottom":
      return { ...base, top: rect.bottom + gap, left: rect.left, maxWidth: Math.min(360, window.innerWidth - 32) };
    case "top":
      return { ...base, bottom: window.innerHeight - rect.top + gap, left: rect.left, maxWidth: Math.min(360, window.innerWidth - 32) };
    case "right":
      return { ...base, top: rect.top, left: rect.right + gap, maxWidth: 320 };
    case "left":
      return { ...base, top: rect.top, right: window.innerWidth - rect.left + gap, maxWidth: 320 };
    default:
      return base;
  }
}

export function useWalkthrough() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(WALKTHROUGH_KEY);
    if (!done) setShow(true);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(WALKTHROUGH_KEY, "true");
    setShow(false);
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(WALKTHROUGH_KEY);
    setShow(true);
  }, []);

  return { showWalkthrough: show, dismissWalkthrough: dismiss, restartWalkthrough: restart };
}

interface Props {
  active: boolean;
  onDismiss: () => void;
}

export default function GuidedWalkthrough({ active, onDismiss }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const updateHighlight = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Small delay for scroll to finish
      setTimeout(() => {
        setHighlightRect(el.getBoundingClientRect());
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    updateHighlight(currentStep);
    const handleResize = () => updateHighlight(currentStep);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active, currentStep, updateHighlight]);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onDismiss();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (!active) return null;

  const step = steps[currentStep];
  const pad = 8;

  return (
    <>
      {/* Overlay with cutout */}
      <div
        className="fixed inset-0 z-[10000] pointer-events-auto"
        style={{
          background: highlightRect
            ? `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)`
            : "rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dark overlay using clip-path to create cutout */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: "rgba(0,0,0,0.55)",
            clipPath: highlightRect
              ? `polygon(
                  0% 0%, 100% 0%, 100% 100%, 0% 100%,
                  0% ${highlightRect.top - pad}px,
                  ${highlightRect.left - pad}px ${highlightRect.top - pad}px,
                  ${highlightRect.left - pad}px ${highlightRect.bottom + pad}px,
                  ${highlightRect.right + pad}px ${highlightRect.bottom + pad}px,
                  ${highlightRect.right + pad}px ${highlightRect.top - pad}px,
                  0% ${highlightRect.top - pad}px
                )`
              : undefined,
          }}
        />

        {/* Highlight ring */}
        {highlightRect && (
          <motion.div
            className="absolute rounded-2xl border-2 border-primary glow-primary pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              top: highlightRect.top - pad,
              left: highlightRect.left - pad,
              width: highlightRect.width + pad * 2,
              height: highlightRect.height + pad * 2,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {highlightRect && step && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="glass-card p-4 shadow-xl border-primary/20"
            style={getTooltipStyle(highlightRect, step.position)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <h4 className="font-display font-semibold text-sm text-foreground">{step.title}</h4>
              </div>
              <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">
                {currentStep + 1}/{steps.length}
              </span>
              <div className="flex items-center gap-1.5">
                {currentStep > 0 && (
                  <Button size="sm" variant="ghost" onClick={prev} className="h-7 px-2 text-xs gap-1">
                    <ChevronLeft className="h-3 w-3" /> Back
                  </Button>
                )}
                <Button size="sm" onClick={next} className="h-7 px-3 text-xs gap-1 bg-primary text-primary-foreground">
                  {currentStep === steps.length - 1 ? "Get Started!" : "Next"}
                  {currentStep < steps.length - 1 && <ChevronRight className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
