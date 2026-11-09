---
title: "Next Greater Element I"
description: "Answer next-greater-element queries for a subset of an array in O(n + m) by precomputing every answer with a monotonic decreasing stack and a hash map."
source: "https://leetcode.com/problems/next-greater-element-i/"
difficulty: "Easy"
tags: ["Array", "Hash Table", "Stack", "Monotonic Stack"]
complexity:
  time: "O(n + m)"
  space: "O(m)"
---

## Problem

The **next greater element** of some element `x` in an array is the **first greater** element that is **to the right** of `x` in the same array.

You are given two **distinct 0-indexed** integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.

For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the **next greater element** of `nums2[j]` in `nums2`. If there is no next greater element, then the answer for this query is `-1`.

Return *an array `ans` of length `nums1.length` such that `ans[i]` is the **next greater element** as described above.*

**Example 1:**

```text
Input:  nums1 = [4,1,2], nums2 = [1,3,4,2]
Output: [-1,3,-1]
Explanation: The next greater element for each value of nums1 is as follows:
- 4 is underlined in nums2 = [1,3,4̲,2]. There is no next greater element, so the answer is -1.
- 1 is underlined in nums2 = [1̲,3,4,2]. The next greater element is 3.
- 2 is underlined in nums2 = [1,3,4,2̲]. There is no next greater element, so the answer is -1.
```

**Example 2:**

```text
Input:  nums1 = [2,4], nums2 = [1,2,3,4]
Output: [3,-1]
Explanation: The next greater element for each value of nums1 is as follows:
- 2 is underlined in nums2 = [1,2̲,3,4]. The next greater element is 3.
- 4 is underlined in nums2 = [1,2,3,4̲]. There is no next greater element, so the answer is -1.
```

**Constraints:**

- $1 \le \text{nums1.length} \le \text{nums2.length} \le 1000$
- $0 \le \text{nums1[i]}, \text{nums2[i]} \le 10^4$
- All integers in `nums1` and `nums2` are **unique**.
- All the integers of `nums1` also appear in `nums2`.

**Follow-up:** Could you find an `O(nums1.length + nums2.length)` solution?

## Solution approach

### Intuition

Searching `nums2` separately for every query costs $O(n \cdot m)$ (with `n = nums1.length`, `m = nums2.length`). The follow-up asks for linear time, so instead we compute the next greater element of **every** value in `nums2` in one pass, store it in a hash map, and answer each query by lookup. Because all values are unique, a value identifies its position.

To compute all next greater elements in one pass, keep a stack of values that are **still waiting** for their next greater element. Those values are in **decreasing** order from bottom to top: if a larger value had come after a smaller one, the smaller one would already have found its answer and left the stack.

When a new value `x` arrives, every waiting value smaller than `x` has just met the first greater element to its right — `x` itself — because everything between them was smaller (otherwise it would have been popped earlier). So we pop them all and record `x` as their answer, then push `x` to wait for its own answer. Values still on the stack at the end have no greater element to their right.

### Algorithm

1. Create an empty stack `st` and a hash map `nge`.
2. For each `x` in `nums2`: while `st` is non-empty and `st.top() < x`, set `nge[st.top()] = x` and pop. Then push `x`.
3. For each `v` in `nums1`, append `nge[v]` if it exists, otherwise `-1`.

### Walkthrough

Example 1, scanning `nums2 = [1,3,4,2]`. Blue is the current value `x`; the `stack` line lists the values still waiting (bottom → top):

![Monotonic stack computing next greater elements of [1,3,4,2]](/img/codes/next-greater-element-i/stack.gif)

Then the queries `4, 1, 2` look up `-1, 3, -1`.

### Complexity

- **Time:** $O(n + m)$ — each element of `nums2` is pushed and popped at most once, and each query is an $O(1)$ average hash lookup.
- **Space:** $O(m)$ — the stack and the map hold at most `m` values (plus the output).

### Edge cases

- **Elements with no greater value to the right** (the maximum, or the tail of a decreasing run): they stay on the stack, never enter `nge`, and the lookup returns `-1`.
- **Increasing `nums2`** (Example 2): each value is popped by the very next one.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        unordered_map<int, int> nge;  // value -> its next greater element in nums2
        stack<int> st;                // values waiting for a greater one, decreasing
        for (int x : nums2) {
            while (!st.empty() && st.top() < x) {
                nge[st.top()] = x;
                st.pop();
            }
            st.push(x);
        }
        vector<int> ans;
        ans.reserve(nums1.size());
        for (int v : nums1) {
            auto it = nge.find(v);
            ans.push_back(it == nge.end() ? -1 : it->second);
        }
        return ans;
    }
};
```
