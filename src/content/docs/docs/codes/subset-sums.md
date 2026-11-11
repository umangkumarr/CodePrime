---
title: "Subset Sums"
description: "Return the sum of every subset of an array in O(2^n) time, using a take-or-skip recursion that carries the running sum."
source: "https://www.geeksforgeeks.org/problems/subset-sums2234/1"
difficulty: "Medium"
tags: ["Recursion"]
complexity:
  time: "O(2^n)"
  space: "O(n)"
---

## Problem

Given an array `arr` of integers, return the sums of all subsets in the list. Return the sums in any order.

Complete the function `subsetSums()`, which takes the array `arr` and returns a list of the $2^n$ subset sums.

**Example 1:**

```text
Input:  arr[] = [2, 3]
Output: [0, 2, 3, 5]
Explanation: When no elements are taken then Sum = 0. When only 2 is taken then Sum = 2. When only 3 is taken then Sum = 3. When elements 2 and 3 are taken then Sum = 2 + 3 = 5.
```

**Example 2:**

```text
Input:  arr[] = [1, 2, 1]
Output: [0, 1, 1, 2, 2, 3, 3, 4]
Explanation: The possible subset sums are 0 (no elements), 1 (either of the 1's), 2 (the element 2), and their combinations.
```

**Example 3:**

```text
Input:  arr[] = [5, 6, 7]
Output: [0, 5, 6, 7, 11, 12, 13, 18]
Explanation: The possible subset sums are 0 (no elements), 5, 6, 7, and their combinations.
```

**Constraints:**

- $1 \le arr.size() \le 15$
- $0 \le arr[i] \le 10^5$

## Solution approach

### Intuition

Every subset is a sequence of `n` independent decisions: for each element, **take** it or **skip** it. Walking those decisions recursively gives a binary tree of depth `n` whose $2^n$ leaves are exactly the subsets.

The trick that makes this optimal is to carry the **running sum** down the tree instead of the subset itself. Each call then does $O(1)$ work, and when we reach a leaf (`i == n`) the sum is ready to record. Recomputing every subset's sum from a bitmask would cost $O(n)$ per subset, $O(n \cdot 2^n)$ overall.

### Algorithm

1. `collect(i, sum)`: if `i == arr.size()`, push `sum` into `sums` and return.
2. Otherwise call `collect(i + 1, sum + arr[i])` (take `arr[i]`) and `collect(i + 1, sum)` (skip it).
3. Start with `collect(0, 0)` and return `sums`.

### Walkthrough

The recursion tree for `arr = [2, 3]`; each node shows `(i, sum)` and each leaf is one subset sum:

[![Recursion tree for arr = [2, 3] with (i, sum) nodes; take or skip each element, leaves give 5, 2, 3, 0](/img/codes/subset-sums/recursion-tree.png)](/img/codes/subset-sums/recursion-tree.png)

The leaves, left to right, give `[5, 2, 3, 0]`; any order is accepted.

### Complexity

- **Time:** $O(2^n)$ — the tree has $2^{n+1} - 1$ nodes and each does constant work. Since the output itself has $2^n$ values, this is optimal.
- **Space:** $O(n)$ auxiliary for the recursion depth, plus the $2^n$ output values.

### Edge cases

- **Zeros or duplicates** (`[1, 2, 1]`): every subset is a different leaf, so repeated sums are reported as many times as they occur, as the examples require.
- **Largest sum:** at most $15 \cdot 10^5$, well inside `int`.

## Code

```cpp
class Solution {
    void collect(const vector<int>& arr, int i, int sum, vector<int>& sums) {
        if (i == (int)arr.size()) {
            sums.push_back(sum);
            return;
        }
        collect(arr, i + 1, sum + arr[i], sums);  // take arr[i]
        collect(arr, i + 1, sum, sums);           // skip arr[i]
    }

   public:
    vector<int> subsetSums(vector<int>& arr) {
        vector<int> sums;
        sums.reserve(1 << arr.size());
        collect(arr, 0, 0, sums);
        return sums;
    }
};
```

```java
class Solution {
    private void collect(int[] arr, int i, int sum, ArrayList<Integer> sums) {
        if (i == arr.length) {
            sums.add(sum);
            return;
        }
        collect(arr, i + 1, sum + arr[i], sums);  // take arr[i]
        collect(arr, i + 1, sum, sums);           // skip arr[i]
    }

    public ArrayList<Integer> subsetSums(int[] arr) {
        ArrayList<Integer> sums = new ArrayList<>(1 << arr.length);
        collect(arr, 0, 0, sums);
        return sums;
    }
}
```

```python
class Solution:
    def subsetSums(self, arr):
        sums = []

        def collect(i, total):
            if i == len(arr):
                sums.append(total)
                return
            collect(i + 1, total + arr[i])  # take arr[i]
            collect(i + 1, total)           # skip arr[i]

        collect(0, 0)
        return sums
```
