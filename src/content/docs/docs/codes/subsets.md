---
title: "Subsets"
description: "Generate the power set of an array of distinct integers with backtracking, where every node of the recursion tree is one subset."
source: "https://leetcode.com/problems/subsets/"
difficulty: "Medium"
tags: ["Array", "Backtracking", "Bit Manipulation"]
complexity:
  time: "O(n \\cdot 2^n)"
  space: "O(n)"
---

## Problem

Given an integer array `nums` of **unique** elements, return *all possible subsets (the power set)*.

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.

**Example 1:**

```text
Input:  nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

**Example 2:**

```text
Input:  nums = [0]
Output: [[],[0]]
```

**Constraints:**

- $1 \le nums.length \le 10$
- $-10 \le nums[i] \le 10$
- All the numbers of `nums` are **unique**.

## Solution approach

### Intuition

Build subsets by deciding, in index order, which element to add **next**. Starting from the empty subset `cur`, we may append any `nums[i]` with `i >= start`, then continue from `i + 1`. Because indices only increase, each subset is produced in exactly one way — as the sequence of its elements in index order — so no duplicates appear and no `set` is needed.

Every node of this recursion tree (not just the leaves) is a distinct subset, so we record `cur` as soon as we enter a call. With distinct elements the tree has exactly $2^n$ nodes.

### Algorithm

1. `backtrack(start)`: append a copy of `cur` to `ans`.
2. For each `i` from `start` to `n - 1`: push `nums[i]` onto `cur`, call `backtrack(i + 1)`, then pop it (undo the choice).
3. Call `backtrack(0)` and return `ans`.

### Walkthrough

Recursion tree for `nums = [1,2,3]`; each node is the subset `cur` recorded when the call starts, and each edge appends one element:

[![Recursion tree for [1, 2, 3]: each call records its subset and each child appends one larger element](/img/codes/subsets/recursion-tree.png)](/img/codes/subsets/recursion-tree.png)

Pre-order (the order `ans` is filled): `[]`, `[1]`, `[1,2]`, `[1,2,3]`, `[1,3]`, `[2]`, `[2,3]`, `[3]`.

### Complexity

- **Time:** $O(n \cdot 2^n)$ — there are $2^n$ calls, and each copies `cur` (up to `n` elements) into `ans`. Since the output itself has $n \cdot 2^{n-1}$ numbers in total, this is optimal.
- **Space:** $O(n)$ auxiliary — the recursion depth and `cur`; the output takes $O(n \cdot 2^n)$.

### Edge cases

- **Single element** (`[0]`): the root records `[]`, its only child records `[0]`.
- **Negative numbers:** values are never compared, only positions, so signs do not matter.

## Code

```cpp
class Solution {
    vector<vector<int>> ans;
    vector<int> cur;

    void backtrack(const vector<int>& nums, int start) {
        ans.push_back(cur);
        for (int i = start; i < (int)nums.size(); i++) {
            cur.push_back(nums[i]);
            backtrack(nums, i + 1);
            cur.pop_back();
        }
    }

   public:
    vector<vector<int>> subsets(vector<int>& nums) {
        backtrack(nums, 0);
        return ans;
    }
};
```

```java
class Solution {
    private final List<List<Integer>> ans = new ArrayList<>();
    private final List<Integer> cur = new ArrayList<>();

    private void backtrack(int[] nums, int start) {
        ans.add(new ArrayList<>(cur));
        for (int i = start; i < nums.length; i++) {
            cur.add(nums[i]);
            backtrack(nums, i + 1);
            cur.remove(cur.size() - 1);
        }
    }

    public List<List<Integer>> subsets(int[] nums) {
        backtrack(nums, 0);
        return ans;
    }
}
```

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        ans, cur = [], []

        def backtrack(start):
            ans.append(cur[:])
            for i in range(start, len(nums)):
                cur.append(nums[i])
                backtrack(i + 1)
                cur.pop()

        backtrack(0)
        return ans
```
