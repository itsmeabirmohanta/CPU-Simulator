import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

export interface TourStep {
  selector: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

interface TourOverlayProps {
  active: boolean;
  steps: TourStep[];
  onDismiss: () => void;
}

function isInViewport(rect: DOMRect) {
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

function resolvePosition(rect: DOMRect, preferred: string): string {
  const spaceAbove = rect.top;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceLeft = rect.left;
  const spaceRight = window.innerWidth - rect.right;
  const minSpace = 120;

  if (preferred === "top" && spaceAbove < minSpace) return "bottom";
  if (preferred === "bottom" && spaceBelow < minSpace) return "top";
  if (preferred === "right" && spaceRight < minSpace) return spaceLeft > minSpace ? "left" : "bottom";
  if (preferred === "left" && spaceLeft < minSpace) return spaceRight > minSpace ? "right" : "bottom";
  return preferred;
}

function getTooltipStyle(rect: DOMRect, position: string): React.CSSProperties {
  const gap = 14;
  const pos = resolvePosition(rect, position);
  const base: React.CSSProperties = { position: "fixed", zIndex: 10002 };
  const maxW = Math.min(360, window.innerWidth - 32);
  const clampLeft = (l: number) => Math.max(16, Math.min(l, window.innerWidth - maxW - 16));

  switch (pos) {
    case "bottom":
      return { ...base, top: Math.min(rect.bottom + gap, window.innerHeight - 180), left: clampLeft(rect.left), maxWidth: maxW };
    case "top":
      return { ...base, bottom: Math.max(window.innerHeight - rect.top + gap, 16), left: clampLeft(rect.left), maxWidth: maxW };
    case "right":
      return { ...base, top: Math.max(16, Math.min(rect.top, window.innerHeight - 200)), left: Math.min(rect.right + gap, window.innerWidth - 340), maxWidth: 320 };
    case "left":
      return { ...base, top: Math.max(16, Math.min(rect.top, window.innerHeight - 200)), right: Math.max(16, window.innerWidth - rect.left + gap), maxWidth: 320 };
    default:
      return base;
  }
}

export default function TourOverlay({ active, steps, onDismiss }: TourOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateHighlight = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;
    const el = document.querySelector(step.selector);
    if (!el) {
      // Auto-skip missing elements after a short delay
      skipTimerRef.current = setTimeout(() => {
        if (stepIndex < steps.length - 1) {
          setCurrentStep(stepIndex + 1);
        } else {
          onDismiss();
        }
      }, 200);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (!isInViewport(rect)) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightRect(el.getBoundingClientRect()), 400);
    } else {
      setHighlightRect(rect);
    }
  }, [steps, onDismiss]);

  useEffect(() => {
    if (!active) {
      setCurrentStep(0);
      setHighlightRect(null);
      return;
    }
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    updateHighlight(currentStep);

    const refresh = () => {
      const step = steps[currentStep];
      if (!step) return;
      const el = document.querySelector(step.selector);
      if (el) setHighlightRect(el.getBoundingClientRect());
    };

    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, true);
    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh, true);
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, [active, currentStep, updateHighlight, steps]);

  if (!active || steps.length === 0) return null;

  const step = steps[currentStep];
  const pad = 8;

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else onDismiss();
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[10000] pointer-events-auto" onClick={(e) => e.stopPropagation()}>
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
        {highlightRect && (
          <motion.div
            className="absolute rounded-2xl border-2 border-primary pointer-events-none"
            style={{ boxShadow: "0 0 0 4px hsl(var(--primary) / 0.15)" }}
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

      <AnimatePresence mode="wait">
        {highlightRect && step && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed z-[10002] bg-card border border-border rounded-xl p-4 shadow-2xl"
            style={getTooltipStyle(highlightRect, step.position)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
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
                <Button size="sm" onClick={next} className="h-7 px-3 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  {currentStep === steps.length - 1 ? "Get Started!" : "Next"}
                  {currentStep < steps.length - 1 && <ChevronRight className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}

export function useTour(storageKey: string) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) setShow(true);
  }, [storageKey]);

  const dismiss = useCallback(() => {
    localStorage.setItem(storageKey, "true");
    setShow(false);
  }, [storageKey]);

  const restart = useCallback(() => {
    localStorage.removeItem(storageKey);
    setShow(true);
  }, [storageKey]);

  return { showTour: show, dismissTour: dismiss, restartTour: restart };
}
