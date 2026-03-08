import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Play, GraduationCap, ArrowRight, Zap, Eye, Brain, Layers, Sparkles, BookOpen, ChevronRight, Github, Terminal, Clock, Code2, Monitor } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const features = [
  { icon: Eye, title: "Animated Data Flow", desc: "Watch values travel between memory, registers, and ALU in real time with smooth animations.", gradient: "from-primary to-primary-glow" },
  { icon: Zap, title: "Step-by-Step Execution", desc: "Walk through each fetch → decode → execute cycle at your own pace or auto-play.", gradient: "from-accent to-success" },
  { icon: Brain, title: "Plain-English Explanations", desc: "Every instruction explained as it runs. Toggle between simple and technical language.", gradient: "from-warning to-destructive" },
  { icon: Layers, title: "Progressive Difficulty", desc: "Start with guided Beginner Mode, then switch to Advanced for full register and flag control.", gradient: "from-success to-accent" },
];

const comparisons = [
  { feature: "Visual CPU Diagram", beginner: true, advanced: true },
  { feature: "Animated Data Flow", beginner: true, advanced: true },
  { feature: "Plain-English Explanations", beginner: true, advanced: true },
  { feature: "Code Editor", beginner: true, advanced: true },
  { feature: "Sample Programs", beginner: true, advanced: true },
  { feature: "Full Register Panel", beginner: false, advanced: true },
  { feature: "Memory Inspector", beginner: false, advanced: true },
  { feature: "Execution Trace Log", beginner: false, advanced: true },
  { feature: "Bitwise & Subroutine Ops", beginner: false, advanced: true },
];

const stats = [
  { value: 24, suffix: "", label: "Instructions Supported" },
  { value: 2, suffix: "", label: "Learning Modes" },
  { value: 64, suffix: "", label: "Memory Cells" },
  { value: 100, suffix: "%", label: "Client-Side" },
];

const timeline = [
  { step: "01", title: "Write Assembly", desc: "Use our syntax-highlighted editor with auto-complete and instant error feedback.", icon: Code2 },
  { step: "02", title: "Watch It Execute", desc: "See the fetch-decode-execute cycle animate in real-time across CPU components.", icon: Monitor },
  { step: "03", title: "Understand Deeply", desc: "Read plain-English explanations and inspect registers, flags, and memory at every step.", icon: Brain },
];

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value, count, rounded]);

  return <span className="stat-counter">{display}{suffix}</span>;
}

// Live animated mini CPU
function LiveCPUPreview() {
  const [phase, setPhase] = useState(0);
  const phases = ["fetch", "decode", "execute"];
  const values = [
    { mem: "LDA 10", cu: "Fetching...", alu: "—", a: "0" },
    { mem: "LDA 10", cu: "LDA 10", alu: "Decoding...", a: "0" },
    { mem: "LDA 10", cu: "LDA 10", alu: "Load → A", a: "5" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 3), 1800);
    return () => clearInterval(timer);
  }, []);

  const v = values[phase];
  const activePhase = phases[phase];

  return (
    <div className="relative">
      {/* Phase indicators */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {phases.map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <motion.div
              animate={{ scale: activePhase === p ? 1 : 0.9, opacity: activePhase === p ? 1 : 0.4 }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${
                activePhase === p ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground"
              }`}
            >
              {p}
            </motion.div>
            {i < 2 && <ChevronRight className="h-3 w-3 text-muted-foreground/30" />}
          </div>
        ))}
      </div>

      {/* CPU blocks */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        {[
          { label: "Memory", value: v.mem, active: activePhase === "fetch", icon: "📦" },
          { label: "Control Unit", value: v.cu, active: activePhase === "decode", icon: "🎛️" },
          { label: "ALU", value: v.alu, active: activePhase === "execute", icon: "⚡" },
        ].map((block) => (
          <motion.div
            key={block.label}
            animate={{
              scale: block.active ? 1.03 : 1,
              borderColor: block.active ? "hsl(var(--primary))" : "hsl(var(--border))",
            }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl border-2 p-4 md:p-5 text-center transition-all duration-300 ${
              block.active ? "bg-primary/[0.06] shadow-lg" : "bg-card/50"
            }`}
          >
            <div className="text-2xl mb-2">{block.icon}</div>
            <div className="font-display font-bold text-sm mb-1">{block.label}</div>
            <motion.div
              key={block.value}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs text-primary mt-1 h-4"
            >
              {block.value}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Accumulator result */}
      <motion.div
        className="mt-4 flex items-center justify-center gap-3"
        animate={{ opacity: 1 }}
      >
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border">
          <span className="text-[10px] text-muted-foreground font-mono">ACC</span>
          <motion.span
            key={v.a}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-mono font-bold text-sm text-primary"
          >
            {v.a}
          </motion.span>
        </div>
        <div className="h-px flex-1 bg-border" />
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="mesh-gradient absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-32 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full gradient-border bg-card/80 backdrop-blur-sm px-5 py-2 text-[12px] font-medium text-muted-foreground mb-8 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Interactive 8-Bit CPU Simulator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
          >
            See How a CPU
            <br />
            <span className="gradient-text">Actually Thinks</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body"
          >
            CPUverse is a visual microprocessor simulator that animates every fetch, decode, and execute cycle. 
            Designed for students and educators, it turns abstract CPU concepts into something you can actually see.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2.5 rounded-xl text-base px-8 h-13 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg glow-primary">
              <Link to="/simulator?mode=beginner"><GraduationCap className="h-5 w-5" /> Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2.5 rounded-xl text-base px-8 h-13 border-primary/20 hover:bg-primary/5 hover:border-primary/40">
              <Link to="/simulator?mode=advanced"><Terminal className="h-5 w-5" /> Open Advanced Lab</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Live CPU Preview */}
      <section className="container mx-auto px-4 pb-20 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto glass-card-glow p-6 md:p-8"
        >
          <LiveCPUPreview />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <div className="text-xs text-muted-foreground mt-1 font-body">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Timeline */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-body">Three steps from code to understanding.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {timeline.map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-5 md:gap-8"
              >
                <div className="shrink-0 relative z-10">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border flex items-center justify-center">
                    <item.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                </div>
                <div className="pt-1 md:pt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-primary/60 font-bold">{item.step}</span>
                    <h3 className="font-display font-bold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-body max-w-md">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Built for Learning</h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-body">
            Not just a simulator — a complete visual learning experience designed for education.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-6 group hover-lift card-glow"
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${f.gradient} mb-4`}>
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mode Comparison */}
      <section className="border-t mesh-gradient">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Two Modes, One Engine</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm font-body">
              The same CPU simulation engine powers both experiences. Switch anytime.
            </p>
          </div>
          <div className="max-w-2xl mx-auto glass-card-glow overflow-hidden">
            <div className="grid grid-cols-3 gap-0 border-b bg-muted/30">
              <div className="p-4 text-xs font-semibold text-muted-foreground">Feature</div>
              <div className="p-4 text-xs font-semibold text-center text-accent">
                <GraduationCap className="h-3.5 w-3.5 inline mr-1.5" />Beginner
              </div>
              <div className="p-4 text-xs font-semibold text-center text-primary">
                <Cpu className="h-3.5 w-3.5 inline mr-1.5" />Advanced
              </div>
            </div>
            {comparisons.map((c, i) => (
              <div key={c.feature} className={`grid grid-cols-3 gap-0 transition-colors hover:bg-muted/20 ${i < comparisons.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="p-3.5 text-xs text-muted-foreground font-body">{c.feature}</div>
                <div className="p-3.5 text-center text-sm">
                  {c.beginner ? <span className="text-accent font-bold">✓</span> : <span className="text-muted-foreground/20">—</span>}
                </div>
                <div className="p-3.5 text-center text-sm">
                  {c.advanced ? <span className="text-primary font-bold">✓</span> : <span className="text-muted-foreground/20">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">What You'll Understand</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {[
            "Fetch → Decode → Execute cycle",
            "ALU arithmetic & flag logic",
            "Conditional branching & jumps",
            "Register transfer operations",
            "Stack & subroutine calling",
            "Memory addressing modes",
          ].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition-colors"
            >
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm text-foreground/80 font-body">{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t bg-muted/10">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-body">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border">
              <GraduationCap className="h-3.5 w-3.5 text-accent" />
              Built for Microprocessor Courses
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Covers 8085-Style Instruction Set
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border">
              <Clock className="h-3.5 w-3.5 text-warning" />
              Zero Setup Required
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="mesh-gradient absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to explore inside a CPU?</h2>
          <p className="text-sm text-muted-foreground mb-8 font-body max-w-md mx-auto">
            No setup, no installation. Start learning in your browser right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
              <Link to="/simulator?mode=beginner"><GraduationCap className="h-4 w-4" /> Start Beginner Mode</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl gap-2 border-primary/20">
              <Link to="/learn"><BookOpen className="h-4 w-4" /> Read the Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                <span className="font-display font-bold text-sm">CPUverse</span>
              </div>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                A visual microprocessor learning platform. Built for education.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/simulator?mode=beginner" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Beginner Mode</Link>
                <Link to="/simulator?mode=advanced" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Advanced Lab</Link>
                <Link to="/learn" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Learn</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Resources</h4>
              <div className="space-y-2">
                <Link to="/learn" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Instruction Set</Link>
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">About</h4>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                Educational project designed for computer architecture and microprocessor courses.
              </p>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground/60 font-body">© {new Date().getFullYear()} CPUverse. Educational Project.</span>
            <span className="text-[11px] text-muted-foreground/40 font-mono">v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
