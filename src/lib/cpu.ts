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

const VALID_OPCODES = ["LDA", "STA", "ADD", "SUB", "MOV", "INR", "DCR", "JMP", "JZ", "HLT"];

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

export function parseProgram(source: string): { memory: MemoryCell[]; errors: string[] } {
  const lines = source.split("\n").filter((l) => l.trim() !== "");
  const memory = createMemory(32);
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

    // Check if it's a pure number (data)
    const numVal = parseInt(content, 10);
    if (!isNaN(numVal) && /^\d+$/.test(content)) {
      memory[address] = { address, value: numVal, type: "data", changed: false };
      continue;
    }

    // It's an instruction
    const parts = content.split(/\s+/);
    const opcode = parts[0].toUpperCase();

    if (!VALID_OPCODES.includes(opcode)) {
      errors.push(`Invalid opcode "${opcode}" at address ${String(address).padStart(2, "0")}`);
      continue;
    }

    memory[address] = { address, value: content.toUpperCase(), type: "instruction", changed: false };
  }

  return { memory, errors };
}

export function executeStep(
  state: CpuState,
  memory: MemoryCell[]
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

  // FETCH phase info
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
      explanation = `LDA ${operand}: Loaded value ${val} from memory address ${String(addr).padStart(2, "0")} into the Accumulator. A changed from ${oldA} to ${newState.accumulator}.`;
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
      explanation = `STA ${operand}: Stored Accumulator value ${newState.accumulator} to memory address ${String(addr).padStart(2, "0")}. Memory changed from ${oldVal} to ${newState.accumulator}.`;
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
      explanation = `ADD ${operand}: Added value ${val} (from address ${String(addr).padStart(2, "0")}) to Accumulator. ${oldA} + ${val} = ${result}. A = ${newState.accumulator}. Zero flag = ${newState.zeroFlag ? 1 : 0}. Carry flag = ${newState.carryFlag ? 1 : 0}.`;
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
      explanation = `SUB ${operand}: Subtracted value ${val} (from address ${String(addr).padStart(2, "0")}) from Accumulator. ${oldA} - ${val} = ${result}. A = ${newState.accumulator}. Zero flag = ${newState.zeroFlag ? 1 : 0}. Carry flag = ${newState.carryFlag ? 1 : 0}.`;
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
      explanation = `MOV ${dest},${src}: Moved value ${srcVal} from register ${src} to register ${dest}. ${dest} changed from ${oldVal} to ${srcVal}.`;
      break;
    }
    case "INR": {
      const reg = operand.trim().toUpperCase();
      if (reg === "A") {
        const oldA = newState.accumulator;
        newState.accumulator = (oldA + 1) & 0xff;
        newState.zeroFlag = newState.accumulator === 0;
        changes.push(`A: ${oldA} → ${newState.accumulator}`);
        explanation = `INR A: Incremented Accumulator from ${oldA} to ${newState.accumulator}. Zero flag = ${newState.zeroFlag ? 1 : 0}.`;
      } else if (reg === "B") {
        const old = newState.registerB;
        newState.registerB = (old + 1) & 0xff;
        changes.push(`B: ${old} → ${newState.registerB}`);
        explanation = `INR B: Incremented Register B from ${old} to ${newState.registerB}.`;
      } else if (reg === "C") {
        const old = newState.registerC;
        newState.registerC = (old + 1) & 0xff;
        changes.push(`C: ${old} → ${newState.registerC}`);
        explanation = `INR C: Incremented Register C from ${old} to ${newState.registerC}.`;
      } else {
        return error(newState, newMemory, `Invalid register "${reg}" for INR at ${String(pc).padStart(2, "0")}`);
      }
      newState.programCounter = pc + 1;
      break;
    }
    case "DCR": {
      const reg = operand.trim().toUpperCase();
      if (reg === "A") {
        const oldA = newState.accumulator;
        newState.accumulator = (oldA - 1) & 0xff;
        newState.zeroFlag = newState.accumulator === 0;
        changes.push(`A: ${oldA} → ${newState.accumulator}`);
        explanation = `DCR A: Decremented Accumulator from ${oldA} to ${newState.accumulator}. Zero flag = ${newState.zeroFlag ? 1 : 0}.`;
      } else if (reg === "B") {
        const old = newState.registerB;
        newState.registerB = (old - 1) & 0xff;
        changes.push(`B: ${old} → ${newState.registerB}`);
        explanation = `DCR B: Decremented Register B from ${old} to ${newState.registerB}.`;
      } else if (reg === "C") {
        const old = newState.registerC;
        newState.registerC = (old - 1) & 0xff;
        changes.push(`C: ${old} → ${newState.registerC}`);
        explanation = `DCR C: Decremented Register C from ${old} to ${newState.registerC}.`;
      } else {
        return error(newState, newMemory, `Invalid register "${reg}" for DCR at ${String(pc).padStart(2, "0")}`);
      }
      newState.programCounter = pc + 1;
      break;
    }
    case "JMP": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) {
        return error(newState, newMemory, `Invalid address "${operand}" for JMP at ${String(pc).padStart(2, "0")}`);
      }
      newState.programCounter = addr;
      changes.push(`PC: ${pc} → ${addr}`);
      explanation = `JMP ${operand}: Unconditional jump. Program counter set to ${String(addr).padStart(2, "0")}.`;
      break;
    }
    case "JZ": {
      const addr = parseInt(operand, 10);
      if (isNaN(addr) || addr < 0 || addr >= newMemory.length) {
        return error(newState, newMemory, `Invalid address "${operand}" for JZ at ${String(pc).padStart(2, "0")}`);
      }
      if (state.zeroFlag) {
        newState.programCounter = addr;
        changes.push(`PC: ${pc} → ${addr} (Z=1, jump taken)`);
        explanation = `JZ ${operand}: Zero flag is SET. Jump taken to address ${String(addr).padStart(2, "0")}.`;
      } else {
        newState.programCounter = pc + 1;
        changes.push(`PC: ${pc} → ${pc + 1} (Z=0, no jump)`);
        explanation = `JZ ${operand}: Zero flag is CLEAR. Jump not taken, continuing to next instruction.`;
      }
      break;
    }
    case "HLT": {
      newState.status = "halted";
      newState.programCounter = pc;
      explanation = `HLT: Program execution halted successfully.`;
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
    code: `00: LDA 10
01: DCR A
02: JZ 04
03: JMP 01
04: STA 11
05: HLT
10: 05
11: 00`,
  },
};
