---
title: "Median of Two Sorted Arrays"
description: "Find the median of two sorted arrays in logarithmic time by binary searching a partition of the shorter array that splits the union into two equal halves."
source: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
difficulty: "Hard"
tags: ["Array", "Binary Search", "Divide and Conquer"]
complexity:
  time: "O(\\log(\\min(m, n)))"
  space: "O(1)"
---

## Problem

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be $O(\log (m+n))$.

**Example 1:**

```text
Input:  nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
```

**Example 2:**

```text
Input:  nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
```

**Constraints:**

- `nums1.length == m`
- `nums2.length == n`
- $0 \le m \le 1000$
- $0 \le n \le 1000$
- $1 \le m + n \le 2000$
- $-10^6 \le$ `nums1[i]`, `nums2[i]` $\le 10^6$

## Solution approach

### Intuition

Merging the arrays would find the median in $O(m + n)$, but the required bound is logarithmic, so we must avoid touching most elements.

The median is defined by a **split** of the merged array into a left half and a right half of (almost) equal size, with everything on the left `<=` everything on the right. We can describe such a split without merging: take the first `i` elements of `nums1` and the first `j` elements of `nums2` as the left half, where

`i + j = half = (m + n + 1) / 2`

(the left half gets the extra element when the total is odd). Choosing `i` fixes `j`. Write `L1 = nums1[i - 1]`, `R1 = nums1[i]`, `L2 = nums2[j - 1]`, `R2 = nums2[j]` (using `-inf` / `+inf` past the ends). Each array is sorted, so `L1 <= R1` and `L2 <= R2` hold automatically, and the split is valid exactly when

`L1 <= R2` and `L2 <= R1`.

This condition is **monotonic** in `i`: if `L1 > R2`, then `i` is too large (every larger `i` makes `L1` bigger and `R2` smaller), and if `L2 > R1`, `i` is too small. So we can binary search `i`. Searching over the **shorter** array keeps `j` in range and gives $O(\log \min(m, n))$.

Once the split is found, the largest left value is `max(L1, L2)` and the smallest right value is `min(R1, R2)`. For an odd total the median is the former; for an even total it is their average.

### Algorithm

1. If `nums1` is longer, swap the roles so that `nums1` (length `m`) is the shorter array.
2. `half = (m + n + 1) / 2`, `lo = 0`, `hi = m`.
3. Loop: `i = lo + (hi - lo) / 2`, `j = half - i`; compute `L1`, `R1`, `L2`, `R2` with `INT_MIN` / `INT_MAX` at the borders.
   - If `L1 > R2`: too many from `nums1`, set `hi = i - 1`.
   - Else if `L2 > R1`: too few from `nums1`, set `lo = i + 1`.
   - Else return `max(L1, L2)` for an odd total, or `(max(L1, L2) + min(R1, R2)) / 2.0` for an even one.

A valid split always exists (the true merged order defines one), and the search interval always contains it, so the loop terminates with a return.

### Walkthrough

On `nums1 = [2,3,5,6,17,36,39]`, `nums2 = [1,8,12,16,18,29,37]` (14 elements, `half = 7`, median `(12 + 16) / 2 = 14`). Green cells form the left half, orange cells are `L1`, `R1`, `L2`, `R2`:

![Binary search for the partition](/img/codes/median-of-two-sorted-arrays/partition.gif)

### Complexity

- **Time:** $O(\log \min(m, n))$ — the search interval `[lo, hi]` over the shorter array halves each iteration.
- **Space:** $O(1)$ — a few integers (the recursive call only swaps the arguments once).

### Edge cases

- **One empty array:** after the swap `m = 0`, so `i = 0` and `j = half`; the median comes entirely from `nums2`.
- **All of one array on one side** (Example 2): `i = m` makes `R1 = INT_MAX`, and `i = 0` makes `L1 = INT_MIN`, so the comparisons still work.
- **Duplicates across arrays:** the search only moves on a strict `L1 > R2` or `L2 > R1`, so equal values may end up on either side of the split, which does not change the median.

## Code

```cpp
class Solution {
   public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.size(), n = nums2.size();
        int half = (m + n + 1) / 2;  // size of the left half
        int lo = 0, hi = m;
        while (true) {
            int i = lo + (hi - lo) / 2;  // elements taken from nums1
            int j = half - i;            // elements taken from nums2
            int L1 = (i == 0) ? INT_MIN : nums1[i - 1];
            int R1 = (i == m) ? INT_MAX : nums1[i];
            int L2 = (j == 0) ? INT_MIN : nums2[j - 1];
            int R2 = (j == n) ? INT_MAX : nums2[j];
            if (L1 > R2) {
                hi = i - 1;
            } else if (L2 > R1) {
                lo = i + 1;
            } else {
                if ((m + n) % 2 == 1) return max(L1, L2);
                return (max(L1, L2) + min(R1, R2)) / 2.0;
            }
        }
    }
};
```

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int half = (m + n + 1) / 2;  // size of the left half
        int lo = 0, hi = m;
        while (true) {
            int i = lo + (hi - lo) / 2;  // elements taken from nums1
            int j = half - i;            // elements taken from nums2
            int L1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
            int R1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int L2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
            int R2 = (j == n) ? Integer.MAX_VALUE : nums2[j];
            if (L1 > R2) {
                hi = i - 1;
            } else if (L2 > R1) {
                lo = i + 1;
            } else {
                if ((m + n) % 2 == 1) return Math.max(L1, L2);
                return (Math.max(L1, L2) + Math.min(R1, R2)) / 2.0;
            }
        }
    }
}
```

```python
from math import inf


class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        if len(nums1) > len(nums2):
            return self.findMedianSortedArrays(nums2, nums1)
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2  # size of the left half
        lo, hi = 0, m
        while True:
            i = (lo + hi) // 2  # elements taken from nums1
            j = half - i        # elements taken from nums2
            L1 = nums1[i - 1] if i > 0 else -inf
            R1 = nums1[i] if i < m else inf
            L2 = nums2[j - 1] if j > 0 else -inf
            R2 = nums2[j] if j < n else inf
            if L1 > R2:
                hi = i - 1
            elif L2 > R1:
                lo = i + 1
            elif (m + n) % 2 == 1:
                return float(max(L1, L2))
            else:
                return (max(L1, L2) + min(R1, R2)) / 2
```
