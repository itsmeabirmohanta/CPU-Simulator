

## Problem Analysis

Two root causes for the simulator failures:

### Bug 1: Auto-execution on page load
`createInitialState()` sets `status: "running"`. The `useEffect` interval (line 98) triggers `step()` whenever status is `"running"`. So the simulator immediately starts executing empty memory before any program is loaded — causing errors from interpreting zeros as instructions.

### Bug 2: Beginner mode parsing vs execution mismatch
All sample programs (including beginner ones) use **assembly mnemonics** like `LDA 10`, `ADD 11`. But when `advanced=false`:
- **Parser** (line 109-116) calls `parseInt(instructionStr)` — `parseInt("LDA 10")` returns `NaN` → error toast
- **Execution engine** (line 443-476) expects a completely different byte encoding (2-byte format: opcode in one cell, operand in next cell) that no sample program actually produces

This means beginner mode is fundamentally broken — it can't parse any of its own sample programs.

## Fix Plan

### 1. Fix `createInitialState()` — set status to `"ready"` instead of `"running"`
This prevents auto-execution before a program is loaded.

### 2. Unify parsing — remove the beginner/advanced split in `parseProgram`
Both modes should parse assembly mnemonics through `encodeInstruction`. The beginner vs advanced distinction should only affect the **UI** (visual CPU vs detailed panels), not the CPU engine.

### 3. Unify execution — remove the beginner/advanced split in `executeStep`
Use the advanced execution path for both modes. The beginner execution engine only supports 4 instructions and uses an incompatible encoding that nothing produces. Remove it and use the single advanced engine for all modes.

### 4. Update `SimulatorPage` — gate execution on `hasProgram`
Add a guard so `step()` and the auto-run interval only execute when `hasProgram` is true, preventing execution of empty memory.

### Files to change
- **`src/lib/cpu.ts`**: Change `createInitialState` status to `"ready"`, remove beginner branches from `parseProgram` and `executeStep`
- **`src/pages/SimulatorPage.tsx`**: Add `hasProgram` guard in `step()` and the run `useEffect`

