import {
  BookOpen, Cpu, Zap, HardDrive, Flag, Layers, GitBranch, Repeat,
  Binary, Brain, Cog, CircuitBoard, Server, Gauge, Code2, Terminal,
  Workflow, Shield, MemoryStick, Timer, ArrowLeftRight, Database,
  MonitorCog, Lightbulb, GraduationCap, type LucideIcon,
} from "lucide-react";
import { SAMPLE_PROGRAMS } from "@/lib/cpu";

/* ── Types ─────────────────────────────────────────────── */

export interface Video {
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  icon: LucideIcon;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  concepts: string[];
  theory: string;
  code?: string;
  advanced?: boolean;
  challenge?: string;
  estimatedMinutes: number;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  icon: LucideIcon;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  prerequisites: string[];
  videos: Video[];
  lessons: Lesson[];
}

/* ── Modules ───────────────────────────────────────────── */

export const modules: Module[] = [
  /* ========== MODULE 1: Foundations ========== */
  {
    id: "foundations",
    number: 1,
    title: "Foundations of Computing",
    icon: BookOpen,
    difficulty: "beginner",
    description: "Start from the very beginning — understand what a computer really is, how binary works, and the fundamental architecture that powers every device.",
    prerequisites: [],
    videos: [
      {
        youtubeId: "tpIctyqH29Q",
        title: "How Computers Work — Early Computing",
        channel: "Crash Course Computer Science",
        duration: "11:36",
        description: "From abacuses to Babbage's Analytical Engine — the surprising origins of computing.",
      },
      {
        youtubeId: "gI-qXk7XojA",
        title: "Boolean Logic & Logic Gates",
        channel: "Crash Course Computer Science",
        duration: "10:06",
        description: "How TRUE and FALSE become the foundation of all computation through AND, OR, and NOT gates.",
      },
    ],
    lessons: [
      {
        id: "what-is-a-computer",
        title: "What is a Computer?",
        icon: MonitorCog,
        difficulty: "beginner",
        description: "Strip away the complexity — a computer is fundamentally a machine that takes input, processes it, and produces output.",
        concepts: ["Input", "Processing", "Output", "Storage"],
        theory: "At its core, a computer does four things: (1) INPUT — receives data from keyboards, mice, sensors, or networks; (2) PROCESSING — the CPU manipulates that data using instructions; (3) OUTPUT — results are sent to screens, speakers, or files; (4) STORAGE — data is saved for later in memory or disk. Every device from a smartphone to a supercomputer follows this exact pattern. The magic is that the 'instructions' can be changed, making the same hardware do completely different tasks.",
        estimatedMinutes: 5,
      },
      {
        id: "binary-number-systems",
        title: "Binary & Number Systems",
        icon: Binary,
        difficulty: "beginner",
        description: "Computers only understand 0s and 1s. Learn how binary encodes everything from numbers to text.",
        concepts: ["Binary", "Decimal", "Hexadecimal", "Bit", "Byte"],
        theory: "Humans use base-10 (decimal) because we have 10 fingers. Computers use base-2 (binary) because transistors have two states: ON (1) and OFF (0). A single binary digit is a BIT. Eight bits make a BYTE, which can represent values 0–255. To convert binary to decimal: each position is a power of 2. For example, 1101 = 8+4+0+1 = 13. Hexadecimal (base-16) is a shorthand — each hex digit represents 4 bits, making long binary numbers easier to read. 0xFF = 11111111 = 255.",
        code: `; Binary exploration\n; These decimal values have interesting binary patterns\n00: LDA 10\n01: ADD 11\n02: STA 12\n03: HLT\n10: 170\n11: 85\n12: 00`,
        challenge: "170 in binary is 10101010 and 85 is 01010101. Their sum is 255 (11111111). Verify this!",
        estimatedMinutes: 8,
      },
      {
        id: "logic-gates",
        title: "Logic Gates & Boolean Algebra",
        icon: CircuitBoard,
        difficulty: "beginner",
        description: "AND, OR, NOT — the tiny building blocks that make up every circuit inside a CPU.",
        concepts: ["AND", "OR", "NOT", "NAND", "XOR", "Truth Tables"],
        theory: "Logic gates are the physical implementation of Boolean algebra. An AND gate outputs 1 only when BOTH inputs are 1. An OR gate outputs 1 when EITHER input is 1. A NOT gate flips 0→1 and 1→0. Incredibly, you can build ANY computation from just NAND gates (NOT-AND). XOR outputs 1 when inputs DIFFER — it's essential for addition circuits. By combining thousands of gates, we build adders, multiplexers, and eventually entire CPUs. Every app you've ever used runs on billions of these tiny logic decisions.",
        estimatedMinutes: 10,
      },
      {
        id: "von-neumann",
        title: "The Von Neumann Architecture",
        icon: Server,
        difficulty: "beginner",
        description: "The blueprint for nearly every modern computer — one shared memory for both instructions and data.",
        concepts: ["Von Neumann", "Harvard", "CPU", "Memory", "Bus"],
        theory: "In 1945, John von Neumann described an architecture where INSTRUCTIONS and DATA share the same memory. The CPU fetches instructions from memory, decodes them, and executes them. This is the architecture our simulator uses. Key components: (1) CPU with ALU (arithmetic) and Control Unit (decoding); (2) Memory storing both program and data; (3) Buses connecting them (address bus says WHERE, data bus carries WHAT). The alternative 'Harvard architecture' uses separate memory for instructions and data — most modern CPUs actually use a hybrid of both.",
        estimatedMinutes: 8,
      },
    ],
  },

  /* ========== MODULE 2: Inside the CPU ========== */
  {
    id: "inside-cpu",
    number: 2,
    title: "Inside the CPU",
    icon: Cpu,
    difficulty: "beginner",
    description: "Zoom into the processor — understand registers, the ALU, the control unit, and the fetch-decode-execute cycle that drives everything.",
    prerequisites: ["foundations"],
    videos: [
      {
        youtubeId: "FZGugFqdr60",
        title: "The Central Processing Unit (CPU)",
        channel: "Crash Course Computer Science",
        duration: "11:37",
        description: "How the CPU fetches, decodes, and executes instructions — with beautiful animations.",
      },
      {
        youtubeId: "cNN_tTXABkM",
        title: "How a CPU Works — In One Lesson",
        channel: "In One Lesson",
        duration: "20:42",
        description: "A thorough walkthrough of CPU internals with clear diagrams.",
      },
    ],
    lessons: [
      {
        id: "cpu-components",
        title: "CPU Components Overview",
        icon: Cog,
        difficulty: "beginner",
        description: "Meet the ALU, Control Unit, registers, and buses — the essential parts of every processor.",
        concepts: ["ALU", "Control Unit", "Registers", "Data Bus", "Address Bus"],
        theory: "The CPU has three main parts: (1) The ALU (Arithmetic Logic Unit) does all math and logic — addition, subtraction, AND, OR, comparisons. (2) The Control Unit orchestrates everything — it reads instructions, figures out what to do, and tells the ALU and memory what to do. (3) Registers are tiny, ultra-fast storage locations inside the CPU. Our simulator has registers A (accumulator), B, and C. Data travels between components on BUSES — wires that carry binary signals. The address bus selects a memory location; the data bus carries the actual value.",
        estimatedMinutes: 8,
      },
      {
        id: "fetch-decode-execute",
        title: "The Fetch-Decode-Execute Cycle",
        icon: Repeat,
        difficulty: "beginner",
        description: "The fundamental cycle that every CPU follows — over and over, billions of times per second.",
        concepts: ["Fetch", "Decode", "Execute", "Program Counter"],
        theory: "Every instruction goes through three stages: FETCH reads the instruction from memory at the address pointed to by the Program Counter (PC). DECODE figures out what the instruction means. EXECUTE performs the action. The PC then advances, and the cycle repeats. This simple loop is the heartbeat of every computer. Modern CPUs execute billions of these cycles per second, but the principle is the same as our simple simulator.",
        code: SAMPLE_PROGRAMS.addition.code,
        challenge: "Watch the PC increment after each step. What value ends up in address 12?",
        estimatedMinutes: 10,
      },
      {
        id: "registers-accumulator",
        title: "Registers & the Accumulator",
        icon: Layers,
        difficulty: "beginner",
        description: "Registers are the CPU's fastest storage. The Accumulator is where all the action happens.",
        concepts: ["Accumulator", "Register B", "Register C", "MOV", "INR", "DCR"],
        theory: "Besides the Accumulator, the CPU has registers B and C for temporary storage. MOV copies data between registers (e.g., MOV B,A copies A into B). INR adds 1 to a register; DCR subtracts 1. Registers are the CPU's fastest storage — much quicker than memory. Using registers efficiently is key to writing fast programs.",
        code: SAMPLE_PROGRAMS.registerMove.code,
        challenge: "Track register B and C values through each step. What ends up in address 12?",
        estimatedMinutes: 8,
      },
      {
        id: "alu-arithmetic",
        title: "The ALU & Arithmetic",
        icon: Zap,
        difficulty: "beginner",
        description: "The Arithmetic Logic Unit handles all math — addition, subtraction, and flag updates.",
        concepts: ["ADD", "SUB", "ALU", "Zero Flag", "Carry Flag"],
        theory: "The Arithmetic Logic Unit (ALU) handles math. ADD takes a value from memory and adds it to the Accumulator. SUB subtracts it. After each operation, flags are updated: the Zero flag (Z) is set if the result is 0, and the Carry flag (CY) is set if the result overflows past 255 or goes below 0. Understanding flags is crucial — they're how the CPU 'remembers' the outcome of calculations.",
        code: SAMPLE_PROGRAMS.addition.code,
        challenge: "Modify the values at addresses 10 and 11 to compute 200 + 100. What happens to the Carry flag?",
        estimatedMinutes: 10,
      },
      {
        id: "clock-timing",
        title: "Clock, Timing & Cycles",
        icon: Timer,
        difficulty: "beginner",
        description: "The system clock synchronizes everything — every operation happens in precise time steps.",
        concepts: ["Clock Speed", "GHz", "Clock Cycle", "CPI"],
        theory: "The CPU clock is like a metronome — it ticks at a fixed rate, and each tick drives one step of the fetch-decode-execute cycle. Clock speed is measured in Hertz (Hz): 1 GHz = 1 billion ticks per second. A faster clock means more instructions per second, but also more heat. CPI (Cycles Per Instruction) tells us how many clock ticks one instruction takes — simple instructions might take 1 cycle, complex ones might take 4+. Modern CPUs use tricks like pipelining to keep every part of the chip busy on every tick.",
        estimatedMinutes: 6,
      },
    ],
  },

  /* ========== MODULE 3: Assembly & Machine Code ========== */
  {
    id: "assembly",
    number: 3,
    title: "Assembly & Machine Code",
    icon: Terminal,
    difficulty: "intermediate",
    description: "Write real assembly programs — learn the language that talks directly to the CPU, one instruction at a time.",
    prerequisites: ["inside-cpu"],
    videos: [
      {
        youtubeId: "Z5JC9Ve1sfI",
        title: "The Fetch-Execute Cycle — What Your CPU Actually Does",
        channel: "Tom Scott",
        duration: "9:01",
        description: "A beautifully simple explanation of how CPUs run programs, step by step.",
      },
      {
        youtubeId: "HyznrdDSSGM",
        title: "Building an 8-bit CPU from Scratch",
        channel: "Ben Eater",
        duration: "44:48",
        description: "The legendary Ben Eater builds a working CPU on breadboards — see assembly come to life in hardware.",
      },
    ],
    lessons: [
      {
        id: "what-is-assembly",
        title: "What is Assembly Language?",
        icon: Code2,
        difficulty: "intermediate",
        description: "Assembly is the lowest-level human-readable language — each line maps directly to a CPU instruction.",
        concepts: ["Opcode", "Operand", "Assembler", "Machine Code"],
        theory: "Assembly language is a thin layer above raw binary machine code. Each assembly instruction (like LDA 10) maps to a specific binary pattern the CPU understands. The OPCODE is the instruction name (LDA, ADD, JMP). The OPERAND is the data it works on (a memory address or register). An ASSEMBLER translates assembly to machine code. Why learn assembly? It's the key to understanding performance, debugging, reverse engineering, and systems programming. Every C, Java, or Python program eventually becomes assembly.",
        code: `; A simple assembly program\n; Load, add, and store\n00: LDA 10\n01: ADD 11\n02: STA 12\n03: HLT\n10: 25\n11: 17\n12: 00`,
        challenge: "Before running, predict what value will be stored at address 12.",
        estimatedMinutes: 8,
      },
      {
        id: "loading-storing",
        title: "Loading & Storing Data",
        icon: HardDrive,
        difficulty: "intermediate",
        description: "Move data between memory and the CPU's accumulator register.",
        concepts: ["LDA", "STA", "Accumulator", "Memory Address"],
        theory: "The Accumulator (A) is the CPU's main working register — it's where calculations happen. LDA loads a value FROM memory INTO A. STA stores A's value INTO memory. Think of A as your hand: LDA picks something up, STA puts it down. Every calculation follows this pattern: load values from memory, process them in registers, store results back.",
        code: `00: LDA 10\n01: STA 11\n02: LDA 12\n03: STA 13\n04: HLT\n10: 42\n11: 00\n12: 99\n13: 00`,
        challenge: "After running, what values are at addresses 11 and 13? Why?",
        estimatedMinutes: 8,
      },
      {
        id: "arithmetic-ops",
        title: "Arithmetic Operations in Practice",
        icon: Zap,
        difficulty: "intermediate",
        description: "Combine ADD, SUB, INR, DCR to perform multi-step calculations.",
        concepts: ["ADD", "SUB", "INR", "DCR", "Chaining"],
        theory: "Real programs chain multiple arithmetic operations. You can ADD several values by loading the first, adding the second, adding the third, and storing the result. SUB works the same way. INR and DCR modify registers directly — useful for counting. The key insight: the Accumulator always holds the 'running total.' Plan your calculations like a recipe: load ingredients (LDA), combine them (ADD/SUB), and store the result (STA).",
        code: `; Add three numbers: 10 + 20 + 30\n00: LDA 10\n01: ADD 11\n02: ADD 12\n03: STA 13\n04: HLT\n10: 10\n11: 20\n12: 30\n13: 00`,
        challenge: "Modify this to subtract 12 from the sum instead of adding it. What's the result?",
        estimatedMinutes: 10,
      },
      {
        id: "register-transfers",
        title: "Multi-Register Programming",
        icon: ArrowLeftRight,
        difficulty: "intermediate",
        description: "Use all three registers together to solve more complex problems.",
        concepts: ["MOV", "Register Planning", "Data Flow"],
        theory: "With registers A, B, and C, you can hold three values simultaneously — no memory access needed. Plan which register holds what: A for active computation, B and C for temporary values. MOV B,A saves A into B before you overwrite A with a new value. This 'register allocation' is exactly what compilers do — and doing it well is the difference between fast and slow programs.",
        code: SAMPLE_PROGRAMS.registerMove.code,
        challenge: "Write a program that swaps the values at addresses 10 and 11 using registers.",
        estimatedMinutes: 10,
      },
      {
        id: "first-program",
        title: "Writing Your First Complete Program",
        icon: GraduationCap,
        difficulty: "intermediate",
        description: "Put it all together — design, write, and test a complete program from scratch.",
        concepts: ["Program Design", "Testing", "Debugging"],
        theory: "Writing a program from scratch follows a process: (1) DEFINE the problem — what inputs and outputs? (2) PLAN the algorithm — what steps? (3) ALLOCATE memory — where are variables? (4) WRITE instructions. (5) TEST by stepping through. Start simple: compute (A + B) × 2. Load A, add B, then add the result to itself (doubling). Store it. Now try (A - B) and check if the result is zero. Building this intuition is essential before tackling loops and branches.",
        code: `; Compute (5 + 3) × 2\n00: LDA 10\n01: ADD 11\n02: MOV B,A\n03: ADD 11\n04: SUB 11\n05: ADD 10\n06: STA 12\n07: HLT\n10: 05\n11: 03\n12: 00`,
        challenge: "Fix this program — it doesn't correctly compute (5+3)×2. The answer should be 16. Hint: use MOV and ADD differently.",
        estimatedMinutes: 12,
      },
    ],
  },

  /* ========== MODULE 4: Control Flow ========== */
  {
    id: "control-flow",
    number: 4,
    title: "Control Flow & Algorithms",
    icon: GitBranch,
    difficulty: "intermediate",
    description: "Make the CPU think — conditional jumps, loops, and your first real algorithms.",
    prerequisites: ["assembly"],
    videos: [
      {
        youtubeId: "GtVDTp826DE",
        title: "CPU Architecture Explained",
        channel: "BitLemon",
        duration: "15:22",
        description: "Deep dive into how branching and control flow work at the hardware level.",
      },
    ],
    lessons: [
      {
        id: "flags-comparisons",
        title: "Flags & Comparisons",
        icon: Flag,
        difficulty: "intermediate",
        description: "The Zero and Carry flags are how the CPU 'remembers' the result of a comparison.",
        concepts: ["Zero Flag", "Carry Flag", "CMP", "SUB"],
        theory: "After any arithmetic operation, the CPU updates STATUS FLAGS. The Zero flag (Z) is set when the result is exactly 0. The Carry flag (CY) is set when the result overflows (>255) or underflows (<0). To compare two values, subtract them: if equal, Z=1. If A < B, the subtraction borrows, setting CY=1. CMP does the same subtraction but DOESN'T change A — it only updates flags. Flags are the CPU's short-term memory of 'what just happened.'",
        code: `; Compare 5 and 5\n00: LDA 10\n01: SUB 11\n02: JZ 05\n03: LDA 12\n04: HLT\n05: LDA 13\n06: STA 14\n07: HLT\n10: 05\n11: 05\n12: 01\n13: 99\n14: 00`,
        challenge: "Change address 11 to 03. Does the program take the JZ branch? What flag determines this?",
        estimatedMinutes: 10,
      },
      {
        id: "conditional-jumps",
        title: "Conditional Branching",
        icon: GitBranch,
        difficulty: "intermediate",
        description: "JZ, JNZ, JC — make the CPU choose different paths based on conditions.",
        concepts: ["JMP", "JZ", "JNZ", "JC", "Branching"],
        theory: "JMP is an unconditional jump — the CPU always goes to the specified address. JZ jumps only IF Z=1. JNZ jumps only IF Z=0. JC jumps only IF CY=1. This is how ALL decision-making works in computers. Every if/else, every switch statement, every conditional in any language compiles down to compare + conditional jump. Pattern: compute something → check flag → jump or fall through.",
        code: SAMPLE_PROGRAMS.conditionalJump.code,
        challenge: "Change address 10 from 05 to 03. Does the program take the same path? Why?",
        estimatedMinutes: 10,
      },
      {
        id: "loops-counting",
        title: "Loops & Counting",
        icon: Repeat,
        difficulty: "intermediate",
        description: "Create loops by combining jumps with decrements — the foundation of iteration.",
        concepts: ["Loop Counter", "DCR", "JZ", "JMP", "Iteration"],
        theory: "A loop is just a jump backward! The pattern: (1) Load a counter. (2) Do work. (3) Decrement the counter. (4) If not zero, jump back to step 2. This is the foundation of every for/while loop. Our countdown program loads 5, decrements each iteration, and stops when it reaches 0. The number of iterations = initial counter value. This same pattern drives everything from rendering pixels to training neural networks.",
        code: SAMPLE_PROGRAMS.countdown.code,
        challenge: "Change the starting value at address 10 to 10. How many steps does the loop take?",
        estimatedMinutes: 10,
      },
      {
        id: "nested-patterns",
        title: "Nested Loops & Patterns",
        icon: Workflow,
        difficulty: "intermediate",
        description: "Combine an outer and inner loop — multiply iterations and build complex behavior.",
        concepts: ["Outer Loop", "Inner Loop", "Multiplication", "Register Usage"],
        theory: "A nested loop uses two counters — an outer loop and an inner loop. The inner loop completes all its iterations for each single iteration of the outer loop. If outer runs N times and inner runs M times, the body executes N×M times. This is how multiplication works at the CPU level: repeated addition in a loop. Registers B and C are crucial here — use one as the outer counter and the other as temporary storage.",
        code: `; Multiply 4 × 3 by repeated addition\n; Result = 4 + 4 + 4 = 12\n00: LDA 15\n01: MOV B,A\n02: LDA 14\n03: MOV C,A\n04: LDA 16\n05: ADD 15\n06: DCR C\n07: JZ 10\n08: JMP 05\n09: NOP\n10: STA 17\n11: HLT\n14: 03\n15: 04\n16: 00\n17: 00`,
        advanced: false,
        challenge: "This computes 4×3. Change it to compute 5×6. What value ends up at address 17?",
        estimatedMinutes: 12,
      },
      {
        id: "simple-algorithm",
        title: "Building a Simple Algorithm",
        icon: Lightbulb,
        difficulty: "intermediate",
        description: "Find the maximum of two numbers — your first real algorithm in assembly.",
        concepts: ["Algorithm", "Comparison", "Selection", "FindMax"],
        theory: "An algorithm is a step-by-step procedure to solve a problem. Finding the maximum of two numbers: (1) Load first number. (2) Subtract second number. (3) If result ≥ 0, first is larger. (4) Otherwise, second is larger. (5) Store the larger one. This uses everything you've learned: loading, arithmetic, flags, and conditional jumps. It's the same algorithm used in sorting, searching, and optimization — just scaled up.",
        code: `; Find max of two numbers\n00: LDA 10\n01: SUB 11\n02: JC 06\n03: LDA 10\n04: STA 12\n05: HLT\n06: LDA 11\n07: STA 12\n08: HLT\n10: 15\n11: 23\n12: 00`,
        advanced: true,
        challenge: "The program finds max(15, 23). Change the values and verify it works with different inputs.",
        estimatedMinutes: 12,
      },
    ],
  },

  /* ========== MODULE 5: Advanced Architecture ========== */
  {
    id: "advanced-arch",
    number: 5,
    title: "Advanced Architecture",
    icon: Brain,
    difficulty: "advanced",
    description: "Dive deep — bitwise operations, subroutines, the stack, pipelining, and memory hierarchy.",
    prerequisites: ["control-flow"],
    videos: [
      {
        youtubeId: "o_WXTRS2qTY",
        title: "Intel Architecture All Access — Inside the CPU",
        channel: "Intel",
        duration: "5:37",
        description: "Intel engineers walk through modern CPU design and manufacturing.",
      },
      {
        youtubeId: "BVNx3wtJ9vs",
        title: "CPU Pipelining Explained",
        channel: "Computerphile",
        duration: "11:01",
        description: "Why modern CPUs overlap instructions like an assembly line — and the hazards involved.",
      },
    ],
    lessons: [
      {
        id: "bitwise-ops",
        title: "Bitwise Operations",
        icon: Binary,
        difficulty: "advanced",
        description: "AND, OR, XOR, NOT, and bit shifting — the foundation of low-level programming.",
        concepts: ["AND", "OR", "XOR", "CMA", "RAL", "RAR", "Bit Masking"],
        theory: "Bitwise operations work on individual bits. AND keeps a bit only if BOTH inputs are 1 — used for masking (isolating specific bits). OR keeps a bit if EITHER is 1 — used for setting bits. XOR keeps a bit if inputs DIFFER — used for toggling and encryption. CMA flips all bits (NOT). RAL/RAR rotate bits left/right through the carry flag. These operations are essential in graphics, networking, cryptography, and hardware control.",
        code: SAMPLE_PROGRAMS.bitwiseOps.code,
        advanced: true,
        challenge: "170 in binary is 10101010, and 85 is 01010101. Predict the AND, OR, and XOR results before running.",
        estimatedMinutes: 12,
      },
      {
        id: "subroutines-stack",
        title: "Subroutines & the Stack",
        icon: Brain,
        difficulty: "advanced",
        description: "Call reusable code blocks and understand the stack — the CPU's function call mechanism.",
        concepts: ["CALL", "RET", "PUSH", "POP", "Stack", "LIFO"],
        theory: "A subroutine is a reusable block of code — the assembly equivalent of a function. CALL jumps to the subroutine and pushes the return address onto the stack. RET pops that address and jumps back. The stack is a LIFO (last-in-first-out) structure. PUSH puts the Accumulator on top; POP removes the top value into A. The stack enables recursion, nested function calls, and local variables. Every function call in every language uses this mechanism.",
        code: SAMPLE_PROGRAMS.subroutine.code,
        advanced: true,
        challenge: "The subroutine doubles the accumulator. What value ends up at address 21?",
        estimatedMinutes: 12,
      },
      {
        id: "memory-hierarchy",
        title: "Memory Hierarchy & Caching",
        icon: Database,
        difficulty: "advanced",
        description: "From registers to RAM to disk — understand why memory has layers and how caches make CPUs fast.",
        concepts: ["Cache", "L1/L2/L3", "Cache Hit", "Cache Miss", "Locality"],
        theory: "Memory isn't one thing — it's a hierarchy. Registers are fastest (1 cycle) but tiny (a few bytes). L1 cache is very fast (~4 cycles) and small (~64KB). L2 cache is slower (~10 cycles) and bigger (~256KB). L3 cache (~40 cycles, ~8MB). RAM (~100 cycles, GBs). Disk (millions of cycles). The CPU automatically copies frequently-used data into caches. 'Temporal locality' means recently-used data is likely used again. 'Spatial locality' means nearby data is likely used next. Understanding this hierarchy is key to writing fast programs.",
        estimatedMinutes: 10,
      },
      {
        id: "pipelining",
        title: "Pipelining Concepts",
        icon: Workflow,
        difficulty: "advanced",
        description: "Modern CPUs overlap instructions like an assembly line — fetch one while executing another.",
        concepts: ["Pipeline Stages", "Throughput", "Hazards", "Stalls", "Branch Prediction"],
        theory: "Without pipelining, the CPU finishes one instruction completely before starting the next. With pipelining, it's like an assembly line: while instruction 1 is executing, instruction 2 is being decoded, and instruction 3 is being fetched. A 5-stage pipeline can have 5 instructions in-flight simultaneously, potentially 5× throughput. But HAZARDS cause problems: data hazards (instruction needs a result that isn't ready), control hazards (branches change the flow). Branch prediction guesses which way a branch will go — modern CPUs are 95%+ accurate.",
        estimatedMinutes: 10,
      },
      {
        id: "interrupts",
        title: "Interrupt Basics",
        icon: Shield,
        difficulty: "advanced",
        description: "How the CPU handles external events — keyboard presses, timers, and hardware signals.",
        concepts: ["Interrupt", "ISR", "Priority", "Context Switch"],
        theory: "An interrupt is an external signal that says 'stop what you're doing and handle this!' When an interrupt fires: (1) The CPU finishes the current instruction. (2) It saves its state (registers, PC, flags) onto the stack. (3) It jumps to an Interrupt Service Routine (ISR) — a special handler. (4) After the ISR, it restores state and resumes. This is how keyboards, mice, timers, and network cards communicate with the CPU. Without interrupts, the CPU would have to constantly poll every device — incredibly wasteful.",
        estimatedMinutes: 10,
      },
    ],
  },

  /* ========== MODULE 6: Real-World Applications ========== */
  {
    id: "real-world",
    number: 6,
    title: "Real-World Applications",
    icon: Gauge,
    difficulty: "advanced",
    description: "Connect theory to practice — compilers, modern CPU design, optimization, and your capstone project.",
    prerequisites: ["advanced-arch"],
    videos: [
      {
        youtubeId: "6tbNew87fZU",
        title: "Every CPU Architecture Explained",
        channel: "Tech Overview",
        duration: "18:15",
        description: "x86, ARM, RISC-V, MIPS — how different architectures make different trade-offs.",
      },
    ],
    lessons: [
      {
        id: "assembly-to-highlevel",
        title: "From Assembly to High-Level Languages",
        icon: Code2,
        difficulty: "advanced",
        description: "See how C, Python, and JavaScript ultimately become the assembly you've been writing.",
        concepts: ["Compiler", "Interpreter", "Abstraction", "Translation"],
        theory: "Every high-level language eventually becomes machine code. C is compiled directly to assembly — you can see the exact instructions. Python is interpreted — a C program reads your Python and executes corresponding machine code. JavaScript is JIT-compiled — translated to machine code while running. Each level of abstraction trades some control for productivity. An 'if' statement becomes CMP + JZ. A 'for' loop becomes LDA + DCR + JNZ. A function call becomes CALL + RET. Understanding this chain makes you a fundamentally better programmer.",
        estimatedMinutes: 10,
      },
      {
        id: "how-compilers-work",
        title: "How Compilers Work",
        icon: Cog,
        difficulty: "advanced",
        description: "Lexing, parsing, optimization, code generation — the stages of turning source code into machine code.",
        concepts: ["Lexer", "Parser", "AST", "Optimization", "Code Generation"],
        theory: "A compiler transforms source code in stages: (1) LEXING breaks code into tokens ('if', '(', 'x', '>'). (2) PARSING builds an Abstract Syntax Tree (AST) — a tree structure of the program. (3) OPTIMIZATION simplifies — removing dead code, folding constants, unrolling loops. (4) CODE GENERATION maps AST nodes to assembly instructions. Modern compilers like GCC and LLVM perform hundreds of optimization passes. The best compilers generate assembly that's often better than what humans write.",
        estimatedMinutes: 10,
      },
      {
        id: "modern-cpu-design",
        title: "Modern CPU Design",
        icon: CircuitBoard,
        difficulty: "advanced",
        description: "Multi-core, out-of-order execution, speculative execution — how modern CPUs achieve incredible speed.",
        concepts: ["Multi-core", "Superscalar", "Out-of-Order", "Speculative Execution"],
        theory: "Modern CPUs go far beyond simple fetch-decode-execute. SUPERSCALAR execution runs multiple instructions per clock cycle using duplicate execution units. OUT-OF-ORDER execution reorders instructions to avoid stalls — if instruction 2 needs the result of instruction 1, the CPU can execute instruction 3 first. MULTI-CORE processors have multiple independent CPUs on one chip, enabling true parallelism. SPECULATIVE EXECUTION guesses the result of branches and executes ahead — rolling back if wrong. These techniques give modern CPUs 1000× the performance of simple designs.",
        estimatedMinutes: 12,
      },
      {
        id: "performance-optimization",
        title: "Performance & Optimization",
        icon: Gauge,
        difficulty: "advanced",
        description: "Write faster programs by understanding cache behavior, branch prediction, and instruction-level parallelism.",
        concepts: ["Cache-Friendly Code", "Branch Prediction", "ILP", "Profiling"],
        theory: "Optimization starts with measurement — use profilers to find bottlenecks. Key principles: (1) Cache-friendly access patterns — process arrays sequentially, not randomly. (2) Minimize branches — conditional moves are faster than jumps. (3) Reduce memory access — keep working data in registers. (4) Loop optimization — unrolling, strength reduction, and vectorization. The 90/10 rule: 90% of time is spent in 10% of code. Profile first, optimize the hot spots, and always measure the improvement.",
        estimatedMinutes: 10,
      },
      {
        id: "capstone",
        title: "Capstone: Build a Complete Program",
        icon: GraduationCap,
        difficulty: "advanced",
        description: "Your final challenge — design and implement a multi-part assembly program from scratch.",
        concepts: ["Program Design", "Algorithm", "Testing", "Debugging"],
        theory: "For your capstone, combine everything: registers, arithmetic, flags, loops, subroutines, and bitwise operations. Challenge: Write a program that (1) takes an input number from memory, (2) computes its factorial using a loop (5! = 5×4×3×2×1 = 120), (3) stores the result. Plan your register usage, design your loop, and handle edge cases. This is what real software engineering looks like at the lowest level.",
        code: `; Capstone: Compute factorial of N\n; N=5, Result should be 120\n; Uses multiplication by repeated addition\n00: LDA 20\n01: MOV B,A\n02: DCR B\n03: MOV C,A\n04: LDA 21\n05: ADD 20\n06: DCR C\n07: JZ 10\n08: JMP 05\n09: NOP\n10: STA 20\n11: DCR B\n12: JZ 15\n13: MOV C,A\n14: JMP 04\n15: LDA 20\n16: STA 22\n17: HLT\n20: 05\n21: 00\n22: 00`,
        advanced: true,
        challenge: "This attempts factorial but has a bug. Debug it! The correct answer for 5! is 120.",
        estimatedMinutes: 20,
      },
    ],
  },
];

/* ── Helpers ───────────────────────────────────────────── */

export function getAllLessons(): Lesson[] {
  return modules.flatMap((m) => m.lessons);
}

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getTotalLessonCount(): number {
  return modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

export const difficultyConfig: Record<string, { color: string; border: string; bg: string }> = {
  beginner: { color: "bg-accent/15 text-accent border-accent/20", border: "border-l-accent", bg: "from-accent/5" },
  intermediate: { color: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", border: "border-l-yellow-500", bg: "from-yellow-500/5" },
  advanced: { color: "bg-primary/15 text-primary border-primary/20", border: "border-l-primary", bg: "from-primary/5" },
};
