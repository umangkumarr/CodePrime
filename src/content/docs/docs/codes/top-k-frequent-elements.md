---
title: "Top K Frequent Elements"
description: "Return the k most frequent values of an array in O(n) time by counting with a hash map and then bucket-sorting the values by frequency."
source: "https://leetcode.com/problems/top-k-frequent-elements/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting", "Quickselect"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an integer array `nums` and an integer `k`, return *the* `k` *most frequent elements*. You may return the answer in **any order**.

**Example 1:**

```text
Input:  nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
```

**Example 2:**

```text
Input:  nums = [1], k = 1
Output: [1]
```

**Example 3:**

```text
Input:  nums = [1,2,1,2,1,2,3,1,3,2], k = 2
Output: [1,2]
```

**Constraints:**

- $1 \le nums.length \le 10^5$
- $-10^4 \le nums[i] \le 10^4$
- `k` is in the range `[1, the number of unique elements in the array]`.
- It is **guaranteed** that the answer is **unique**.

**Follow-up:** Your algorithm's time complexity must be better than $O(n \log n)$, where `n` is the array's size.

## Solution approach

### Intuition

First count how often each value occurs with a hash map `freq`. Sorting the distinct values by count would give the answer in $O(n \log n)$, which the follow-up rules out. A heap of size `k` gives $O(n \log k)$; we can do even better.

The trick is that a frequency is an integer between `1` and `n`. So instead of comparison-sorting by frequency we can **bucket** the values by it: `buckets[f]` holds every value that occurs exactly `f` times. Scanning the buckets from `f = n` down to `1` visits the values in decreasing order of frequency, and the first `k` values we meet are the answer. Because the answer is guaranteed to be unique, we never have to break a tie at the boundary.

### Algorithm

1. Build `freq[x]` = number of occurrences of `x` in `nums`.
2. Create `n + 1` empty buckets; for each `(x, f)` in `freq`, append `x` to `buckets[f]`.
3. For `f` from `n` down to `1`, append the values of `buckets[f]` to `ans`, stopping as soon as `ans` holds `k` values.
4. Return `ans`.

### Walkthrough

Example 3, `nums = [1,2,1,2,1,2,3,1,3,2]`, `k = 2`:

| step | state |
| --- | --- |
| count | `freq = {1: 4, 2: 4, 3: 2}` |
| bucket | `buckets[4] = [1, 2]`, `buckets[2] = [3]`, all others empty |
| scan from `f = 10` down | buckets 10 to 5 are empty; `buckets[4]` gives `1` and `2`; `ans` has `k = 2` values, stop |

Result: `[1, 2]`.

### Complexity

- **Time:** $O(n)$ — counting is one pass with average $O(1)$ hash operations, filling the buckets touches each distinct value once, and the scan visits at most `n + 1` buckets.
- **Space:** $O(n)$ — the hash map and the buckets each hold at most `n` entries.

### Edge cases

- **All values distinct:** every value lands in `buckets[1]`. Since the answer must be unique, `k` then equals the number of values, and all of them are returned.
- **Single element** (Example 2): `buckets[1] = [1]`, returned immediately.
- **Negative values:** they are only used as map keys and bucket contents, never as indices.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int x : nums) freq[x]++;

        // buckets[f] = values that occur exactly f times
        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& [x, f] : freq) buckets[f].push_back(x);

        vector<int> ans;
        for (int f = nums.size(); f >= 1 && (int)ans.size() < k; f--) {
            for (int x : buckets[f]) {
                ans.push_back(x);
                if ((int)ans.size() == k) break;
            }
        }
        return ans;
    }
};
```
