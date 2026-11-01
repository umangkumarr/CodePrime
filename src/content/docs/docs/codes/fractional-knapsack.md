---
title: "Fractional Knapsack"
description: "Given weights and values of N items, we need to put these items in a knapsack of capacity W to get the maximum total value in the knapsack. Note: Unlike…"
source: "https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1"
tags: ["Dynamic Programming", "Sorting"]
complexity:
  time: "O(n \\log n)"
  space: "O(1)"
---

## Problem

<p><span>Given <em>weights</em> and <em>values</em> of <strong>N</strong> items, we need to put these items in a knapsack of capacity <strong>W</strong> to get the <em>maximum</em> total value in the knapsack.<br/>
<strong>Note:</strong> Unlike 0/1 knapsack, you are allowed to break&nbsp;the item.&nbsp;</span></p>

## Solution approach

### Intuition

Because items can be split, the best use of each unit of capacity is to fill it with the item that gives the most value per unit of weight. This suggests a greedy approach: compute the ratio `value / weight` for every item, sort the items by this ratio, then take the items with the highest ratio whole until the next item no longer fits. Finally, take as much of that next item as the remaining capacity allows.

### Algorithm

1. Sort `arr` in decreasing order of `value / weight` using a lambda comparator.
2. For each item: if it fits (`W >= arr[i].weight`), take all of it: subtract its weight from `W` and add its value to `ans`.
3. Otherwise compute the value per unit `per_gm`, add `per_gm * W` for the remaining capacity, and stop.
4. Return `ans`.

### Complexity

- **Time:** $O(n \log n)$ — dominated by the sort; the greedy pass is $O(n)$.
- **Space:** $O(1)$ extra — the array is sorted in place (ignoring the sort's internal stack).

### Edge cases

- **All items fit:** the loop never reaches the fractional branch and `ans` is the total value.
- **Capacity filled exactly:** `W` becomes `0`, and the next item adds `per_gm * 0`, which is nothing.

## Code

```cpp title="C++"
class Solution {
   public:
    double fractionalKnapsack(int W, Item arr[], int n) {
        sort(arr, arr + n, [&](auto &a, auto &b) {
            return (double(a.value) / double(a.weight)) >
                   (double(b.value) / double(b.weight));
        });
        double ans = 0;
        for (int i = 0; i < n; i++) {
            if (W >= arr[i].weight) {
                W -= arr[i].weight;
                ans += arr[i].value;
            } else {
                double per_gm = double(arr[i].value) / double(arr[i].weight);
                double money = per_gm * double(W);
                ans += money;
                break;
            }
        }
        return ans;
    }
};
```
