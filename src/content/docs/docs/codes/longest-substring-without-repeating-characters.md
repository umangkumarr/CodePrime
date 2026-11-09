---
title: "Longest Substring Without Repeating Characters"
description: "Find the length of the longest substring with no repeated character in one pass, using a sliding window that jumps past the last occurrence."
source: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
difficulty: "Medium"
tags: ["Hash Table", "String", "Sliding Window"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given a string `s`, find the length of the **longest substring** without duplicate characters.

**Example 1:**

```text
Input:  s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.
```

**Example 2:**

```text
Input:  s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

**Example 3:**

```text
Input:  s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

**Constraints:**

- $0 \le$ `s.length` $\le 10^5$
- `s` consists of English letters, digits, symbols and spaces.

## Solution approach

### Intuition

Keep a window `s[left .. right]` that never contains a repeated character, and grow it one character at a time on the right. When the new character `c = s[right]` already occurs inside the window, every window that contains both copies is invalid, so the left edge must move just past the earlier copy. Nothing to the left of that copy can be part of a valid window ending at `right`, so we never need to move `left` backwards.

Instead of shrinking the window one step at a time, remember `last[c]`, the most recent index of every character. Then `left` can jump straight to `last[c] + 1` — but only if that copy is inside the window (`last[c] >= left`); an older copy to the left of the window is irrelevant.

Every window `s[left .. right]` is the longest valid substring ending at `right`, so the maximum of their lengths is the answer.

### Algorithm

1. `last` is an array of 256 entries, all `-1`; `left = 0`, `best = 0`.
2. For each `right` from `0` to `n - 1`, with `c = (unsigned char)s[right]`:
   - If `last[c] >= left`, set `left = last[c] + 1`.
   - Set `last[c] = right`.
   - Update `best = max(best, right - left + 1)`.
3. Return `best`.

### Walkthrough

The blue cells are the current window; orange marks the earlier copy that forces `left` to jump:

![Sliding window on "abcabcbb"](/img/codes/longest-substring-without-repeating-characters/window.gif)

### Complexity

- **Time:** $O(n)$ — `right` visits each index once and all other work per step is $O(1)$.
- **Space:** $O(1)$ — a fixed array of 256 indices, independent of `n`.

### Edge cases

- **Empty string:** the loop never runs and `best` is `0`.
- **All characters equal** (Example 2): `left` jumps to `right` every step, so the window length stays `1`.
- **Old copy outside the window:** in `"abba"`, at the final `a` its previous index `0` is left of `left = 2`, so the `last[c] >= left` check keeps `left` from moving backwards.
- **Characters outside 0-127:** the cast to `unsigned char` keeps the array index non-negative.

## Code

```cpp title="C++"
class Solution {
   public:
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);  // last index of each character
        int left = 0, best = 0;
        for (int right = 0; right < (int)s.size(); right++) {
            unsigned char c = s[right];
            if (last[c] >= left) left = last[c] + 1;
            last[c] = right;
            best = max(best, right - left + 1);
        }
        return best;
    }
};
```
