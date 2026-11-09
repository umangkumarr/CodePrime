---
title: "Majority Element II"
description: "Find all elements appearing more than n/3 times in linear time and O(1) space, using the two-candidate Boyer-Moore vote and a verification pass."
source: "https://leetcode.com/problems/majority-element-ii/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "Sorting", "Counting"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an integer array of size `n`, find all elements that appear more than `⌊n / 3⌋` times.

**Example 1:**

```text
Input:  nums = [3,2,3]
Output: [3]
```

**Example 2:**

```text
Input:  nums = [1]
Output: [1]
```

**Example 3:**

```text
Input:  nums = [1,2]
Output: [1,2]
```

**Constraints:**

- $1 \le$ `nums.length` $\le 5 \times 10^4$
- $-10^9 \le$ `nums[i]` $\le 10^9$

**Follow-up:** Could you solve the problem in linear time and in `O(1)` space?

## Solution approach

### Intuition

Counting with a hash map is $O(n)$ time but $O(n)$ space. The follow-up asks for $O(1)$ space.

First, **at most two** values can appear more than $\lfloor n/3 \rfloor$ times: three such values would need more than `n` elements in total. So we only need to track two candidates.

Generalise the Boyer-Moore vote from [Majority Element](/docs/codes/majority-element/): instead of cancelling pairs of different values, cancel **triples of three different values**. Each cancellation removes three elements, one copy each of three distinct values, so there are at most $n/3$ cancellations and each removes at most one copy of a given value. A value with more than $n/3$ copies therefore survives as one of the two candidates.

The reverse is not true: a surviving candidate may just be a leftover (e.g. in `[1,2,3]` a candidate is left with no real majority). So a second pass counts the two candidates exactly and keeps only those above `n / 3`.

### Algorithm

1. Keep `cand1, cnt1` and `cand2, cnt2`, counts starting at `0`.
2. For each `x`:
   - if `cnt1 > 0` and `x == cand1`, `cnt1++`; else if `cnt2 > 0` and `x == cand2`, `cnt2++`;
   - else if `cnt1 == 0`, set `cand1 = x, cnt1 = 1`; else if `cnt2 == 0`, set `cand2 = x, cnt2 = 1`;
   - else `x` differs from both candidates: cancel a triple with `cnt1--` and `cnt2--`.
3. Count the real occurrences of `cand1` and `cand2` in a second pass, and return those that occur more than `n / 3` times (adding `cand2` only if it differs from `cand1`).

Checking "equals a live candidate" **before** "slot is empty" matters: otherwise a value already held in one slot could also be put into the other, empty slot, and both slots would track the same value.

### Walkthrough

Blue is the current element; the line below shows both candidates and counts after it is processed:

![Two-candidate vote on [1,1,1,3,3,2,2,2]](/img/codes/majority-element-ii/vote.gif)

### Complexity

- **Time:** $O(n)$ — one voting pass and one counting pass.
- **Space:** $O(1)$ — four variables, apart from the output of at most two values.

### Edge cases

- **Only one distinct value** (Example 2): `cand2` keeps its initial `0`. Every candidate is counted in the second pass, so a stale `0` is reported only if `0` really qualifies, and the `cand2 != cand1` guard stops the same value from being reported twice (e.g. `nums = [0]`).
- **Two values that both qualify** (Example 3): both candidates survive and both pass the count.
- **No value qualifies** (e.g. `[1,2,3]`): the verification pass rejects the leftover candidates and returns `[]`.

## Code

```cpp
class Solution {
   public:
    vector<int> majorityElement(vector<int>& nums) {
        int cand1 = 0, cand2 = 0, cnt1 = 0, cnt2 = 0;
        for (int x : nums) {
            if (cnt1 > 0 && x == cand1) {
                cnt1++;
            } else if (cnt2 > 0 && x == cand2) {
                cnt2++;
            } else if (cnt1 == 0) {
                cand1 = x;
                cnt1 = 1;
            } else if (cnt2 == 0) {
                cand2 = x;
                cnt2 = 1;
            } else {
                cnt1--;  // x, cand1 and cand2 are three different values: cancel them
                cnt2--;
            }
        }

        int n = nums.size();
        vector<int> ans;
        if (count(nums.begin(), nums.end(), cand1) > n / 3) ans.push_back(cand1);
        if (cand2 != cand1 && count(nums.begin(), nums.end(), cand2) > n / 3) ans.push_back(cand2);
        return ans;
    }
};
```

```java
class Solution {
    public List<Integer> majorityElement(int[] nums) {
        int cand1 = 0, cand2 = 0, cnt1 = 0, cnt2 = 0;
        for (int x : nums) {
            if (cnt1 > 0 && x == cand1) {
                cnt1++;
            } else if (cnt2 > 0 && x == cand2) {
                cnt2++;
            } else if (cnt1 == 0) {
                cand1 = x;
                cnt1 = 1;
            } else if (cnt2 == 0) {
                cand2 = x;
                cnt2 = 1;
            } else {
                cnt1--;  // x, cand1 and cand2 are three different values: cancel them
                cnt2--;
            }
        }

        int n = nums.length, c1 = 0, c2 = 0;
        for (int x : nums) {
            if (x == cand1) c1++;
            if (x == cand2) c2++;
        }
        List<Integer> ans = new ArrayList<>();
        if (c1 > n / 3) ans.add(cand1);
        if (cand2 != cand1 && c2 > n / 3) ans.add(cand2);
        return ans;
    }
}
```

```python
class Solution:
    def majorityElement(self, nums: list[int]) -> list[int]:
        cand1 = cand2 = cnt1 = cnt2 = 0
        for x in nums:
            if cnt1 > 0 and x == cand1:
                cnt1 += 1
            elif cnt2 > 0 and x == cand2:
                cnt2 += 1
            elif cnt1 == 0:
                cand1, cnt1 = x, 1
            elif cnt2 == 0:
                cand2, cnt2 = x, 1
            else:
                cnt1 -= 1  # x, cand1 and cand2 are three different values: cancel them
                cnt2 -= 1

        n = len(nums)
        ans = []
        if nums.count(cand1) > n // 3:
            ans.append(cand1)
        if cand2 != cand1 and nums.count(cand2) > n // 3:
            ans.append(cand2)
        return ans
```
