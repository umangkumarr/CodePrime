---
title: "Maximum XOR With an Element From Array"
description: "You are given an array nums consisting of non-negative integers. You are also given a queries array, where queries[i] = [xi, mi]. The answer to the ith…"
source: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/"
tags: ["Array", "Bit Manipulation", "Trie"]
complexity:
  time: "O(n \\log n + q \\log q + 31(n + q))"
  space: "O(31 \\cdot n + q)"
---

## Problem

<p>You are given an array <code>nums</code> consisting of non-negative integers. You are also given a <code>queries</code> array, where <code>queries[i] = [xi, mi]</code>.</p>

<p>The answer to the <code>ith</code> query is the maximum bitwise <code>XOR</code> value of <code>xi</code> and any element of <code>nums</code> that does not exceed <code>mi</code>. In other words, the answer is <code>max(nums[j] XOR xi)</code> for all <code>j</code> such that <code>nums[j] &lt;= mi</code>. If all elements in <code>nums</code> are larger than <code>mi</code>, then the answer is <code>-1</code>.</p>

<p>Return <em>an integer array </em><code>answer</code><em> where </em><code>answer.length == queries.length</code><em> and </em><code>answer[i]</code><em> is the answer to the </em><code>ith</code><em> query.</em></p>

## Solution approach

### Intuition

Without the limit `m`, each query is the classic "maximum XOR with a trie" problem: walk from the highest bit down and prefer the opposite bit at every level. The limit means only numbers `<= m` may be in the trie. Answer the queries offline, sorted by `m`: as `m` grows, insert the numbers that have just become allowed, so each number is inserted only once.

Checking every number for every query would cost $O(n \cdot q)$; sorting both lists avoids that.

### Algorithm

1. Append each query's original index and swap its two values, so each query becomes `[m, x, idx]`. Sort `queries` by `m`, and sort `nums`.
2. For each query `j`, insert every `nums[i] <= queries[j][0]` into the trie with `insert`, which creates a path over bits `30` to `0`.
3. If no number has been inserted (`i == 0`), the answer is `-1`. Otherwise `query(queries[j][1])` walks the trie, taking the child `v[bit == 0]` (the opposite bit) when it exists and adding `1 << i` to the result.
4. Store the answer at `ans[queries[j][2]]` so the results come back in the original order.

### Complexity

- **Time:** $O(n \log n + q \log q + 31(n + q))$ — two sorts, then one 31-step trie walk per insertion and per query.
- **Space:** $O(31 \cdot n + q)$ — the trie nodes plus the answer array.

### Edge cases

- **All numbers larger than `m`**: nothing has been inserted yet, so the answer is `-1`.

## Code

```cpp title="C++"
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
