export type CpuStatus = "ready" | "running" | "halted" | "error" | "paused";

export interface CpuState {
  accumulator: number;
  registerB: number;
  registerC: number;
  programCounter: number;
  instructionRegister: string;
  zeroFlag: boolean;
  carryFlag: boolean;
  status: CpuStatus;
  errorMessage: string | null;
}

export interface MemoryCell {
  address: number;
  value: number | string;
  type: "instruction" | "data";
  changed: boolean;
}

export interface LogEntry {
  step: number;
  instruction: string;
  changes: string[];
  explanation: string;
  phase: "fetch" | "decode" | "execute";
}

export interface ParsedInstruction {
  opcode: string;
  operand?: string;
  raw: string;
  address: number;
}

const BASIC_OPCODES = ["LDA", "STA", "ADD", "SUB", "MOV", "INR", "DCR", "JMP", "JZ", "HLT"];
const ADVANCED_OPCODES = [...BASIC_OPCODES, "AND", "OR", "XOR", "CMP", "JNZ", "JC", "PUSH", "POP", "CALL", "RET", "NOP", "CMA", "RAL", "RAR"];

export function getValidOpcodes(advanced: boolean) {
  return advanced ? ADVANCED_OPCODES : BASIC_OPCODES;
}

export function createInitialState(): CpuState {
  return {
    accumulator: 0,
    registerB: 0,
    registerC: 0,
    programCounter: 0,
    instructionRegister: "",
    zeroFlag: false,
    carryFlag: false,
    status: "ready",
    errorMessage: null,
  };
}

export function createMemory(size: number = 32): MemoryCell[] {
  return Array.from({ length: size }, (_, i) => ({
    address: i,
    value: 0,
    type: "data" as const,
    changed: false,
  }));
}

export function validateLine(line: string, advanced: boolean, memSize: number): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  // Allow comments
  if (trimmed.startsWith(";") || trimmed.startsWith("//")) return null;

  const match = trimmed.match(/^(\d{2}):\s*(.+)$/);
  if (!match) return `Expected format "XX: INSTRUCTION" or "XX: VALUE"`;

  const address = parseInt(match[1], 10);
  if (address < 0 || address >= memSize) return `Address ${address} out of range (0-${memSize - 1})`;

  const content = match[2].trim();
  const numVal = parseInt(content, 10);
  if (!isNaN(numVal) && /^\d+$/.test(content)) {
    if (numVal > 255) return `Value ${numVal} exceeds 8-bit max (255)`;
    return null;
  }

  const parts = content.split(/\s+/);
  const opcode = parts[0].toUpperCase();
  const validOps = getValidOpcodes(advanced);
  if (!validOps.includes(opcode)) return `Unknown opcode "${opcode}"`;

  return null;
}

export function parseProgram(source: string, advanced: boolean = false): { memory: MemoryCell[]; errors: string[] } {
  const memSize = advanced ? 64 : 32;
  const lines = source.split("\n").filter((l) => l.trim() !== "" && !l.trim().startsWith(";") && !l.trim().startsWith("//"));
  const memory = createMemory(memSize);
  const errors: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^(\d{2}):\s*(.+)$/);
    if (!match) {
      errors.push(`Invalid format: "${trimmed}". Expected "XX: INSTRUCTION" or "XX: VALUE"`);
      continue;
    }

    const address = parseInt(match[1], 10);
    const content = match[2].trim();

    if (address < 0 || address >= memory.length) {
      errors.push(`Address ${address} out of range (0-${memory.length - 1})`);
      continue;
    }

    const numVal = parseInt(content, 10);
    if (!isNaN(numVal) && /^\d+$/.test(content)) {
      memory[address] = { address, value: numVal, type: "data", changed: false };
      continue;
    }

    const parts = content.split(/\s+/);
    const opcode = parts[0].toUpperCase();
    const validOps = getValidOpcodes(advanced);

    if (!validOps.includes(opcode)) {
      errors.push(`Invalid opcode "${opcode}" at address ${String(address).padStart(2, "0")}`);
      continue;
    }

    memory[address] = { address, value: content.toUpperCase(), type: "instruction", changed: false };
  }

  return { memory, errors };
}

// Stack for PUSH/POP/CALL/RET in advanced mode
let stack: number[] = [];

export function resetStack() {
  stack = [];
}

export function executeStep(
  state: CpuState,
  memory: MemoryCell[],
  advanced: boolean = false
): { state: CpuState; memory: MemoryCell[]; log: LogEntry } {
  const newState = { ...state };
  const newMemory = memory.map((m) => ({ ...m, changed: false }));
  const pc = state.programCounter;

  if (pc < 0 || pc >= newMemory.length) {
    return {
      state: { ...newState, status: "error", errorMessage: `Program counter ${pc} out of range` },
      memory: newMemory,
      log: { step: 0, instruction: "N/A", changes: [], explanation: "PC out of range", phase: "fetch" },
    };
  }

  const cell = newMemory[pc];
  if (cell.type !== "instruction" || typeof cell.value !== "string") {
    return {
      state: { ...newState, status: "error", errorMessage: `No instruction at address ${String(pc).padStart(2, "0")}` },
      memory: newMemory,
      log: { step: 0, instruction: "N/A", changes: [], explanation: `Expected instruction at address ${String(pc).padStart(2, "0")}`, phase: "fetch" },
    };
  }

  const instrStr = cell.value;
  newState.instructionRegister = instrStr;

  const parts = instrStr.split(/[\s,]+/);
  const opcode = parts[0];
  const operand = parts.slice(1).join(",");
  const changes: string[] = [];
  let explanation = "";

  const fetchInfo = `Fetched "${instrStr}" from address ${String(pc).padStart(2, "0")}`;

  switch (opcode) {
    case "LDA": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) {
        return error(newState, newMemory, `Invalid address "${operand}" for LDA at ${String(pc).padStart(2, "0")}`);
      }
      const val = Number(newMemory[addr].value);
      const oldA = newState.accumulator;
      newState.accumulator = val & 0xff;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `LDA ${operand}: Loaded value ${val} from memory address ${String(addr).padStart(2, "0")} into the Accumulator.`;
      break;
    }
    case "STA": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) {
        return error(newState, newMemory, `Invalid address "${operand}" for STA at ${String(pc).padStart(2, "0")}`);
      }
      const oldVal = newMemory[addr].value;
      newMemory[addr] = { ...newMemory[addr], value: newState.accumulator, changed: true };
      newState.programCounter = pc + 1;
      changes.push(`MEM[${String(addr).padStart(2, "0")}]: ${oldVal} → ${newState.accumulator}`);
      explanation = `STA ${operand}: Stored Accumulator value ${newState.accumulator} to memory address ${String(addr).padStart(2, "0")}.`;
      break;
    }
    case "ADD": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) {
        return error(newState, newMemory, `Invalid address "${operand}" for ADD at ${String(pc).padStart(2, "0")}`);
      }
      const val = Number(newMemory[addr].value);
      const oldA = newState.accumulator;
      const result = oldA + val;
      newState.carryFlag = result > 255;
      newState.accumulator = result & 0xff;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      if (newState.carryFlag) changes.push(`CY: 0 → 1`);
      if (newState.zeroFlag) changes.push(`Z: 0 → 1`);
      explanation = `ADD ${operand}: Added value ${val} from address ${String(addr).padStart(2, "0")} to Accumulator. ${oldA} + ${val} = ${result}. A = ${newState.accumulator}. Z=${newState.zeroFlag ? 1 : 0}, CY=${newState.carryFlag ? 1 : 0}.`;
      break;
    }
    case "SUB": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) {
        return error(newState, newMemory, `Invalid address "${operand}" for SUB at ${String(pc).padStart(2, "0")}`);
      }
      const val = Number(newMemory[addr].value);
      const oldA = newState.accumulator;
      const result = oldA - val;
      newState.carryFlag = result < 0;
      newState.accumulator = result & 0xff;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `SUB ${operand}: Subtracted value ${val} from Accumulator. ${oldA} - ${val} = ${result}. A = ${newState.accumulator}. Z=${newState.zeroFlag ? 1 : 0}, CY=${newState.carryFlag ? 1 : 0}.`;
      break;
    }
    case "MOV": {
      const movParts = operand.split(",").map((s) => s.trim().toUpperCase());
      if (movParts.length !== 2) {
        return error(newState, newMemory, `Invalid MOV format at ${String(pc).padStart(2, "0")}. Use MOV A,B or MOV B,A`);
      }
      const [dest, src] = movParts;
      let srcVal = 0;
      if (src === "A") srcVal = newState.accumulator;
      else if (src === "B") srcVal = newState.registerB;
      else if (src === "C") srcVal = newState.registerC;
      else return error(newState, newMemory, `Invalid register "${src}" in MOV at ${String(pc).padStart(2, "0")}`);

      const oldVal = dest === "A" ? newState.accumulator : dest === "B" ? newState.registerB : dest === "C" ? newState.registerC : -1;
      if (oldVal === -1) return error(newState, newMemory, `Invalid register "${dest}" in MOV at ${String(pc).padStart(2, "0")}`);

      if (dest === "A") newState.accumulator = srcVal;
      else if (dest === "B") newState.registerB = srcVal;
      else if (dest === "C") newState.registerC = srcVal;

      newState.programCounter = pc + 1;
      changes.push(`${dest}: ${oldVal} → ${srcVal}`);
      explanation = `MOV ${dest},${src}: Moved value ${srcVal} from register ${src} to register ${dest}.`;
      break;
    }
    case "INR": {
      const reg = operand.trim().toUpperCase();
      let oldVal = 0, newVal = 0;
      if (reg === "A") { oldVal = newState.accumulator; newState.accumulator = (oldVal + 1) & 0xff; newVal = newState.accumulator; newState.zeroFlag = newVal === 0; }
      else if (reg === "B") { oldVal = newState.registerB; newState.registerB = (oldVal + 1) & 0xff; newVal = newState.registerB; }
      else if (reg === "C") { oldVal = newState.registerC; newState.registerC = (oldVal + 1) & 0xff; newVal = newState.registerC; }
      else return error(newState, newMemory, `Invalid register "${reg}" for INR at ${String(pc).padStart(2, "0")}`);
      newState.programCounter = pc + 1;
      changes.push(`${reg}: ${oldVal} → ${newVal}`);
      explanation = `INR ${reg}: Incremented register ${reg} from ${oldVal} to ${newVal}.`;
      break;
    }
    case "DCR": {
      const reg = operand.trim().toUpperCase();
      let oldVal = 0, newVal = 0;
      if (reg === "A") { oldVal = newState.accumulator; newState.accumulator = (oldVal - 1) & 0xff; newVal = newState.accumulator; newState.zeroFlag = newVal === 0; }
      else if (reg === "B") { oldVal = newState.registerB; newState.registerB = (oldVal - 1) & 0xff; newVal = newState.registerB; }
      else if (reg === "C") { oldVal = newState.registerC; newState.registerC = (oldVal - 1) & 0xff; newVal = newState.registerC; }
      else return error(newState, newMemory, `Invalid register "${reg}" for DCR at ${String(pc).padStart(2, "0")}`);
      newState.programCounter = pc + 1;
      changes.push(`${reg}: ${oldVal} → ${newVal}`);
      explanation = `DCR ${reg}: Decremented register ${reg} from ${oldVal} to ${newVal}.`;
      break;
    }
    case "JMP": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for JMP at ${String(pc).padStart(2, "0")}`);
      newState.programCounter = addr;
      changes.push(`PC: ${pc} → ${addr}`);
      explanation = `JMP ${operand}: Unconditional jump to address ${String(addr).padStart(2, "0")}.`;
      break;
    }
    case "JZ": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for JZ at ${String(pc).padStart(2, "0")}`);
      if (state.zeroFlag) {
        newState.programCounter = addr;
        changes.push(`PC: ${pc} → ${addr} (Z=1)`);
        explanation = `JZ ${operand}: Zero flag SET → jump taken to ${String(addr).padStart(2, "0")}.`;
      } else {
        newState.programCounter = pc + 1;
        changes.push(`PC: ${pc} → ${pc + 1} (Z=0)`);
        explanation = `JZ ${operand}: Zero flag CLEAR → jump not taken.`;
      }
      break;
    }
    case "HLT": {
      newState.status = "halted";
      newState.programCounter = pc;
      explanation = `HLT: Program halted successfully.`;
      break;
    }
    // === ADVANCED INSTRUCTIONS ===
    case "AND": {
      if (!advanced) return error(newState, newMemory, `AND requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for AND`);
      const val = Number(newMemory[addr].value);
      const oldA = newState.accumulator;
      newState.accumulator = (oldA & val) & 0xff;
      newState.zeroFlag = newState.accumulator === 0;
      newState.carryFlag = false;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `AND ${operand}: Bitwise AND of A (${oldA}) with memory[${operand}] (${val}) = ${newState.accumulator}.`;
      break;
    }
    case "OR": {
      if (!advanced) return error(newState, newMemory, `OR requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for OR`);
      const val = Number(newMemory[addr].value);
      const oldA = newState.accumulator;
      newState.accumulator = (oldA | val) & 0xff;
      newState.zeroFlag = newState.accumulator === 0;
      newState.carryFlag = false;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `OR ${operand}: Bitwise OR of A (${oldA}) with memory[${operand}] (${val}) = ${newState.accumulator}.`;
      break;
    }
    case "XOR": {
      if (!advanced) return error(newState, newMemory, `XOR requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for XOR`);
      const val = Number(newMemory[addr].value);
      const oldA = newState.accumulator;
      newState.accumulator = (oldA ^ val) & 0xff;
      newState.zeroFlag = newState.accumulator === 0;
      newState.carryFlag = false;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `XOR ${operand}: Bitwise XOR of A (${oldA}) with memory[${operand}] (${val}) = ${newState.accumulator}.`;
      break;
    }
    case "CMP": {
      if (!advanced) return error(newState, newMemory, `CMP requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for CMP`);
      const val = Number(newMemory[addr].value);
      const result = newState.accumulator - val;
      newState.zeroFlag = result === 0;
      newState.carryFlag = result < 0;
      newState.programCounter = pc + 1;
      changes.push(`Z: ${newState.zeroFlag ? 1 : 0}, CY: ${newState.carryFlag ? 1 : 0}`);
      explanation = `CMP ${operand}: Compared A (${newState.accumulator}) with memory[${operand}] (${val}). Z=${newState.zeroFlag ? 1 : 0}, CY=${newState.carryFlag ? 1 : 0}. A unchanged.`;
      break;
    }
    case "JNZ": {
      if (!advanced) return error(newState, newMemory, `JNZ requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for JNZ`);
      if (!state.zeroFlag) {
        newState.programCounter = addr;
        changes.push(`PC: ${pc} → ${addr} (Z=0)`);
        explanation = `JNZ ${operand}: Zero flag CLEAR → jump taken to ${String(addr).padStart(2, "0")}.`;
      } else {
        newState.programCounter = pc + 1;
        changes.push(`PC: ${pc} → ${pc + 1} (Z=1)`);
        explanation = `JNZ ${operand}: Zero flag SET → jump not taken.`;
      }
      break;
    }
    case "JC": {
      if (!advanced) return error(newState, newMemory, `JC requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for JC`);
      if (state.carryFlag) {
        newState.programCounter = addr;
        changes.push(`PC: ${pc} → ${addr} (CY=1)`);
        explanation = `JC ${operand}: Carry flag SET → jump taken.`;
      } else {
        newState.programCounter = pc + 1;
        changes.push(`PC: ${pc} → ${pc + 1} (CY=0)`);
        explanation = `JC ${operand}: Carry flag CLEAR → jump not taken.`;
      }
      break;
    }
    case "PUSH": {
      if (!advanced) return error(newState, newMemory, `PUSH requires Advanced mode`);
      stack.push(newState.accumulator);
      newState.programCounter = pc + 1;
      changes.push(`Stack ← ${newState.accumulator}`);
      explanation = `PUSH: Pushed Accumulator (${newState.accumulator}) onto stack. Stack depth: ${stack.length}.`;
      break;
    }
    case "POP": {
      if (!advanced) return error(newState, newMemory, `POP requires Advanced mode`);
      if (stack.length === 0) return error(newState, newMemory, `Stack underflow at POP`);
      const oldA = newState.accumulator;
      newState.accumulator = stack.pop()!;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `POP: Popped ${newState.accumulator} from stack into Accumulator. Stack depth: ${stack.length}.`;
      break;
    }
    case "CALL": {
      if (!advanced) return error(newState, newMemory, `CALL requires Advanced mode`);
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) return error(newState, newMemory, `Invalid address for CALL`);
      stack.push(pc + 1);
      newState.programCounter = addr;
      changes.push(`PC: ${pc} → ${addr}, Return addr ${pc + 1} pushed`);
      explanation = `CALL ${operand}: Pushed return address ${pc + 1} onto stack, jumped to ${String(addr).padStart(2, "0")}.`;
      break;
    }
    case "RET": {
      if (!advanced) return error(newState, newMemory, `RET requires Advanced mode`);
      if (stack.length === 0) return error(newState, newMemory, `Stack underflow at RET`);
      const retAddr = stack.pop()!;
      newState.programCounter = retAddr;
      changes.push(`PC: ${pc} → ${retAddr} (return)`);
      explanation = `RET: Returned to address ${String(retAddr).padStart(2, "0")} from stack.`;
      break;
    }
    case "NOP": {
      if (!advanced) return error(newState, newMemory, `NOP requires Advanced mode`);
      newState.programCounter = pc + 1;
      explanation = `NOP: No operation. PC advanced.`;
      break;
    }
    case "CMA": {
      if (!advanced) return error(newState, newMemory, `CMA requires Advanced mode`);
      const oldA = newState.accumulator;
      newState.accumulator = (~oldA) & 0xff;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`);
      explanation = `CMA: Complemented Accumulator. ~${oldA} = ${newState.accumulator}.`;
      break;
    }
    case "RAL": {
      if (!advanced) return error(newState, newMemory, `RAL requires Advanced mode`);
      const oldA = newState.accumulator;
      const oldCY = newState.carryFlag ? 1 : 0;
      newState.carryFlag = (oldA & 0x80) !== 0;
      newState.accumulator = ((oldA << 1) | oldCY) & 0xff;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`, `CY: ${oldCY} → ${newState.carryFlag ? 1 : 0}`);
      explanation = `RAL: Rotated Accumulator left through carry. A: ${oldA} → ${newState.accumulator}, CY: ${oldCY} → ${newState.carryFlag ? 1 : 0}.`;
      break;
    }
    case "RAR": {
      if (!advanced) return error(newState, newMemory, `RAR requires Advanced mode`);
      const oldA = newState.accumulator;
      const oldCY = newState.carryFlag ? 1 : 0;
      newState.carryFlag = (oldA & 0x01) !== 0;
      newState.accumulator = ((oldA >> 1) | (oldCY << 7)) & 0xff;
      newState.programCounter = pc + 1;
      changes.push(`A: ${oldA} → ${newState.accumulator}`, `CY: ${oldCY} → ${newState.carryFlag ? 1 : 0}`);
      explanation = `RAR: Rotated Accumulator right through carry. A: ${oldA} → ${newState.accumulator}, CY: ${oldCY} → ${newState.carryFlag ? 1 : 0}.`;
      break;
    }
    default:
      return error(newState, newMemory, `Unknown opcode "${opcode}" at address ${String(pc).padStart(2, "0")}`);
  }

  return {
    state: newState,
    memory: newMemory,
    log: {
      step: 0,
      instruction: `${String(pc).padStart(2, "0")}: ${instrStr}`,
      changes,
      explanation: `${fetchInfo}\n${explanation}`,
      phase: "execute",
    },
  };
}

function error(state: CpuState, memory: MemoryCell[], msg: string) {
  return {
    state: { ...state, status: "error" as CpuStatus, errorMessage: msg },
    memory,
    log: { step: 0, instruction: "ERROR", changes: [], explanation: msg, phase: "execute" as const },
  };
}

export const SAMPLE_PROGRAMS = {
  addition: {
    name: "Addition",
    description: "Adds two numbers from memory",
    advanced: false,
    code: `00: LDA 10
01: ADD 11
02: STA 12
03: HLT
10: 05
11: 03
12: 00`,
  },
  subtraction: {
    name: "Subtraction",
    description: "Subtracts two numbers from memory",
    advanced: false,
    code: `00: LDA 10
01: SUB 11
02: STA 12
03: HLT
10: 09
11: 04
12: 00`,
  },
  conditionalJump: {
    name: "Conditional Jump",
    description: "Demonstrates JZ branching",
    advanced: false,
    code: `00: LDA 10
01: SUB 11
02: JZ 05
03: STA 12
04: HLT
05: LDA 13
06: STA 12
07: HLT
10: 05
11: 05
12: 00
13: 99`,
  },
  registerMove: {
    name: "Register Transfer",
    description: "Moves data between registers",
    advanced: false,
    code: `00: LDA 10
01: MOV B,A
02: LDA 11
03: ADD 10
04: MOV C,A
05: MOV A,B
06: STA 12
07: HLT
10: 07
11: 03
12: 00`,
  },
  countdown: {
    name: "Countdown Loop",
    description: "Decrements until zero",
    advanced: false,
    code: `00: LDA 10
01: DCR A
02: JZ 04
03: JMP 01
04: STA 11
05: HLT
10: 05
11: 00`,
  },
  bitwiseOps: {
    name: "Bitwise Logic",
    description: "AND, OR, XOR operations",
    advanced: true,
    code: `00: LDA 20
01: AND 21
02: STA 22
03: LDA 20
04: OR 21
05: STA 23
06: LDA 20
07: XOR 21
08: STA 24
09: HLT
20: 170
21: 85
22: 00
23: 00
24: 00`,
  },
  subroutine: {
    name: "Subroutine Call",
    description: "CALL/RET demo",
    advanced: true,
    code: `; Main program
00: LDA 20
01: CALL 10
02: STA 21
03: HLT
; Subroutine: doubles A
10: ADD 20
11: RET
20: 07
21: 00`,
  },
  stackOps: {
    name: "Stack Operations",
    description: "PUSH/POP demo",
    advanced: true,
    code: `00: LDA 20
01: PUSH
02: LDA 21
03: PUSH
04: POP
05: STA 22
06: POP
07: STA 23
08: HLT
20: 42
21: 99
22: 00
23: 00`,
  },
};

export const INSTRUCTION_HINTS: Record<string, { syntax: string; desc: string }> = {
  LDA: { syntax: "LDA addr", desc: "Load value from memory into Accumulator" },
  STA: { syntax: "STA addr", desc: "Store Accumulator value to memory" },
  ADD: { syntax: "ADD addr", desc: "Add memory value to Accumulator" },
  SUB: { syntax: "SUB addr", desc: "Subtract memory value from Accumulator" },
  MOV: { syntax: "MOV dst,src", desc: "Move between registers (A, B, C)" },
  INR: { syntax: "INR reg", desc: "Increment register by 1" },
  DCR: { syntax: "DCR reg", desc: "Decrement register by 1" },
  JMP: { syntax: "JMP addr", desc: "Unconditional jump" },
  JZ:  { syntax: "JZ addr", desc: "Jump if Zero flag is set" },
  HLT: { syntax: "HLT", desc: "Halt execution" },
  AND: { syntax: "AND addr", desc: "Bitwise AND with memory value" },
  OR:  { syntax: "OR addr", desc: "Bitwise OR with memory value" },
  XOR: { syntax: "XOR addr", desc: "Bitwise XOR with memory value" },
  CMP: { syntax: "CMP addr", desc: "Compare A with memory (sets flags only)" },
  JNZ: { syntax: "JNZ addr", desc: "Jump if Zero flag is clear" },
  JC:  { syntax: "JC addr", desc: "Jump if Carry flag is set" },
  PUSH: { syntax: "PUSH", desc: "Push Accumulator onto stack" },
  POP:  { syntax: "POP", desc: "Pop stack into Accumulator" },
  CALL: { syntax: "CALL addr", desc: "Call subroutine at address" },
  RET:  { syntax: "RET", desc: "Return from subroutine" },
  NOP:  { syntax: "NOP", desc: "No operation" },
  CMA:  { syntax: "CMA", desc: "Complement Accumulator (bitwise NOT)" },
  RAL:  { syntax: "RAL", desc: "Rotate Accumulator left through carry" },
  RAR:  { syntax: "RAR", desc: "Rotate Accumulator right through carry" },
};
