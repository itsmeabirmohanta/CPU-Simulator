

## Plan: Update Guided Tours, Website Content, and Redesign About Page

This is a multi-part update covering 4 areas: fixing the Learn page tour, adding simulator tours, updating landing/content pages to reflect recent changes, and redesigning the About page.

---

### 1. Fix & Expand Learn Page Guided Tour

**Problem**: The walkthrough references `data-tour='lesson-0'` and `data-tour='open-sim'` selectors that don't exist in the DOM (no elements have these attributes). Steps 2-4 will fail silently.

**Fix** in `src/pages/LearnPage.tsx`:
- Add `data-tour="lesson-0"` to the first module card wrapper
- Add `data-tour="open-sim"` to the "Start Learning" or "Open Simulator" button

**Update steps** in `src/components/learn/GuidedWalkthrough.tsx`:
- Update step descriptions to match current UI (modules, not individual lessons on this page)
- Add steps for: module grid, learning path section, course stats

---

### 2. Add Simulator Page Guided Tour

Create a new `SimulatorWalkthrough` component (or make the existing one generic/reusable) that works on `/simulator`.

**New file**: `src/components/simulator/SimulatorTour.tsx`
- Reuse the same overlay/tooltip/cutout pattern from `GuidedWalkthrough`
- Separate localStorage keys for beginner vs advanced tour completion
- Accept a `mode` prop to show different steps

**Beginner mode steps** (6 steps):
1. Mode toggle (`data-tour="sim-mode-toggle"`) -- "Switch between Beginner and Advanced"
2. Sample program list (`data-tour="sim-samples"`) -- "Pick a program to explore"
3. Code editor area (`data-tour="sim-code"`) -- "Your assembly code appears here"
4. Load button (`data-tour="sim-load"`) -- "Load the program into memory"
5. Step/Run controls (`data-tour="sim-controls"`) -- "Step through or auto-run"
6. Visual CPU area (`data-tour="sim-visual"`) -- "Watch the CPU execute each instruction"

**Advanced mode steps** (7 steps):
1. Mode toggle
2. Code editor (`data-tour="sim-editor"`) -- "Write assembly or load samples"
3. Load button
4. Controls (step/run/pause/reset)
5. CPU diagram (`data-tour="sim-diagram"`) -- "See data flow between components"
6. Memory viewer (`data-tour="sim-memory"`) -- "Inspect memory contents"
7. Execution log (`data-tour="sim-log"`) -- "Trace every instruction"

**Add `data-tour` attributes** to `src/pages/SimulatorPage.tsx` on the relevant elements.

Add a Tour button (?) to the simulator toolbar that restarts the tour.

---

### 3. Update Landing Page Content

**File**: `src/pages/Index.tsx`

Updates to reflect the unified engine and curriculum:
- Update `stats` array: change "24 Instructions" to accurate count, add "6 Modules" or "30+ Lessons"
- Update `comparisons` table: beginner now has code editor too (both modes share the same engine), so mark "Code Editor" as true for both; remove "Plain-English Narration" from beginner-only (both show explanations)
- Update "What You'll Understand" list to include bitwise ops and subroutines (already supported)
- Update footer version to v3.0

---

### 4. Redesign About Page

**File**: `src/pages/AboutPage.tsx`

Complete redesign with richer content:
- **Hero**: Keep creator intro but add a project mission statement section
- **Project Story**: New section explaining why CPUverse was built (educational gap, visual learning)
- **Features Overview**: Cards showing key capabilities (unified engine, 6 modules, 30+ lessons, 2 modes, keyboard shortcuts, share links, progress tracking)
- **Architecture Diagram**: ASCII-style or visual showing Engine Layer / Visual Layer / Curriculum Layer
- **Instruction Set Reference**: Quick reference table of all supported instructions (LDA, STA, ADD, SUB, MOV, etc.) -- helps users and adds educational value
- **Tech Stack**: Keep but refresh with icons and brief descriptions
- **Stats Section**: Animated counters (modules, lessons, instructions, memory cells)
- **Contact/Links**: Social links, GitHub
- **CTA Banner**: Keep but update text

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/simulator/SimulatorTour.tsx` | **Create** -- Tour component for simulator |
| `src/components/learn/GuidedWalkthrough.tsx` | **Modify** -- Fix selectors, update steps |
| `src/pages/LearnPage.tsx` | **Modify** -- Add missing `data-tour` attributes |
| `src/pages/SimulatorPage.tsx` | **Modify** -- Add `data-tour` attributes, integrate tour |
| `src/pages/Index.tsx` | **Modify** -- Update stats, comparisons, content |
| `src/pages/AboutPage.tsx` | **Rewrite** -- Full redesign |

