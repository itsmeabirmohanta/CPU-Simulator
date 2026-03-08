

## Analysis of All Sample Programs and Curriculum Code

I traced through every sample program and inline curriculum code block. Here are the issues found:

### Bug 1: `bitCount` sample program (cpu.ts) -- CRITICAL
The algorithm is completely broken and causes an infinite loop:
- Line 11 (`DCR A`) decrements A, but A holds the rotated value, not the loop counter
- Lines 12-14 (`LDA 33, SUB 31, STA 33`) subtracts `mem[31]` (which is 0) from the counter, so the counter never decrements
- Result: infinite loop, never terminates

**Fix**: Rewrite the entire bitCount algorithm with correct loop counter management using `SUB 32` (subtract 1) and proper control flow.

### Bug 2: `registerMove` lesson challenge text (curriculum.ts, line 176)
Challenge says "What ends up in address 12?" but the program stores the result at address **11**.

### Bug 3: `subroutine` lesson challenge text (curriculum.ts, line 426)
Challenge says "What value ends up at address 21?" but the program stores the result at address **31**.

### All Other Programs Verified Correct
- `addition` ✓ (15+28=43)
- `registerMove` ✓ (42+1=43 at addr 11)
- `conditionalJump` ✓ (5-5=0, jumps, stores 99)
- `countdown` ✓ (5→0 loop)
- `bitwiseOps` ✓ (170 AND/OR/XOR 85)
- `subroutine` ✓ (doubles 10→20)
- `multiplication` ✓ (4×3=12)
- `findMax` ✓ (max(15,23)=23)
- `fibonacci` ✓ (1,1,2,3,5)
- `bubbleSort3` ✓ (25,10,15 → 10,15,25)
- All inline curriculum code blocks ✓ (including nested-patterns multiply, capstone which is intentionally buggy)

### Files to Change
- **`src/lib/cpu.ts`**: Rewrite `bitCount` sample program
- **`src/lib/curriculum.ts`**: Fix two challenge text references (lines 176 and 426)

