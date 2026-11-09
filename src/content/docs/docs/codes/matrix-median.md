---
title: "Matrix Median"
description: "Find the median of a matrix whose rows are sorted, without extra memory, by binary searching on the answer value and counting elements per row."
source: "https://www.interviewbit.com/problems/matrix-median/"
difficulty: "Medium"
tags: ["Binary Search", "Matrix"]
complexity:
  time: "O(N \\log M \\cdot \\log R)"
  space: "O(1)"
---

## Problem

Given a matrix of integers **A** of size **N x M** in which each row is sorted.

Find and return the overall median of matrix **A**.

**NOTE:** No extra memory is allowed.

**NOTE:** Rows are numbered from top to bottom and columns are numbered from left to right.

Complete the function `findMedian()`, which takes the matrix `A` and returns its median.

**Example 1:**

```text
Input:  A = [ [1, 3, 5],
              [2, 6, 9],
              [3, 6, 9] ]
Output: 5
Explanation: A = [1, 2, 3, 3, 5, 6, 6, 9, 9]
Median is 5. So, we return 5.
```

**Example 2:**

```text
Input:  A = [ [5, 17, 100] ]
Output: 17
Explanation: Median is 17.
```

**Constraints:**

- $1 \le N, M \le 10^5$
- $1 \le N \cdot M \le 10^6$
- $1 \le$ `A[i]` $\le 10^9$
- `N*M` is odd

## Solution approach

### Intuition

Copying all elements and sorting them is $O(NM \log NM)$ time and $O(NM)$ memory, which the note forbids. Instead of searching for the median's **position**, binary-search on its **value**.

Since `N*M` is odd, the median is the element at sorted position `half = (N*M + 1) / 2` (1-based). Define `count(x)` = number of elements `<= x`. Then:

- `count(x)` never decreases as `x` grows, and
- the median is the **smallest** `x` with `count(x) >= half`: for `x` equal to the median, at least `half` elements are `<= x` (the median and everything before it in sorted order), while for any smaller `x`, at most `half - 1` are.

So we can binary-search for the smallest such `x` between the smallest and largest element. Because each row is sorted, `count(x)` for one row is just `upper_bound(row, x)`, an $O(\log M)$ binary search, and the whole count takes $O(N \log M)$.

The answer found this way is always an element of the matrix: the smallest `x` whose count reaches `half` must be a value at which the count increases, i.e. a value present in `A`.

### Algorithm

1. Set `lo` to the minimum of the first column and `hi` to the maximum of the last column — the smallest and largest elements.
2. Let `half = (N * M + 1) / 2`.
3. While `lo < hi`:
   - `mid = lo + (hi - lo) / 2`;
   - `cnt` = sum over rows of `upper_bound(row, mid)`, the number of elements `<= mid`;
   - if `cnt < half`, the median is larger: `lo = mid + 1`; otherwise it is `mid` or smaller: `hi = mid`.
4. Return `lo`.

### Walkthrough

Example 1, `half = 5`. Green cells are the elements `<= mid` counted in that step:

![Binary search on the median value of a 3x3 matrix](/img/codes/matrix-median/search.gif)

### Complexity

- **Time:** $O(N \log M \cdot \log R)$ — where $R$ is the difference between the largest and smallest element ($\log R \le 30$ for values up to $10^9$); each of those steps does `N` row searches of $O(\log M)$.
- **Space:** $O(1)$ — a few counters, no copy of the matrix.

### Edge cases

- **One row** (Example 2): the count is a single `upper_bound`; the search still converges on `17`.
- **All elements equal:** `lo == hi` from the start, and that value is returned without iterating.
- **Overflow:** `lo + (hi - lo) / 2` avoids overflowing `lo + hi`, and `cnt` is at most $10^6$.

## Code

```cpp
int Solution::findMedian(vector<vector<int> >& A) {
    int n = A.size(), m = A[0].size();
    int lo = INT_MAX, hi = INT_MIN;
    for (int i = 0; i < n; i++) {
        lo = min(lo, A[i][0]);
        hi = max(hi, A[i][m - 1]);
    }

    int half = (n * m + 1) / 2;  // 1-based position of the median
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        int cnt = 0;  // number of elements <= mid
        for (int i = 0; i < n; i++)
            cnt += upper_bound(A[i].begin(), A[i].end(), mid) - A[i].begin();
        if (cnt < half)
            lo = mid + 1;
        else
            hi = mid;
    }
    return lo;
}
```

```java
public class Solution {
    public int findMedian(ArrayList<ArrayList<Integer>> A) {
        int n = A.size(), m = A.get(0).size();
        int lo = Integer.MAX_VALUE, hi = Integer.MIN_VALUE;
        for (List<Integer> row : A) {
            lo = Math.min(lo, row.get(0));
            hi = Math.max(hi, row.get(m - 1));
        }

        int half = (n * m + 1) / 2;  // 1-based position of the median
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int cnt = 0;  // number of elements <= mid
            for (List<Integer> row : A) cnt += upperBound(row, mid);
            if (cnt < half)
                lo = mid + 1;
            else
                hi = mid;
        }
        return lo;
    }

    // number of elements <= x in the sorted row
    private int upperBound(List<Integer> row, int x) {
        int l = 0, r = row.size();
        while (l < r) {
            int mid = (l + r) >>> 1;
            if (row.get(mid) <= x)
                l = mid + 1;
            else
                r = mid;
        }
        return l;
    }
}
```

```python
from bisect import bisect_right


class Solution:
    # @param A : list of list of integers
    # @return an integer
    def findMedian(self, A):
        n, m = len(A), len(A[0])
        lo = min(row[0] for row in A)
        hi = max(row[-1] for row in A)

        half = (n * m + 1) // 2  # 1-based position of the median
        while lo < hi:
            mid = (lo + hi) // 2
            cnt = sum(bisect_right(row, mid) for row in A)  # number of elements <= mid
            if cnt < half:
                lo = mid + 1
            else:
                hi = mid
        return lo
```
