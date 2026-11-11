---
title: "Sudoku Solver"
description: "Fill a 9 x 9 Sudoku grid by backtracking with bitmasks for rows, columns and boxes, always branching on the empty cell with the fewest candidates."
source: "https://leetcode.com/problems/sudoku-solver/"
difficulty: "Hard"
tags: ["Array", "Hash Table", "Backtracking", "Matrix"]
complexity:
  time: "O(9^m)"
  space: "O(m)"
---

## Problem

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy **all of the following rules**:

1. Each of the digits `1-9` must occur exactly once in each row.
2. Each of the digits `1-9` must occur exactly once in each column.
3. Each of the digits `1-9` must occur exactly once in each of the 9 `3x3` sub-boxes of the grid.

The `'.'` character indicates empty cells.

**Example 1:**

![Sudoku puzzle with 30 given digits](https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/250px-Sudoku-by-L2G-20050714.svg.png)

```text
Input:  board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
Output: [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
Explanation: The input board is shown above and the only valid solution is shown below.
```

![The solved Sudoku grid, with the filled-in digits in red](https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sudoku-by-L2G-20050714_solution.svg/250px-Sudoku-by-L2G-20050714_solution.svg.png)

**Constraints:**

- `board.length == 9`
- `board[i].length == 9`
- `board[i][j]` is a digit or `'.'`.
- It is **guaranteed** that the input board has only one solution.

## Solution approach

### Intuition

Sudoku is a constraint-satisfaction problem, and the standard exact method is **backtracking**: put a legal digit in an empty cell, recurse, and undo the choice if the recursion gets stuck. Two refinements make it fast:

1. **Constant-time legality checks with bitmasks.** Keep `rows[r]`, `cols[c]` and `boxes[b]`, where bit `d` is set if digit `d + 1` is already used in that row, column or `3x3` box (`b = r / 3 * 3 + c / 3`). The digits still allowed in a cell are then the zero bits of `rows[r] | cols[c] | boxes[b]` — one expression instead of scanning 27 cells.
2. **Most-constrained cell first.** Instead of filling cells in reading order, always branch on the empty cell with the **fewest** candidates. A cell with one candidate is forced (no branching at all), and a cell with zero candidates proves the current partial grid is dead, so we backtrack immediately. On typical puzzles, including the example, almost every step is forced and the search barely branches.

The search is exhaustive over legal choices, so it is guaranteed to find the (unique) solution.

### Algorithm

1. Scan the board: for each digit, set its bit in `rows`, `cols`, `boxes`; collect every `'.'` cell into `empties`.
2. `solve(board, k)` fills `empties[k..]`:
   - If `k == empties.size()`, every cell is filled: return `true`.
   - Among `empties[k..]`, find the cell with the fewest candidates (the popcount of the candidate mask) and swap it into position `k`. If it has none, return `false`.
   - For each candidate bit in its mask: place the digit (set the three bits, write the character), recurse with `k + 1`, and return `true` if that succeeds; otherwise clear the three bits and try the next candidate.
   - If no candidate works, reset the cell to `'.'` and return `false`.

### Walkthrough

The first steps on Example 1. Blue is the cell chosen by the "fewest candidates" rule, green cells have been filled so far; every one of these steps has a single candidate, so nothing is guessed:

![Most-constrained-cell backtracking on the example Sudoku](/img/codes/sudoku-solver/mrv/01.webp)

### Complexity

Let `m` be the number of empty cells (at most 81).

- **Time:** $O(9^m)$ in the worst case — each empty cell has at most 9 choices. Each search node costs $O(m)$ to pick the most constrained cell. Because the grid is fixed at `9 x 9`, this is a constant bound in theory, and the pruning makes real puzzles finish in microseconds to milliseconds.
- **Space:** $O(m)$ — the recursion depth and the `empties` list; the masks are 27 integers.

### Edge cases

- **Contradiction found early:** a cell with an empty candidate mask makes `solve` return `false` immediately, which cuts that whole branch.
- **Board with no empty cells:** `empties` is empty and `solve` returns `true` at once.

## Code

```cpp
class Solution {
    int rows[9] = {}, cols[9] = {}, boxes[9] = {};  // bit d set => digit d + 1 is used
    vector<pair<int, int>> empties;

    static int box(int r, int c) { return r / 3 * 3 + c / 3; }
    int candidates(int r, int c) const { return ~(rows[r] | cols[c] | boxes[box(r, c)]) & 0x1FF; }

    void toggle(int r, int c, int bit) {
        rows[r] ^= bit;
        cols[c] ^= bit;
        boxes[box(r, c)] ^= bit;
    }

    bool solve(vector<vector<char>>& board, int k) {
        if (k == (int)empties.size()) return true;

        // Branch on the empty cell with the fewest legal digits.
        int best = k, bestCount = 10;
        for (int t = k; t < (int)empties.size(); t++) {
            int cnt = __builtin_popcount(candidates(empties[t].first, empties[t].second));
            if (cnt < bestCount) {
                bestCount = cnt;
                best = t;
            }
        }
        if (bestCount == 0) return false;
        swap(empties[k], empties[best]);

        auto [r, c] = empties[k];
        for (int mask = candidates(r, c); mask; mask &= mask - 1) {
            int bit = mask & -mask;
            toggle(r, c, bit);
            board[r][c] = '1' + __builtin_ctz(bit);
            if (solve(board, k + 1)) return true;
            toggle(r, c, bit);
        }
        board[r][c] = '.';
        return false;
    }

   public:
    void solveSudoku(vector<vector<char>>& board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    empties.push_back({r, c});
                } else {
                    toggle(r, c, 1 << (board[r][c] - '1'));
                }
            }
        }
        solve(board, 0);
    }
};
```

```java
class Solution {
    private final int[] rows = new int[9], cols = new int[9], boxes = new int[9];  // bit d set => digit d + 1 is used
    private final int[] empties = new int[81];  // empty cells, encoded as r * 9 + c
    private int emptyCount = 0;

    private static int box(int r, int c) { return r / 3 * 3 + c / 3; }
    private int candidates(int r, int c) { return ~(rows[r] | cols[c] | boxes[box(r, c)]) & 0x1FF; }

    private void toggle(int r, int c, int bit) {
        rows[r] ^= bit;
        cols[c] ^= bit;
        boxes[box(r, c)] ^= bit;
    }

    private boolean solve(char[][] board, int k) {
        if (k == emptyCount) return true;

        // Branch on the empty cell with the fewest legal digits.
        int best = k, bestCount = 10;
        for (int t = k; t < emptyCount; t++) {
            int cnt = Integer.bitCount(candidates(empties[t] / 9, empties[t] % 9));
            if (cnt < bestCount) {
                bestCount = cnt;
                best = t;
            }
        }
        if (bestCount == 0) return false;
        int tmp = empties[k];
        empties[k] = empties[best];
        empties[best] = tmp;

        int r = empties[k] / 9, c = empties[k] % 9;
        for (int mask = candidates(r, c); mask != 0; mask &= mask - 1) {
            int bit = mask & -mask;
            toggle(r, c, bit);
            board[r][c] = (char) ('1' + Integer.numberOfTrailingZeros(bit));
            if (solve(board, k + 1)) return true;
            toggle(r, c, bit);
        }
        board[r][c] = '.';
        return false;
    }

    public void solveSudoku(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    empties[emptyCount++] = r * 9 + c;
                } else {
                    toggle(r, c, 1 << (board[r][c] - '1'));
                }
            }
        }
        solve(board, 0);
    }
}
```

```python
class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        rows, cols, boxes = [0] * 9, [0] * 9, [0] * 9  # bit d set => digit d + 1 is used
        empties = []  # (row, col, box) of each empty cell
        popcount = [bin(m).count('1') for m in range(512)]

        def candidates(r, c, b):
            return ~(rows[r] | cols[c] | boxes[b]) & 0x1FF

        def toggle(r, c, b, bit):
            rows[r] ^= bit
            cols[c] ^= bit
            boxes[b] ^= bit

        def solve(k):
            if k == len(empties):
                return True

            # Branch on the empty cell with the fewest legal digits.
            best, best_count = k, 10
            for t in range(k, len(empties)):
                cnt = popcount[candidates(*empties[t])]
                if cnt < best_count:
                    best_count, best = cnt, t
            if best_count == 0:
                return False
            empties[k], empties[best] = empties[best], empties[k]

            r, c, b = empties[k]
            mask = candidates(r, c, b)
            while mask:
                bit = mask & -mask
                toggle(r, c, b, bit)
                board[r][c] = str(bit.bit_length())
                if solve(k + 1):
                    return True
                toggle(r, c, b, bit)
                mask &= mask - 1
            board[r][c] = '.'
            return False

        for r in range(9):
            for c in range(9):
                b = r // 3 * 3 + c // 3
                if board[r][c] == '.':
                    empties.append((r, c, b))
                else:
                    toggle(r, c, b, 1 << (int(board[r][c]) - 1))
        solve(0)
```
