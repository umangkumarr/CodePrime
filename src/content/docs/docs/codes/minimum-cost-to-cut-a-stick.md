---
title: "Minimum Cost to Cut a Stick"
description: "Given a wooden stick of length n units. The stick is labelled from 0 to n. For example, a stick of length 6 is labelled as follows: Given an integer array…"
source: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(m^3)"
  space: "O(m^2)"
---

## Problem

<p>Given a wooden stick of length <code>n</code> units. The stick is labelled from <code>0</code> to <code>n</code>. For example, a stick of length <strong>6</strong> is labelled as follows:</p>
<img alt="" src="https://assets.leetcode.com/uploads/2020/07/21/statement.jpg" />
<p>Given an integer array <code>cuts</code> where <code>cuts[i]</code> denotes a position you should perform a cut at.</p>

<p>You should perform the cuts in order, you can change the order of the cuts as you wish.</p>

<p>The cost of one cut is the length of the stick to be cut, the total cost is the sum of costs of all cuts. When you cut a stick, it will be split into two smaller sticks (i.e. the sum of their lengths is the length of the stick before the cut). Please refer to the first example for a better explanation.</p>

<p>Return <em>the minimum total cost</em> of the cuts.</p>

## Solution approach

### Intuition

Whichever cut is made first inside a piece costs the piece's full length, and then splits it into two independent pieces. After adding `0` and `n` to `cuts` and sorting it, every piece is described by two indices `low` and `high` into `cuts`. The best cost of a piece is the minimum, over every cut `i` strictly between them, of the piece's length plus the best costs of the two halves.

Trying every order of cuts directly would be factorial; memoising on `(low, high)` leaves only $O(m^2)$ states.

### Algorithm

1. Append `0` and `n` to `cuts`, sort it, and fill `dp` with `-1`.
2. `solve(cuts, low, high)` returns `0` when `low + 1 == high`, because no cut lies inside the piece.
3. Otherwise, for each `i` in `(low, high)`, compute `cuts[high] - cuts[low] + solve(cuts, low, i) + solve(cuts, i, high)` and keep the minimum in `dp[low][high]`.
4. Return `solve(cuts, 0, cuts.size() - 1)`.

### Complexity

- **Time:** $O(m^3)$ — `m` is the number of cuts; there are $O(m^2)$ `(low, high)` states, and each tries $O(m)$ split points.
- **Space:** $O(m^2)$ — the `dp` table (fixed at `102 x 102`), plus $O(m)$ recursion stack.

## Code

```cpp title="C++"
class Solution {
   public:
    int dp[102][102];

    int solve(vector<int>& cuts, int low, int high) {
        if (low + 1 == high)
            return 0;
        else if (dp[low][high] != -1)
            return dp[low][high];

        else {
            int ans = INT_MAX;
            for (int i = low + 1; i < high; i++) {
                int curr = cuts[high] - cuts[low] + solve(cuts, low, i) +
                           solve(cuts, i, high);
                ans = min(ans, curr);
            }
            return dp[low][high] = ans;
        }
    }

    int minCost(int n, vector<int>& cuts) {
        cuts.push_back(0);
        cuts.push_back(n);
        memset(dp, -1, sizeof(dp));
        sort(cuts.begin(), cuts.end());
        return solve(cuts, 0, cuts.size() - 1);
    }
};

```
