---
displayed_sidebar: null
sidebar_position : 74
tags: [Array, Hash Table, Stack, Monotonic Stack]
---

# Next Greater Element I

## [Problem](https://leetcode.com/problems/next-greater-element-i/)

<p>The <strong>next greater element</strong> of some element <code>x</code> in an array is the <strong>first greater</strong> element that is <strong>to the right</strong> of <code>x</code> in the same array.</p>

<p>You are given two <strong>distinct 0-indexed</strong> integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>.</p>

<p>For each <code>0 &lt;= i &lt; nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the <strong>next greater element</strong> of <code>nums2[j]</code> in <code>nums2</code>. If there is no next greater element, then the answer for this query is <code>-1</code>.</p>

<p>Return <em>an array </em><code>ans</code><em> of length </em><code>nums1.length</code><em> such that </em><code>ans[i]</code><em> is the <strong>next greater element</strong> as described above.</em></p>

## Solution Approach
Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
