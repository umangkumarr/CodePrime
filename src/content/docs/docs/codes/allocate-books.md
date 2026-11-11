---
title: "Allocate Books"
description: "Split books into contiguous groups for B students so the largest group of pages is minimal, using binary search on the answer with a greedy check."
source: "https://www.interviewbit.com/problems/allocate-books/"
difficulty: "Medium"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(n \\log S)"
  space: "O(1)"
---

## Problem

Given an array of integers `A` of size `N` and an integer `B`.

The College library has `N` books. The `i`th book has `A[i]` number of pages.

You have to allocate books to `B` number of students so that the maximum number of pages allocated to a student is minimum.

1. A book will be allocated to exactly one student.
2. Each student has to be allocated at least one book.
3. Allotment should be in contiguous order, for example: A student cannot be allocated book 1 and book 3, skipping book 2.

Calculate and return that minimum possible number.

**Note:** Return `-1` if a valid assignment is not possible.

The first argument is the integer array `A`, the second is the integer `B`. Complete the function `books(A, B)`.

**Example 1:**

```text
Input:  A = [12, 34, 67, 90], B = 2
Output: 113
Explanation: There are two students. Books can be distributed in the following fashion:
1) [12] and [34, 67, 90]   Max pages are allocated to student 2: 34 + 67 + 90 = 191
2) [12, 34] and [67, 90]   Max pages are allocated to student 2: 67 + 90 = 157
3) [12, 34, 67] and [90]   Max pages are allocated to student 1: 12 + 34 + 67 = 113
Of the 3 cases, option 3 has the minimum pages = 113.
```

**Example 2:**

```text
Input:  A = [5, 17, 100, 11], B = 4
Output: 100
```

**Constraints:**

- $1 \le N \le 10^5$
- $1 \le$ `A[i]`, `B` $\le 10^5$

## Solution approach

### Intuition

Turn the optimisation question into a yes/no question: **"can the books be shared among at most `B` students so that nobody reads more than `limit` pages?"**

- The question is easy to answer greedily. Walk through the books and keep giving them to the current student until the next book would push them past `limit`; then start a new student. Giving each student as many books as possible can never increase the number of students needed, so if the greedy needs more than `B` students, no allocation works.
- The answer is **monotonic** in `limit`: if a limit works, every larger limit works too. So the smallest working limit can be found by binary search.

The search range is `[max(A), sum(A)]`: no limit below the thickest book can work, and a single student reading everything always fits.

Why "at most `B`" is enough even though every student must get a book: when `B <= N`, a split into fewer than `B` groups can always be refined by cutting off single books from groups that have more than one, which never increases a group's sum. If `B > N`, some student would get nothing, so the answer is `-1`.

### Algorithm

1. If `B > A.size()`, return `-1`.
2. Set `lo = max(A)` and `hi = sum(A)` (as 64-bit integers, since the sum can reach $10^{10}$).
3. While `lo < hi`:
   - `mid = lo + (hi - lo) / 2`;
   - if `canAllocate(A, B, mid)`, the answer is at most `mid`: `hi = mid`;
   - otherwise it is larger: `lo = mid + 1`.
4. Return `lo`.

`canAllocate` keeps the running page count `pages` of the current student and the number of students used, `students`. When `pages + A[i] > limit`, it starts a new student with `A[i]`, and fails as soon as `students > B`.

### Walkthrough

Example 1 (`B = 2`). Each frame tests one `limit`; books with the same colour go to the same student:

![Binary search on the page limit for A = [12, 34, 67, 90], B = 2](/img/codes/allocate-books/binary-search/01.webp)

### Complexity

- **Time:** $O(n \log S)$ — the search range has at most $S$ values (where $S$ is `sum(A)`), so there are $O(\log S)$ steps, each running the $O(n)$ greedy check.
- **Space:** $O(1)$ — `A` is passed by reference and the check uses a few counters.

### Edge cases

- **More students than books** such as `B = 5` for 4 books: returns `-1` immediately.
- **One student per book** (Example 2): the search settles on `max(A) = 100`.
- **One student** (`B = 1`): every limit below `sum(A)` fails, so the answer is the total. The judge's return type is `int`, so this assumes the answer fits in an `int` (true for the judge's tests); the search itself uses 64-bit integers and cannot overflow.

## Code

```cpp
static bool canAllocate(const vector<int>& A, int B, long long limit) {
    int students = 1;
    long long pages = 0;
    for (int x : A) {
        if (pages + x > limit) {
            if (++students > B) return false;
            pages = 0;
        }
        pages += x;
    }
    return true;
}

int Solution::books(vector<int>& A, int B) {
    if (B > (int)A.size()) return -1;
    long long lo = *max_element(A.begin(), A.end());
    long long hi = accumulate(A.begin(), A.end(), 0LL);
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (canAllocate(A, B, mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return (int)lo;
}
```

```java
public class Solution {
    public int books(ArrayList<Integer> A, int B) {
        if (B > A.size()) return -1;
        long lo = 0, hi = 0;
        for (int x : A) {
            lo = Math.max(lo, x);
            hi += x;
        }
        while (lo < hi) {
            long mid = lo + (hi - lo) / 2;
            if (canAllocate(A, B, mid)) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return (int) lo;
    }

    private static boolean canAllocate(List<Integer> A, int B, long limit) {
        int students = 1;
        long pages = 0;
        for (int x : A) {
            if (pages + x > limit) {
                if (++students > B) return false;
                pages = 0;
            }
            pages += x;
        }
        return true;
    }
}
```

```python
class Solution:
    def books(self, A, B):
        if B > len(A):
            return -1

        def can_allocate(limit):
            students, pages = 1, 0
            for x in A:
                if pages + x > limit:
                    students += 1
                    if students > B:
                        return False
                    pages = 0
                pages += x
            return True

        lo, hi = max(A), sum(A)
        while lo < hi:
            mid = (lo + hi) // 2
            if can_allocate(mid):
                hi = mid
            else:
                lo = mid + 1
        return lo
```
