---
title: "Combination Sum II"
description: "List every unique combination of candidates (each used at most once) that sums to target, by backtracking over the sorted array and skipping equal values at the same depth."
source: "https://leetcode.com/problems/combination-sum-ii/"
difficulty: "Medium"
tags: ["Array", "Backtracking"]
complexity:
  time: "O(2^n \\cdot n)"
  space: "O(n)"
---

## Problem

Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`.

Each number in `candidates` may only be used **once** in the combination.

**Note:** The solution set must not contain duplicate combinations.

**Example 1:**

```text
Input:  candidates = [10,1,2,7,6,1,5], target = 8
Output:
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

**Example 2:**

```text
Input:  candidates = [2,5,2,1,2], target = 5
Output:
[
[1,2,2],
[5]
]
```

**Constraints:**

- $1 \le$ `candidates.length` $\le 100$
- $1 \le$ `candidates[i]` $\le 50$
- $1 \le$ `target` $\le 30$

## Solution approach

### Intuition

Generating every subset and de-duplicating at the end works but wastes time on the many copies of the same combination when the input repeats values (Example 1 has two `1`s, so `[1,7]` could be built twice).

Sort the array first and build each combination in non-decreasing order, choosing **the next element** at each recursion depth from the positions after the previous one. Two rules then make the search both duplicate-free and fast:

- **Skip equal values at the same depth.** If `candidates[i] == candidates[i - 1]` and `i > start`, then choosing `candidates[i]` as the next element would produce exactly the combinations already produced by choosing `candidates[i - 1]` (which had all the same later elements available, plus one more). Using the second `1` *after* the first one is still allowed, because that happens at a deeper level where `i == start`.
- **Prune by size.** The array is sorted, so once `candidates[i] > remaining`, every later value is too big as well and the loop can stop.

### Algorithm

1. Sort `candidates` and call `backtrack(candidates, 0, target, path, res)`.
2. In `backtrack(nums, start, remaining, path, res)`:
   - If `remaining == 0`, `path` is a valid combination: copy it into `res` and return.
   - For `i` from `start` while `nums[i] <= remaining`:
     - if `i > start` and `nums[i] == nums[i - 1]`, skip it;
     - push `nums[i]` onto `path`, recurse with `start = i + 1` (each element is used at most once) and `remaining - nums[i]`, then pop it.
3. Return `res`.

### Walkthrough

Example 2 sorted is `[1, 2, 2, 2, 5]`, `target = 5`. Each box is a call showing `path` and the remaining sum. Green calls record an answer; grey choices are skipped as duplicates at their depth; red choices are pruned because the value exceeds `remaining`:

```mermaid
flowchart TD
    r["[] rem 5"] --> a["[1] rem 4"]
    r --> b["[2] rem 3"]
    r -.-> bs["2, 2: same value at this depth"]
    r --> e["[5] rem 0"]
    a --> a2["[1,2] rem 2"]
    a -.-> as["2, 2: skipped"]
    a -.-> ap["5 > 4: stop"]
    a2 --> a22["[1,2,2] rem 0"]
    a2 -.-> a2s["2: skipped"]
    a2 -.-> a2p["5 > 2: stop"]
    b --> b2["[2,2] rem 1"]
    b -.-> bs2["2: skipped"]
    b -.-> bp["5 > 3: stop"]
    b2 -.-> b2p["2 > 1: stop"]
    classDef ok fill:#dcf5e3,stroke:#2e9e57,color:#1f2430
    classDef skip fill:#e9eaed,stroke:#b4b8bf,color:#1f2430
    classDef cut fill:#fde0e0,stroke:#d64545,color:#1f2430
    class a22,e ok
    class bs,as,a2s,bs2 skip
    class ap,a2p,bp,b2p cut
```

Only two leaves reach `rem 0`: `[1,2,2]` and `[5]`.

### Complexity

- **Time:** $O(2^n \cdot n)$ in the worst case — each element is either in or out of a combination, and copying a finished combination costs up to its length. In practice the sorted pruning cuts this drastically, because `target` is at most `30`.
- **Space:** $O(n)$ — the recursion depth and `path` are bounded by the combination length (at most `min(n, target)`), not counting the output.

### Edge cases

- **Duplicates in the input:** handled by the same-depth skip, so `[1,7]` in Example 1 is produced once even though there are two `1`s.
- **No valid combination:** no call ever reaches `remaining == 0` and `res` is returned empty.
- **A single candidate equal to `target`:** recorded at depth 1, like `[5]` above.

## Code

```cpp
class Solution {
    void backtrack(const vector<int>& nums, int start, int remaining, vector<int>& path,
                   vector<vector<int>>& res) {
        if (remaining == 0) {
            res.push_back(path);
            return;
        }
        for (int i = start; i < (int)nums.size() && nums[i] <= remaining; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;  // same value already tried at this depth
            path.push_back(nums[i]);
            backtrack(nums, i + 1, remaining - nums[i], path, res);
            path.pop_back();
        }
    }

   public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> res;
        vector<int> path;
        backtrack(candidates, 0, target, path, res);
        return res;
    }
};
```

```java
class Solution {
    private void backtrack(int[] nums, int start, int remaining, List<Integer> path, List<List<Integer>> res) {
        if (remaining == 0) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < nums.length && nums[i] <= remaining; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;  // same value already tried at this depth
            path.add(nums[i]);
            backtrack(nums, i + 1, remaining - nums[i], path, res);
            path.remove(path.size() - 1);
        }
    }

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> res = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }
}
```

```python
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        res, path = [], []

        def backtrack(start, remaining):
            if remaining == 0:
                res.append(path.copy())
                return
            for i in range(start, len(candidates)):
                num = candidates[i]
                if num > remaining:
                    break
                if i > start and num == candidates[i - 1]:
                    continue  # same value already tried at this depth
                path.append(num)
                backtrack(i + 1, remaining - num)
                path.pop()

        backtrack(0, target)
        return res
```
