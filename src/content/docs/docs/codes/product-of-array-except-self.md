---
title: "Product of Array Except Self"
description: "For each index, return the product of all other elements without division in O(n) time and O(1) extra space, combining prefix and suffix products."
source: "https://leetcode.com/problems/product-of-array-except-self/"
difficulty: "Medium"
tags: ["Array", "Prefix Sum"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an integer array `nums`, return *an array* `answer` *such that* `answer[i]` *is equal to the product of all the elements of* `nums` *except* `nums[i]`.

The product of any prefix or suffix of `nums` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in $O(n)$ time and without using the division operation.

**Example 1:**

```text
Input:  nums = [1,2,3,4]
Output: [24,12,8,6]
```

**Example 2:**

```text
Input:  nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
```

**Constraints:**

- $2 \le$ `nums.length` $\le 10^5$
- $-30 \le$ `nums[i]` $\le 30$
- The input is generated such that `answer[i]` is **guaranteed** to fit in a **32-bit** integer.

**Follow-up:** Can you solve the problem in $O(1)$ extra space complexity? (The output array **does not** count as extra space for space complexity analysis.)

## Solution approach

### Intuition

Dividing the total product by `nums[i]` is forbidden (and breaks on zeros anyway). Instead, split "everything except `nums[i]`" into two parts:

$$answer[i] = \underbrace{nums[0] \cdots nums[i-1]}_{\text{prefix product}} \times \underbrace{nums[i+1] \cdots nums[n-1]}_{\text{suffix product}}$$

Both parts can be built incrementally: the prefix product for `i + 1` is the prefix for `i` times `nums[i]`, and symmetrically for suffixes. So one left-to-right pass yields every prefix product and one right-to-left pass yields every suffix product. Zeros need no special handling because nothing is ever divided.

For the follow-up, store the prefix products directly in the output array `ans`, and keep the running suffix product in a single variable `suffix` during the second pass.

### Algorithm

1. Create `ans` of size `n` filled with `1`.
2. For `i` from `1` to `n - 1`, set `ans[i] = ans[i - 1] * nums[i - 1]`. Now `ans[i]` is the product of everything left of `i` (`ans[0] = 1`, the empty product).
3. Set `suffix = 1`. For `i` from `n - 1` down to `0`: multiply `ans[i]` by `suffix`, then multiply `suffix` by `nums[i]`. At the moment `ans[i]` is multiplied, `suffix` is the product of everything right of `i`.
4. Return `ans`.

### Walkthrough

Example 1, `nums = [1,2,3,4]`:

| `i` | `nums[i]` | prefix (after pass 1) | `suffix` used at `i` | `ans[i]` |
| --- | --- | --- | --- | --- |
| 0 | 1 | 1 | 2·3·4 = 24 | 24 |
| 1 | 2 | 1 | 3·4 = 12 | 12 |
| 2 | 3 | 1·2 = 2 | 4 | 8 |
| 3 | 4 | 1·2·3 = 6 | 1 | 6 |

### Complexity

- **Time:** $O(n)$ — two linear passes.
- **Space:** $O(1)$ extra — apart from the output array `ans`, only the `suffix` variable is used.

### Edge cases

- **One zero** (Example 2): every prefix or suffix that spans the zero is `0`, so only the zero's own position gets a non-zero value, `(-1)·1·(-3)·3 = 9`.
- **Two or more zeros**, e.g. `[0, 4, 0]`: every position's prefix or suffix contains a zero, so the result is `[0, 0, 0]`.
- **Overflow:** every value stored is a prefix product, a suffix product or an answer, all of which the problem guarantees fit in a 32-bit integer.

## Code

```cpp
class Solution {
   public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, 1);
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
};
```

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
}
```

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        ans = [1] * n
        for i in range(1, n):
            ans[i] = ans[i - 1] * nums[i - 1]
        suffix = 1
        for i in range(n - 1, -1, -1):
            ans[i] *= suffix
            suffix *= nums[i]
        return ans
```
