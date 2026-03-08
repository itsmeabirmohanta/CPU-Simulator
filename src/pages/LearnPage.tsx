import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import MiniSimulator from "@/components/learn/MiniSimulator";
import ProgressTracker, {
  getCompletedLessons,
  markLessonComplete,
  resetProgress,
  type LessonMeta,
} from "@/components/learn/LessonProgress";
import { BookOpen, Cpu, Zap, HardDrive, Flag, ArrowRight, ChevronDown, Rocket, Brain, Layers, GitBranch, Repeat, Binary, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SAMPLE_PROGRAMS } from "@/lib/cpu";
import GuidedWalkthrough, { useWalkthrough } from "@/components/learn/GuidedWalkthrough";

/* ── Lesson data ──────────────────────────────────────────── */

interface Lesson {
  id: string;
  title: string;
  icon: React.ElementType;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  concepts: string[];
  theory: string;
  code: string;
  advanced?: boolean;
  challenge?: string;
}

const lessons: Lesson[] = [
  {
    id: "fetch-decode-execute",
    title: "The CPU Cycle",
    icon: Repeat,
    difficulty: "beginner",
    description: "Learn the fundamental fetch-decode-execute cycle that every CPU follows.",
    concepts: ["Fetch", "Decode", "Execute", "Program Counter"],
    theory:
      "Every instruction goes through three stages: FETCH reads the instruction from memory at the address pointed to by the Program Counter (PC). DECODE figures out what the instruction means. EXECUTE performs the action. The PC then advances, and the cycle repeats. This simple loop is the heartbeat of every computer.",
    code: SAMPLE_PROGRAMS.addition.code,
    challenge: "Watch the PC increment after each step. What value ends up in address 12?",
  },
  {
    id: "loading-storing",
    title: "Loading & Storing Data",
    icon: HardDrive,
    difficulty: "beginner",
    description: "Move data between memory and the CPU's accumulator register.",
    concepts: ["LDA", "STA", "Accumulator", "Memory Address"],
    theory:
      "The Accumulator (A) is the CPU's main working register — it's where calculations happen. LDA loads a value FROM memory INTO A. STA stores A's value INTO memory. Think of A as your hand: LDA picks something up, STA puts it down.",
    code: `00: LDA 10
01: STA 11
02: HLT
10: 42
11: 00`,
    challenge: "After running, address 11 should contain 42. Why?",
  },
  {
    id: "arithmetic",
    title: "Arithmetic Operations",
    icon: Zap,
    difficulty: "beginner",
    description: "Add and subtract numbers using the ALU.",
    concepts: ["ADD", "SUB", "ALU", "Zero Flag", "Carry Flag"],
    theory:
      "The Arithmetic Logic Unit (ALU) handles math. ADD takes a value from memory and adds it to the Accumulator. SUB subtracts it. After each operation, flags are updated: the Zero flag (Z) is set if the result is 0, and the Carry flag (CY) is set if the result overflows past 255 or goes below 0.",
    code: SAMPLE_PROGRAMS.addition.code,
    challenge: "Modify the values at addresses 10 and 11 to compute 200 + 100. What happens to the Carry flag?",
  },
  {
    id: "registers",
    title: "Register Transfers",
    icon: Layers,
    difficulty: "beginner",
    description: "Copy data between registers using MOV, and increment/decrement with INR/DCR.",
    concepts: ["MOV", "INR", "DCR", "Register B", "Register C"],
    theory:
      "Besides the Accumulator, the CPU has registers B and C for temporary storage. MOV copies data between registers (e.g., MOV B,A copies A into B). INR adds 1 to a register; DCR subtracts 1. Registers are the CPU's fastest storage — much quicker than memory.",
    code: SAMPLE_PROGRAMS.registerMove.code,
    challenge: "Track register B and C values through each step. What ends up in address 12?",
  },
  {
    id: "conditional-jumps",
    title: "Decisions & Branching",
    icon: GitBranch,
    difficulty: "intermediate",
    description: "Make the CPU choose different paths based on flag values.",
    concepts: ["JMP", "JZ", "JNZ", "Zero Flag", "Branching"],
    theory:
      "JMP is an unconditional jump — the CPU goes to a different address no matter what. JZ jumps only IF the Zero flag is set (Z=1). This lets the CPU make decisions! Compare two values with SUB: if they're equal, the result is 0, Z is set, and JZ will jump. This is how all if/else logic works at the hardware level.",
    code: SAMPLE_PROGRAMS.conditionalJump.code,
    challenge: "Change address 10 from 05 to 03. Does the program take the same path? Why?",
  },
  {
    id: "loops",
    title: "Loops & Counting",
    icon: Repeat,
    difficulty: "intermediate",
    description: "Create loops by combining jumps with decrements.",
    concepts: ["DCR", "JZ", "JMP", "Loop Counter"],
    theory:
      "A loop is just a jump backward! Load a counter value, decrement it each iteration, check if it's zero with JZ, and jump back with JMP if not. This pattern — load, modify, test, jump — is the foundation of every loop in every programming language.",
    code: SAMPLE_PROGRAMS.countdown.code,
    challenge: "Change the starting value at address 10 to 10. How many steps does the loop take?",
  },
  {
    id: "bitwise",
    title: "Bitwise Logic",
    icon: Binary,
    difficulty: "advanced",
    description: "Perform AND, OR, and XOR at the bit level.",
    concepts: ["AND", "OR", "XOR", "Binary", "Bit Masking"],
    theory:
      "Bitwise operations work on individual bits. AND keeps a bit only if BOTH inputs are 1. OR keeps a bit if EITHER is 1. XOR keeps a bit if inputs DIFFER. These are essential for masking, toggling, and checking individual bits — used everywhere from graphics to encryption.",
    code: SAMPLE_PROGRAMS.bitwiseOps.code,
    advanced: true,
    challenge: "170 in binary is 10101010, and 85 is 01010101. Predict the AND, OR, and XOR results before running.",
  },
  {
    id: "subroutines",
    title: "Subroutines & Stack",
    icon: Brain,
    difficulty: "advanced",
    description: "Call reusable code blocks and return with the stack.",
    concepts: ["CALL", "RET", "PUSH", "POP", "Stack"],
    theory:
      "A subroutine is a reusable block of code. CALL jumps to the subroutine and pushes the return address onto the stack. RET pops that address and jumps back. The stack is a last-in-first-out (LIFO) data structure — like a stack of plates. PUSH puts a value on top; POP takes it off.",
    code: SAMPLE_PROGRAMS.subroutine.code,
    advanced: true,
    challenge: "The subroutine doubles the accumulator. What value ends up at address 21?",
  },
];

const lessonMetas: LessonMeta[] = lessons.map((l) => ({ id: l.id, title: l.title }));

const difficultyColors: Record<string, string> = {
  beginner: "bg-accent/15 text-accent border-accent/20",
  intermediate: "bg-warning/15 text-warning border-warning/20",
  advanced: "bg-primary/15 text-primary border-primary/20",
};

/* ── Component ────────────────────────────────────────────── */

export default function LearnPage() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<string[]>(getCompletedLessons);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const toggleLesson = (id: string) => {
    setExpandedLesson((prev) => (prev === id ? null : id));
  };

  const handleComplete = useCallback((id: string) => {
    markLessonComplete(id);
    setCompleted(getCompletedLessons());
  }, []);

  const handleReset = useCallback(() => {
    resetProgress();
    setCompleted([]);
  }, []);

  const handleTryInSimulator = (code: string, advanced?: boolean) => {
    const encoded = encodeURIComponent(code);
    navigate(`/simulator?mode=${advanced ? "advanced" : "beginner"}&code=${encoded}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Learn</h1>
            <p className="text-sm text-muted-foreground">
              Interactive lessons — understand how a CPU works by doing
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex items-center gap-3 mb-8">
          <Button asChild className="rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/simulator?mode=beginner">Open Simulator →</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl gap-2">
            <Link to="/simulator?mode=advanced">Advanced Lab →</Link>
          </Button>
        </div>

        {/* Progress Tracker */}
        <div className="mb-10">
          <ProgressTracker lessons={lessonMetas} completed={completed} onReset={handleReset} />
        </div>

        {/* Lessons */}
        <section className="space-y-4">
          {lessons.map((lesson, index) => {
            const isExpanded = expandedLesson === lesson.id;
            const isDone = completed.includes(lesson.id);
            const Icon = lesson.icon;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                className={`glass-card overflow-hidden transition-shadow ${
                  isExpanded ? "card-glow" : ""
                }`}
              >
                {/* Card header — clickable */}
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="w-full text-left p-5 flex items-start gap-4 group"
                >
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isDone ? "bg-accent/15" : "bg-primary/10"
                    }`}
                  >
                    {isDone ? (
                      <Rocket className="h-4 w-4 text-accent" />
                    ) : (
                      <Icon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-display font-semibold text-sm">
                        <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
                        {lesson.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${difficultyColors[lesson.difficulty]}`}
                      >
                        {lesson.difficulty}
                      </Badge>
                      {isDone && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/20">
                          ✓ Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {lesson.description}
                    </p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {lesson.concepts.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-5 border-t pt-5">
                        {/* Theory */}
                        <div>
                          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            How it works
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {lesson.theory}
                          </p>
                        </div>

                        {/* Mini simulator */}
                        <div>
                          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Try it — step through the code
                          </h4>
                          <MiniSimulator code={lesson.code} advanced={lesson.advanced} />
                        </div>

                        {/* Challenge */}
                        {lesson.challenge && (
                          <div className="rounded-xl bg-warning/5 border border-warning/15 p-4">
                            <h4 className="font-display text-xs font-semibold text-warning mb-1">
                              🧩 Challenge
                            </h4>
                            <p className="text-sm text-foreground/70">
                              {lesson.challenge}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg gap-1.5 text-xs"
                            onClick={() =>
                              handleTryInSimulator(lesson.code, lesson.advanced)
                            }
                          >
                            <Rocket className="h-3 w-3" />
                            Open in Simulator
                          </Button>
                          {!isDone && (
                            <Button
                              size="sm"
                              className="rounded-lg gap-1.5 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                              onClick={() => handleComplete(lesson.id)}
                            >
                              Mark as Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </section>

        {/* Quick reference */}
        <section className="mt-14 mb-8">
          <h2 className="font-display text-xl font-bold mb-5">Quick Reference</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass-card p-4">
              <code className="font-mono font-bold text-primary text-sm">Z (Zero)</code>
              <p className="text-xs text-muted-foreground mt-1">
                Set when an arithmetic result is exactly 0.
              </p>
            </div>
            <div className="glass-card p-4">
              <code className="font-mono font-bold text-warning text-sm">CY (Carry)</code>
              <p className="text-xs text-muted-foreground mt-1">
                Set when ADD overflows 255 or SUB borrows.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "A (Accumulator)", desc: "Main register for arithmetic." },
              { name: "B", desc: "General-purpose temp register." },
              { name: "C", desc: "General-purpose temp register." },
            ].map((r) => (
              <div key={r.name} className="glass-card p-4">
                <code className="font-mono font-bold text-primary text-xs">{r.name}</code>
                <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
