---
title: "Maximum sum increasing subsequence"
description: "Find the largest sum of a strictly increasing subsequence with an LIS-style DP, sped up to O(n log n) with a prefix-maximum Fenwick tree over values."
source: "https://practice.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1"
difficulty: "Medium"
tags: ["Dynamic Programming"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given an array of positive integers `arr[]`, find the maximum sum of a subsequence such that the elements of the subsequence form a strictly increasing sequence. In other words, among all strictly increasing subsequences of the array, return the one with the largest possible sum.

Complete the function `maxSumIS()` which takes the array `arr` and returns the maximum sum.

**Example 1:**

```text
Input:  arr[] = [1, 101, 2, 3, 100]
Output: 106
Explanation: The maximum sum of an increasing sequence is obtained from [1, 2, 3, 100].
```

**Example 2:**

```text
Input:  arr[] = [4, 1, 2, 3]
Output: 6
Explanation: The maximum sum of an increasing sequence is obtained from [1, 2, 3].
```

**Example 3:**

```text
Input:  arr[] = [4, 1, 2, 4]
Output: 7
Explanation: The maximum sum of an increasing sequence is obtained from [1, 2, 4].
```

**Constraints:**

- $1 \le$ `arr.size()` $\le 10^3$
- $1 \le$ `arr[i]` $\le 10^5$

## Solution approach

### Approach 1: Quadratic DP

**Intuition**

This is the longest increasing subsequence DP with sums instead of lengths. Let `dp[i]` be the largest sum of a strictly increasing subsequence that **ends at** `arr[i]`. Such a subsequence is either `arr[i]` alone, or a subsequence ending at some earlier, smaller `arr[j]` with `arr[i]` appended — and for the latter we should take the best one, `dp[j]`:

`dp[i] = arr[i] + max(0, max{ dp[j] : j < i, arr[j] < arr[i] })`.

The answer is the largest `dp[i]`, since the best subsequence ends somewhere.

**Algorithm**

1. For each `i`, start with `dp[i] = arr[i]`.
2. For every `j < i` with `arr[j] < arr[i]`, set `dp[i] = max(dp[i], dp[j] + arr[i])`.
3. Track `ans = max(ans, dp[i])` and return it.

**Walkthrough** on Example 1 (orange is the best predecessor `j` chosen for the blue `i`):

![dp values for [1, 101, 2, 3, 100]](/img/codes/maximum-sum-increasing-subsequence/dp.gif)

**Complexity**

- **Time:** $O(n^2)$ — every pair `j < i` is checked once. With $n \le 10^3$ this is about $5 \times 10^5$ steps, which is what the judge expects.
- **Space:** $O(n)$ — the `dp` array.

### Approach 2: Fenwick tree over values

**Intuition**

The inner loop of Approach 1 asks one question: _among the elements already processed whose value is smaller than `arr[i]`, what is the largest `dp`?_ That is a **prefix maximum over values**. Compress the values to ranks `1..m` and keep a Fenwick tree where position `r` holds the best `dp` of any processed element of rank `r`. Then

- `query(rank(arr[i]) - 1)` gives the best predecessor (strictly smaller values only, so equal values never chain);
- `update(rank(arr[i]), dp)` records the new subsequence ending at `arr[i]`.

Values in a Fenwick tree for maxima only ever increase, which is exactly what happens here.

**Algorithm**

1. Copy and sort the values, remove duplicates into `vals`; `m = vals.size()`.
2. For each `x` in `arr` in order: `r = lower_bound(vals, x) + 1`; `cur = x + query(r - 1)`; `update(r, cur)`; `ans = max(ans, cur)`.
3. Return `ans`.

**Complexity**

- **Time:** $O(n \log n)$ — sorting plus one query and one update of $O(\log n)$ per element.
- **Space:** $O(n)$ — `vals` and the tree.

### Edge cases

- **Equal values** (Example 3 has two `4`s): only strictly smaller values are combined — `arr[j] < arr[i]` in Approach 1, `query(r - 1)` in Approach 2.
- **Strictly decreasing array:** no element has a smaller predecessor, so the answer is the largest single element.
- **Overflow:** the sum is at most $10^3 \cdot 10^5 = 10^8$, which fits in an `int`.

## Code

```cpp title="Approach 1: Quadratic DP"
class Solution {
   public:
    int maxSumIS(vector<int>& arr) {
        int n = arr.size(), ans = 0;
        vector<int> dp(n);
        for (int i = 0; i < n; ++i) {
            dp[i] = arr[i];
            for (int j = 0; j < i; ++j)
                if (arr[j] < arr[i]) dp[i] = max(dp[i], dp[j] + arr[i]);
            ans = max(ans, dp[i]);
        }
        return ans;
    }
};
```

```java title="Approach 1: Quadratic DP"
class Solution {
    public int maxSumIS(int arr[]) {
        int n = arr.length, ans = 0;
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) {
            dp[i] = arr[i];
            for (int j = 0; j < i; j++)
                if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + arr[i]);
            ans = Math.max(ans, dp[i]);
        }
        return ans;
    }
}
```

```python title="Approach 1: Quadratic DP"
class Solution:
    def maxSumIS(self, arr):
        n, ans = len(arr), 0
        dp = [0] * n
        for i in range(n):
            dp[i] = arr[i]
            for j in range(i):
                if arr[j] < arr[i]:
                    dp[i] = max(dp[i], dp[j] + arr[i])
            ans = max(ans, dp[i])
        return ans
```

```cpp title="Approach 2: Fenwick tree"
class Solution {
   public:
    int maxSumIS(vector<int>& arr) {
        vector<int> vals(arr);
        sort(vals.begin(), vals.end());
        vals.erase(unique(vals.begin(), vals.end()), vals.end());
        int m = vals.size();
        vector<int> tree(m + 1, 0);  // tree[r]: max dp over a block of ranks ending at r

        auto query = [&](int r) {  // max dp over ranks 1..r
            int best = 0;
            for (; r > 0; r -= r & -r) best = max(best, tree[r]);
            return best;
        };
        auto update = [&](int r, int v) {
            for (; r <= m; r += r & -r) tree[r] = max(tree[r], v);
        };

        int ans = 0;
        for (int x : arr) {
            int r = lower_bound(vals.begin(), vals.end(), x) - vals.begin() + 1;
            int cur = x + query(r - 1);
            update(r, cur);
            ans = max(ans, cur);
        }
        return ans;
    }
};
```

```java title="Approach 2: Fenwick tree"
class Solution {
    private int[] tree;  // tree[r]: max dp over a block of ranks ending at r

    private int query(int r) {  // max dp over ranks 1..r
        int best = 0;
        for (; r > 0; r -= r & -r) best = Math.max(best, tree[r]);
        return best;
    }

    private void update(int r, int v) {
        for (; r < tree.length; r += r & -r) tree[r] = Math.max(tree[r], v);
    }

    public int maxSumIS(int arr[]) {
        int[] vals = Arrays.stream(arr).sorted().distinct().toArray();
        tree = new int[vals.length + 1];

        int ans = 0;
        for (int x : arr) {
            int r = Arrays.binarySearch(vals, x) + 1;
            int cur = x + query(r - 1);
            update(r, cur);
            ans = Math.max(ans, cur);
        }
        return ans;
    }
}
```

```python title="Approach 2: Fenwick tree"
from bisect import bisect_left


class Solution:
    def maxSumIS(self, arr):
        vals = sorted(set(arr))
        m = len(vals)
        tree = [0] * (m + 1)  # tree[r]: max dp over a block of ranks ending at r

        def query(r):  # max dp over ranks 1..r
            best = 0
            while r > 0:
                best = max(best, tree[r])
                r -= r & -r
            return best

        def update(r, v):
            while r <= m:
                tree[r] = max(tree[r], v)
                r += r & -r

        ans = 0
        for x in arr:
            r = bisect_left(vals, x) + 1
            cur = x + query(r - 1)
            update(r, cur)
            ans = max(ans, cur)
        return ans
```
