

# Expand Learn Page into a Comprehensive CPU Curriculum

## Overview

Transform the current single-page Learn section into a multi-page curriculum hub with **6 course modules** (24+ lessons), embedded YouTube videos from top educators, and deeper simulator integration. The architecture uses a course index page (`/learn`) linking to individual module pages (`/learn/:moduleId`).

## Curriculum Structure

```text
Module 1: Foundations (Beginner)
├── What is a Computer?
├── Binary & Number Systems
├── Logic Gates & Boolean Algebra
├── The Von Neumann Architecture
└── Video: Crash Course CS #1-3

Module 2: Inside the CPU (Beginner)
├── CPU Components Overview
├── The Fetch-Decode-Execute Cycle (existing)
├── Registers & the Accumulator (existing)
├── The ALU & Arithmetic (existing)
├── Clock, Timing & Cycles
└── Video: Crash Course CS #7, Ben Eater

Module 3: Assembly & Machine Code (Intermediate)
├── What is Assembly Language?
├── Loading & Storing Data (existing)
├── Arithmetic Operations (existing)
├── Register Transfers (existing)
├── Writing Your First Program
└── Video: CS 61 Harvard Assembly

Module 4: Control Flow (Intermediate)
├── Flags & Comparisons
├── Conditional Jumps (existing)
├── Loops & Counting (existing)
├── Nested Loops & Patterns
├── Building a Simple Algorithm
└── Video: Computerphile

Module 5: Advanced Architecture (Advanced)
├── Bitwise Operations (existing)
├── Subroutines & the Stack (existing)
├── Memory Hierarchy & Caching
├── Pipelining Concepts
├── Interrupt Basics
└── Video: Intel Architecture All Access

Module 6: Real-World Applications (Advanced)
├── From Assembly to High-Level Languages
├── How Compilers Work
├── Modern CPU Design (multi-core, etc.)
├── Performance & Optimization
├── Capstone: Build a Complete Program
└── Video: Every CPU Architecture Explained
```

## Embedded Videos (Researched)

| Topic | Video | YouTube ID |
|-------|-------|-----------|
| How Computers Work | Crash Course CS #1 | `tpIctyqH29Q` |
| Boolean Logic & Gates | Crash Course CS #3 | `gI-qXk7XojA` |
| The CPU | Crash Course CS #7 | `FZGugFqdr60` |
| How a CPU Works | In One Lesson | `cNN_tTXABkM` |
| CPU Architecture Explained | BitLemon | `GtVDTp826DE` |
| Build 8-bit CPU | Ben Eater | `HyznrdDSSGM` |
| CPU Pipelining | Computerphile | `BVNx3wtJ9vs` |
| Intel Architecture | Intel | `o_WXTRS2qTY` |
| Fetch-Execute Cycle | Tom Scott style | `Z5JC9Ve1sfI` |
| Every CPU Architecture | Overview | `6tbNew87fZU` |

Videos will be embedded as responsive `<iframe>` elements with `loading="lazy"`.

## New Sample Programs for Simulator

Add to `cpu.ts` SAMPLE_PROGRAMS:
- **Multiplication by repeated addition** (intermediate)
- **Finding max of two numbers** (intermediate)
- **Fibonacci sequence** (advanced)
- **Bubble sort of 3 numbers** (advanced)
- **Bit counting** (advanced)

## File Architecture

```text
src/
├── pages/
│   ├── LearnPage.tsx          (course hub - redesigned as module index)
│   └── LearnModulePage.tsx    (individual module page with lessons)
├── lib/
│   ├── cpu.ts                 (add new SAMPLE_PROGRAMS)
│   └── curriculum.ts          (NEW - all module/lesson data + video refs)
├── components/learn/
│   ├── ModuleCard.tsx         (NEW - card for each module on index)
│   ├── VideoEmbed.tsx         (NEW - responsive YouTube embed)
│   ├── LessonCard.tsx         (NEW - extracted/enhanced lesson card)
│   ├── MiniSimulator.tsx      (existing - unchanged)
│   ├── LessonProgress.tsx     (updated - track per-module progress)
│   └── GuidedWalkthrough.tsx  (existing - unchanged)
├── App.tsx                    (add /learn/:moduleId route)
```

## Technical Details

### `src/lib/curriculum.ts`
Central data file containing all 6 modules, each with:
- Module metadata (id, title, icon, difficulty, description, prerequisites)
- Array of lessons (same structure as current but with added `videoId?: string` and `estimatedMinutes` fields)
- Array of video resources per module

### `src/pages/LearnPage.tsx` (Redesigned as Course Hub)
- Hero with overall progress across all modules
- 6 module cards in a grid, each showing:
  - Module number, title, difficulty badge
  - Lesson count + completion count
  - Progress bar per module
  - "Continue" / "Start" CTA linking to `/learn/:moduleId`
- Bottom section: "Recommended Learning Path" with visual flow diagram
- Quick links to simulator

### `src/pages/LearnModulePage.tsx` (New)
- Module header with title, description, prerequisites
- Video section at top (1-2 embedded videos per module)
- Expandable lesson cards (reusing current card design)
- Each lesson has: theory, mini-simulator, challenge, "Open in Simulator" button
- Module completion badge when all lessons done
- Next/Previous module navigation

### `src/components/learn/VideoEmbed.tsx`
- Responsive 16:9 YouTube iframe wrapper
- Title, duration badge, and description
- `loading="lazy"` for performance

### `src/components/learn/LessonProgress.tsx` (Updated)
- Track progress per module: `cpuverse-progress-{moduleId}`
- Global progress aggregation across all modules
- Functions: `getModuleProgress(moduleId)`, `markLessonComplete(moduleId, lessonId)`, `getOverallProgress()`

### `src/lib/cpu.ts` (Updated)
Add 5 new SAMPLE_PROGRAMS:
- `multiplication`: repeated ADD loop
- `findMax`: compare two values, store larger
- `fibonacci`: generate sequence using registers
- `bubbleSort3`: sort 3 numbers with comparisons
- `bitCount`: count set bits using AND + shift

### `src/App.tsx`
Add route: `<Route path="/learn/:moduleId" element={<LearnModulePage />} />`

### Navbar
Update Learn link to highlight for both `/learn` and `/learn/:moduleId` paths using `startsWith`.

## Scope
- **6 modules, ~30 lessons total** (8 existing migrated, 22 new)
- **10 embedded YouTube videos** from Crash Course, Ben Eater, Computerphile, Intel
- **5 new simulator programs** for hands-on practice
- Responsive, mobile-friendly design matching existing visual style
- All progress tracked in localStorage per module

