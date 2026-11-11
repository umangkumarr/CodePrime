---
title: "N-Queens"
description: "Return every placement of n non-attacking queens on an n x n board, using row-by-row backtracking with O(1) column and diagonal occupancy checks."
source: "https://leetcode.com/problems/n-queens/"
difficulty: "Hard"
tags: ["Array", "Backtracking", "Algorithm X"]
complexity:
  time: "O(n \\cdot n!)"
  space: "O(n^2)"
---

## Problem

The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.

Given an integer `n`, return *all distinct solutions to the **n-queens puzzle***. You may return the answer in **any order**.

Each solution contains a distinct board configuration of the n-queens' placement, where `'Q'` and `'.'` both indicate a queen and an empty space, respectively.

**Example 1:**

![The two solutions of the 4-queens puzzle](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)

```text
Input:  n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above
```

**Example 2:**

```text
Input:  n = 1
Output: [["Q"]]
```

**Constraints:**

- $1 \le n \le 9$

## Solution approach

### Intuition

Two queens in the same row attack each other, so a solution has **exactly one queen per row**. That turns the search into: for row `0`, then row `1`, and so on, choose a column for that row's queen. This is a natural fit for **backtracking** — place a queen, recurse to the next row, and remove it again to try the next column.

A placement at `(row, col)` is legal only if no earlier queen shares its column or one of its two diagonals. Diagonals have a simple signature:

- on a down-right diagonal (`\`), `row - col` is constant — shift it to `row - col + n - 1` to get an index in `[0, 2n - 2]`;
- on a down-left diagonal (`/`), `row + col` is constant, already in `[0, 2n - 2]`.

So three boolean arrays — `cols`, `diag` and `anti` — tell in $O(1)$ whether a square is attacked, instead of scanning the board. Marking them on placement and clearing them on removal keeps them in sync with the current partial board. Branches die as soon as a row has no safe column, which prunes the search far below the $n^n$ raw possibilities.

### Algorithm

1. Start with `board` as `n` strings of `'.'`, and `cols` (size `n`), `diag` and `anti` (size `2n - 1`) all `false`.
2. `place(row)`:
   - if `row == n`, every row has a queen: append a copy of `board` to `ans` and return;
   - for each `col` in `0 .. n - 1`, skip it if `cols[col]`, `diag[row - col + n - 1]` or `anti[row + col]` is set; otherwise set all three, put `'Q'` at `board[row][col]`, call `place(row + 1)`, then clear the three flags and restore `'.'`.
3. Call `place(0)` and return `ans`.

### Walkthrough

Backtracking on `n = 4` until the first solution. Blue is the queen just placed, purple the queens already on the board, red the squares in later rows that they attack; a row that is entirely red forces a backtrack:

![Backtracking search for the first 4-queens solution](/img/codes/n-queens/backtrack/01.webp)

### Complexity

- **Time:** $O(n \cdot n!)$ — row `0` has at most `n` choices, row `1` at most `n - 1` safe columns, and so on, so the search tree has $O(n!)$ nodes, each scanning its `n` columns with $O(1)$ checks (in practice pruning keeps it far smaller); copying each of the `S` solutions costs an extra $O(S \cdot n^2)$.
- **Space:** $O(n^2)$ — the working `board`; the flag arrays and the recursion stack are $O(n)$ (not counting the output).

### Edge cases

- **`n = 1`:** the only square is safe, giving `[["Q"]]`.
- **`n = 2` and `n = 3`:** no solution exists; every branch dies and an empty list is returned.

## Code

```cpp
class Solution {
    int n;
    vector<string> board;
    vector<bool> cols, diag, anti;  // diag: row - col + n - 1, anti: row + col
    vector<vector<string>> ans;

    void place(int row) {
        if (row == n) {
            ans.push_back(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            int d = row - col + n - 1, a = row + col;
            if (cols[col] || diag[d] || anti[a]) continue;
            cols[col] = diag[d] = anti[a] = true;
            board[row][col] = 'Q';
            place(row + 1);
            board[row][col] = '.';
            cols[col] = diag[d] = anti[a] = false;
        }
    }

   public:
    vector<vector<string>> solveNQueens(int n) {
        this->n = n;
        board.assign(n, string(n, '.'));
        cols.assign(n, false);
        diag.assign(2 * n - 1, false);
        anti.assign(2 * n - 1, false);
        place(0);
        return ans;
    }
};
```

```java
class Solution {
    private int n;
    private char[][] board;
    private boolean[] cols, diag, anti;  // diag: row - col + n - 1, anti: row + col
    private List<List<String>> ans;

    private void place(int row) {
        if (row == n) {
            List<String> solution = new ArrayList<>(n);
            for (char[] r : board) solution.add(new String(r));
            ans.add(solution);
            return;
        }
        for (int col = 0; col < n; col++) {
            int d = row - col + n - 1, a = row + col;
            if (cols[col] || diag[d] || anti[a]) continue;
            cols[col] = diag[d] = anti[a] = true;
            board[row][col] = 'Q';
            place(row + 1);
            board[row][col] = '.';
            cols[col] = diag[d] = anti[a] = false;
        }
    }

    public List<List<String>> solveNQueens(int n) {
        this.n = n;
        board = new char[n][n];
        for (char[] r : board) Arrays.fill(r, '.');
        cols = new boolean[n];
        diag = new boolean[2 * n - 1];
        anti = new boolean[2 * n - 1];
        ans = new ArrayList<>();
        place(0);
        return ans;
    }
}
```

```python
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        board = [["."] * n for _ in range(n)]
        cols = [False] * n
        diag = [False] * (2 * n - 1)  # row - col + n - 1
        anti = [False] * (2 * n - 1)  # row + col
        ans = []

        def place(row):
            if row == n:
                ans.append(["".join(r) for r in board])
                return
            for col in range(n):
                d, a = row - col + n - 1, row + col
                if cols[col] or diag[d] or anti[a]:
                    continue
                cols[col] = diag[d] = anti[a] = True
                board[row][col] = "Q"
                place(row + 1)
                board[row][col] = "."
                cols[col] = diag[d] = anti[a] = False

        place(0)
        return ans
```
