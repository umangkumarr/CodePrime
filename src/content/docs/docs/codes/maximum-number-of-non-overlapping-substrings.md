---
title: "Maximum Number of Non-Overlapping Substrings"
description: "Pick the most non-overlapping substrings that each hold every occurrence of their letters: one minimal candidate per letter, then choose greedily."
source: "https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/"
difficulty: "Hard"
tags: ["Hash Table", "String", "Greedy", "Sorting"]
complexity:
  time: "O(26 \\cdot n)"
  space: "O(1)"
---

## Problem

Given a string `s` of lowercase letters, you need to find the maximum number of **non-empty** substrings of `s` that meet the following conditions:

1. The substrings do not overlap, that is for any two substrings `s[i..j]` and `s[x..y]`, either `j < x` or `i > y` is true.
2. A substring that contains a certain character `c` must also contain all occurrences of `c`.

Find _the maximum number of substrings that meet the above conditions_. If there are multiple solutions with the same number of substrings, _return the one with minimum total length._ It can be shown that there exists a unique solution of minimum total length.

Notice that you can return the substrings in **any** order.

**Example 1:**

```text
Input:  s = "adefaddaccc"
Output: ["e","f","ccc"]
Explanation: The following are all the possible substrings that meet the conditions:
[
  "adefaddaccc"
  "adefadda",
  "ef",
  "e",
  "f",
  "ccc",
]
If we choose the first string, we cannot choose anything else and we'd get only 1. If we choose "adefadda", we are left with "ccc" which is the only one that doesn't overlap, thus obtaining 2 substrings. Notice also, that it's not optimal to choose "ef" since it can be split into two. Therefore, the optimal way is to choose ["e","f","ccc"] which gives us 3 substrings. No other solution of the same number of substrings exist.
```

**Example 2:**

```text
Input:  s = "abbaccd"
Output: ["d","bb","cc"]
Explanation: Notice that while the set of substrings ["d","abba","cc"] also has length 3, it's considered incorrect since it has larger total length.
```

**Constraints:**

- $1 \le$ `s.length` $\le 10^5$
- `s` contains only lowercase English letters.

## Solution approach

### Intuition

Call a substring **closed** if it satisfies condition 2. A closed substring that contains a letter `c` must stretch at least from the first to the last occurrence of `c`, and then also over every occurrence of every other letter caught inside that range, and so on.

So for every letter `c` there is at most one **smallest** closed substring that starts exactly at `first[c]`: start with `[first[c], last[c]]` and keep widening the right end whenever a letter inside reaches further right. If some letter inside occurs _before_ `first[c]`, the substring would have to grow to the left, so no closed substring starts at `first[c]` and the letter `c` gives no candidate.

Two such candidates are always either **disjoint or nested**: if they shared a letter, each would have to contain every occurrence of it, and the closure argument then forces one to contain the other. Now:

- Every closed substring `s[a..b]` contains a candidate: the letter `s[a]` cannot occur before `a` (the substring holds all its occurrences), so its candidate starts at `a`, and the widening never leaves `[a, b]` because every letter it meets is closed inside `s[a..b]`. So replacing each chosen substring by a candidate inside it never loses count and never increases length.
- Among nested candidates, the innermost one is always the better choice — it is shorter and leaves more room.

Hence the answer is exactly the set of candidates that **contain no other candidate**. Scanning start positions from right to left and keeping a `cut` (the start of the last chosen candidate) selects them: an inner candidate has a larger start, so it is seen first, and any candidate enclosing it ends at or after `cut` and is rejected.

[![Candidates for adefaddaccc: the chosen e, f and ccc sit inside or beside the rejected outer candidates](/img/codes/maximum-number-of-non-overlapping-substrings/candidates.png)](/img/codes/maximum-number-of-non-overlapping-substrings/candidates.png)

### Algorithm

1. Record `first[c]` and `last[c]` for every letter.
2. For each letter `c` that occurs, set `r = last[c]` and scan `j` from `first[c]` while `j <= r`. If `first[s[j]] < first[c]`, the letter has no candidate; otherwise `r = max(r, last[s[j]])`. Because the loop bound is `r`, letters pulled in by the extension are checked too. Store `right[c] = r` (or `-1` for no candidate).
3. Scan `i` from `n - 1` down to `0` with `cut = n`. When `i == first[s[i]]`, the letter has a candidate and `right[s[i]] < cut`, append `s.substr(i, right[s[i]] - i + 1)` and set `cut = i`.

### Walkthrough

For `s = "adefaddaccc"` the candidates are `a → [0, 7]`, `d` has none (its range `[1, 6]` contains `a`, whose first occurrence is 0), `e → [2, 2]`, `f → [3, 3]`, `c → [8, 10]`. Scanning right to left: `c` at 8 is chosen (`cut = 8`), `f` at 3 is chosen (`cut = 3`), `e` at 2 is chosen (`cut = 2`), `a` at 0 ends at 7, which is not `< 2`, so it is rejected. Result: `["ccc","f","e"]`.

### Complexity

- **Time:** $O(26 \cdot n)$ — each of the 26 letters scans at most the whole string once, plus two linear passes.
- **Space:** $O(1)$ — three arrays of size 26, apart from the output.

### Edge cases

- **One letter fills the whole string**, such as `"aaa"`: its candidate `[0, n - 1]` is the only one and is returned.
- **Letters that never appear** have `last[c] == -1` and are skipped before the scan.
- **No letter except the first has a valid candidate** (e.g. `"abab"`): only the whole string's candidate survives, which is always valid because `s` itself is closed.

## Code

```cpp
class Solution {
   public:
    vector<string> maxNumOfSubstrings(string s) {
        int n = s.size();
        vector<int> first(26, n), last(26, -1);
        for (int i = 0; i < n; ++i) {
            int c = s[i] - 'a';
            first[c] = min(first[c], i);
            last[c] = i;
        }

        // right[c]: end of the smallest closed substring starting at first[c], or -1 if none.
        vector<int> right(26, -1);
        for (int c = 0; c < 26; ++c) {
            if (last[c] == -1) continue;
            int r = last[c];
            bool valid = true;
            for (int j = first[c]; j <= r && valid; ++j) {
                int d = s[j] - 'a';
                if (first[d] < first[c])
                    valid = false;
                else
                    r = max(r, last[d]);
            }
            if (valid) right[c] = r;
        }

        vector<string> result;
        int cut = n;  // start of the most recently chosen substring
        for (int i = n - 1; i >= 0; --i) {
            int c = s[i] - 'a';
            if (i == first[c] && right[c] != -1 && right[c] < cut) {
                result.push_back(s.substr(i, right[c] - i + 1));
                cut = i;
            }
        }
        return result;
    }
};
```

```java
class Solution {
    public List<String> maxNumOfSubstrings(String s) {
        int n = s.length();
        int[] first = new int[26], last = new int[26];
        Arrays.fill(first, n);
        Arrays.fill(last, -1);
        for (int i = 0; i < n; i++) {
            int c = s.charAt(i) - 'a';
            first[c] = Math.min(first[c], i);
            last[c] = i;
        }

        // right[c]: end of the smallest closed substring starting at first[c], or -1 if none.
        int[] right = new int[26];
        Arrays.fill(right, -1);
        for (int c = 0; c < 26; c++) {
            if (last[c] == -1) continue;
            int r = last[c];
            boolean valid = true;
            for (int j = first[c]; j <= r && valid; j++) {
                int d = s.charAt(j) - 'a';
                if (first[d] < first[c]) valid = false;
                else r = Math.max(r, last[d]);
            }
            if (valid) right[c] = r;
        }

        List<String> result = new ArrayList<>();
        int cut = n;  // start of the most recently chosen substring
        for (int i = n - 1; i >= 0; i--) {
            int c = s.charAt(i) - 'a';
            if (i == first[c] && right[c] != -1 && right[c] < cut) {
                result.add(s.substring(i, right[c] + 1));
                cut = i;
            }
        }
        return result;
    }
}
```

```python
class Solution:
    def maxNumOfSubstrings(self, s: str) -> list[str]:
        n = len(s)
        first, last = [n] * 26, [-1] * 26
        for i, ch in enumerate(s):
            c = ord(ch) - 97
            first[c] = min(first[c], i)
            last[c] = i

        # right[c]: end of the smallest closed substring starting at first[c], or -1 if none.
        right = [-1] * 26
        for c in range(26):
            if last[c] == -1:
                continue
            r, j, valid = last[c], first[c], True
            while j <= r:
                d = ord(s[j]) - 97
                if first[d] < first[c]:
                    valid = False
                    break
                r = max(r, last[d])
                j += 1
            if valid:
                right[c] = r

        result = []
        cut = n  # start of the most recently chosen substring
        for i in range(n - 1, -1, -1):
            c = ord(s[i]) - 97
            if i == first[c] and right[c] != -1 and right[c] < cut:
                result.append(s[i:right[c] + 1])
                cut = i
        return result
```
