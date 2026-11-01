---
title: "Allocate Books"
description: "Given an array of integers A of size N and an integer B. College library has N bags,the ith book has A[i] number of pages. You have to allocate books to B…"
source: "https://www.interviewbit.com/problems/allocate-books/"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(n \\log S)"
  space: "O(n)"
---

## Problem

<p>Given an array of integers <strong>A</strong> of size <strong>N</strong> and an integer <strong>B</strong>.</p>

<p>College library has <strong>N</strong> bags,the <strong>ith</strong> book has <strong>A[i]</strong> number of pages.</p>

<p>You have to allocate books to <strong>B</strong> number of students so that maximum number of pages alloted to a student is minimum.</p>

*A book will be allocated to exactly one student.
Each student has to be allocated at least one book.
Allotment should be in contiguous order, for example: A student cannot be allocated book 1 and book 3, skipping book 2.*

<p>Calculate and return that minimum possible number.</p>

## Solution approach

### Intuition

Instead of trying every way to split the books, **binary search on the answer**: the maximum number of pages any student reads. If students can manage with a limit of `x` pages each, they can also manage with any larger limit, so feasibility is monotonic and the smallest feasible limit can be found by binary search.

To test a limit, assign books greedily: give the current student books in order until the next book would exceed the limit, then start a new student. If this needs more than `B` students, the limit is too small.

### Algorithm

1. If `B > n`, return `-1`, since every student must get at least one book. If `n == 1`, return `A[0]`.
2. Search the range `min = 0` to `max = sm`, where `sm` is the total number of pages.
3. For each `mid`, call `possible(A, B, n, mid)`:
   - return `false` if any single book has more than `curr_min` pages;
   - add books to `curr_sum` while they fit, otherwise increase `student_required` and start a new sum;
   - return `false` as soon as `student_required` exceeds `B`.
4. If `mid` is feasible, record it in `ans` and search lower (`max = mid - 1`); otherwise search higher (`min = mid + 1`).
5. Return `ans`.

### Complexity

- **Time:** $O(n \log S)$ — about $\log S$ binary-search steps, where $S$ is the total number of pages, each running an $O(n)$ check.
- **Space:** $O(n)$ — `possible` receives a copy of `A` because it is passed by value.

### Edge cases

- **More students than books:** returns `-1` immediately.

## Code

```cpp title="C++"
bool possible(vector<int> A, int B, int n, long long curr_min) {
    long long curr_sum = 0;
    int student_required = 1;

    for (int i = 0; i < n; i++) {
        if (A[i] > curr_min) return false;
        if (A[i] + curr_sum > curr_min) {
            student_required++;
            curr_sum = A[i];
            if (student_required > B) return false;
        } else
            curr_sum += A[i];
    }
    return true;
}

int Solution::books(vector<int> &A, int B) {
    int n = A.size();
    if (B > n) return -1;
    if (n == 1) return A[0];
    long long sm = 0;
    for (int i = 0; i < n; i++) {
        sm += A[i];
    }
    long long min = 0, max = sm, ans = -1;
    while (min <= max) {
        long long mid = min + (max - min) / 2;
        if (possible(A, B, n, mid)) {
            ans = mid;
            max = mid - 1;
        } else {
            min = mid + 1;
        }
    }
    return ans;
}
```
