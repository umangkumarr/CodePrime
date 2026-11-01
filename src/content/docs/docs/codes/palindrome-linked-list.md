---
title: "Palindrome Linked List"
description: "Given the head of a singly linked list, return true if it is a palindrome."
source: "https://leetcode.com/problems/palindrome-linked-list/"
tags: ["Linked List", "Two Pointers", "Stack", "Recursion"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome.</p>

## Solution approach

### Intuition

A singly linked list cannot be read backwards, but an array can. Copy the values into a vector, and the list is a palindrome exactly when that vector equals its own reverse.

### Algorithm

1. Walk the list from `head` and push every `val` into the vector `a`.
2. Copy `a` into `b` and reverse `b`.
3. Return `true` if `a == b`, otherwise `false`.

### Complexity

- **Time:** $O(n)$ — one pass over the list, one reverse and one comparison.
- **Space:** $O(n)$ — the two vectors `a` and `b` each store all `n` values.

## Code

```cpp title="C++"
class Solution {
   public:
    bool isPalindrome(ListNode* head) {
        vector<int> a, b;
        while (head) {
            a.push_back(head->val);
            head = head->next;
        }
        b = a;
        reverse(b.begin(), b.end());
        if (a == b) return true;
        return false;
    }
};

```
