---
sidebar_position : 7
tags: [String, Dynamic Programming, Backtracking]
---

# Palindrome Partitioning

## [Problem](https://leetcode.com/problems/palindrome-partitioning/)

<p>Given a string <code>s</code>, partition <code>s</code> such that every substring of the partition is a <strong>palindrome</strong>. Return all possible palindrome partitioning of <code>s</code>.</p>

<p>A <strong>palindrome</strong> string is a string that reads the same backward as forward.</p>

## Solution Approach

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
        string s = "", ss;
        for (int j = indx; j < n; j++) {
            s.push_back(w[j]);
            ss = s;
            reverse(ss.begin(), ss.end());
            if (ss == s) {
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
