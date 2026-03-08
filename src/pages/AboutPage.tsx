import Navbar from "@/components/Navbar";
import { Cpu, GraduationCap, Layers, Code2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">About CPUverse</h1>
            <p className="text-sm text-muted-foreground">Visual Microprocessor Learning Platform</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">What is CPUverse?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CPUverse is a web-based interactive microprocessor learning simulator with two experience levels:
              Beginner Mode for guided visual understanding, and Advanced Mode for detailed CPU simulation
              and instruction-level execution. It simulates a simple 8-bit CPU and visually demonstrates
              fetch, decode, execute cycles, register updates, memory access, ALU operations, and conditional jumps.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-semibold">Educational Purpose</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              This project supports courses in Microprocessors, Computer Architecture, and Digital Systems by providing
              hands-on experience with CPU execution concepts.
            </p>
            <ul className="list-none space-y-2">
              {[
                "Visual understanding of the fetch-decode-execute cycle",
                "Hands-on experience with assembly-like programming",
                "Real-time observation of register and memory changes",
                "Understanding of conditional branching and flags",
                "Progressive learning from beginner to advanced concepts",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-warning" />
              <h2 className="font-display text-lg font-semibold">Architecture</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The simulator separates the CPU execution engine from the UI layer.
              The engine handles instruction parsing, memory management, and state transitions, while
              React components provide real-time visualization with animated state changes.
              The same engine powers both Beginner and Advanced modes — only the presentation layer changes.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Technology Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"].map((tech) => (
                <span key={tech} className="rounded-xl border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <Button asChild className="rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/simulator?mode=beginner"><GraduationCap className="h-4 w-4" /> Try CPUverse</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
