---
sidebar_position : 5
tags: [String, Backtracking, Dynamic Programming]
---

# Palindrome Partitioning

## Problem Link
https://leetcode.com/problems/palindrome-partitioning/

## Solution Approach
View Backtracting take the all the possible prefix string of s and check if it is palindrome. If it is
   * add it in the arr and check for the palindrome starting after this string
   * not, check for different prefix palindrome

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
    int n;
    string w;
    vector<string> arr;
    vector<vector<string>> ans;

   public:
    void partition(int indx) {
        if (indx == n) {
            ans.push_back(arr);
            return;
        }
        string s = "", revs;
        for (int j = indx; j < n; j++) {
            s.push_back(w[j]);
            revs = s;
            reverse(revs.begin(), revs.end());
            if (revs == s) {
                arr.push_back(s);
                partition(j + 1);
                arr.pop_back();
            }
        }
    }

    vector<vector<string>> partition(string s) {
        this->n = s.length();
        this->w = s;
        partition(0);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
