---
title: "Sliding Window Maximum"
description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can…"
source: "https://leetcode.com/problems/sliding-window-maximum/"
tags: ["Array", "Queue", "Sliding Window", "Heap (Priority Queue)", "Monotonic Queue"]
complexity:
  time: "O(n \\log k)"
  space: "O(k)"
---

## Problem

<p>You are given an array of integers&nbsp;<code>nums</code>, there is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position.</p>

<p>Return <em>the max sliding window</em>.</p>

## Solution approach

### Intuition

A `std::map` keeps its keys sorted, so its last key is always the largest. If the map holds exactly the values in the current window (with counts, to handle duplicates), the window maximum is just the last key. Recomputing the maximum of each window from scratch would cost $O(k)$ per window, $O(n \cdot k)$ overall.

### Algorithm

1. Insert the first `k` values into `mp`, counting how often each occurs.
2. Push the last key of `mp` (found with `itr = mp.end(); itr--`) into `ans`.
3. For each `i` from `k` to `n - 1`: increment `mp[nums[i]]`, decrement `mp[nums[i - k]]`, and erase that key if its count drops to `0`.
4. Push the current last key of `mp` into `ans`.
5. Return `ans`.

### Complexity

- **Time:** $O(n \log k)$ — each step does a constant number of map operations on a map of at most `k` keys.
- **Space:** $O(k)$ — the map holds at most `k` distinct values (plus the output).

### Edge cases

- **Duplicate values in the window**: the counts make sure a value is only removed when its last copy leaves the window.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        map<int, int> mp;
        for (int i = 0; i < k; i++) mp[nums[i]]++;
        int n = nums.size();
        vector<int> ans;
        auto itr = mp.end();
        itr--;
        ans.push_back((*itr).first);
        for (int i = k; i < n; i++) {
            mp[nums[i]]++;
            mp[nums[i - k]]--;
            if (mp[nums[i - k]] == 0) {
                mp.erase(nums[i - k]);
            }
            itr = mp.end();
            itr--;
            ans.push_back((*itr).first);
        }

        return ans;
    }
};

```
