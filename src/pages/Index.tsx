import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Play, BookOpen, Layers, ArrowRight, Zap, Eye, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const features = [
  { icon: Terminal, title: "Assembly Editor", description: "Write assembly-like programs with syntax validation and sample programs." },
  { icon: Eye, title: "Live Visualization", description: "Watch registers, memory, and flags update in real-time as instructions execute." },
  { icon: Layers, title: "Step-by-Step", description: "Execute one instruction at a time to understand the fetch-decode-execute cycle." },
  { icon: Zap, title: "Instant Feedback", description: "Get detailed explanations of what each instruction does and how it affects the CPU." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Cpu className="h-3.5 w-3.5 text-primary" />
            Educational CPU Simulator
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Understand How a{" "}
            <span className="text-primary">CPU</span>{" "}
            Really Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            An interactive 8-bit microprocessor simulator that visualizes registers, memory, flags, and the fetch-decode-execute cycle. Built for students and educators.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/simulator">
                <Play className="h-4 w-4" />
                Start Simulating
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/help">
                <BookOpen className="h-4 w-4" />
                Instruction Set
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="panel p-5 space-y-3"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <h2 className="font-display text-2xl font-bold text-center mb-8">What You'll Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              "How the Program Counter sequences through instructions",
              "How the ALU performs arithmetic and sets flags",
              "How conditional branching works with status flags",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Microprocessor CPU Simulator — An educational project for microprocessor courses
      </footer>
    </div>
  );
}
