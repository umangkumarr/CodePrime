---
sidebar_position : 6
tags: [Stack]
---

# Next Greater Element I

## Problem Link
https://leetcode.com/problems/next-greater-element-i/

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
