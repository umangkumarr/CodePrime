---
title: "Distinct Numbers in Window"
description: "Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.…"
source: "https://www.interviewbit.com/problems/distinct-numbers-in-window/"
tags: ["Hash Maps", "Array"]
complexity:
  time: "O(n \\log B)"
  space: "O(B)"
---

## Problem

<p>Design a class to find the <code>kth</code> largest element in a stream. Note that it is the <code>kth</code> largest element in the sorted order, not the <code>kth</code> distinct element.</p>

<p>Implement <code>KthLargest</code> class:</p>

<ul>
        <li><code>KthLargest(int k, int[] nums)</code> Initializes the object with the integer <code>k</code> and the stream of integers <code>nums</code>.</li>
        <li><code>int add(int val)</code> Appends the integer <code>val</code> to the stream and returns the element representing the <code>kth</code> largest element in the stream.</li>
</ul>

<p>&nbsp;</p>

## Solution approach

### Intuition

Recounting the distinct values of every window from scratch would cost $O(n \cdot B)$. Neighbouring windows differ by only two elements, so we keep a frequency map of the current window and update it in $O(\log B)$: add the element entering on the right and remove the one leaving on the left. The number of keys in the map is the number of distinct values.

### Algorithm

1. Insert the first `B` elements into the map `mp` (value to count) and push `mp.size()` into `ans`.
2. For `j` from `B` to `n - 1`: increment `mp[A[j]]`, decrement `mp[A[j - B]]`, and erase `A[j - B]` from `mp` if its count drops to `0`.
3. Push `mp.size()` into `ans` after each slide and return `ans`.

### Complexity

- **Time:** $O(n \log B)$ — each element is inserted once and removed at most once, and the `std::map` holds at most `B` keys.
- **Space:** $O(B)$ — the map, not counting the $n - B + 1$ answers.

### Edge cases

- **`B == n`:** only the first window exists, so `ans` has one value.
- Erasing keys whose count reaches `0` is what keeps `mp.size()` equal to the distinct count.

## Code

```cpp title="C++"
vector<int> Solution::dNums(vector<int> &A, int B) {
    map<int, int> mp;
    int n = A.size();
    for (int i = 0; i < B; i++) {
        mp[A[i]]++;
    }
    vector<int> ans;
    ans.push_back(mp.size());
    for (int j = B; j < n; j++) {
        mp[A[j]]++;
        mp[A[j - B]]--;
        if (mp[A[j - B]] == 0) {
            mp.erase(A[j - B]);
        }
        ans.push_back(mp.size());
    }
    return ans;
}

```
