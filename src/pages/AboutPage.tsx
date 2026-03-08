import Navbar from "@/components/Navbar";
import { Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold">About This Project</h1>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Objective</h2>
            <p>
              A web-based educational microprocessor simulator that demonstrates the internal operation of a basic CPU
              using registers, memory, ALU logic, status flags, and instruction execution visualization.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Course Relevance</h2>
            <p>
              This project supports courses in Microprocessors, Computer Architecture, and Digital Systems by providing
              hands-on experience with CPU execution concepts that are typically taught theoretically.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Educational Benefits</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Visual understanding of the fetch-decode-execute cycle</li>
              <li>Hands-on experience with assembly-like programming</li>
              <li>Real-time observation of register and memory changes</li>
              <li>Understanding of conditional branching and flags</li>
              <li>Intuitive learning through step-by-step execution</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Architecture</h2>
            <p>
              Built with React and TypeScript, the simulator separates the CPU execution engine from the UI layer.
              The engine handles instruction parsing, memory management, and state transitions, while the
              React components provide real-time visualization with animated state changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"].map((tech) => (
                <span key={tech} className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
