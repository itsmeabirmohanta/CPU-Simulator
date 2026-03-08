import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Play, BookOpen, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  { title: "Step-by-Step Execution", desc: "Walk through each fetch, decode, execute cycle at your own pace." },
  { title: "Live Register View", desc: "Watch accumulator, flags, and PC update in real-time." },
  { title: "Memory Visualization", desc: "See the entire memory layout with highlighted active cells." },
  { title: "Detailed Explanations", desc: "Every instruction is explained in plain English as it runs." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground mb-6">
          <Cpu className="h-3 w-3 text-primary" />
          Educational Simulator
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          Learn How a <span className="text-primary">CPU</span> Works
        </h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
          An interactive 8-bit microprocessor simulator. Write assembly, step through instructions, and watch registers and memory change in real time.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2 rounded-lg">
            <Link to="/simulator"><Play className="h-4 w-4" /> Open Simulator</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 rounded-lg">
            <Link to="/help"><BookOpen className="h-4 w-4" /> Instruction Set</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="sim-panel p-4 space-y-1.5">
              <h3 className="font-display font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-lg font-bold mb-4">What You'll Understand</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 text-sm text-muted-foreground">
            {["Program Counter sequencing", "ALU arithmetic & flags", "Conditional branching"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-4 text-center text-[11px] text-muted-foreground">
        CPU Simulator — Educational Microprocessor Project
      </footer>
    </div>
  );
}
