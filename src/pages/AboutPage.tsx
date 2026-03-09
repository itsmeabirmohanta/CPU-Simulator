import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Cpu, BookOpen, Rocket, Eye,
  ArrowRight, GraduationCap, Terminal, Lightbulb,
  Keyboard, Share2, BarChart3, Heart, Github, Linkedin, User,
} from "lucide-react";
import { modules, getTotalLessonCount } from "@/lib/curriculum";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: EASE } }),
};

const features = [
  { icon: Cpu, title: "Unified CPU Engine", desc: "A single simulation engine powers both Beginner and Advanced modes — same accuracy, different views." },
  { icon: GraduationCap, title: "6-Module Curriculum", desc: "University-level course from binary basics to pipelining, with 30+ hands-on lessons." },
  { icon: Eye, title: "Visual Execution", desc: "Watch registers, memory, and data buses update in real time as each instruction runs." },
  { icon: Terminal, title: "Inline Code Editor", desc: "Write, validate, and run assembly programs with syntax highlighting and real-time error checking." },
  { icon: Keyboard, title: "Keyboard Shortcuts", desc: "Power-user controls: Space to step, Shift+Space to run, L to load, R to reset." },
  { icon: Share2, title: "Shareable Links", desc: "Share any program via URL — code and mode are encoded in the link for instant collaboration." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Your lesson completion is saved locally. Pick up where you left off across sessions." },
  { icon: Lightbulb, title: "Plain-English Explanations", desc: "Every instruction is explained in simple terms — what it does, why, and what changed." },
];

const instructions = [
  { op: "LDA addr", desc: "Load value from memory into accumulator" },
  { op: "STA addr", desc: "Store accumulator value to memory" },
  { op: "ADD addr", desc: "Add memory value to accumulator" },
  { op: "SUB addr", desc: "Subtract memory value from accumulator" },
  { op: "MOV R, R", desc: "Copy value between registers (A, B, C)" },
  { op: "AND / OR / XOR", desc: "Bitwise operations on accumulator" },
  { op: "NOT", desc: "Bitwise complement of accumulator" },
  { op: "SHL / SHR", desc: "Shift accumulator left or right by 1 bit" },
  { op: "JMP addr", desc: "Unconditional jump to address" },
  { op: "JZ / JNZ addr", desc: "Jump if zero flag is set / not set" },
  { op: "JC addr", desc: "Jump if carry flag is set" },
  { op: "CMP addr", desc: "Compare accumulator with memory value" },
  { op: "INR / DCR R", desc: "Increment or decrement a register" },
  { op: "CALL / RET", desc: "Subroutine call and return" },
  { op: "HLT", desc: "Halt execution" },
  { op: "NOP", desc: "No operation (skip cycle)" },
];

const architectureLayers = [
  { name: "Curriculum Layer", icon: BookOpen, color: "text-accent", items: ["6 progressive modules", "30+ interactive lessons", "Embedded mini-simulators", "Video resources & challenges"] },
  { name: "Visual Layer", icon: Eye, color: "text-primary", items: ["Beginner guided view", "Advanced multi-panel layout", "Animated data flow diagrams", "Real-time state display"] },
  { name: "Engine Layer", icon: Cpu, color: "text-muted-foreground", items: ["Fetch-Decode-Execute cycle", "8-bit registers & ALU", "256-byte addressable memory", "Full instruction set"] },
];

const techStack = [
  { name: "React 18", color: "bg-primary/10 text-primary" },
  { name: "TypeScript", color: "bg-accent/10 text-accent" },
  { name: "Tailwind CSS", color: "bg-primary/10 text-primary" },
  { name: "Framer Motion", color: "bg-accent/10 text-accent" },
  { name: "Vite", color: "bg-muted text-muted-foreground" },
  { name: "shadcn/ui", color: "bg-muted text-muted-foreground" },
  { name: "Radix UI", color: "bg-primary/10 text-primary" },
  { name: "Lucide Icons", color: "bg-accent/10 text-accent" },
];

export default function AboutPage() {
  const totalLessons = getTotalLessonCount();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(var(--accent)/0.08),transparent)]" />
        <div className="relative container mx-auto px-4 pt-16 pb-20 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6"
            >
              <Cpu className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">About CPU Simulator</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
              An interactive, visual CPU simulator and curriculum designed to make computer architecture accessible to everyone — from curious beginners to university students.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" className="rounded-full gap-2 px-6">
                  <Link to="/learn"><GraduationCap className="h-4 w-4" /> Start Learning</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" variant="outline" className="rounded-full gap-2 px-6">
                  <Link to="/simulator?mode=beginner"><Rocket className="h-4 w-4" /> Try Simulator</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-24">

        {/* Why */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Why CPU Simulator?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Understanding how a CPU works is fundamental to computer science, yet most resources are either too abstract or too complex. CPU Simulator bridges this gap with a purpose-built 8-bit simulator that lets you <strong className="text-foreground">see</strong> every fetch, decode, and execute cycle — then reinforces concepts through a structured, progressive curriculum.
          </p>
        </motion.section>

        {/* Features */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Key Features</h2>
            <p className="text-sm text-muted-foreground">Everything you need to learn CPU architecture hands-on</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className="p-5 rounded-2xl border bg-card/50 hover:bg-card transition-colors cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Architecture</h2>
            <p className="text-sm text-muted-foreground">Three layers working together to create an integrated learning experience</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {architectureLayers.map((layer, i) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className="relative p-6 rounded-2xl border bg-card/50 overflow-hidden cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-accent/40" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <layer.icon className={`h-5 w-5 ${layer.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{layer.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">Layer {i + 1}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {layer.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary/50 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Instruction Set */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Instruction Set</h2>
            <p className="text-sm text-muted-foreground">The complete 8-bit instruction set supported by CPU Simulator</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border bg-card/50"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {[0, 1].map(col => (
                <div key={col} className="divide-y divide-border">
                  {instructions.slice(col * 8, col * 8 + 8).map((inst, j) => (
                    <motion.div
                      key={inst.op}
                      initial={{ opacity: 0, x: col === 0 ? -8 : 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.04 }}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <code className="font-mono text-xs font-semibold text-primary w-28 shrink-0">{inst.op}</code>
                      <span className="text-xs text-muted-foreground">{inst.desc}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: modules.length, label: "Modules", suffix: "" },
              { value: totalLessons, label: "Lessons", suffix: "+" },
              { value: instructions.length, label: "Instructions", suffix: "+" },
              { value: 256, label: "Memory Cells", suffix: "" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ scale: 1.04 }}
                className="text-center p-6 rounded-2xl border bg-card/50 cursor-default"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}{stat.suffix}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Meet the Developer</h2>
            <p className="text-sm text-muted-foreground">The creative mind behind CPU Simulator</p>
          </div>
          <div className="max-w-lg mx-auto">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 rounded-2xl border bg-card/50 text-center"
            >
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Abir Mahanta</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Crafting digital experiences at the intersection of design and AI innovation. Building products that resonate.
              </p>
              <div className="flex items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm" className="rounded-full gap-2">
                    <a href="https://github.com/itsmeabirmohanta" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm" className="rounded-full gap-2">
                    <a href="https://www.linkedin.com/in/itsmeabirmohanta/" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-6">Built With</h2>
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {techStack.map((t, i) => (
              <motion.span
                key={t.name}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-default ${t.color}`}
              >
                {t.name}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-accent/6 to-primary/8" />
          <div className="relative px-8 py-14 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <Heart className="h-8 w-8 text-primary mx-auto" />
            </motion.div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">Start Your Journey</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              Whether you're a student, educator, or curious mind — CPU Simulator is free and ready to explore.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" className="rounded-full gap-2 px-8">
                  <Link to="/learn">Begin the Curriculum <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Button asChild size="lg" variant="outline" className="rounded-full gap-2 px-6">
                  <Link to="/simulator?mode=advanced"><Terminal className="h-4 w-4" /> Advanced Lab</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <span className="text-xs text-muted-foreground font-mono">CPU Simulator v3.0 — Built with React, TypeScript & Framer Motion</span>
        </div>
      </footer>
    </div>
  );
}
