---
title: "Word Search II"
description: "Find every dictionary word that can be traced through adjacent board cells, with one backtracking DFS per cell guided and pruned by a trie of all words."
source: "https://leetcode.com/problems/word-search-ii/"
difficulty: "Hard"
tags: ["Array", "String", "Backtracking", "Trie", "Matrix"]
complexity:
  time: "O(K + m \\cdot n \\cdot 4 \\cdot 3^{L-1})"
  space: "O(26 \\cdot K)"
---

## Problem

Given an `m x n` `board` of characters and a list of strings `words`, return _all words on the board_.

Each word must be constructed from letters of sequentially adjacent cells, where **adjacent cells** are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

**Example 1:**

![4 x 4 board with the words "oath" and "eat" traced](https://assets.leetcode.com/uploads/2020/11/07/search1.jpg)

```text
Input:  board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
        words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
```

**Example 2:**

![2 x 2 board a b / c d](https://assets.leetcode.com/uploads/2020/11/07/search2.jpg)

```text
Input:  board = [["a","b"],["c","d"]], words = ["abcb"]
Output: []
```

**Constraints:**

- `m == board.length`
- `n == board[i].length`
- $1 \le m, n \le 12$
- `board[i][j]` is a lowercase English letter.
- $1 \le$ `words.length` $\le 3 \times 10^4$
- $1 \le$ `words[i].length` $\le 10$
- `words[i]` consists of lowercase English letters.
- All the strings of `words` are unique.

## Solution approach

### Intuition

Running the single-word search from [Word Search](/docs/codes/word-search/) once per word costs up to $3 \times 10^4$ full board searches — far too slow. But those searches repeat each other: words that share a prefix (`"oath"`, `"oat"`, `"oak"`) walk the same cells for that prefix again and again.

So search for **all words at once**. Put them in a **trie**; then a DFS from a cell walks the board and the trie together. Moving to a neighbouring cell with letter `ch` is allowed only if the current trie node has a child `ch` — i.e. only while the letters so far are a prefix of **some** word. Whenever the walk reaches a trie node where a word ends, that word is on the board.

For Example 1 the trie is:

```mermaid
flowchart TD
    root(( )) --> o((o)) --> oa((a)) --> oat((t)) --> oath(("h ✓ oath"))
    root --> p((p)) --> pe((e)) --> pea(("a · pea"))
    root --> e((e)) --> ea((a)) --> eat(("t ✓ eat"))
    root --> r((r)) --> ra((a)) --> rai((i)) --> rain(("n · rain"))
    classDef found fill:#dcf5e3,stroke:#2e9e57,color:#145c2e
    classDef miss fill:#fde0e0,stroke:#d64545,color:#7d1a1a
    class oath,eat found
    class pea,rain miss
```

The board has no `p`, so the whole `p` branch is never entered; and a DFS starting at the `o` in the corner follows `o → a → t → h` because each step is a child in the trie.

Two prunings keep it fast:

- **Report each word once.** When a word is found, clear its mark in the trie so later paths do not add it again.
- **Skip exhausted branches.** Each node keeps `remaining`, the number of not-yet-found words in its subtree. Once it drops to `0`, there is nothing left to find below that node, so the DFS does not enter it. Each `dfs` call returns how many new words it found, and the caller subtracts that from its node, so the counts stay correct all the way up to the root.

### Algorithm

1. Build the trie: node `0` is the root; `next[node][c]` is the child for letter `c` (`0` = none), `word[node]` is the word ending there (empty if none), and `remaining[node]` counts the words inserted through the node.
2. For every cell `(r, c)`, call `dfs(board, r, c, 0)` and subtract its result from `remaining[0]`; stop early once `remaining[0] == 0`.
3. `dfs(board, r, c, node)`:
   - Let `ch = board[r][c]`. If it is `'#'` (already on the path), return `0`.
   - Let `cur = next[node][ch - 'a']`. If `cur == 0` or `remaining[cur] == 0`, return `0`.
   - If `word[cur]` is not empty, append it to `found`, clear it, and count `1`.
   - Mark the cell `'#'`, recurse into the in-bounds neighbours with node `cur` and add up their results, then restore `ch`.
   - Subtract the total from `remaining[cur]` and return it.
4. Return `found`.

### Complexity

Let $K$ = total number of letters in `words` (at most $3 \times 10^5$) and $L$ = the longest word ($\le 10$).

- **Time:** $O(K + m \cdot n \cdot 4 \cdot 3^{L-1})$ — building the trie is $O(K)$. From each of the $m \cdot n$ starting cells the DFS has 4 first moves, then at most 3 (it cannot step back onto the path), and never goes deeper than $L$ because the trie has no longer paths. In practice the trie and the `remaining` counts cut this down drastically.
- **Space:** $O(26 \cdot K)$ — at most $K + 1$ trie nodes with 26 child slots each, plus the recursion depth of at most $L$. The board is marked in place.

### Edge cases

- **A word needing the same cell twice** (`"abcb"` in Example 2): the `b` cell is `'#'` when the path tries to return to it, so the word is not found.
- **A word that is a prefix of another** (`"oa"` and `"oath"`): `word[cur]` is checked before recursing, so the shorter word is reported and the search still continues to the longer one.
- **Many occurrences of one word:** the word is cleared from the trie after the first hit, so it appears once in the answer.

## Code

```cpp title="C++"
class Solution {
    vector<array<int, 26>> next;  // trie edges; 0 means "no child" (node 0 is the root)
    vector<string> word;          // word ending at this node, or empty
    vector<int> remaining;        // words in this node's subtree not found yet
    vector<string> found;

    // Returns the number of new words found by paths starting at (r, c).
    int dfs(vector<vector<char>>& board, int r, int c, int node) {
        char ch = board[r][c];
        if (ch == '#') return 0;
        int cur = next[node][ch - 'a'];
        if (cur == 0 || remaining[cur] == 0) return 0;

        int got = 0;
        if (!word[cur].empty()) {
            found.push_back(word[cur]);
            word[cur].clear();
            got++;
        }
        board[r][c] = '#';
        static const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr >= 0 && nr < (int)board.size() && nc >= 0 && nc < (int)board[0].size())
                got += dfs(board, nr, nc, cur);
        }
        board[r][c] = ch;
        remaining[cur] -= got;
        return got;
    }

   public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        next.assign(1, {});
        word.assign(1, "");
        remaining.assign(1, 0);
        found.clear();
        for (const string& w : words) {
            int node = 0;
            remaining[0]++;
            for (char ch : w) {
                if (next[node][ch - 'a'] == 0) {
                    next[node][ch - 'a'] = next.size();
                    next.push_back({});
                    word.push_back("");
                    remaining.push_back(0);
                }
                node = next[node][ch - 'a'];
                remaining[node]++;
            }
            word[node] = w;
        }

        for (int r = 0; r < (int)board.size() && remaining[0] > 0; r++)
            for (int c = 0; c < (int)board[0].size() && remaining[0] > 0; c++)
                remaining[0] -= dfs(board, r, c, 0);
        return found;
    }
};
```
