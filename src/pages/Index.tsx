import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Play, GraduationCap, ArrowRight, Zap, Eye, Brain, Layers, Sparkles, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Eye, title: "Animated Data Flow", desc: "Watch values travel between memory, registers, and ALU in real time with smooth animations.", color: "text-primary" },
  { icon: Zap, title: "Step-by-Step Execution", desc: "Walk through each fetch → decode → execute cycle at your own pace or auto-play.", color: "text-accent" },
  { icon: Brain, title: "Plain-English Explanations", desc: "Every instruction explained as it runs. Toggle between simple and technical language.", color: "text-warning" },
  { icon: Layers, title: "Progressive Difficulty", desc: "Start with guided Beginner Mode, then switch to Advanced for full register and flag control.", color: "text-success" },
];

const comparisons = [
  { feature: "Visual CPU Blocks", beginner: true, advanced: true },
  { feature: "Animated Data Flow", beginner: true, advanced: true },
  { feature: "Plain-English Narration", beginner: true, advanced: false },
  { feature: "Concept Helper Cards", beginner: true, advanced: false },
  { feature: "Full Register Panel", beginner: false, advanced: true },
  { feature: "Memory Grid", beginner: false, advanced: true },
  { feature: "Execution Trace", beginner: false, advanced: true },
  { feature: "Code Editor", beginner: false, advanced: true },
  { feature: "Bitwise / Stack Ops", beginner: false, advanced: true },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-28 text-center max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-[12px] font-medium text-muted-foreground mb-8 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Visual Microprocessor Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Learn How a CPU Works
            <br />
            <span className="gradient-text">Visually, Step by Step</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            CPUverse is an interactive 8-bit microprocessor simulator that helps beginners understand CPU operations through guided animation and lets advanced learners inspect full register, memory, and instruction-level behavior.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2.5 rounded-xl text-base px-8 h-12 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
              <Link to="/simulator?mode=beginner"><GraduationCap className="h-5 w-5" /> Start Beginner Mode</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2.5 rounded-xl text-base px-8 h-12 border-primary/30 hover:bg-primary/5">
              <Link to="/simulator?mode=advanced"><Play className="h-5 w-5" /> Open Advanced Lab</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Animated CPU Preview */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto glass-card p-6 md:p-8"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              { label: "Memory", value: "LDA 10", sub: "Instruction fetched", icon: "📦" },
              { label: "Control Unit", value: "Decode", sub: "Parse opcode", icon: "🎛️" },
              { label: "ALU", value: "5 + 3 = 8", sub: "Compute result", icon: "⚡" },
            ].map((block, i) => (
              <motion.div
                key={block.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="visual-block border-primary/20 bg-primary/[0.03]"
              >
                <div className="text-2xl mb-2">{block.icon}</div>
                <div className="font-display font-bold text-sm">{block.label}</div>
                <div className="font-mono text-xs text-primary mt-1">{block.value}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{block.sub}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground/50">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-mono">FETCH → DECODE → EXECUTE</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Why CPUverse?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Not just a simulator — a complete visual learning experience designed for education.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-6 group hover:shadow-md transition-shadow"
            >
              <f.icon className={`h-6 w-6 ${f.color} mb-3`} />
              <h3 className="font-display font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mode Comparison */}
      <section className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Two Modes, One Engine</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              The same CPU simulation engine powers both experiences. Switch anytime.
            </p>
          </div>
          <div className="max-w-2xl mx-auto glass-card overflow-hidden">
            <div className="grid grid-cols-3 gap-0 border-b bg-muted/40">
              <div className="p-3 text-xs font-semibold text-muted-foreground">Feature</div>
              <div className="p-3 text-xs font-semibold text-center text-accent">
                <GraduationCap className="h-3.5 w-3.5 inline mr-1" />Beginner
              </div>
              <div className="p-3 text-xs font-semibold text-center text-primary">
                <Cpu className="h-3.5 w-3.5 inline mr-1" />Advanced
              </div>
            </div>
            {comparisons.map((c, i) => (
              <div key={c.feature} className={`grid grid-cols-3 gap-0 ${i < comparisons.length - 1 ? "border-b" : ""}`}>
                <div className="p-3 text-xs text-muted-foreground">{c.feature}</div>
                <div className="p-3 text-center text-sm">
                  {c.beginner ? <span className="text-accent">✓</span> : <span className="text-muted-foreground/30">—</span>}
                </div>
                <div className="p-3 text-center text-sm">
                  {c.advanced ? <span className="text-primary">✓</span> : <span className="text-muted-foreground/30">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">What You'll Understand</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-6 text-sm text-muted-foreground max-w-3xl mx-auto">
          {[
            "Fetch → Decode → Execute cycle",
            "ALU arithmetic & flag logic",
            "Conditional branching & jumps",
            "Register transfer operations",
            "Stack & subroutine calling",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" /> {item}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-xl font-bold mb-4">Ready to explore inside a CPU?</h2>
          <div className="flex items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/simulator?mode=beginner"><GraduationCap className="h-4 w-4" /> Beginner Mode</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl gap-2">
              <Link to="/learn"><BookOpen className="h-4 w-4" /> Read the Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-[11px] text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Cpu className="h-3 w-3 text-primary" />
          <span className="font-display font-semibold">CPUverse</span>
        </div>
        A Visual Microprocessor Learning Platform — Educational Project
      </footer>
    </div>
  );
}
