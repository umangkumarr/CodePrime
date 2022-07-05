---
displayed_sidebar: null
sidebar_position : 1
tags: [Bit Manipulationa, Recursion]
---

# Subset Sums

## [Problem](https://practice.geeksforgeeks.org/problems/subset-sums2234/1)

<span>Given a&nbsp;list <strong>arr</strong>&nbsp;of <strong>N</strong> integers, print sums of all subsets in it.</span>

## Solution Approach
Iterate overall possible subset. This can be done using recursion or bitmasking.

Expected Time complexity: $O(2^n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<int> subsetSums(vector<int> arr, int N) {
        vector<int> ans;
        int end = pow(2, N), sm = 0;
        for (int i = 0; i < end; i++) {
            sm = 0;
            for (int j = 0; j < N; j++) {
                int bit = (1 << j) & i;
                if (bit) sm += arr[j];
            }
            ans.push_back(sm);
        }
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
