import { toast } from "@/components/ui/use-toast";

export type CpuStatus = "ready" | "running" | "halted" | "error" | "paused";

export interface CpuState {
  accumulator: number;
  registerB: number;
  registerC: number;
  programCounter: number;
  status: CpuStatus;
  memorySize: number;
  instructionRegister?: string;
  zeroFlag?: boolean;
  carryFlag?: boolean;
  errorMessage?: string;
}

export interface MemoryCell {
  address: number;
  value: number;
  type?: "instruction" | "data";
  changed?: boolean;
}

export interface LogEntry {
  step: number;
  instruction: string;
  changes: string[];
  explanation?: string;
}

const MEMORY_SIZE = 256;
let stackPointer = 255; // Initialize stack pointer

export function resetStack() {
    stackPointer = 255; // Reset stack pointer to top of memory
}

export function createInitialState(): CpuState {
  return {
    accumulator: 0,
    registerB: 0,
    registerC: 0,
    programCounter: 0,
    status: "ready",
    memorySize: MEMORY_SIZE,
  };
}

export function createMemory(size: number = MEMORY_SIZE): MemoryCell[] {
  const memory: MemoryCell[] = [];
  for (let i = 0; i < size; i++) {
    memory.push({ address: i, value: 0 });
  }
  return memory;
}

export function parseProgram(code: string, _advanced?: boolean): { memory: MemoryCell[]; errors: string[] } {
  const memory = createMemory(MEMORY_SIZE);
  const errors: string[] = [];
  const lines = code.split("\n");

  lines.forEach((line, i) => {
    line = line.trim();
    if (!line || line.startsWith(";")) return;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      errors.push(`Invalid syntax on line ${i + 1}: ${line}`);
      return;
    }

    const addressStr = line.substring(0, colonIdx).trim();
    // Strip inline comments (anything after ;)
    let instructionStr = line.substring(colonIdx + 1).trim();
    if (instructionStr.includes(";")) {
      instructionStr = instructionStr.substring(0, instructionStr.indexOf(";")).trim();
    }

    const address = parseInt(addressStr);
    if (isNaN(address) || address < 0 || address >= MEMORY_SIZE) {
      errors.push(`Invalid memory address on line ${i + 1}: ${addressStr}`);
      return;
    }

    if (!instructionStr) return;

    // Try parsing as a plain number (data value)
    const numValue = parseInt(instructionStr);
    if (!isNaN(numValue) && String(numValue) === instructionStr) {
      if (numValue < 0 || numValue > 65535) {
        errors.push(`Value out of range on line ${i + 1}: ${instructionStr}`);
        return;
      }
      memory[address].value = numValue;
      return;
    }

    // Parse as assembly instruction
    const parts = instructionStr.split(/[\s,]+/);
    const opcode = parts[0].toUpperCase();

    if (!opcode) {
      errors.push(`Missing instruction on line ${i + 1}`);
      return;
    }

    // Handle MOV specially: MOV B,A -> operand encodes src/dst
    let operand: number | undefined;
    if (opcode === "MOV") {
      const regMap: Record<string, number> = { A: 0, B: 1, C: 2 };
      const dst = parts[1]?.toUpperCase();
      const src = parts[2]?.toUpperCase();
      if (dst && src && dst in regMap && src in regMap) {
        operand = (regMap[dst] << 4) | regMap[src];
      } else {
        errors.push(`Invalid MOV operands on line ${i + 1}: ${instructionStr}`);
        return;
      }
    } else if (opcode === "INR" || opcode === "DCR") {
      const regMap: Record<string, number> = { A: 0, B: 1, C: 2 };
      const reg = parts[1]?.toUpperCase();
      if (reg && reg in regMap) {
        operand = regMap[reg];
      } else {
        errors.push(`Invalid register on line ${i + 1}: ${parts[1]}`);
        return;
      }
    } else if (parts[1]) {
      operand = parseInt(parts[1]);
      if (isNaN(operand) || operand < 0 || operand > 255) {
        errors.push(`Invalid operand on line ${i + 1}: ${parts[1]}`);
        return;
      }
    }

    const value = encodeInstruction(opcode, operand);
    if (value === -1) {
      errors.push(`Unknown instruction on line ${i + 1}: ${opcode}`);
      return;
    }

    memory[address].value = value;
  });

  return { memory, errors };
}

function encodeInstruction(instruction: string, operand?: number): number {
  switch (instruction) {
    case "HLT": return 0x00;
    case "LDA": return 0x0100 + (operand || 0); // Ensure operand is provided
    case "STA": return 0x0200 + (operand || 0);
    case "ADD": return 0x0300 + (operand || 0);
    case "SUB": return 0x0400 + (operand || 0);
    case "JMP": return 0x0500 + (operand || 0);
    case "JZ":  return 0x0600 + (operand || 0);
    case "JNZ": return 0x0700 + (operand || 0);
    case "JC":  return 0x0800 + (operand || 0);
    case "MOV":
      if (operand === undefined) return -1;
      return 0x0900 + operand; // e.g., 0x0901 for MOV B,A (B <- A)
    case "INR": return 0x0A00 + (operand || 0);
    case "DCR": return 0x0B00 + (operand || 0);
    case "CMA": return 0x0C00;
    case "CMP": return 0x0D00 + (operand || 0);
    case "RAL": return 0x0E00;
    case "RAR": return 0x0F00;
    case "AND": return 0x1000 + (operand || 0);
    case "OR":  return 0x1100 + (operand || 0);
    case "XOR": return 0x1200 + (operand || 0);
    case "PUSH": return 0x1300;
    case "POP": return 0x1400;
    case "CALL": return 0x1500 + (operand || 0);
    case "RET": return 0x1600;
    case "NOP": return 0x1700;
    default:    return -1; // Invalid instruction
  }
}

export function executeStep(
  state: CpuState,
  memory: MemoryCell[],
  _advanced?: boolean,
): { state: CpuState; memory: MemoryCell[]; log: LogEntry } {
  if (state.status !== "running") {
    return { state, memory, log: { step: 0, instruction: "Halted", changes: [] } };
  }

  const instructionAddress = state.programCounter;
  const instruction = memory[instructionAddress].value;
  let logMessage = "";
  const changes: string[] = [];
  const newState = { ...state };

  const opcode = instruction & 0xFF00;
  const operand = instruction & 0x00FF;

  switch (opcode) {
    case 0x000: // HLT
      newState.status = "halted";
      logMessage = "HLT";
      break;

    case 0x100: // LDA
      newState.accumulator = memory[operand].value;
      newState.programCounter += 1;
      logMessage = `LDA ${operand}`;
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0x200: // STA
      memory[operand].value = newState.accumulator;
      newState.programCounter += 1;
      logMessage = `STA ${operand}`;
      changes.push(`mem[${operand}] = ${newState.accumulator}`);
      break;

    case 0x300: // ADD
      newState.accumulator += memory[operand].value;
      newState.carryFlag = newState.accumulator > 255;
      newState.accumulator &= 255;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter += 1;
      logMessage = `ADD ${operand}`;
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0x400: // SUB
      const subResult = newState.accumulator - memory[operand].value;
      newState.carryFlag = subResult < 0;
      newState.accumulator = subResult < 0 ? (subResult + 256) & 255 : subResult & 255;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter += 1;
      logMessage = `SUB ${operand}`;
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0x500: // JMP
      newState.programCounter = operand;
      logMessage = `JMP ${operand}`;
      changes.push(`PC = ${operand}`);
      break;

    case 0x600: // JZ
      if (newState.zeroFlag || newState.accumulator === 0) {
        newState.programCounter = operand;
        changes.push(`PC = ${operand}`);
      } else {
        newState.programCounter += 1;
      }
      logMessage = `JZ ${operand}`;
      break;

    case 0x700: // JNZ
      if (!newState.zeroFlag && newState.accumulator !== 0) {
        newState.programCounter = operand;
        changes.push(`PC = ${operand}`);
      } else {
        newState.programCounter += 1;
      }
      logMessage = `JNZ ${operand}`;
      break;

    case 0x800: // JC
      if (newState.carryFlag) {
        newState.programCounter = operand;
        changes.push(`PC = ${operand} (Carry)`);
      } else {
        newState.programCounter += 1;
      }
      logMessage = `JC ${operand}`;
      break;

    case 0x900: { // MOV
      const reg1 = (operand >> 4) & 0x0F;
      const reg2 = operand & 0x0F;
      let sourceValue: number;
      if (reg2 === 0) sourceValue = newState.accumulator;
      else if (reg2 === 1) sourceValue = newState.registerB;
      else if (reg2 === 2) sourceValue = newState.registerC;
      else { newState.status = "error"; logMessage = `MOV error: invalid source register ${reg2}`; break; }

      if (reg1 === 0) newState.accumulator = sourceValue;
      else if (reg1 === 1) newState.registerB = sourceValue;
      else if (reg1 === 2) newState.registerC = sourceValue;
      else { newState.status = "error"; logMessage = `MOV error: invalid dest register ${reg1}`; break; }

      newState.programCounter += 1;
      logMessage = `MOV ${["A", "B", "C"][reg1]}, ${["A", "B", "C"][reg2]}`;
      changes.push(`${["A", "B", "C"][reg1]} = ${sourceValue}`);
      break;
    }

    case 0xA00: { // INR
      const reg = operand & 0x0F;
      if (reg === 0) { newState.accumulator = (newState.accumulator + 1) & 255; changes.push(`A = ${newState.accumulator}`); }
      else if (reg === 1) { newState.registerB = (newState.registerB + 1) & 255; changes.push(`B = ${newState.registerB}`); }
      else if (reg === 2) { newState.registerC = (newState.registerC + 1) & 255; changes.push(`C = ${newState.registerC}`); }
      else { newState.status = "error"; logMessage = `Invalid register for INR: ${reg}`; break; }
      newState.zeroFlag = (reg === 0 ? newState.accumulator : reg === 1 ? newState.registerB : newState.registerC) === 0;
      newState.programCounter += 1;
      logMessage = `INR ${["A", "B", "C"][reg]}`;
      break;
    }

    case 0xB00: { // DCR
      const reg = operand & 0x0F;
      if (reg === 0) { newState.accumulator = (newState.accumulator - 1 + 256) & 255; changes.push(`A = ${newState.accumulator}`); }
      else if (reg === 1) { newState.registerB = (newState.registerB - 1 + 256) & 255; changes.push(`B = ${newState.registerB}`); }
      else if (reg === 2) { newState.registerC = (newState.registerC - 1 + 256) & 255; changes.push(`C = ${newState.registerC}`); }
      else { newState.status = "error"; logMessage = `Invalid register for DCR: ${reg}`; break; }
      newState.zeroFlag = (reg === 0 ? newState.accumulator : reg === 1 ? newState.registerB : newState.registerC) === 0;
      newState.programCounter += 1;
      logMessage = `DCR ${["A", "B", "C"][reg]}`;
      break;
    }

    case 0xC00: // CMA
      newState.accumulator = 255 - newState.accumulator;
      newState.programCounter += 1;
      logMessage = "CMA";
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0xD00: { // CMP
      const cmpVal = memory[operand].value;
      const cmpDiff = newState.accumulator - cmpVal;
      newState.zeroFlag = cmpDiff === 0;
      newState.carryFlag = cmpDiff < 0;
      newState.programCounter += 1;
      logMessage = `CMP ${operand}`;
      changes.push(`Compared A(${newState.accumulator}) with mem[${operand}](${cmpVal})`);
      break;
    }

    case 0xE00: { // RAL
      const leftBit = newState.accumulator >> 7;
      newState.accumulator = ((newState.accumulator << 1) & 255) | leftBit;
      newState.programCounter += 1;
      logMessage = "RAL";
      changes.push(`A = ${newState.accumulator}`);
      break;
    }

    case 0xF00: { // RAR
      const rightBit = newState.accumulator & 1;
      newState.accumulator = (newState.accumulator >> 1) | (rightBit << 7);
      newState.programCounter += 1;
      logMessage = "RAR";
      changes.push(`A = ${newState.accumulator}`);
      break;
    }

    case 0x1000: // AND
      newState.accumulator &= memory[operand].value;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter += 1;
      logMessage = `AND ${operand}`;
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0x1100: // OR
      newState.accumulator |= memory[operand].value;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter += 1;
      logMessage = `OR ${operand}`;
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0x1200: // XOR
      newState.accumulator ^= memory[operand].value;
      newState.zeroFlag = newState.accumulator === 0;
      newState.programCounter += 1;
      logMessage = `XOR ${operand}`;
      changes.push(`A = ${newState.accumulator}`);
      break;

    case 0x1300: // PUSH
      if (stackPointer < 0) { newState.status = "error"; logMessage = "Stack overflow!"; break; }
      memory[stackPointer].value = newState.accumulator;
      stackPointer--;
      newState.programCounter += 1;
      logMessage = "PUSH";
      changes.push(`Pushed A=${newState.accumulator} to stack`);
      break;

    case 0x1400: // POP
      if (stackPointer >= MEMORY_SIZE - 1) { newState.status = "error"; logMessage = "Stack underflow!"; break; }
      stackPointer++;
      newState.accumulator = memory[stackPointer].value;
      newState.programCounter += 1;
      logMessage = "POP";
      changes.push(`Popped A=${newState.accumulator} from stack`);
      break;

    case 0x1500: // CALL
      if (stackPointer < 1) { newState.status = "error"; logMessage = "Stack overflow (CALL)!"; break; }
      memory[stackPointer].value = newState.programCounter + 1;
      stackPointer--;
      newState.programCounter = operand;
      logMessage = `CALL ${operand}`;
      changes.push(`CALL ${operand}, pushed return address`);
      break;

    case 0x1600: // RET
      if (stackPointer >= MEMORY_SIZE - 1) { newState.status = "error"; logMessage = "Stack underflow (RET)!"; break; }
      stackPointer++;
      newState.programCounter = memory[stackPointer].value;
      logMessage = "RET";
      changes.push(`RET to ${newState.programCounter}`);
      break;

    case 0x1700: // NOP
      newState.programCounter += 1;
      logMessage = "NOP";
      break;

    default:
      newState.status = "error";
      newState.errorMessage = `Unknown opcode 0x${opcode.toString(16)}`;
      logMessage = `Error: Unknown opcode 0x${opcode.toString(16)}`;
      break;
  }

  return { state: newState, memory, log: { step: instructionAddress, instruction: logMessage, changes } };
}

/* ── Sample Programs ──────────────────────────────────────────────────────── */

interface SampleProgram {
  name: string;
  code: string;
  description?: string;
  advanced?: boolean;
}

export const SAMPLE_PROGRAMS: Record<string, SampleProgram> = {
  addition: {
    name: "Addition",
    code: `; Load two numbers and add them
00: LDA 10
01: ADD 11
02: STA 12
03: HLT
10: 15 ; First number
11: 28 ; Second number
12: 0  ; Result`,
  },
  registerMove: {
    name: "Register Move",
    code: `; Move value to B, increment B, move back to A, store
00: LDA 10
01: MOV B,A
02: INR B
03: MOV A,B
04: STA 11
05: HLT
10: 42 ; Input
11: 0  ; Result (should be 43)`,
  },
  conditionalJump: {
    name: "Conditional Jump",
    code: `; Compare two values, jump if equal
00: LDA 10
01: SUB 11
02: JZ 05
03: LDA 12
04: HLT
05: LDA 13
06: STA 14
07: HLT
10: 05
11: 05
12: 01
13: 99
14: 0`,
  },
  countdown: {
    name: "Countdown Loop",
    code: `; Count down from 5 to 0
00: LDA 10
01: SUB 11
02: STA 10
03: JZ 05
04: JMP 00
05: HLT
10: 05 ; Counter (starts at 5)
11: 01 ; Decrement value`,
  },
  bitwiseOps: {
    name: "Bitwise Operations",
    code: `; Bitwise AND, OR, XOR on two values
00: LDA 20
01: AND 21
02: STA 22
03: LDA 20
04: OR 21
05: STA 23
06: LDA 20
07: XOR 21
08: STA 24
09: HLT
20: 170 ; 10101010
21: 85  ; 01010101
22: 0   ; AND result
23: 0   ; OR result
24: 0   ; XOR result`,
  },
  subroutine: {
    name: "Subroutine Call",
    code: `; Call a subroutine to double a value
00: LDA 30
01: STA 20
02: CALL 10
03: STA 31
04: HLT
; Subroutine: double the value at mem[20]
10: LDA 20
11: ADD 20
12: RET
20: 0  ; Temp
30: 10 ; Input value
31: 0  ; Result (should be 20)`,
  },
  multiplication: {
    name: "Multiplication by Repeated Addition",
    code: `; Multiply 4 x 3 by repeated addition
; Result = 4 + 4 + 4 = 12
00: LDA 20
01: MOV B,A
02: LDA 21
03: MOV C,A
04: LDA 22
05: ADD 20
06: STA 22
07: DCR C
08: JZ 11
09: JMP 05
10: NOP
11: LDA 22
12: STA 23
13: HLT
20: 04 ; Multiplicand
21: 03 ; Multiplier
22: 0  ; Running sum
23: 0  ; Result`,
  },
  findMax: {
    name: "Find Max of Two Numbers",
    code: `; Find the larger of two numbers
00: LDA 20
01: SUB 21
02: JC 06
03: LDA 20
04: STA 22
05: HLT
06: LDA 21
07: STA 22
08: HLT
20: 15 ; First number
21: 23 ; Second number
22: 0  ; Result (max)`,
  },
  fibonacci: {
    name: "Fibonacci (first 5 terms)",
    code: `; Generate Fibonacci: 1 1 2 3 5
; mem[30-34] will hold the sequence
00: LDA 40
01: STA 30
02: STA 31
03: LDA 40
04: ADD 30
05: STA 32
06: LDA 31
07: ADD 32
08: STA 33
09: LDA 32
10: ADD 33
11: STA 34
12: HLT
30: 0  ; fib[0]
31: 0  ; fib[1]
32: 0  ; fib[2]
33: 0  ; fib[3]
34: 0  ; fib[4]
40: 01 ; Initial value 1`,
  },
  bubbleSort3: {
    name: "Bubble Sort of 3 Numbers",
    code: `; Sort 3 numbers in ascending order
; Uses temp at mem[33] for swaps
00: LDA 30
01: SUB 31
02: JC 09
; Swap mem[30] and mem[31]
03: LDA 31
04: STA 33
05: LDA 30
06: STA 31
07: LDA 33
08: STA 30
09: LDA 31
10: SUB 32
11: JC 18
; Swap mem[31] and mem[32]
12: LDA 32
13: STA 33
14: LDA 31
15: STA 32
16: LDA 33
17: STA 31
; Second pass: check 30 vs 31 again
18: LDA 30
19: SUB 31
20: JC 27
21: LDA 31
22: STA 33
23: LDA 30
24: STA 31
25: LDA 33
26: STA 30
27: HLT
30: 25 ; A
31: 10 ; B
32: 15 ; C
33: 0  ; Temp`,
  },
  bitCount: {
    name: "Bit Counting",
    code: `; Count the number of set bits in a value
; Uses AND with 1, rotate right, repeat 8 times
00: LDA 30
01: MOV B,A
02: LDA 31
03: MOV C,A
; Loop: check lowest bit
04: MOV A,B
05: AND 32
06: JZ 08
07: INR C
08: MOV A,B
09: RAR
10: MOV B,A
11: LDA 33
12: SUB 32
13: STA 33
14: JZ 16
15: JMP 04
16: MOV A,C
17: STA 34
18: HLT
30: 170 ; Value to count bits of (10101010 = 4 bits)
31: 0   ; Initial count
32: 01  ; Mask (value 1) and decrement value
33: 08  ; Loop counter (8 bits)
34: 0   ; Result`,
  },
};

/* ── Validation & Hints ───────────────────────────────────────────────────── */

const BASIC_OPCODES = ["LDA", "STA", "ADD", "SUB", "JMP", "JZ", "JNZ", "JC", "MOV", "INR", "DCR", "HLT", "NOP"];
const ADVANCED_OPCODES = [...BASIC_OPCODES, "AND", "OR", "XOR", "CMP", "CMA", "RAL", "RAR", "PUSH", "POP", "CALL", "RET"];

export function getValidOpcodes(advanced: boolean): string[] {
  return advanced ? ADVANCED_OPCODES : BASIC_OPCODES;
}

export function validateLine(line: string, advanced: boolean, memSize: number): string | null {
  line = line.trim();
  if (!line || line.startsWith(";") || line.startsWith("//")) return null;

  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return "Missing address prefix (e.g. 00:)";

  const addrStr = line.substring(0, colonIdx).trim();
  const addr = parseInt(addrStr);
  if (isNaN(addr) || addr < 0 || addr >= memSize) return `Invalid address: ${addrStr}`;

  const rest = line.substring(colonIdx + 1).trim();
  if (!rest) return null; // empty value is ok

  // Check if it's a pure number (data)
  const num = parseInt(rest);
  if (!isNaN(num)) {
    if (num < 0 || num > 255) return "Value must be 0–255";
    return null;
  }

  // Check if it's a valid instruction
  const parts = rest.split(/\s+/);
  const opcode = parts[0].toUpperCase();
  const validOps = getValidOpcodes(advanced);

  // Handle MOV specially (MOV B,A format)
  if (opcode === "MOV") return null;

  if (!validOps.includes(opcode)) return `Unknown instruction: ${opcode}`;
  return null;
}

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
  JNZ: { syntax: "JNZ addr", desc: "Jump if Zero flag is clear" },
  JC:  { syntax: "JC addr", desc: "Jump if Carry flag is set" },
  HLT: { syntax: "HLT", desc: "Halt execution" },
  AND: { syntax: "AND addr", desc: "Bitwise AND with memory value" },
  OR:  { syntax: "OR addr", desc: "Bitwise OR with memory value" },
  XOR: { syntax: "XOR addr", desc: "Bitwise XOR with memory value" },
  CMP: { syntax: "CMP addr", desc: "Compare A with memory (sets flags only)" },
  CMA: { syntax: "CMA", desc: "Complement Accumulator (bitwise NOT)" },
  RAL: { syntax: "RAL", desc: "Rotate Accumulator left through carry" },
  RAR: { syntax: "RAR", desc: "Rotate Accumulator right through carry" },
  PUSH: { syntax: "PUSH", desc: "Push Accumulator onto stack" },
  POP:  { syntax: "POP", desc: "Pop stack into Accumulator" },
  CALL: { syntax: "CALL addr", desc: "Call subroutine at address" },
  RET:  { syntax: "RET", desc: "Return from subroutine" },
  NOP:  { syntax: "NOP", desc: "No operation" },
};
