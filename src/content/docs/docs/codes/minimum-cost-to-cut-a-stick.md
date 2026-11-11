---
title: "Minimum Cost to Cut a Stick"
description: "Find the cheapest order to make all the required cuts in a stick, where each cut costs the current piece's length, using interval dynamic programming."
source: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/"
difficulty: "Hard"
tags: ["Array", "Dynamic Programming", "Sorting"]
complexity:
  time: "O(m^3)"
  space: "O(m^2)"
---

## Problem

Given a wooden stick of length `n` units. The stick is labelled from `0` to `n`. For example, a stick of length **6** is labelled as follows:

![A stick of length 6 with positions 0 to 6 marked](https://assets.leetcode.com/uploads/2020/07/21/statement.jpg)

Given an integer array `cuts` where `cuts[i]` denotes a position you should perform a cut at.

You should perform the cuts in order, you can change the order of the cuts as you wish.

The cost of one cut is the length of the stick to be cut, the total cost is the sum of costs of all cuts. When you cut a stick, it will be split into two smaller sticks (i.e. the sum of their lengths is the length of the stick before the cut). Please refer to the first example for a better explanation.

Return *the minimum total cost* of the cuts.

**Example 1:**

![The stick of length 7 cut at 3, 5, 1, 4 for a total cost of 16](https://assets.leetcode.com/uploads/2020/07/23/e1.jpg)

```text
Input:  n = 7, cuts = [1,3,4,5]
Output: 16
Explanation: Using cuts order = [1, 3, 4, 5] as in the input leads to the following scenario:
```

![Cutting in the order 1, 3, 4, 5 costs 7 + 6 + 4 + 3 = 20](https://assets.leetcode.com/uploads/2020/07/21/e11.jpg)

```text
The first cut is done to a rod of length 7 so the cost is 7. The second cut is done to a rod of
length 6 (i.e. the second part of the first cut), the third is done to a rod of length 4 and the
last cut is to a rod of length 3. The total cost is 7 + 6 + 4 + 3 = 20.
Rearranging the cuts to be [3, 5, 1, 4] for example will lead to a scenario with
total cost = 16 (as shown in the example photo 7 + 4 + 3 + 2 = 16).
```

**Example 2:**

```text
Input:  n = 9, cuts = [5,6,1,4,2]
Output: 22
Explanation: If you try the given cuts ordering the cost will be 25.
There are much ordering with total cost <= 25, for example, the order [4, 6, 5, 2, 1]
has total cost = 22 which is the minimum possible.
```

**Constraints:**

- $2 \le n \le 10^6$
- $1 \le \text{cuts.length} \le \min(n - 1, 100)$
- $1 \le \text{cuts[i]} \le n - 1$
- All the integers in `cuts` array are **distinct**.

## Solution approach

### Intuition

Think about the **first** cut made inside a piece of stick. Whatever position it is at, it costs the full length of that piece, and afterwards the left and right halves are completely independent: no later cut ever crosses from one half into the other. So the cheapest way to process a piece is

$$
\text{cost(piece)} = \text{length(piece)} + \min_{\text{first cut } c} \big(\text{cost(left of } c) + \text{cost(right of } c)\big).
$$

Every piece that can ever appear lies between two "boundaries", where a boundary is either an end of the stick or a cut position. Put the boundaries in a sorted array `pos = [0, sorted cuts..., n]`. Then a piece is identified by a pair of indices `i < j` into `pos`, and the cuts inside it are exactly `pos[i+1 .. j-1]`. With `m = cuts.length` there are only $O(m^2)$ such pieces, and `n` (up to $10^6$) never matters — only the positions do.

Define `dp[i][j]` = minimum cost to make every cut strictly between `pos[i]` and `pos[j]`. Then

- `dp[i][i+1] = 0` (no cut inside), and
- `dp[i][j] = (pos[j] - pos[i]) + min over i < k < j of (dp[i][k] + dp[k][j])`.

A piece depends only on strictly shorter pieces, so filling the table in order of increasing `j - i` always finds its sub-answers ready.

### Algorithm

1. Build `pos` from `0`, the cuts and `n`, and sort it. Let `m = pos.size()`.
2. Create `dp` as an `m x m` table of zeros (so every adjacent pair `dp[i][i+1]` is already `0`).
3. For `len = 2 .. m - 1`, for every `i` with `j = i + len < m`:
   - `dp[i][j]` = the minimum of `dp[i][k] + dp[k][j]` over `k` in `(i, j)`, plus `pos[j] - pos[i]`.
4. Return `dp[0][m - 1]`, the cost for the whole stick.

### Walkthrough

Example 1, `pos = [0, 1, 3, 4, 5, 7]`. Row `i`, column `j` is `dp[i][j]`; the blue cell is being computed and the orange cells are the best split `dp[i][k]`, `dp[k][j]`:

![Interval DP table for n = 7, cuts = [1,3,4,5]](/img/codes/minimum-cost-to-cut-a-stick/dp/01.webp)

### Complexity

- **Time:** $O(m^3)$ — $O(m^2)$ pairs `(i, j)`, each trying $O(m)$ split points `k`; with $m \le 102$ that is about $10^6$ steps.
- **Space:** $O(m^2)$ — the `dp` table.

### Edge cases

- **A single cut:** `pos` has three entries and the answer is just `n`, the length of the whole stick.
- **Large `n`:** costs are at most `100` cuts × $10^6$ = $10^8$, which fits in `int`.
- **Unsorted `cuts`** (Example 2): sorting `pos` is what makes "cuts inside a piece" a contiguous index range.

## Code

```cpp
class Solution {
   public:
    int minCost(int n, vector<int>& cuts) {
        vector<int> pos(cuts);
        pos.push_back(0);
        pos.push_back(n);
        sort(pos.begin(), pos.end());
        int m = pos.size();

        // dp[i][j]: min cost to make all cuts strictly between pos[i] and pos[j]
        vector<vector<int>> dp(m, vector<int>(m, 0));
        for (int len = 2; len < m; len++) {
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                int best = INT_MAX;
                for (int k = i + 1; k < j; k++) best = min(best, dp[i][k] + dp[k][j]);
                dp[i][j] = best + pos[j] - pos[i];
            }
        }
        return dp[0][m - 1];
    }
};
```

```java
class Solution {
    public int minCost(int n, int[] cuts) {
        int m = cuts.length + 2;
        int[] pos = Arrays.copyOf(cuts, m);
        pos[m - 2] = 0;
        pos[m - 1] = n;
        Arrays.sort(pos);

        // dp[i][j]: min cost to make all cuts strictly between pos[i] and pos[j]
        int[][] dp = new int[m][m];
        for (int len = 2; len < m; len++) {
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                int best = Integer.MAX_VALUE;
                for (int k = i + 1; k < j; k++) best = Math.min(best, dp[i][k] + dp[k][j]);
                dp[i][j] = best + pos[j] - pos[i];
            }
        }
        return dp[0][m - 1];
    }
}
```

```python
class Solution:
    def minCost(self, n: int, cuts: list[int]) -> int:
        pos = sorted(cuts + [0, n])
        m = len(pos)

        # dp[i][j]: min cost to make all cuts strictly between pos[i] and pos[j]
        dp = [[0] * m for _ in range(m)]
        for length in range(2, m):
            for i in range(m - length):
                j = i + length
                dp[i][j] = min(dp[i][k] + dp[k][j] for k in range(i + 1, j)) + pos[j] - pos[i]
        return dp[0][m - 1]
```
