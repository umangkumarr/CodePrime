---
title: "The Celebrity Problem"
description: "Find the person known by everyone who knows no one, with fewer than 3n calls to knows(), by eliminating one non-celebrity per call and then verifying the survivor."
source: "https://www.naukri.com/code360/problems/the-celebrity-problem_982769"
difficulty: "Medium"
tags: ["Number Theory", "Two Pointers", "Graph", "Stack"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

There are `N` people at a party. Each person has been assigned a unique id between `0` and `N - 1` (both inclusive). A celebrity is a person who is known to everyone but does not know anyone at the party.

Given a helper function `knows(A, B)`, it returns `true` if the person having id `A` knows the person having id `B` in the party, `false` otherwise. Your task is to find out the celebrity at the party. Return the id of the celebrity; if there is no celebrity at the party, return `-1`.

**Note:**

1. The helper function `knows` is already implemented for you.
2. `knows(A, B)` returns `false` if `A` doesn't know `B`.
3. You should not implement the helper function `knows`, or speculate about its implementation.
4. You should minimize the number of calls to the function `knows(A, B)`.
5. There are at least 2 people at the party.
6. At most one celebrity will exist.

Complete the function `findCelebrity(int n)`.

**Example 1:**

```text
Input:  N = 2
        knows(0, 1) returns false
        knows(1, 0) returns true
Output: 0
Explanation: Person 0 does not know person 1, and person 1 knows person 0. So person 0 is known to everyone but knows no one: 0 is the celebrity.
```

**Example 2:**

```text
Input:  N = 2
        knows(0, 1) returns true
        knows(1, 0) returns true
Output: -1
Explanation: Both people know each other, so there is no celebrity.
```

**Example 3:**

```text
Input:  N = 2
        knows(0, 1) returns false
        knows(1, 0) returns false
Output: -1
Explanation: Neither person knows the other, so neither is known to everyone: there is no celebrity.
```

**Constraints:**

- $1 \le T \le 50$
- $2 \le N \le 10^4$
- Time limit: 1 sec

## Solution approach

### Intuition

Checking every person against every other costs $O(n^2)$ calls. The key observation is that **one call to `knows(a, b)` always rules out one of the two people**:

- if `a` knows `b`, then `a` knows someone, so `a` is not the celebrity;
- if `a` does not know `b`, then `b` is not known by everyone, so `b` is not the celebrity.

So we can run an elimination tournament: keep a single `candidate`, compare it with each next person, and let the loser drop out. After `n - 1` calls, only one person can still be the celebrity. They are not guaranteed to be one (maybe nobody is), so we verify them.

Verification can reuse what the elimination already proved. The final `candidate` became the candidate at step `candidate` and then "beat" every later person `i`, which means `knows(candidate, i)` was `false` for all `i > candidate`. So only `knows(candidate, i)` for `i < candidate` and `knows(i, candidate)` for every `i` still need checking.

### Algorithm

1. **Eliminate.** `candidate = 0`. For `i` from `1` to `n - 1`: if `knows(candidate, i)`, set `candidate = i`.
2. **Verify.** For every `i != candidate`:
   - if `i < candidate` and `knows(candidate, i)`, return `-1` (the candidate knows someone);
   - if `!knows(i, candidate)`, return `-1` (someone does not know the candidate).
3. Return `candidate`.

### Walkthrough

Five people, where everyone knows person `2` and person `2` knows no one. Blue is the person compared with the current candidate (orange); grey people have been eliminated:

![Eliminating non-celebrities with one knows() call each](/img/codes/the-celebrity-problem/elimination/01.webp)

### Complexity

- **Time:** $O(n)$ — at most $(n - 1) + (n - 1) + \text{candidate} < 3n$ calls to `knows`, each assumed $O(1)$.
- **Space:** $O(1)$.

### Edge cases

- **Nobody is a celebrity** (Examples 2 and 3): some person still survives the elimination, and the verification rejects them with `-1`.
- **Celebrity is person 0:** the candidate never changes, the first verification check is skipped (no `i < 0`), and only `knows(i, 0)` is verified.

## Code

```cpp
int findCelebrity(int n) {
    // Each call eliminates one person: whoever knows someone, or whoever is not known.
    int candidate = 0;
    for (int i = 1; i < n; i++) {
        if (knows(candidate, i)) candidate = i;
    }

    // knows(candidate, i) is already known to be false for every i > candidate.
    for (int i = 0; i < n; i++) {
        if (i == candidate) continue;
        if (i < candidate && knows(candidate, i)) return -1;
        if (!knows(i, candidate)) return -1;
    }
    return candidate;
}
```

```java
public class Solution {
    // The judge provides the helper as Runner.knows(A, B).
    public static int findCelebrity(int n) {
        // Each call eliminates one person: whoever knows someone, or whoever is not known.
        int candidate = 0;
        for (int i = 1; i < n; i++) {
            if (Runner.knows(candidate, i)) candidate = i;
        }

        // knows(candidate, i) is already known to be false for every i > candidate.
        for (int i = 0; i < n; i++) {
            if (i == candidate) continue;
            if (i < candidate && Runner.knows(candidate, i)) return -1;
            if (!Runner.knows(i, candidate)) return -1;
        }
        return candidate;
    }
}
```

```python
def findCelebrity(n, knows):
    # Each call eliminates one person: whoever knows someone, or whoever is not known.
    candidate = 0
    for i in range(1, n):
        if knows(candidate, i):
            candidate = i

    # knows(candidate, i) is already known to be false for every i > candidate.
    for i in range(n):
        if i == candidate:
            continue
        if i < candidate and knows(candidate, i):
            return -1
        if not knows(i, candidate):
            return -1
    return candidate
```
