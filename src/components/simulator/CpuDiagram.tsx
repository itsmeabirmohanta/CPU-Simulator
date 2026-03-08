import { CpuState } from "@/lib/cpu";
import { motion } from "framer-motion";

interface CpuDiagramProps {
  state: CpuState;
  previousState: CpuState;
  activeFlow: "fetch" | "decode" | "execute" | "idle";
}

export default function CpuDiagram({ state, previousState, activeFlow }: CpuDiagramProps) {
  const aChanged = state.accumulator !== previousState.accumulator;
  const pcChanged = state.programCounter !== previousState.programCounter;
  const irChanged = state.instructionRegister !== previousState.instructionRegister;
  const bChanged = state.registerB !== previousState.registerB;
  const cChanged = state.registerC !== previousState.registerC;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">CPU Architecture</span>
        <div className="flex items-center gap-1.5">
          {(["fetch", "decode", "execute"] as const).map((phase) => (
            <span key={phase} className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md transition-all ${
              activeFlow === phase ? "bg-primary/20 text-primary" : "text-muted-foreground/30"
            }`}>
              {phase.charAt(0).toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <svg viewBox="0 0 520 260" className="w-full h-auto">
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--primary))" opacity="0.5" />
            </marker>
            <marker id="arr-on" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--primary))" />
            </marker>
            {/* Data bus gradient */}
            <linearGradient id="bus-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="520" height="260" rx="12" fill="hsl(var(--muted) / 0.15)" />
          <rect x="4" y="4" width="512" height="252" rx="10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 3" />

          {/* Data Bus label */}
          <text x="260" y="80" textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground) / 0.3)" fontFamily="var(--font-mono)" letterSpacing="3">DATA BUS</text>
          <line x1="20" y1="84" x2="500" y2="84" stroke="hsl(var(--border) / 0.4)" strokeWidth="1" strokeDasharray="2 4" />

          {/* Address Bus label */}
          <text x="260" y="96" textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground) / 0.3)" fontFamily="var(--font-mono)" letterSpacing="3">ADDRESS BUS</text>
          <line x1="20" y1="100" x2="500" y2="100" stroke="hsl(var(--border) / 0.4)" strokeWidth="1" strokeDasharray="2 4" />

          {/* Registers row */}
          <Block x={15} y={15} w={80} h={50} label="PC" value={String(state.programCounter).padStart(2,"0")} active={pcChanged || activeFlow==="fetch"} />
          <Block x={110} y={15} w={100} h={50} label="IR" value={state.instructionRegister||"---"} active={irChanged || activeFlow==="decode"} />
          <Block x={230} y={15} w={80} h={50} label="ACC" value={String(state.accumulator)} active={aChanged} />
          <Block x={325} y={15} w={60} h={50} label="B" value={String(state.registerB)} active={bChanged} />
          <Block x={400} y={15} w={60} h={50} label="C" value={String(state.registerC)} active={cChanged} />

          {/* Flags */}
          <SmallBlock x={475} y={15} w={35} h={22} label="Z" value={state.zeroFlag?"1":"0"} active={state.zeroFlag} />
          <SmallBlock x={475} y={43} w={35} h={22} label="CY" value={state.carryFlag?"1":"0"} active={state.carryFlag} />

          {/* ALU - larger triangle */}
          <motion.g animate={activeFlow==="execute"?{opacity:[0.6,1,0.6]}:{opacity:1}} transition={{duration:1,repeat:activeFlow==="execute"?Infinity:0}}>
            <polygon points="240,120 190,190 290,190" fill={activeFlow==="execute"?"hsl(var(--primary) / 0.1)":"hsl(var(--muted) / 0.5)"} stroke={activeFlow==="execute"?"hsl(var(--primary))":"hsl(var(--border))"} strokeWidth={activeFlow==="execute"?"1.5":"0.5"} />
            <text x="240" y="170" textAnchor="middle" fontSize="11" fill="hsl(var(--primary))" fontFamily="var(--font-mono)" fontWeight="700">ALU</text>
            {activeFlow === "execute" && (
              <motion.circle cx="240" cy="155" r="3" fill="hsl(var(--primary))" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} />
            )}
          </motion.g>

          {/* Memory - larger */}
          <rect x={350} y={120} width={150} height={70} rx="10" fill="hsl(var(--muted) / 0.5)" stroke={activeFlow==="fetch"?"hsl(var(--primary))":"hsl(var(--border))"} strokeWidth={activeFlow==="fetch"?"1.5":"0.5"} />
          <text x="425" y="142" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1.5">MEMORY</text>
          <text x="425" y="165" textAnchor="middle" fontSize="13" fill="hsl(var(--foreground))" fontFamily="var(--font-mono)" fontWeight="700">[{String(state.programCounter).padStart(2,"0")}]</text>
          <text x="425" y="180" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground) / 0.5)" fontFamily="var(--font-mono)">{state.instructionRegister || "..."}</text>

          {/* Control Unit */}
          <rect x={20} y={120} width={140} height={70} rx="10" fill={activeFlow==="decode"?"hsl(var(--primary) / 0.06)":"hsl(var(--muted) / 0.3)"} stroke={activeFlow==="decode"?"hsl(var(--primary))":"hsl(var(--border))"} strokeWidth={activeFlow==="decode"?"1.5":"0.5"} />
          <text x="90" y="142" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1.5">CONTROL UNIT</text>
          <text x="90" y="165" textAnchor="middle" fontSize="10" fill={activeFlow==="decode"?"hsl(var(--primary))":"hsl(var(--muted-foreground))"} fontFamily="var(--font-mono)" fontWeight="600">
            {activeFlow === "decode" ? "DECODING..." : activeFlow === "execute" ? "EXECUTING" : "IDLE"}
          </text>

          {/* Arrows - Data paths */}
          <Arrow x1={55} y1={65} x2={55} y2={84} active={activeFlow==="fetch"} label="" />
          <Arrow x1={160} y1={65} x2={160} y2={84} active={activeFlow==="decode"} label="" />
          <Arrow x1={270} y1={65} x2={270} y2={84} active={activeFlow==="execute"} label="" />

          {/* Memory to bus */}
          <Arrow x1={425} y1={120} x2={425} y2={100} active={activeFlow==="fetch"} label="" />

          {/* CU to ALU */}
          <Arrow x1={160} y1={155} x2={190} y2={155} active={activeFlow==="execute"} label="" />

          {/* ALU to bus */}
          <Arrow x1={240} y1={120} x2={240} y2={100} active={activeFlow==="execute"} label="" />

          {/* Cycle bar */}
          <g transform="translate(15, 210)">
            {(["FETCH","DECODE","EXECUTE"] as const).map((p, i) => {
              const isActive = activeFlow === p.toLowerCase();
              const w = 160;
              const x = i * (w + 5);
              return (
                <g key={p}>
                  <rect x={x} y={0} width={w} height={28} rx="8" fill={isActive?"hsl(var(--primary) / 0.12)":"transparent"} stroke={isActive?"hsl(var(--primary) / 0.4)":"hsl(var(--border) / 0.3)"} strokeWidth="0.5" />
                  <text x={x+w/2} y={17} textAnchor="middle" fontSize="9" fill={isActive?"hsl(var(--primary))":"hsl(var(--muted-foreground) / 0.4)"} fontFamily="var(--font-mono)" fontWeight={isActive?"700":"400"} letterSpacing="2">{p}</text>
                  {isActive && (
                    <motion.rect x={x+4} y={24} width={w-8} height={2} rx="1" fill="hsl(var(--primary))" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

function Block({ x,y,w,h,label,value,active }:{x:number;y:number;w:number;h:number;label:string;value:string;active:boolean}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8"
        fill={active?"hsl(var(--primary) / 0.08)":"hsl(var(--card))"}
        stroke={active?"hsl(var(--primary))":"hsl(var(--border))"}
        strokeWidth={active?"1.5":"0.5"}
      />
      {active && (
        <rect x={x} y={y+h-3} width={w} height={3} rx="1.5" fill="hsl(var(--primary))" opacity="0.4" />
      )}
      <text x={x+6} y={y+13} fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1">{label}</text>
      <text x={x+w/2} y={y+h/2+8} textAnchor="middle" fontSize="14" fill={active?"hsl(var(--primary))":"hsl(var(--foreground))"} fontFamily="var(--font-mono)" fontWeight="700">{value}</text>
    </g>
  );
}

function SmallBlock({ x,y,w,h,label,value,active }:{x:number;y:number;w:number;h:number;label:string;value:string;active:boolean}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5"
        fill={active?"hsl(var(--primary) / 0.12)":"hsl(var(--muted) / 0.5)"}
        stroke={active?"hsl(var(--primary) / 0.5)":"hsl(var(--border) / 0.5)"}
        strokeWidth="0.5"
      />
      <text x={x+4} y={y+h/2+2} fontSize="7" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)">{label}</text>
      <text x={x+w-4} y={y+h/2+2} textAnchor="end" fontSize="9" fill={active?"hsl(var(--primary))":"hsl(var(--muted-foreground))"} fontFamily="var(--font-mono)" fontWeight="700">{value}</text>
    </g>
  );
}

function Arrow({ x1,y1,x2,y2,active,label="" }:{x1:number;y1:number;x2:number;y2:number;active:boolean;label?:string}) {
  return (
    <g>
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={active?"hsl(var(--primary))":"hsl(var(--border))"}
        strokeWidth={active?"2":"0.5"}
        animate={active?{opacity:[0.4,1,0.4]}:{opacity:0.3}}
        transition={{duration:1.2,repeat:active?Infinity:0}}
      />
      {active && (
        <motion.circle
          cx={x1} cy={y1} r="2.5"
          fill="hsl(var(--primary))"
          animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </g>
  );
}
