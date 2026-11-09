---
title: "Maximum XOR With an Element From Array"
description: "Answer max-XOR queries limited to elements not exceeding m by sorting queries by m offline and growing a binary trie as the limit rises."
source: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/"
difficulty: "Hard"
tags: ["Array", "Bit Manipulation", "Trie"]
complexity:
  time: "O(n \\log n + q \\log q + (n + q) \\log M)"
  space: "O(n \\log M + q)"
---

## Problem

You are given an array `nums` consisting of non-negative integers. You are also given a `queries` array, where `queries[i] = [xi, mi]`.

The answer to the `i`-th query is the maximum bitwise `XOR` value of `xi` and any element of `nums` that does not exceed `mi`. In other words, the answer is `max(nums[j] XOR xi)` for all `j` such that `nums[j] <= mi`. If all elements in `nums` are larger than `mi`, then the answer is `-1`.

Return _an integer array_ `answer` _where_ `answer.length == queries.length` _and_ `answer[i]` _is the answer to the_ `i`-th _query._

**Example 1:**

```text
Input:  nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]
Output: [3,3,7]
Explanation:
1) 0 and 1 are the only two integers not greater than 1. 0 XOR 3 = 3 and 1 XOR 3 = 2. The larger of the two is 3.
2) 1 XOR 2 = 3.
3) 5 XOR 2 = 7.
```

**Example 2:**

```text
Input:  nums = [5,2,4,6,6,3], queries = [[12,4],[8,1],[6,3]]
Output: [15,-1,5]
```

**Constraints:**

- $1 \le$ `nums.length`, `queries.length` $\le 10^5$
- `queries[i].length == 2`
- $0 \le$ `nums[j]`, `xi`, `mi` $\le 10^9$

## Solution approach

### Intuition

Without the limit `mi`, each query is [Maximum XOR of Two Numbers in an Array](/docs/codes/maximum-xor-of-two-numbers-in-an-array/): put the numbers into a binary trie and, for `xi`, walk from the highest bit down, preferring the child with the opposite bit at every level. Higher bits dominate lower ones, so this greedy walk finds the best partner.

The limit says only numbers `<= mi` may take part. Rebuilding a trie per query would be far too slow, but the queries do not have to be answered in the given order. **Sort them by `mi`** (remembering each one's original index) and sort `nums`. As we sweep the queries with growing `mi`, the set of allowed numbers only grows — it is always a prefix of sorted `nums`. So each number is inserted into the trie exactly once, just before the first query whose limit admits it, and every query sees exactly the allowed numbers.

### Algorithm

1. Sort `nums`. Build `order`, the query indices sorted by `mi`.
2. Keep a pointer `i` into `nums`. For each query index `k` in `order`:
   - While `i < n` and `nums[i] <= m`, insert `nums[i]` into the trie and advance `i`.
   - If `i == 0`, nothing is allowed: `answer[k] = -1`.
   - Otherwise walk the trie for `x`: at bit `b`, take the child `1 - ((x >> b) & 1)` if it exists (setting bit `b` of the result), else the other child. Store the result in `answer[k]`.
3. Return `answer`.

Values are at most $10^9 < 2^{30}$, so bits `29..0` are enough.

### Walkthrough

Example 2: sorted `nums = [2,3,4,5,6,6]`, queries in order of `m` are `[8,1]`, `[6,3]`, `[12,4]`. Green numbers are in the trie:

![Offline sweep over queries sorted by m for Example 2](/img/codes/maximum-xor-with-an-element-from-array/offline.gif)

### Complexity

- **Time:** $O(n \log n + q \log q + (n + q) \log M)$ — two sorts, then one 30-step trie walk per insertion and per query ($M = 2^{30}$).
- **Space:** $O(n \log M + q)$ — at most 30 trie nodes per number, plus `order` and `answer`.

### Edge cases

- **All numbers larger than `mi`** (`[8,1]` in Example 2): no number has been inserted yet, so `i == 0` and the answer is `-1`.
- **Equal limits:** the inner `while` uses `<=`, so a number equal to `mi` is allowed.
- **Duplicates in `nums`** share one trie path and do not affect the answer.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
        const int HIGH = 29;  // all values are at most 1e9 < 2^30
        sort(nums.begin(), nums.end());
        int n = nums.size(), q = queries.size();
        vector<int> order(q);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return queries[a][1] < queries[b][1]; });

        vector<array<int, 2>> trie(1, {0, 0});  // node 0 is the root; child 0 means "none"
        trie.reserve(n * (HIGH + 1) + 1);
        auto insert = [&](int v) {
            int node = 0;
            for (int b = HIGH; b >= 0; --b) {
                int bit = (v >> b) & 1;
                if (!trie[node][bit]) {
                    trie[node][bit] = trie.size();
                    trie.push_back({0, 0});
                }
                node = trie[node][bit];
            }
        };
        auto bestXor = [&](int x) {
            int node = 0, res = 0;
            for (int b = HIGH; b >= 0; --b) {
                int want = 1 - ((x >> b) & 1);
                if (trie[node][want]) {
                    res |= 1 << b;
                    node = trie[node][want];
                } else {
                    node = trie[node][1 - want];
                }
            }
            return res;
        };

        vector<int> answer(q);
        int i = 0;
        for (int k : order) {
            int x = queries[k][0], m = queries[k][1];
            while (i < n && nums[i] <= m) insert(nums[i++]);
            answer[k] = (i == 0) ? -1 : bestXor(x);
        }
        return answer;
    }
};
```
