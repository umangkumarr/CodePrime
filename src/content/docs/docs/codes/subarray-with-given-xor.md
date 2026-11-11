---
title: "Subarray with given XOR"
description: "Count the subarrays whose XOR equals B in one pass, using prefix XORs and a hash map of how often each prefix XOR has occurred."
source: "https://www.interviewbit.com/problems/subarray-with-given-xor/"
difficulty: "Medium"
tags: ["Hash Table", "Bit Manipulation", "Prefix Sum"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array of integers `A` and an integer `B`.

Find the total number of subarrays having bitwise XOR of all elements equal to `B`.

The first argument is the integer array `A`, the second is the integer `B`. Return the total number of subarrays having bitwise XOR equal to `B`.

**Example 1:**

```text
Input:  A = [4, 2, 2, 6, 4], B = 6
Output: 4
Explanation: The subarrays having XOR of their elements as 6 are: [4, 2], [4, 2, 2, 6, 4], [2, 2, 6], [6].
```

**Example 2:**

```text
Input:  A = [5, 6, 7, 8, 9], B = 5
Output: 2
Explanation: The subarrays having XOR of their elements as 5 are [5] and [5, 6, 7, 8, 9].
```

**Constraints:**

- $1 \le$ length of the array $\le 10^5$
- $1 \le A[i], B \le 10^9$

## Solution approach

### Intuition

Checking every `(start, end)` pair costs $O(n^2)$. Prefix XORs turn the question into a lookup.

Let `xorr` be the XOR of `A[0..i]` and `p` the XOR of some shorter prefix `A[0..j-1]`. Because `x ^ x = 0`, the XOR of the subarray `A[j..i]` is `xorr ^ p`. That equals `B` exactly when

`p = xorr ^ B`.

So the number of good subarrays **ending at `i`** is the number of earlier prefixes whose XOR is `xorr ^ B`. If we keep a hash map `freq` counting how often each prefix XOR has occurred so far, each step is a single lookup. The empty prefix (XOR `0`) is counted once at the start so that subarrays beginning at index `0` are found too.

### Algorithm

1. Set `freq[0] = 1` (the empty prefix), `xorr = 0`, `ans = 0`.
2. For each element `a` of `A`:
   - `xorr ^= a`;
   - add `freq[xorr ^ B]` (if present) to `ans`;
   - increment `freq[xorr]`.
3. Return `ans`.

### Walkthrough

Example 1. Blue is the current element, `xorr` is the prefix XOR up to it, and `freq` holds the prefix XORs seen before it:

![Prefix XOR counting on A = [4,2,2,6,4], B = 6](/img/codes/subarray-with-given-xor/prefix-xor/01.webp)

### Complexity

- **Time:** $O(n)$ — one pass with average $O(1)$ hash-map operations.
- **Space:** $O(n)$ — the map holds at most $n + 1$ distinct prefix XORs.

### Edge cases

- **Subarray starting at index 0:** found through the initial `freq[0] = 1`.
- **Many answers:** the count can grow like $n^2 / 2$, so it is accumulated in a 64-bit integer to avoid signed overflow; the judge's return type is `int`.

## Code

```cpp
int Solution::solve(vector<int> &A, int B) {
    unordered_map<int, int> freq;  // prefix XOR -> number of prefixes with that XOR
    freq[0] = 1;
    int xorr = 0;
    long long ans = 0;
    for (int a : A) {
        xorr ^= a;
        auto it = freq.find(xorr ^ B);
        if (it != freq.end()) ans += it->second;
        freq[xorr]++;
    }
    return ans;
}
```

```java
public class Solution {
    public int solve(ArrayList<Integer> A, int B) {
        HashMap<Integer, Integer> freq = new HashMap<>();  // prefix XOR -> number of prefixes with that XOR
        freq.put(0, 1);
        int xorr = 0;
        long ans = 0;
        for (int a : A) {
            xorr ^= a;
            ans += freq.getOrDefault(xorr ^ B, 0);
            freq.merge(xorr, 1, Integer::sum);
        }
        return (int) ans;
    }
}
```

```python
from collections import defaultdict


class Solution:
    def solve(self, A, B):
        freq = defaultdict(int)  # prefix XOR -> number of prefixes with that XOR
        freq[0] = 1
        xorr = ans = 0
        for a in A:
            xorr ^= a
            ans += freq.get(xorr ^ B, 0)
            freq[xorr] += 1
        return ans
```
