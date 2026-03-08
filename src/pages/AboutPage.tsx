import Navbar from "@/components/Navbar";
import {
  Cpu,
  GraduationCap,
  Layers,
  Code2,
  Sparkles,
  Eye,
  Brain,
  GitBranch,
  Zap,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const educationItems = [
  { icon: Eye, label: "Visual fetch-decode-execute cycle" },
  { icon: Code2, label: "Hands-on assembly programming" },
  { icon: Zap, label: "Real-time register & memory changes" },
  { icon: GitBranch, label: "Conditional branching & flags" },
  { icon: Brain, label: "Progressive beginner → advanced path" },
];

const techStack = [
  { name: "React", color: "text-sky-400" },
  { name: "TypeScript", color: "text-blue-400" },
  { name: "Tailwind CSS", color: "text-teal-400" },
  { name: "Framer Motion", color: "text-purple-400" },
  { name: "Vite", color: "text-yellow-400" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero: Creator Intro ─────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" />

        <div className="relative container mx-auto px-4 py-20 max-w-4xl">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
            {...fadeUp}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/20">
                <span className="font-display text-5xl md:text-6xl font-bold text-primary-foreground">
                  AM
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-accent flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left flex-1">
              <p className="text-xs font-mono uppercase tracking-widest text-accent mb-2">
                Creator & Developer
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
                Abir Mahanta
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg mb-6">
                Passionate about making computer architecture accessible and
                interactive. I built CPUverse to bridge the gap between
                theoretical knowledge and hands-on understanding of how
                processors actually work — one instruction at a time.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Button
                  asChild
                  className="rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link to="/simulator?mode=beginner">
                    <Cpu className="h-4 w-4" /> Try CPUverse
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl gap-2">
                  <Link to="/learn">
                    <GraduationCap className="h-4 w-4" /> Start Learning
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-20 max-w-4xl space-y-8">
        {/* What is CPUverse */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.04] to-transparent p-8 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">
              What is CPUverse?
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            CPUverse is a web-based interactive microprocessor learning simulator
            with two experience levels: <strong className="text-foreground">Beginner Mode</strong> for
            guided visual understanding, and <strong className="text-foreground">Advanced Mode</strong> for
            detailed CPU simulation and instruction-level execution. It
            simulates a simple 8-bit CPU and visually demonstrates fetch,
            decode, execute cycles, register updates, memory access, ALU
            operations, and conditional jumps.
          </p>
        </motion.div>

        {/* Educational Purpose — icon grid */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-2xl border bg-card/50 p-8"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold">
              Educational Purpose
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            This project supports courses in Microprocessors, Computer
            Architecture, and Digital Systems by providing hands-on experience
            with CPU execution concepts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {educationItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border bg-background/50 p-4 transition-colors hover:bg-accent/5"
              >
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm text-foreground/80 leading-snug pt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Architecture — two-column */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="rounded-2xl border bg-card/50 p-8 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Layers className="h-4 w-4 text-warning" />
              </div>
              <h2 className="font-display text-lg font-bold">Engine Layer</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              The CPU execution engine handles instruction parsing, memory
              management, and state transitions. It powers both modes with the
              same deterministic logic — only the presentation layer differs.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {["Parser", "Memory", "ALU", "Flags"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-1 rounded-lg bg-warning/10 text-warning"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-card/50 p-8 flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold">Visual Layer</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              React components provide real-time visualization with animated
              state changes, CPU diagrams, memory viewers, and execution logs —
              all updating live as instructions execute.
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {["React", "Framer Motion", "Diagrams", "Logs"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-1 rounded-lg bg-primary/10 text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="rounded-2xl border bg-card/50 p-8"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">Built With</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group rounded-xl border bg-background/50 px-5 py-3 flex items-center gap-2.5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <span className="font-mono text-sm font-medium text-foreground">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/15 p-10 text-center"
        >
          <h2 className="font-display text-2xl font-bold mb-2">
            Ready to explore?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Jump into the simulator and see how a CPU executes instructions —
            step by step, visually.
          </p>
          <div className="flex items-center gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Link to="/simulator?mode=beginner">
                <Cpu className="h-4 w-4" /> Launch Simulator
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl gap-2">
              <Link to="/learn">
                <GraduationCap className="h-4 w-4" /> Browse Lessons
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
