---
title: "Kth Largest Element in a Stream"
description: "Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.…"
source: "https://leetcode.com/problems/kth-largest-element-in-a-stream/"
tags: ["Tree", "Design", "Binary Search Tree", "Heap (Priority Queue)", "Binary Tree", "Data Stream"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Design a class to find the <code>kth</code> largest element in a stream. Note that it is the <code>kth</code> largest element in the sorted order, not the <code>kth</code> distinct element.</p>

<p>Implement <code>KthLargest</code> class:</p>

<ul>
	<li><code>KthLargest(int k, int[] nums)</code> Initializes the object with the integer <code>k</code> and the stream of integers <code>nums</code>.</li>
	<li><code>int add(int val)</code> Appends the integer <code>val</code> to the stream and returns the element representing the <code>kth</code> largest element in the stream.</li>
</ul>

## Solution approach

### Intuition

In a list of `n` numbers, the $k$-th largest is the element that would sit at index `n - k` if the list were sorted. `nth_element` (quickselect) puts exactly that element in that position without sorting the whole list, which costs linear time on average.

### Algorithm

1. The constructor stores `nums` in `num`, together with `k` and the current size `n`.
2. On `add(val)`, append `val` to `num` and increase `n`.
3. Call `nth_element` with position `num.begin() + n - k`, so the element of rank `n - k` (0-indexed, ascending) lands there.
4. Return `num[n - k]`.

### Complexity

- **Time:** $O(n)$ per `add` on average — one quickselect over all `n` stored values.
- **Space:** $O(n)$ — every value seen so far is kept in `num`.

## Code

```cpp title="C++"
class KthLargest {
    vector<int> num;
    int k;
    int n;

   public:
    KthLargest(int kk, vector<int>& nums) {
        this->num = nums;
        this->k = kk;
        this->n = nums.size();
    }

    int add(int val) {
        num.push_back(val);
        n++;
        nth_element(num.begin(), num.begin() + n - k, num.end());
        return num[n - k];
    }
};

```
