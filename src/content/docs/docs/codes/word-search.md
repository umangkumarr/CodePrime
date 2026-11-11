---
title: "Word Search"
description: "Decide whether a word can be traced through adjacent grid cells without reuse, by backtracking DFS with in-place marking and letter-count pruning."
source: "https://leetcode.com/problems/word-search/"
difficulty: "Medium"
tags: ["Array", "String", "Backtracking", "Depth-First Search", "Matrix"]
complexity:
  time: "O(m \\cdot n \\cdot 3^L)"
  space: "O(L)"
---

## Problem

Given an `m x n` grid of characters `board` and a string `word`, return `true` _if_ `word` _exists in the grid_.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

**Example 1:**

![Board with the path A-B-C-C-E-D highlighted](https://assets.leetcode.com/uploads/2020/11/04/word2.jpg)

```text
Input:  board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
```

**Example 2:**

![Board with the path S-E-E highlighted](https://assets.leetcode.com/uploads/2020/11/04/word-1.jpg)

```text
Input:  board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true
```

**Example 3:**

![Board where A-B-C-B cannot be formed](https://assets.leetcode.com/uploads/2020/10/15/word3.jpg)

```text
Input:  board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false
```

**Constraints:**

- `m == board.length`
- `n = board[i].length`
- $1 \le m, n \le 6$
- $1 \le$ `word.length` $\le 15$
- `board` and `word` consists of only lowercase and uppercase English letters.

**Follow-up:** Could you use search pruning to make your solution faster with a larger `board`?

## Solution approach

### Intuition

A match is a path of cells: the first cell holds `word[0]`, and each next cell is a neighbour of the previous one holding the next letter, with no cell repeated. We can grow such a path one letter at a time with a **depth-first search**, and when a branch cannot continue, undo the last step and try another neighbour — **backtracking**.

To forbid reusing a cell, we overwrite it with `'#'` while it is on the current path (no letter equals `'#'`, so it can never match) and restore it when the DFS returns. This needs no separate `visited` array, and the board is unchanged when we finish.

For the follow-up, two cheap checks before searching cut the work a lot:

- **Letter counts.** If the board has fewer copies of some letter than `word` needs (Example 3 needs two `B`s, the board has one), no path can exist, so return `false` without searching.
- **Start from the rarer end.** A path for `word` reversed is the same path walked backwards, so searching for either is equivalent. Starting from the letter with **fewer** occurrences on the board means fewer starting cells and earlier failures. For example, `word = "AAAAAAAAAAAAAB"` on a board of `A`s would explore a huge number of paths before discovering there is no `B`; reversed, the search starts from the few `B` cells.

### Algorithm

1. If `word` is longer than `m * n`, return `false`.
2. Count every letter on the board in `count`. For each letter of `word`, if `word` uses it more often than `count` has it, return `false`.
3. If `count[word[0]] > count[word.back()]`, reverse `word`.
4. For each cell `(r, c)`, if `dfs(board, word, 0, r, c)` returns `true`, return `true`. Otherwise return `false`.
5. `dfs(board, word, i, r, c)`:
   - Return `false` if `(r, c)` is outside the board or `board[r][c] != word[i]` (this also rejects cells marked `'#'`).
   - If `i` is the last index of `word`, return `true`.
   - Save `ch = board[r][c]`, set the cell to `'#'`, try the four neighbours with `i + 1` (stopping at the first success), restore the cell and return the result.

### Walkthrough

Example 2, `word = "SEE"` (orange = cell just added, blue = rest of the path, red = rejected or backtracked):

![Backtracking DFS for "SEE": the S at (1,0) fails, the S at (1,3) leads to E, E](/img/codes/word-search/backtracking/01.webp)

### Complexity

Let $L$ = `word.length`.

- **Time:** $O(m \cdot n \cdot 3^L)$ — from each of the $m \cdot n$ starting cells the DFS branches into at most 4 neighbours at the first step and at most 3 afterwards (it never steps back onto the path), to a depth of $L$. The pruning checks add only $O(m \cdot n + L)$.
- **Space:** $O(L)$ — the recursion depth; cells are marked in place and the letter counts take constant space.

### Edge cases

- **Single cell** (`[["a"]]`, `"a"`): the first `dfs` call matches the last (only) letter and returns `true`.
- **Word needs a cell twice** (`"ABCB"`): caught immediately by the letter count; even without it, the marked `'#'` cell could not be reused.
- **Upper and lower case** are different letters: the comparison and the counts are by exact character.
- **Board left intact:** each `dfs` restores its cell before returning, on success as well as on failure.

## Code

```cpp
class Solution {
    bool dfs(vector<vector<char>>& board, const string& word, int i, int r, int c) {
        if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return false;
        if (board[r][c] != word[i]) return false;  // also rejects cells marked '#'
        if (i + 1 == (int)word.size()) return true;

        char ch = board[r][c];
        board[r][c] = '#';
        bool found = dfs(board, word, i + 1, r + 1, c) || dfs(board, word, i + 1, r - 1, c) ||
                     dfs(board, word, i + 1, r, c + 1) || dfs(board, word, i + 1, r, c - 1);
        board[r][c] = ch;
        return found;
    }

   public:
    bool exist(vector<vector<char>>& board, string word) {
        int m = board.size(), n = board[0].size();
        if ((int)word.size() > m * n) return false;

        array<int, 128> count{};
        for (const auto& row : board)
            for (char ch : row) count[ch]++;
        array<int, 128> need{};
        for (char ch : word)
            if (++need[ch] > count[ch]) return false;

        // Start from the end whose letter is rarer on the board.
        if (count[word[0]] > count[word.back()]) reverse(word.begin(), word.end());

        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (dfs(board, word, 0, r, c)) return true;
        return false;
    }
};
```

```java
class Solution {
    private boolean dfs(char[][] board, char[] word, int i, int r, int c) {
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return false;
        if (board[r][c] != word[i]) return false;  // also rejects cells marked '#'
        if (i + 1 == word.length) return true;

        char ch = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(board, word, i + 1, r + 1, c) || dfs(board, word, i + 1, r - 1, c)
                || dfs(board, word, i + 1, r, c + 1) || dfs(board, word, i + 1, r, c - 1);
        board[r][c] = ch;
        return found;
    }

    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        if (word.length() > m * n) return false;

        int[] count = new int[128];
        for (char[] row : board)
            for (char ch : row) count[ch]++;
        int[] need = new int[128];
        for (char ch : word.toCharArray())
            if (++need[ch] > count[ch]) return false;

        // Start from the end whose letter is rarer on the board.
        if (count[word.charAt(0)] > count[word.charAt(word.length() - 1)])
            word = new StringBuilder(word).reverse().toString();
        char[] w = word.toCharArray();

        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (dfs(board, w, 0, r, c)) return true;
        return false;
    }
}
```

```python
from collections import Counter


class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        if len(word) > m * n:
            return False

        count = Counter(ch for row in board for ch in row)
        if any(k > count[ch] for ch, k in Counter(word).items()):
            return False

        # Start from the end whose letter is rarer on the board.
        if count[word[0]] > count[word[-1]]:
            word = word[::-1]

        def dfs(i: int, r: int, c: int) -> bool:
            if r < 0 or c < 0 or r >= m or c >= n:
                return False
            if board[r][c] != word[i]:  # also rejects cells marked '#'
                return False
            if i + 1 == len(word):
                return True

            ch = board[r][c]
            board[r][c] = '#'
            found = (dfs(i + 1, r + 1, c) or dfs(i + 1, r - 1, c) or
                     dfs(i + 1, r, c + 1) or dfs(i + 1, r, c - 1))
            board[r][c] = ch
            return found

        return any(dfs(0, r, c) for r in range(m) for c in range(n))
```
