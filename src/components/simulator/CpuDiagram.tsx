import { CpuState } from "@/lib/cpu";
import { motion } from "framer-motion";

interface CpuDiagramProps {
  state: CpuState;
  previousState: CpuState;
  activeFlow: "fetch" | "decode" | "execute" | "idle";
}

export default function CpuDiagram({ state, previousState, activeFlow }: CpuDiagramProps) {
  const aChanged = state.accumulator !== previousState.accumulator;
  const bChanged = state.registerB !== previousState.registerB;
  const cChanged = state.registerC !== previousState.registerC;
  const pcChanged = state.programCounter !== previousState.programCounter;
  const irChanged = state.instructionRegister !== previousState.instructionRegister;

  return (
    <div className="panel">
      <div className="panel-header">CPU Architecture</div>
      <div className="p-4">
        <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ minHeight: 200 }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary))" opacity="0.6" />
            </marker>
            <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary))" />
            </marker>
          </defs>
          <rect width="480" height="280" fill="url(#grid)" rx="8" />

          {/* CPU boundary box */}
          <rect x="10" y="10" width="460" height="260" rx="8" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 2" />
          <text x="24" y="28" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" fontWeight="600" letterSpacing="2">CPU</text>

          {/* PC Box */}
          <RegisterBlock x={30} y={45} w={90} h={50} label="PC" value={String(state.programCounter).padStart(2, "0")} active={pcChanged} highlight={activeFlow === "fetch"} />

          {/* IR Box */}
          <RegisterBlock x={30} y={115} w={90} h={50} label="IR" value={state.instructionRegister || "—"} active={irChanged} highlight={activeFlow === "decode"} />

          {/* ALU */}
          <motion.g animate={activeFlow === "execute" ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }} transition={{ duration: 1, repeat: activeFlow === "execute" ? Infinity : 0 }}>
            <polygon points="240,190 195,240 285,240" fill="hsl(var(--primary) / 0.08)" stroke={activeFlow === "execute" ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth={activeFlow === "execute" ? "2" : "1"} />
            <text x="240" y="228" textAnchor="middle" fontSize="11" fill="hsl(var(--primary))" fontFamily="var(--font-mono)" fontWeight="700">ALU</text>
          </motion.g>

          {/* Accumulator */}
          <RegisterBlock x={170} y={45} w={90} h={50} label="A (ACC)" value={String(state.accumulator).padStart(2, "0")} active={aChanged} highlight={aChanged} />

          {/* Register B */}
          <RegisterBlock x={290} y={45} w={80} h={50} label="REG B" value={String(state.registerB).padStart(2, "0")} active={bChanged} highlight={bChanged} />

          {/* Register C */}
          <RegisterBlock x={390} y={45} w={80} h={50} label="REG C" value={String(state.registerC).padStart(2, "0")} active={cChanged} highlight={cChanged} />

          {/* Flags */}
          <FlagBlock x={340} y={130} label="Z" active={state.zeroFlag} />
          <FlagBlock x={395} y={130} label="CY" active={state.carryFlag} />
          <text x="340" y="125" fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1.5">FLAGS</text>

          {/* Memory label */}
          <rect x={340} y={200} width={120} height={50} rx="6" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" strokeWidth="1" />
          <text x="400" y="220" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1.5">MEMORY</text>
          <text x="400" y="238" textAnchor="middle" fontSize="10" fill="hsl(var(--foreground))" fontFamily="var(--font-mono)" fontWeight="600">
            [{String(state.programCounter).padStart(2, "0")}]
          </text>

          {/* Data flow arrows */}
          {/* PC → IR (fetch) */}
          <FlowArrow x1={75} y1={95} x2={75} y2={115} active={activeFlow === "fetch"} />
          
          {/* IR → ALU (decode) */}
          <FlowArrow x1={120} y1={140} x2={195} y2={200} active={activeFlow === "decode"} />
          
          {/* ACC → ALU */}
          <FlowArrow x1={215} y1={95} x2={230} y2={190} active={activeFlow === "execute"} />
          
          {/* ALU → ACC (result) */}
          <FlowArrow x1={255} y1={190} x2={240} y2={95} active={activeFlow === "execute" && aChanged} />
          
          {/* Memory → ALU */}
          <FlowArrow x1={340} y1={225} x2={285} y2={225} active={activeFlow === "execute"} />
          
          {/* PC → Memory (address bus) */}
          <FlowArrow x1={120} y1={60} x2={340} y2={215} active={activeFlow === "fetch"} dashed />

          {/* Cycle indicator */}
          <CycleIndicator phase={activeFlow} />
        </svg>
      </div>
    </div>
  );
}

function RegisterBlock({ x, y, w, h, label, value, active, highlight }: {
  x: number; y: number; w: number; h: number; label: string; value: string; active: boolean; highlight: boolean;
}) {
  return (
    <motion.g
      animate={active ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.4 }}
      style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
    >
      <rect
        x={x} y={y} width={w} height={h} rx="6"
        fill={highlight ? "hsl(var(--primary) / 0.1)" : "hsl(var(--card))"}
        stroke={highlight ? "hsl(var(--primary))" : "hsl(var(--border))"}
        strokeWidth={highlight ? "2" : "1"}
        filter={highlight ? "url(#glow)" : undefined}
      />
      <text x={x + 8} y={y + 16} fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1.5">{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" fontSize="16" fill={highlight ? "hsl(var(--primary))" : "hsl(var(--foreground))"} fontFamily="var(--font-mono)" fontWeight="700">
        {value}
      </text>
    </motion.g>
  );
}

function FlagBlock({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={40} height={30} rx="4"
        fill={active ? "hsl(var(--primary) / 0.15)" : "hsl(var(--muted) / 0.5)"}
        stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
        strokeWidth={active ? "1.5" : "0.5"}
      />
      <text x={x + 20} y={y + 13} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)">{label}</text>
      <text x={x + 20} y={y + 24} textAnchor="middle" fontSize="12" fill={active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} fontFamily="var(--font-mono)" fontWeight="700">
        {active ? "1" : "0"}
      </text>
    </g>
  );
}

function FlowArrow({ x1, y1, x2, y2, active, dashed }: { x1: number; y1: number; x2: number; y2: number; active: boolean; dashed?: boolean }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={active ? "hsl(var(--primary))" : "hsl(var(--border))"}
      strokeWidth={active ? "2" : "1"}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
      animate={active ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.4 }}
      transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
    />
  );
}

function CycleIndicator({ phase }: { phase: string }) {
  const phases = [
    { key: "fetch", label: "FETCH", x: 40 },
    { key: "decode", label: "DECODE", x: 200 },
    { key: "execute", label: "EXECUTE", x: 360 },
  ];
  return (
    <g>
      {phases.map((p) => (
        <g key={p.key}>
          <rect x={p.x} y={255} width={60} height={16} rx="8"
            fill={phase === p.key ? "hsl(var(--primary) / 0.2)" : "transparent"}
            stroke={phase === p.key ? "hsl(var(--primary))" : "hsl(var(--border))"}
            strokeWidth={phase === p.key ? "1.5" : "0.5"}
          />
          <text x={p.x + 30} y={266} textAnchor="middle" fontSize="7"
            fill={phase === p.key ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            fontFamily="var(--font-mono)" fontWeight={phase === p.key ? "700" : "400"} letterSpacing="1"
          >
            {p.label}
          </text>
        </g>
      ))}
      {/* Connecting arrows between phases */}
      <line x1="100" y1="263" x2="198" y2="263" stroke="hsl(var(--border))" strokeWidth="0.5" markerEnd="url(#arrowhead)" />
      <line x1="260" y1="263" x2="358" y2="263" stroke="hsl(var(--border))" strokeWidth="0.5" markerEnd="url(#arrowhead)" />
    </g>
  );
}
