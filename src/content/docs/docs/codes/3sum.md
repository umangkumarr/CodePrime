---
title: "3Sum"
description: "Find all unique triplets in an array that sum to zero by sorting the array and closing in on each fixed element with two pointers."
source: "https://leetcode.com/problems/3sum/"
difficulty: "Medium"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(n^2)"
  space: "O(\\log n)"
---

## Problem

Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.

Notice that the solution set must not contain duplicate triplets.

**Example 1:**

```text
Input:  nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation:
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Notice that the order of the output and the order of the triplets does not matter.
```

**Example 2:**

```text
Input:  nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.
```

**Example 3:**

```text
Input:  nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.
```

**Constraints:**

- $3 \le$ `nums.length` $\le 3000$
- $-10^5 \le$ `nums[i]` $\le 10^5$

## Solution approach

### Intuition

Checking every triple is $O(n^3)$, far too slow for $n = 3000$. Sorting the array unlocks two things at once.

1. **Two Sum on a sorted array is linear.** Fix the smallest element `nums[i]`; we now need two elements to its right that sum to `-nums[i]`. Put `lo` just after `i` and `hi` at the end. If `nums[i] + nums[lo] + nums[hi]` is too small, the only way to increase it is to move `lo` right; if it is too big, move `hi` left. Every move discards a value that cannot be part of any answer with the current `i`, so one sweep finds all pairs.
2. **Duplicates sit next to each other.** A triplet is identified by its values, so we skip an `i` whose value equals the previous one, and after recording a triplet we step `lo` past every copy of its value. This produces each triplet exactly once, in sorted order, without a `set`.

A further shortcut: once `nums[i] > 0`, the three smallest remaining values are all positive, so no more triplets exist.

### Algorithm

1. Sort `nums`.
2. For each `i` from `0` to `n - 3`:
   - stop if `nums[i] > 0`; skip `i` if `nums[i] == nums[i - 1]`;
   - set `lo = i + 1`, `hi = n - 1` and, while `lo < hi`, compute `sum = nums[i] + nums[lo] + nums[hi]`:
     - `sum < 0`: `lo++`;
     - `sum > 0`: `hi--`;
     - `sum == 0`: record the triplet, move `lo` right and `hi` left, then keep moving `lo` right while `nums[lo] == nums[lo - 1]`.
3. Return the recorded triplets.

Skipping duplicates only on `lo` is enough: if `nums[lo]` changes and `nums[i]` is fixed, the matching `nums[hi]` must change too.

### Walkthrough

Example 1 after sorting is `[-4,-1,-1,0,1,2]`. Blue is the fixed element `i`, orange the pair `lo`/`hi`, grey the values already ruled out:

![Two-pointer sweep for 3Sum on [-4,-1,-1,0,1,2]](/img/codes/3sum/two-pointers.gif)

### Complexity

- **Time:** $O(n^2)$ — sorting costs $O(n \log n)$; for each of the $n$ choices of `i` the pointers `lo` and `hi` together move at most $n$ steps.
- **Space:** $O(\log n)$ — the stack space of the sort in C++ and Java (Python's `sort` may use $O(n)$); the output list is not counted.

### Edge cases

- **All zeros** such as `[0,0,0,0]`: `i = 0` records `[0,0,0]` once, the duplicate skip on `lo` ends the inner loop, and every later `i` is skipped because its value repeats.
- **No answer** such as `[0,1,1]`: every sum is positive, `hi` moves left until it meets `lo`, and the result is empty.
- **Sum range:** the largest possible magnitude is $3 \times 10^5$, which fits in an `int`.

## Code

```cpp
class Solution {
   public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        vector<vector<int>> ans;
        for (int i = 0; i + 2 < n && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                int sum = nums[i] + nums[lo] + nums[hi];
                if (sum < 0) {
                    lo++;
                } else if (sum > 0) {
                    hi--;
                } else {
                    ans.push_back({nums[i], nums[lo], nums[hi]});
                    lo++, hi--;
                    while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                }
            }
        }
        return ans;
    }
};
```

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        int n = nums.length;
        List<List<Integer>> ans = new ArrayList<>();
        for (int i = 0; i + 2 < n && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                int sum = nums[i] + nums[lo] + nums[hi];
                if (sum < 0) {
                    lo++;
                } else if (sum > 0) {
                    hi--;
                } else {
                    ans.add(List.of(nums[i], nums[lo], nums[hi]));
                    lo++;
                    hi--;
                    while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                }
            }
        }
        return ans;
    }
}
```

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        n = len(nums)
        ans = []
        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, n - 1
            while lo < hi:
                total = nums[i] + nums[lo] + nums[hi]
                if total < 0:
                    lo += 1
                elif total > 0:
                    hi -= 1
                else:
                    ans.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
        return ans
```
