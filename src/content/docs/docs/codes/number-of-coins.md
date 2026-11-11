---
title: "Number of Coins"
description: "Find the minimum number of coins (unlimited supply of each) that add up to a target sum, using a one-dimensional unbounded-knapsack DP."
source: "https://www.geeksforgeeks.org/problems/number-of-coins1824/1"
difficulty: "Medium"
tags: ["Dynamic Programming"]
complexity:
  time: "O(n \\cdot sum)"
  space: "O(sum)"
---

## Problem

Given an array `coins[]`, where each element represents a coin of a different denomination, and a target value `sum`. You have an unlimited supply of each coin type.

Find the minimum number of coins needed to obtain the target `sum`. If it is not possible to form the sum using the given coins, return `-1`.

Complete the function `minCoins()` which takes the array `coins[]` and the integer `sum` and returns the minimum number of coins, or `-1`.

**Example 1:**

```text
Input:  coins[] = [25, 10, 5], sum = 30
Output: 2
Explanation: Minimum 2 coins needed, 25 and 5.
```

**Example 2:**

```text
Input:  coins[] = [9, 6, 5, 1], sum = 19
Output: 3
Explanation: 19 = 9 + 9 + 1
```

**Example 3:**

```text
Input:  coins[] = [5, 1], sum = 0
Output: 0
Explanation: For 0 sum, we do not need a coin.
```

**Example 4:**

```text
Input:  coins[] = [4, 6, 2], sum = 5
Output: -1
Explanation: Not possible to make the given sum.
```

**Constraints:**

- $0 \le sum \le 10^4$
- $1 \le$ `coins.size()` $\le 10^3$
- $1 \le$ `coins[i]` $\le 10^4$

## Solution approach

### Intuition

Greedy (always take the largest coin that fits) fails: with `coins = [9, 6, 5, 1]` and `sum = 11`, greedy gives `9 + 1 + 1` (3 coins) but `6 + 5` uses 2.

Instead, think about the **last** coin used. If the best way to make amount `x` ends with coin `c`, then the rest is the best way to make `x - c`. So

$$dp[x] = 1 + \min_{c \,\in\, coins,\ c \le x} dp[x - c], \qquad dp[0] = 0$$

where `dp[x]` is the fewest coins summing to exactly `x`. Because every `dp[x - c]` is for a smaller amount, filling `dp` from `0` up to `sum` always has the needed values ready. Coins are unlimited, so the same coin may be the "last coin" again in `dp[x - c]` — that is exactly what an unbounded knapsack needs, and why a single 1D array suffices.

### Algorithm

1. Create `dp` of size `sum + 1`, set `dp[0] = 0` and every other entry to `INF = sum + 1`. No answer can use more than `sum` coins (every coin is at least `1`), so `INF` safely means "not reachable" and `INF + 1` cannot overflow.
2. For each coin `c` in `coins`, for every amount `x` from `c` to `sum`, set `dp[x] = min(dp[x], dp[x - c] + 1)`. Going **upwards** lets `dp[x - c]` already include copies of `c`.
3. Return `-1` if `dp[sum]` is still `INF`, otherwise `dp[sum]`.

### Walkthrough

The table for Example 2 after each coin is processed (green cells changed in that round):

![dp table for coins [9,6,5,1] and sum 19, filled coin by coin](/img/codes/number-of-coins/dp/01.webp)

### Complexity

- **Time:** $O(n \cdot sum)$ — for each of the `n` coins we sweep the amounts once.
- **Space:** $O(sum)$ — a single array of `sum + 1` entries.

### Edge cases

- **`sum = 0`:** `dp[0] = 0` is returned immediately (Example 3).
- **Unreachable sum:** e.g. only even coins and an odd `sum` — `dp[sum]` stays `INF` and the function returns `-1` (Example 4).
- **Coins larger than `sum`:** the inner loop for that coin does not run.

## Code

```cpp
class Solution {
   public:
    int minCoins(vector<int>& coins, int sum) {
        const int INF = sum + 1;
        vector<int> dp(sum + 1, INF);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= sum; x++) {
                dp[x] = min(dp[x], dp[x - c] + 1);
            }
        }
        return dp[sum] == INF ? -1 : dp[sum];
    }
};
```

```java
class Solution {
    public int minCoins(int coins[], int sum) {
        final int INF = sum + 1;
        int[] dp = new int[sum + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= sum; x++) {
                dp[x] = Math.min(dp[x], dp[x - c] + 1);
            }
        }
        return dp[sum] == INF ? -1 : dp[sum];
    }
}
```

```python
class Solution:
    def minCoins(self, coins: list[int], sum: int) -> int:
        INF = sum + 1
        dp = [INF] * (sum + 1)
        dp[0] = 0
        for c in coins:
            for x in range(c, sum + 1):
                if dp[x - c] + 1 < dp[x]:
                    dp[x] = dp[x - c] + 1
        return -1 if dp[sum] == INF else dp[sum]
```
