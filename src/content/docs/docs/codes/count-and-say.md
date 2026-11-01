---
title: "Count and Say"
description: "The count-and-say sequence is a sequence of digit strings defined by the recursive formula: countAndSay(1) = \"1\" countAndSay(n) is the way you would \"say\"…"
source: "https://leetcode.com/problems/count-and-say/"
tags: ["String"]
complexity:
  time: "O(n \\cdot L)"
  space: "O(L)"
---

## Problem

<p>The <strong>count-and-say</strong> sequence is a sequence of digit strings defined by the recursive formula:</p>

<ul>
	<li><code>countAndSay(1) = &quot;1&quot;</code></li>
	<li><code>countAndSay(n)</code> is the way you would &quot;say&quot; the digit string from <code>countAndSay(n-1)</code>, which is then converted into a different digit string.</li>
</ul>

<p>To determine how you &quot;say&quot; a digit string, split it into the <strong>minimal</strong> number of substrings such that each substring contains exactly <strong>one</strong> unique digit. Then for each substring, say the number of digits, then say the digit. Finally, concatenate every said digit.</p>

<p>For example, the saying and conversion for digit string <code>&quot;3322251&quot;</code>:</p>
<img alt="" src="https://assets.leetcode.com/uploads/2020/10/23/countandsay.jpg" />
<p>Given a positive integer <code>n</code>, return <em>the </em><code>nth</code><em> term of the <strong>count-and-say</strong> sequence</em>.</p>

## Solution approach

### Intuition

Each term is produced from the previous one by reading it aloud: split it into runs of equal digits and write each run as "count, digit". So the answer is just this transformation applied $n - 1$ times, starting from `"1"`.

A run never has more than three equal digits in this sequence, so a count always fits in a single character and `cnt + '0'` is safe.

### Algorithm

1. `find_next(s)` scans `s` from index `1`, keeping `cnt`, the length of the current run.
2. When `s[i] != s[i - 1]`, the run ends: append `cnt` and the digit `s[i - 1]` to `ss`, then start a new run.
3. After the loop, append the last run (`cnt` and `s[n - 1]`).
4. `countAndSay(n)` returns `"1"` for `n == 1`; otherwise it computes `find_next("1")` and applies `find_next` again for `i = 3` to `n`.

### Complexity

- **Time:** $O(n \cdot L)$, where $L$ is the length of the $n$-th term — each of the $n - 1$ steps scans a string no longer than $L$ (and $L$ itself grows exponentially, by roughly $1.3\times$ per term).
- **Space:** $O(L)$ — only the current and the next term are kept.

### Edge cases

- **`n == 1`:** returned directly as `"1"`.
- **`n == 2`:** the loop from `3` does not run, so the result is `find_next("1")`, i.e. `"11"`.

## Code

```cpp title="C++"
class Solution {
   public:
    string find_next(string s) {
        int cnt = 1;
        int n = s.length();
        string ss = "";
        for (int i = 1; i < n; i++) {
            if (s[i] != s[i - 1]) {
                ss.push_back(cnt + '0');
                ss.push_back(s[i - 1]);
                cnt = 0;
            }
            cnt++;
        }
        if (cnt) {
            ss.push_back(cnt + '0');
            ss.push_back(s[n - 1]);
        }
        return ss;
    }

    string countAndSay(int n) {
        if (n == 1) return "1";
        string s = find_next("1");
        for (int i = 3; i <= n; i++) {
            s = find_next(s);
        }
        return s;
    }
};

```
