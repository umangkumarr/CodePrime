---
title: "Maximum XOR of Two Numbers in an Array"
description: "Given an integer array nums, return the maximum result of nums[i] XOR nums[j], where 0 <= i <= j < n."
source: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/"
tags: ["Array", "Hash Table", "Bit Manipulation", "Trie"]
complexity:
  time: "O(n \\log M)"
  space: "O(n \\log M)"
---

## Problem

<p>Given an integer array <code>nums</code>, return <em>the maximum result of </em><code>nums[i] XOR nums[j]</code>, where <code>0 &lt;= i &lt;= j &lt; n</code>.</p>

## Solution approach

### Intuition

To maximise `a ^ b` for a fixed `a`, we want the highest bit of the result set first, then the next one, and so on. Store all numbers in a binary trie from bit `30` down to bit `0`. To query, walk the trie and at each level prefer the child with the opposite bit, since a differing bit there beats anything in the lower bits.

Comparing every pair would take $O(n^2)$ time; the trie answers each number in a fixed 31 steps.

### Algorithm

1. `insert(w)` walks bits `30` down to `0` of `w`, creating a `Node` in `children` for each missing bit.
2. `find(w)` walks the same bits. At each level it looks for the child `aa ^ 1` (the opposite bit). If it exists, it adds `1LL << i` to `ans1` and follows it; otherwise it follows the matching bit.
3. `find` then updates the global `ans` with `ans1` and inserts `w`, so every number is compared with all numbers before it.
4. `findMaximumXOR` returns `0` when there is one number. Otherwise it inserts `nums[0]` and calls `t.find(nums[i])` for the rest.

### Complexity

- **Time:** $O(n \log M)$ — each insert and query walks 31 bits, where `M` is the largest value, so this is effectively $O(31 \cdot n)$.
- **Space:** $O(n \log M)$ — up to 31 new trie nodes per number.

### Edge cases

- **A single number**: there is no pair, so the answer is `0`.

## Code

```cpp title="C++"
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
