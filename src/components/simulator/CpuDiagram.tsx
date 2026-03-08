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
        <svg viewBox="0 0 460 200" className="w-full h-auto">
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--primary))" opacity="0.5" />
            </marker>
            <marker id="arr-on" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--primary))" />
            </marker>
          </defs>

          {/* Background */}
          <rect width="460" height="200" rx="12" fill="hsl(var(--muted) / 0.2)" />
          <rect x="4" y="4" width="452" height="192" rx="10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 3" />

          {/* Registers row */}
          <Block x={15} y={15} w={70} h={40} label="PC" value={String(state.programCounter).padStart(2,"0")} active={pcChanged || activeFlow==="fetch"} />
          <Block x={100} y={15} w={90} h={40} label="IR" value={state.instructionRegister||"---"} active={irChanged || activeFlow==="decode"} />
          <Block x={210} y={15} w={70} h={40} label="ACC" value={String(state.accumulator)} active={aChanged} />
          <Block x={295} y={15} w={55} h={40} label="B" value={String(state.registerB)} active={state.registerB !== previousState.registerB} />
          <Block x={360} y={15} w={55} h={40} label="C" value={String(state.registerC)} active={state.registerC !== previousState.registerC} />

          {/* Flags */}
          <SmallBlock x={425} y={15} w={25} h={18} label="Z" value={state.zeroFlag?"1":"0"} active={state.zeroFlag} />
          <SmallBlock x={425} y={37} w={25} h={18} label="CY" value={state.carryFlag?"1":"0"} active={state.carryFlag} />

          {/* ALU */}
          <motion.g animate={activeFlow==="execute"?{opacity:[0.6,1,0.6]}:{opacity:1}} transition={{duration:1,repeat:activeFlow==="execute"?Infinity:0}}>
            <polygon points="210,100 170,155 250,155" fill={activeFlow==="execute"?"hsl(var(--primary) / 0.1)":"hsl(var(--muted) / 0.5)"} stroke={activeFlow==="execute"?"hsl(var(--primary))":"hsl(var(--border))"} strokeWidth={activeFlow==="execute"?"1.5":"0.5"} rx="4" />
            <text x="210" y="140" textAnchor="middle" fontSize="10" fill="hsl(var(--primary))" fontFamily="var(--font-mono)" fontWeight="700">ALU</text>
          </motion.g>

          {/* Memory */}
          <rect x={310} y={100} width={130} height={50} rx="8" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <text x="375" y="120" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1">MEMORY</text>
          <text x="375" y="140" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))" fontFamily="var(--font-mono)" fontWeight="600">[{String(state.programCounter).padStart(2,"0")}]</text>

          {/* Arrows */}
          <Arrow x1={50} y1={55} x2={50} y2={75} x3={145} y3={75} x4={145} y4={55} active={activeFlow==="fetch"} />
          <Arrow x1={190} y1={35} x2={210} y2={35} x3={210} y3={100} active={activeFlow==="decode"} />
          <Arrow x1={245} y1={55} x2={245} y2={100} active={activeFlow==="execute"} />
          <Arrow x1={310} y1={125} x2={250} y2={125} active={activeFlow==="execute"} />

          {/* Cycle bar */}
          <g transform="translate(15, 170)">
            {(["FETCH","DECODE","EXECUTE"] as const).map((p, i) => {
              const isActive = activeFlow === p.toLowerCase();
              const x = i * 145;
              return (
                <g key={p}>
                  <rect x={x} y={0} width={130} height={20} rx="6" fill={isActive?"hsl(var(--primary) / 0.15)":"transparent"} stroke={isActive?"hsl(var(--primary) / 0.4)":"hsl(var(--border) / 0.3)"} strokeWidth="0.5" />
                  <text x={x+65} y={13} textAnchor="middle" fontSize="8" fill={isActive?"hsl(var(--primary))":"hsl(var(--muted-foreground) / 0.4)"} fontFamily="var(--font-mono)" fontWeight={isActive?"700":"400"} letterSpacing="1.5">{p}</text>
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
      <rect x={x} y={y} width={w} height={h} rx="6"
        fill={active?"hsl(var(--primary) / 0.08)":"hsl(var(--card))"}
        stroke={active?"hsl(var(--primary))":"hsl(var(--border))"}
        strokeWidth={active?"1.5":"0.5"}
      />
      <text x={x+4} y={y+11} fontSize="7" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)" letterSpacing="1">{label}</text>
      <text x={x+w/2} y={y+h/2+7} textAnchor="middle" fontSize="13" fill={active?"hsl(var(--primary))":"hsl(var(--foreground))"} fontFamily="var(--font-mono)" fontWeight="700">{value}</text>
    </g>
  );
}

function SmallBlock({ x,y,w,h,label,value,active }:{x:number;y:number;w:number;h:number;label:string;value:string;active:boolean}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4"
        fill={active?"hsl(var(--primary) / 0.12)":"hsl(var(--muted) / 0.5)"}
        stroke={active?"hsl(var(--primary) / 0.5)":"hsl(var(--border) / 0.5)"}
        strokeWidth="0.5"
      />
      <text x={x+3} y={y+h/2+1} fontSize="6" fill="hsl(var(--muted-foreground))" fontFamily="var(--font-mono)">{label}</text>
      <text x={x+w-3} y={y+h/2+1} textAnchor="end" fontSize="8" fill={active?"hsl(var(--primary))":"hsl(var(--muted-foreground))"} fontFamily="var(--font-mono)" fontWeight="700">{value}</text>
    </g>
  );
}

function Arrow({ x1,y1,x2,y2,x3,y3,x4,y4,active }:{x1:number;y1:number;x2:number;y2:number;x3?:number;y3?:number;x4?:number;y4?:number;active:boolean}) {
  const points = x3 !== undefined && y3 !== undefined
    ? x4 !== undefined && y4 !== undefined
      ? `M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}`
      : `M${x1},${y1} L${x2},${y2} L${x3},${y3}`
    : `M${x1},${y1} L${x2},${y2}`;

  return (
    <motion.path
      d={points}
      fill="none"
      stroke={active?"hsl(var(--primary))":"hsl(var(--border))"}
      strokeWidth={active?"1.5":"0.5"}
      markerEnd={active?"url(#arr-on)":"url(#arr)"}
      animate={active?{opacity:[0.4,1,0.4]}:{opacity:0.3}}
      transition={{duration:1.2,repeat:active?Infinity:0}}
    />
  );
}
