import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

// ─── Inline Spinner (non-fullscreen) ────────────────────────────────────────
const sizeMap = { sm: 20, md: 32, lg: 52 };

function SpinnerLoader({ size = "md", text }: Omit<LoaderProps, "fullScreen">) {
  const px = sizeMap[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        width={px}
        height={px}
        viewBox="0 0 52 52"
        fill="none"
        className="drop-shadow-[0_0_8px_hsl(252_85%_68%/0.6)]"
      >
        {/* Static outer ring */}
        <circle cx="26" cy="26" r="23" stroke="hsl(252 85% 68% / 0.12)" strokeWidth="3" />
        {/* Spinning gradient arc */}
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          stroke="hsl(252 85% 68%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="36 108"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "26px 26px" }}
        />
        {/* Inner pulsing dot */}
        <motion.circle
          cx="26"
          cy="26"
          r="5"
          fill="hsl(252 85% 68%)"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {text && (
        <motion.p
          className="text-xs font-mono text-muted-foreground tracking-widest uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// ─── Full-Screen CPU Boot Loader ─────────────────────────────────────────────
const BOOT_STAGES = [
  { label: "BIOS POST", detail: "Power-on self-test…", color: "hsl(168 72% 46%)", pct: 15 },
  { label: "LOADING REGISTERS", detail: "Initialising ALU & CU…", color: "hsl(252 85% 68%)", pct: 38 },
  { label: "FETCH CYCLE", detail: "PC → MAR → MDR…", color: "hsl(262 80% 72%)", pct: 60 },
  { label: "DECODE CYCLE", detail: "Decoding instruction…", color: "hsl(38 92% 55%)", pct: 80 },
  { label: "EXECUTE CYCLE", detail: "ALU execute…", color: "hsl(252 85% 68%)", pct: 95 },
  { label: "READY", detail: "System online", color: "hsl(168 72% 46%)", pct: 100 },
];

// Circuit node positions (x,y pairs as % of 400×300 svg)
const NODES = [
  [10, 20], [30, 20], [50, 20], [70, 20], [90, 20],
  [10, 50], [30, 50], [50, 50], [70, 50], [90, 50],
  [10, 80], [30, 80], [50, 80], [70, 80], [90, 80],
];

const LINES = [
  [[10,20],[30,20]], [[30,20],[50,20]], [[50,20],[70,20]], [[70,20],[90,20]],
  [[10,50],[30,50]], [[30,50],[50,50]], [[50,50],[70,50]], [[70,50],[90,50]],
  [[10,80],[30,80]], [[30,80],[50,80]], [[50,80],[70,80]], [[70,80],[90,80]],
  [[10,20],[10,50]], [[10,50],[10,80]],
  [[30,20],[30,50]], [[30,50],[30,80]],
  [[50,20],[50,50]], [[50,50],[50,80]],
  [[70,20],[70,50]], [[70,50],[70,80]],
  [[90,20],[90,50]], [[90,50],[90,80]],
];

function HexCounter() {
  const [val, setVal] = useState(0x0000);
  useEffect(() => {
    const id = setInterval(() => setVal((v) => (v + Math.floor(Math.random() * 0x3f + 1)) & 0xffff), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[10px] tabular-nums text-primary/60 tracking-widest">
      0x{val.toString(16).toUpperCase().padStart(4, "0")}
    </span>
  );
}

function CircuitBackground({ activeNode }: { activeNode: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full opacity-[0.15]"
      preserveAspectRatio="xMidYMid slice"
    >
      {LINES.map(([[x1, y1], [x2, y2]], i) => (
        <motion.line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="hsl(252 85% 68%)"
          strokeWidth="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
        />
      ))}
      {NODES.map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r="1.2"
          fill={i === activeNode ? "hsl(252 85% 68%)" : "hsl(252 85% 68% / 0.5)"}
          animate={i === activeNode ? {
            r: [1.2, 2.2, 1.2],
            opacity: [0.5, 1, 0.5],
          } : {}}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function FullScreenLoader({ text }: { text?: string }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeNode, setActiveNode] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Progress bar
    const target = BOOT_STAGES[stage].pct;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= target) {
          clearInterval(intervalRef.current!);
          return target;
        }
        return p + 1;
      });
    }, 18);
    return () => clearInterval(intervalRef.current!);
  }, [stage]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveNode((n) => (n + 1) % NODES.length);
    }, 160);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= BOOT_STAGES[stage].pct && stage < BOOT_STAGES.length - 1) {
      const t = setTimeout(() => setStage((s) => s + 1), 320);
      return () => clearTimeout(t);
    }
  }, [progress, stage]);

  const current = BOOT_STAGES[stage];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "hsl(230 28% 5%)" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Circuit SVG background */}
      <CircuitBackground activeNode={activeNode} />

      {/* Radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, hsl(252 85% 68% / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, hsl(0 0% 100% / 0.012) 3px, hsl(0 0% 100% / 0.012) 4px)",
        }}
      />

      {/* ── Core Card ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-8 py-10 w-[min(420px,90vw)]"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* CPU die graphic */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer pulsing halo */}
          <motion.div
            className="absolute inset-0 rounded-xl border border-primary/20"
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Main CPU square */}
          <motion.div
            className="relative w-16 h-16 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, hsl(230 25% 9%), hsl(230 25% 13%))",
              border: "1.5px solid hsl(252 85% 68% / 0.35)",
              boxShadow: "0 0 28px hsl(252 85% 68% / 0.18), inset 0 1px 0 hsl(252 85% 68% / 0.1)",
            }}
            animate={{ boxShadow: [
              "0 0 28px hsl(252 85% 68% / 0.18), inset 0 1px 0 hsl(252 85% 68% / 0.1)",
              "0 0 40px hsl(252 85% 68% / 0.32), inset 0 1px 0 hsl(252 85% 68% / 0.15)",
              "0 0 28px hsl(252 85% 68% / 0.18), inset 0 1px 0 hsl(252 85% 68% / 0.1)",
            ]}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Inner circuit grid */}
            <svg viewBox="0 0 32 32" className="w-10 h-10 opacity-90">
              <rect x="8" y="8" width="16" height="16" rx="2"
                fill="none" stroke="hsl(252 85% 68%)" strokeWidth="1" />
              <line x1="16" y1="8" x2="16" y2="4" stroke="hsl(252 85% 68%)" strokeWidth="0.8" />
              <line x1="16" y1="24" x2="16" y2="28" stroke="hsl(252 85% 68%)" strokeWidth="0.8" />
              <line x1="8" y1="16" x2="4" y2="16" stroke="hsl(252 85% 68%)" strokeWidth="0.8" />
              <line x1="24" y1="16" x2="28" y2="16" stroke="hsl(252 85% 68%)" strokeWidth="0.8" />
              <line x1="8" y1="12" x2="4" y2="12" stroke="hsl(168 72% 46%)" strokeWidth="0.8" />
              <line x1="8" y1="20" x2="4" y2="20" stroke="hsl(168 72% 46%)" strokeWidth="0.8" />
              <line x1="24" y1="12" x2="28" y2="12" stroke="hsl(168 72% 46%)" strokeWidth="0.8" />
              <line x1="24" y1="20" x2="28" y2="20" stroke="hsl(168 72% 46%)" strokeWidth="0.8" />
              <motion.rect x="11" y="11" width="10" height="10" rx="1"
                fill="hsl(252 85% 68% / 0.12)"
                stroke="hsl(252 85% 68% / 0.5)"
                strokeWidth="0.6"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <motion.circle cx="16" cy="16" r="2"
                fill={current.color}
                animate={{ r: [2, 2.8, 2], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </svg>
          </motion.div>

          {/* Spinning orbit */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              border: "1px dashed hsl(252 85% 68% / 0.25)",
              transformOrigin: "center",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* App title */}
        <div className="text-center">
          <motion.h1
            className="font-display font-bold text-2xl tracking-tight"
            style={{
              background: "linear-gradient(135deg, hsl(252 85% 78%), hsl(168 72% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CPU Simulator
          </motion.h1>
          <HexCounter />
        </div>

        {/* Stage label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase mb-0.5"
              style={{ color: current.color }}
            >
              {current.label}
            </p>
            <p className="text-xs text-muted-foreground font-mono">{current.detail}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full">
          <div
            className="relative h-[3px] w-full rounded-full overflow-hidden"
            style={{ background: "hsl(230 25% 14%)" }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${current.color}, hsl(252 85% 68%))`,
                boxShadow: `0 0 8px ${current.color}`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
            {/* Shimmer on bar */}
            <motion.div
              className="absolute inset-y-0 w-12 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.25), transparent)",
                left: `calc(${progress}% - 3rem)`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] font-mono text-muted-foreground/50">INIT</span>
            <span className="text-[10px] font-mono" style={{ color: current.color }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Stage dots */}
        <div className="flex gap-2 items-center">
          {BOOT_STAGES.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: i === stage ? 18 : 5,
                height: 5,
                background:
                  i < stage
                    ? "hsl(168 72% 46%)"
                    : i === stage
                    ? current.color
                    : "hsl(230 25% 18%)",
                boxShadow: i === stage ? `0 0 6px ${current.color}` : "none",
              }}
              animate={{ width: i === stage ? 18 : 5 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {text && (
          <p className="text-[10px] font-mono text-muted-foreground/40 tracking-widest">
            {text}
          </p>
        )}
      </motion.div>

      {/* Bottom watermark */}
      <div className="absolute bottom-5 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase">
            Secure Boot Active
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Default Export ───────────────────────────────────────────────────────────
export default function Loader({ size = "md", text, fullScreen = false }: LoaderProps) {
  if (fullScreen) {
    return <FullScreenLoader text={text} />;
  }
  return <SpinnerLoader size={size} text={text} />;
}
