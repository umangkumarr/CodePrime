---
title: "Next Greater Element I"
description: "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array. You are given two…"
source: "https://leetcode.com/problems/next-greater-element-i/"
tags: ["Array", "Hash Table", "Stack", "Monotonic Stack"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n)"
---

## Problem

<p>The <strong>next greater element</strong> of some element <code>x</code> in an array is the <strong>first greater</strong> element that is <strong>to the right</strong> of <code>x</code> in the same array.</p>

<p>You are given two <strong>distinct 0-indexed</strong> integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>.</p>

<p>For each <code>0 &lt;= i &lt; nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the <strong>next greater element</strong> of <code>nums2[j]</code> in <code>nums2</code>. If there is no next greater element, then the answer for this query is <code>-1</code>.</p>

<p>Return <em>an array </em><code>ans</code><em> of length </em><code>nums1.length</code><em> such that </em><code>ans[i]</code><em> is the <strong>next greater element</strong> as described above.</em></p>

## Solution approach

### Intuition

For each value in `nums1`, find where it sits in `nums2`, then scan to the right for the first larger value. Because `nums1` is a subset of `nums2` with distinct values, that position is unique. This is the direct approach: it scans `nums2` once for every query instead of preprocessing it.

### Algorithm

1. For each `j` in `nums1`, move `indx` forward from `0` until `nums2[indx] == j`.
2. Keep moving `indx` while `nums2[indx] <= j`. If it stops inside the array, store `mp[j] = nums2[indx]`.
3. Build `ans` by looking up each value of `nums1` in `mp`, using `-1` when there is no entry.

The code block also contains two unrelated helpers, `insert` and `sortStack`, which sort a stack recursively. The `Solution` class is written inside the body of `sortStack`.

### Complexity

- **Time:** $O(n \cdot m)$ — `n = nums1.size()` and `m = nums2.size()`; each query may scan all of `nums2`.
- **Space:** $O(n)$ — the map `mp` and the output.

### Edge cases

- **No greater element**, for example the last element of `nums2`: `indx` runs off the end, nothing is stored, and the answer is `-1`.

## Code

```cpp title="C++"
void insert(int temp, stack<int>& st) {
    if (st.size() == 0) {
        st.push(temp);
        return;
    }
    if (st.top() > temp) {
        int t = st.top();
        st.pop();
        insert(temp, st);
        st.push(t);
    } else {
        st.push(temp);
    }
}
void sortStack(stack<int>& st) {
    class Solution {
       public:
        vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
            int n = nums2.size();
            unordered_map<int, int> mp;
            for (int j : nums1) {
                int indx = 0;
                while (nums2[indx] != j) indx++;
                while (indx < n && nums2[indx] <= j) indx++;
                if (indx < n) mp[j] = nums2[indx];
            }
            vector<int> ans;
            for (auto j : nums1)
                ans.push_back(mp.find(j) != mp.end() ? mp[j] : -1);
            return ans;
        }
    };
    if (st.size() == 1) return;
    int temp = st.top();
    st.pop();
    sortStack(st);
    insert(temp, st);
}

```
