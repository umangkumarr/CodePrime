---
title: "Single Element in a Sorted Array"
description: "Find the only element that appears once in a sorted array of pairs in O(log n) time, by binary searching on whether pairs start at even indices."
source: "https://leetcode.com/problems/single-element-in-a-sorted-array/"
difficulty: "Medium"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.

Return *the single element that appears only once*.

Your solution must run in $O(\log n)$ time and $O(1)$ space.

**Example 1:**

```text
Input:  nums = [1,1,2,3,3,4,4,8,8]
Output: 2
```

**Example 2:**

```text
Input:  nums = [3,3,7,7,10,11,11]
Output: 10
```

**Constraints:**

- $1 \le nums.length \le 10^5$
- $0 \le nums[i] \le 10^5$

## Solution approach

### Intuition

Look at where each pair starts. **Before** the single element, every pair occupies indices `(even, odd)`: `nums[0] == nums[1]`, `nums[2] == nums[3]`, and so on. The single element shifts everything after it by one, so **after** it every pair occupies `(odd, even)`.

So for any even index `mid`:

- if `nums[mid] == nums[mid + 1]`, the pairing is still "normal" at `mid`, and the single element lies to the **right** of `mid + 1`;
- otherwise the pairing is already broken, and the single element is at `mid` or to its **left**.

That predicate is monotonic over the even indices, so we can binary search on it. The array length is odd (pairs plus one), so the search range `[lo, hi]` always has even endpoints and the answer is the first even index where the pairing breaks.

### Algorithm

1. Set `lo = 0`, `hi = n - 1` (both even, since `n` is odd).
2. While `lo < hi`:
   - `mid = lo + (hi - lo) / 2`; if `mid` is odd, decrement it so that it is even (it stays `>= lo`).
   - If `nums[mid] == nums[mid + 1]`, the single element is after this pair: `lo = mid + 2`.
   - Otherwise it is at `mid` or before: `hi = mid`.
3. Return `nums[lo]`.

The invariant is that the single element is always at an even index in `[lo, hi]`. Since `mid < hi`, `mid + 1` is always a valid index.

### Walkthrough

Blue is `mid`, orange is its partner `mid + 1`, grey indices have been ruled out:

![Binary search on pairs for [1,1,2,3,3,4,4,8,8]](/img/codes/single-element-in-a-sorted-array/pairs/01.webp)

### Complexity

- **Time:** $O(\log n)$ — the range `[lo, hi]` at least halves every iteration.
- **Space:** $O(1)$ — three indices.

### Edge cases

- **`n == 1`:** `lo == hi == 0`, the loop never runs and `nums[0]` is returned.
- **Single element first or last** (e.g. `[1,2,2]` or `[1,1,2]`): the search converges to index `0` or `n - 1` respectively; no special case is needed.

## Code

```cpp
class Solution {
   public:
    int singleNonDuplicate(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (mid % 2 == 1) mid--;  // compare from the start of a pair
            if (nums[mid] == nums[mid + 1]) {
                lo = mid + 2;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
};
```

```java
class Solution {
    public int singleNonDuplicate(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (mid % 2 == 1) mid--;  // compare from the start of a pair
            if (nums[mid] == nums[mid + 1]) {
                lo = mid + 2;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
}
```

```python
class Solution:
    def singleNonDuplicate(self, nums: List[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if mid % 2 == 1:
                mid -= 1  # compare from the start of a pair
            if nums[mid] == nums[mid + 1]:
                lo = mid + 2
            else:
                hi = mid
        return nums[lo]
```
