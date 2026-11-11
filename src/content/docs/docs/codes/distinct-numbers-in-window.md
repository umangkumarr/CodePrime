---
title: "Distinct Numbers in Window"
description: "Count the distinct values in every window of size B of an array in O(N) using a sliding window over a hash map of value frequencies."
source: "https://www.interviewbit.com/problems/distinct-numbers-in-window/"
difficulty: "Medium"
tags: ["Hash Table", "Array", "Sliding Window"]
complexity:
  time: "O(N)"
  space: "O(B)"
---

## Problem

You are given an array of `N` integers, `A1, A2, ..., AN` and an integer `B`. Return the count of distinct numbers in all windows of size `B`.

Formally, return an array of size `N - B + 1` where the `i`-th element in this array contains the number of distinct elements in the sequence `Ai, Ai+1, ..., Ai+B-1`.

**Note:** If `B > N`, return an empty array.

Complete the function `dNums(vector<int> &A, int B)` which returns the list of counts.

**Example 1:**

```text
Input:  A = [1, 2, 1, 3, 4, 3], B = 3
Output: [2, 3, 3, 2]
Explanation:
Window [1, 2, 1] has 2 distinct numbers.
Window [2, 1, 3] has 3 distinct numbers.
Window [1, 3, 4] has 3 distinct numbers.
Window [3, 4, 3] has 2 distinct numbers.
```

**Example 2:**

```text
Input:  A = [1, 1, 2, 2], B = 1
Output: [1, 1, 1, 1]
Explanation: A window of size 1 always contains exactly one distinct number.
```

**Constraints (assumed):** the source page lists none; the solution is designed for

- $1 \le N \le 10^6$
- $1 \le$ `A[i]` $\le 10^9$
- $1 \le B$ (and `B > N` must return an empty array)

## Solution approach

### Intuition

Recounting each window from scratch costs $O(N \cdot B)$. But two neighbouring windows differ by just two elements: one enters on the right, one leaves on the left. So we keep a frequency map `freq` (value to count inside the current window) and update it in $O(1)$ per slide. A value contributes to the distinct count exactly while its frequency is positive, so if we erase keys whose count drops to `0`, the **number of keys** in `freq` is always the number of distinct values in the window.

### Algorithm

1. If `B > N`, return an empty array.
2. For each index `i` from `0` to `N - 1`:
   - add the entering element: `freq[A[i]]++`;
   - if `i >= B`, the element `A[i - B]` has just left the window: decrement its count and erase it when the count becomes `0`;
   - once the window is full (`i >= B - 1`), append `freq.size()` to `ans`.
3. Return `ans`.

### Walkthrough

Example 1 with `B = 3`. Blue cells form the current window, and `freq` lists the counts inside it:

![Sliding a window of size 3 over [1,2,1,3,4,3]](/img/codes/distinct-numbers-in-window/window/01.webp)

### Complexity

- **Time:** $O(N)$ on average — each element is inserted into and removed from the hash map once.
- **Space:** $O(B)$ — the map never holds more than `B` keys (the answer array of $N - B + 1$ values is output).

### Edge cases

- **`B > N`:** returned early as an empty array; without the check there would be no full window.
- **`B == N`:** only one window, so `ans` has a single value.
- **`B == 1`:** each window has one element, so every count is `1` (Example 2).
- **Repeated values leaving the window:** a value is erased only when its count reaches `0`, so a duplicate still inside the window keeps it counted.

## Code

```cpp
vector<int> Solution::dNums(vector<int> &A, int B) {
    int n = A.size();
    if (B > n) return {};

    unordered_map<int, int> freq;
    freq.reserve(B);
    vector<int> ans;
    ans.reserve(n - B + 1);
    for (int i = 0; i < n; i++) {
        freq[A[i]]++;
        if (i >= B && --freq[A[i - B]] == 0) freq.erase(A[i - B]);
        if (i >= B - 1) ans.push_back(freq.size());
    }
    return ans;
}
```

```java
public class Solution {
    public ArrayList<Integer> dNums(ArrayList<Integer> A, int B) {
        int n = A.size();
        ArrayList<Integer> ans = new ArrayList<>();
        if (B > n) return ans;

        HashMap<Integer, Integer> freq = new HashMap<>();
        for (int i = 0; i < n; i++) {
            freq.merge(A.get(i), 1, Integer::sum);
            if (i >= B) {
                int out = A.get(i - B);
                if (freq.merge(out, -1, Integer::sum) == 0) freq.remove(out);
            }
            if (i >= B - 1) ans.add(freq.size());
        }
        return ans;
    }
}
```

```python
class Solution:
    def dNums(self, A, B):
        n = len(A)
        if B > n:
            return []

        freq = {}
        ans = []
        for i, x in enumerate(A):
            freq[x] = freq.get(x, 0) + 1
            if i >= B:
                out = A[i - B]
                freq[out] -= 1
                if freq[out] == 0:
                    del freq[out]
            if i >= B - 1:
                ans.append(len(freq))
        return ans
```
