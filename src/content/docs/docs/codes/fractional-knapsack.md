---
title: "Fractional Knapsack"
description: "Maximise the value packed into a knapsack when items may be split, using the greedy rule of taking items in decreasing value-per-weight order."
source: "https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1"
difficulty: "Easy"
tags: ["Greedy"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given two arrays, **`val[]`** and **`wt[]`**, representing the values and weights of items, and an integer `capacity` representing the maximum weight a knapsack can hold, determine the maximum total value that can be achieved by putting items in the knapsack. You are allowed to break items into fractions if necessary.

Return the maximum value as a `double`, rounded to 6 decimal places.

Complete the function `fractionalKnapsack(val, wt, capacity)`.

**Example 1:**

```text
Input:  val[] = [60, 100, 120], wt[] = [10, 20, 30], capacity = 50
Output: 240.000000
Explanation: By taking items of weight 10 and 20 kg and 2/3 fraction of 30 kg.
Hence total price will be 60 + 100 + (2/3)(120) = 240.
```

**Example 2:**

```text
Input:  val[] = [500], wt[] = [30], capacity = 10
Output: 166.670000
Explanation: Since the item's weight exceeds capacity, we take a fraction 10/30 of it,
yielding value 166.670000.
```

**Constraints:**

- `val.size()` $\le 10^5$
- `wt.size() == val.size()`
- $1 \le$ `val[i]`, `wt[i]` $\le 10^4$
- $1 \le$ `capacity` $\le 10^9$

**Expected complexities:** Time $O(n \log n)$, auxiliary space $O(n)$.

## Solution approach

### Intuition

Because items can be cut, every unit of capacity can be filled independently. A unit of weight taken from item `i` is worth `val[i] / wt[i]`, its **value density**. So each unit of capacity should go to the densest item still available.

This greedy choice is optimal by an exchange argument: suppose an optimal packing leaves part of a denser item `a` behind while it carries some weight of a less dense item `b`. Swapping an equal amount of `b` for `a` keeps the weight the same and does not decrease the value. Repeating the swap turns any optimal packing into the greedy one without losing value.

So: sort by density, take whole items while they fit, then take the fraction of the next item that fills the remaining space, and stop — the knapsack is full.

### Algorithm

1. Build `order = [0, 1, ..., n-1]` and sort it by decreasing density. Compare `val[a] / wt[a]` with `val[b] / wt[b]` as `val[a] * wt[b] > val[b] * wt[a]` — exact integer arithmetic, with no floating-point division and no rounding ties (both products are at most $10^8$).
2. Keep `left`, the remaining capacity, and `total`, the value collected.
3. For each index `i` in `order`:
   - If `wt[i] <= left`, take the whole item: `total += val[i]`, `left -= wt[i]`.
   - Otherwise take the fraction `left / wt[i]` of it, adding `val[i] * left / wt[i]`, and stop.
4. Return `total`.

### Walkthrough

Example 1: the densities are `60/10 = 6`, `100/20 = 5` and `120/30 = 4`, so the order is items 0, 1, 2.

| Item | Density | Taken | `left` after | `total` after |
| --- | --- | --- | --- | --- |
| 0 | 6 | all 10 | 40 | 60 |
| 1 | 5 | all 20 | 20 | 160 |
| 2 | 4 | 20 of 30 | 0 | 160 + 120 · 20/30 = 240 |

### Complexity

- **Time:** $O(n \log n)$ — sorting dominates; the greedy pass is $O(n)$.
- **Space:** $O(n)$ — the index array `order` (the input arrays are left untouched).

### Edge cases

- **Everything fits** (`capacity` up to $10^9$ exceeds the total weight): the loop never reaches the fractional branch and `total` is the sum of all values.
- **The first item is already too heavy** (Example 2): the very first iteration takes a fraction and stops.
- **Capacity filled exactly:** the next item sees `left = 0` and adds `0`, then the loop stops.

## Code

```cpp title="C++"
class Solution {
  public:
    double fractionalKnapsack(vector<int>& val, vector<int>& wt, int capacity) {
        int n = val.size();
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        // a is denser than b  <=>  val[a] / wt[a] > val[b] / wt[b]
        sort(order.begin(), order.end(), [&](int a, int b) {
            return (long long)val[a] * wt[b] > (long long)val[b] * wt[a];
        });

        long long left = capacity;
        double total = 0;
        for (int i : order) {
            if (wt[i] <= left) {
                total += val[i];
                left -= wt[i];
            } else {
                total += (double)val[i] * left / wt[i];
                break;
            }
        }
        return total;
    }
};
```
