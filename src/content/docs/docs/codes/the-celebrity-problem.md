---
title: "The Celebrity Problem"
description: "There are ‘N’ people at a party. Each person has been assigned a unique id between 0 to 'N' - 1(both inclusive). A celebrity is a person who is known to…"
source: "https://www.codingninjas.com/codestudio/problems/the-celebrity-problem_982769?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website"
tags: ["Implementation", "Array"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

There are ‘N’ people at a party. Each person has been assigned a unique id between 0 to 'N' - 1(both inclusive). A celebrity is a person who is known to everyone but does not know anyone at the party.

Given a helper function ‘knows(A, B)’, It will returns "true" if the person having id ‘A’ know the person having id ‘B’ in the party, "false" otherwise. Your task is to find out the celebrity at the party. Print the id of the celebrity, if there is no celebrity at the party then print -1.

## Solution approach

### Intuition

One call to `knows(a, b)` always rules someone out: if `a` knows `b`, then `a` is not a celebrity; if not, `b` is not a celebrity. Keeping a single candidate and challenging it with every other person leaves only one possible celebrity after one pass. A second pass then checks whether that candidate really is one. Checking every pair would take $O(n^2)$ calls.

### Algorithm

1. Start with candidate `c = 0`.
2. For each `i` from `1` to `n - 1`, if `knows(c, i)`, then `c` cannot be the celebrity, so set `c = i`.
3. Verify `c`: for every `i != c`, if `c` knows `i` or `i` does not know `c`, return `-1`.
4. Otherwise return `c`.

### Complexity

- **Time:** $O(n)$ — two passes, each making $O(1)$ calls to `knows` per person.
- **Space:** $O(1)$ — only the candidate is stored.

### Edge cases

- **No celebrity**: the first pass still produces a candidate, so the verification pass is required to return `-1`.

## Code

```cpp title="C++"
int findCelebrity(int n) {
    int c = 0;
    for (int i = 1; i < n; i++) {
        if (knows(c, i) == 1) {
            c = i;
        }
    }
    for (int i = 0; i < n; i++) {
        if (i != c and (knows(c, i) == 1 or knows(i, c) == 0)) return -1;
    }
    return c;
}
```
