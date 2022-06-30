---
sidebar_position : 4
tags: [Array, Bit Manipulation, Trie]
---

# Maximum XOR With an Element From Array

## [Problem](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/)

<p>You are given an array <code>nums</code> consisting of non-negative integers. You are also given a <code>queries</code> array, where <code>queries[i] = [xi, mi]</code>.</p>

<p>The answer to the <code>ith</code> query is the maximum bitwise <code>XOR</code> value of <code>xi</code> and any element of <code>nums</code> that does not exceed <code>mi</code>. In other words, the answer is <code>max(nums[j] XOR xi)</code> for all <code>j</code> such that <code>nums[j] &lt;= mi</code>. If all elements in <code>nums</code> are larger than <code>mi</code>, then the answer is <code>-1</code>.</p>

<p>Return <em>an integer array </em><code>answer</code><em> where </em><code>answer.length == queries.length</code><em> and </em><code>answer[i]</code><em> is the answer to the </em><code>ith</code><em> query.</em></p>

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
struct Node {
    vector<Node*> v;
    int val;
    Node(int _val) {
        v = {NULL, NULL};
        val = _val;
    }
};

class Solution {
   public:
    Node* root;

    void insert(int n) {
        Node* temp = root;
        int i = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = (n & (1 << i));
            if (temp->v[bit > 0] == NULL) {
                Node* newNode = new Node(bit > 0);
                temp->v[bit > 0] = newNode;
            }
            temp = temp->v[bit ? 1 : 0];
        }
    }

    int query(int n) {
        Node* temp = root;
        int ans = 0;
        for (int i = 30; i >= 0; i--) {
            int bit = n & (1ll << i);
            if (temp->v[bit == 0] != NULL) {
                ans += (1ll << i);
                temp = temp->v[bit == 0];
            } else
                temp = temp->v[bit != 0];
        }
        return ans;
    }

    vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {
        for (int i = 0; i < queries.size(); i++) {
            queries[i].push_back(i);
            swap(queries[i][0], queries[i][1]);
        }
        sort(queries.begin(), queries.end());
        sort(nums.begin(), nums.end());
        root = new Node(0);
        int i = 0, j = 0;
        vector<int> ans(queries.size());
        while (j < queries.size()) {
            while (i < nums.size() && nums[i] <= queries[j][0]) {
                insert(nums[i]);
                i++;
            }

            if (i == 0) {
                ans[queries[j][2]] = -1;
            } else {
                ans[queries[j][2]] = query(queries[j][1]);
            }
            j++;
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
