---
sidebar_position : 177
tags: [Array, Hash Table, Bit Manipulation, Trie]
---

# Maximum XOR of Two Numbers in an Array

## [Problem](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)

<p>Given an integer array <code>nums</code>, return <em>the maximum result of </em><code>nums[i] XOR nums[j]</code>, where <code>0 &lt;= i &lt;= j &lt; n</code>.</p>

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
typedef long long ll;
ll ans = 0;
class Node {
   public:
    ll data;
    unordered_map<ll, Node*> children;
    bool terminal;

    Node(ll d) {
        data = d;
        terminal = false;
    }
};
class Trie {
    Node* root;
    ll cnt;

   public:
    Trie() {
        root = new Node(0);
        cnt = 0;
    }

    void insert(ll w) {
        Node* temp = root;
        ll a = w;
        for (ll i = 30; i >= 0; i--) {
            ll bit = 1LL << i;
            bit &= w;
            ll aa = bit >> i;
            if (temp->children.count(aa)) {
                temp = temp->children[aa];
            } else {
                Node* n = new Node(aa);
                temp->children[aa] = n;
                temp = n;
            }
        }
        temp->terminal = true;
    }

    void find(ll w) {
        Node* temp = root;
        ll ans1 = 0;
        for (ll i = 30; i >= 0; i--) {
            ll bit = 1LL << i;
            bit &= w;
            ll aa = bit >> i;
            aa ^= 1LL;
            if (temp->children.count(aa)) {
                ans1 += 1LL << i;
                temp = temp->children[aa];
            } else {
                temp = temp->children[aa ^ 1];
            }
        }
        ans = max(ans, ans1);
        insert(w);
    }
};

class Solution {
   public:
    int findMaximumXOR(vector<int>& nums) {
        Trie t;
        ll n = nums.size();
        if (n == 1) {
            return 0;
        }
        ans = 0;
        t.insert(nums[0]);
        for (int i = 1; i < n; i++) {
            t.find(nums[i]);
        }
        return (int)ans;
    }
};

```
</TabItem>
</Tabs>

</details>
