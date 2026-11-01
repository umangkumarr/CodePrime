---
title: "4Sum"
description: "Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that: 0 <= a, b, c, d < n a, b,…"
source: "https://leetcode.com/problems/4sum/"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(n^3 \\log n)"
  space: "O(n^3)"
---

## Problem

<p>Given an array <code>nums</code> of <code>n</code> integers, return <em>an array of all the <strong>unique</strong> quadruplets</em> <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that:</p>

<ul>
	<li><code>0 &lt;= a, b, c, d&nbsp;&lt; n</code></li>
	<li><code>a</code>, <code>b</code>, <code>c</code>, and <code>d</code> are <strong>distinct</strong>.</li>
	<li><code>nums[a] + nums[b] + nums[c] + nums[d] == target</code></li>
</ul>

<p>You may return the answer in <strong>any order</strong>.</p>

## Solution approach

### Intuition

Fix three indices `i`, `j`, `k`; the fourth number must then equal `target - (arr[i] + arr[j] + arr[k])`. A frequency map `mp` lets us check in $O(1)$ whether that value is still available, which replaces the innermost loop of the $O(n^4)$ brute force.

To stop the fourth number from reusing one of the three chosen elements, the code decrements the count of each chosen element while it is in use and restores it afterwards. Every quadruplet is sorted and stored in a `set`, so duplicates disappear automatically.

### Algorithm

1. Count every value of `arr` in `mp`.
2. For each `i`, decrement `mp[arr[i]]`; for each `j > i`, decrement `mp[arr[j]]`; for each `k > j`, decrement `mp[arr[k]]`.
3. Compute `sm` as a `long long` sum of the three values (to avoid overflow). If `mp[target - sm]` is non-zero, build `a`, sort it, and insert it into `ans`.
4. After the `k` loop, add back every `arr[k]`; after the `j` loop, add back every `arr[j]`, so the counts are correct for the next outer iteration.
5. Copy `ans` into `res` and return it.

### Complexity

- **Time:** $O(n^3 \log n)$ — three nested loops with an $O(1)$ average map lookup, plus an ordered-`set` insertion for each match.
- **Space:** $O(n^3)$ in the worst case — `mp[target - sm]` uses `operator[]`, which inserts a zero entry for every new value it queries; the set adds one entry per unique quadruplet.

### Edge cases

- **Overflow:** values near `INT_MAX` would overflow an `int` sum, so `sm` and the map keys use `long long`.

## Code

```cpp title="C++"
#define ll long long
class Solution {
   public:
    vector<vector<int>> fourSum(vector<int>& arr, int target) {
        int n = arr.size();
        unordered_map<ll, ll> mp;
        set<vector<int>> ans;
        vector<int> a;

        for (int i = 0; i < n; i++) mp[arr[i]]++;
        for (int i = 0; i < n; i++) {
            mp[arr[i]]--;
            for (int j = i + 1; j < n; j++) {
                mp[arr[j]]--;
                for (int k = j + 1; k < n; k++) {
                    mp[arr[k]]--;
                    ll sm = (ll)arr[i] + (ll)arr[k] + (ll)arr[j];
                    if (mp[target - sm]) {
                        a = {arr[i], arr[j], arr[k], int(target - sm)};
                        sort(a.begin(), a.end());
                        ans.insert(a);
                    }
                }
                for (int k = j + 1; k < n; k++) mp[arr[k]]++;
            }
            for (int j = i + 1; j < n; j++) mp[arr[j]]++;
        }
        vector<vector<int>> res;
        for (auto i : ans) res.push_back(i);
        return res;
    }
};

```
