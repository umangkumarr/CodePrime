---
title: "Chess Tournament"
description: "Place C players in hotel rooms to maximise the minimum distance between any two of them, using binary search on the answer with a greedy check."
source: "https://www.naukri.com/code360/problems/chess-tournament_981299"
difficulty: "Medium"
tags: ["Array", "Binary Search", "Greedy", "Sorting"]
complexity:
  time: "O(n \\log n + n \\log R)"
  space: "O(1)"
---

## Problem

Chess tournament is going to be organized in Ninjaland. There will be `C` chess players going to attend the tournament. All the players will be staying in a hotel. The hotel has `N` free rooms available for the players, where one player will choose one room to live in. The `i`-th room is at `position[i]` in the hotel. All rooms are in distinct positions.

Focus level of a chess player is defined as the minimum distance between his room and the room of another player. The overall focus of a tournament is defined as the minimum focus level among all players. You as an organizer obviously want the overall focus as high as possible so you assign the rooms to players such that the overall focus is as high as possible.

Implement `chessTournament(positions, n, c)`, which returns the maximum overall focus.

For example, with 3 players and 5 rooms at positions `1 2 3 4 6`, the optimal allocation is rooms `1 3 6` and the overall focus level is `2`.

**Example 1:**

```text
Input:  n = 5, c = 3, positions = [1, 2, 3, 4, 6]
Output: 2
Explanation: Rooms 1, 3 and 6 give pairwise gaps 2 and 3, so the minimum is 2. No allocation achieves 3.
```

**Example 2:**

```text
Input:  n = 4, c = 2, positions = [5, 4, 2, 1]
Output: 4
Explanation: With only 2 players, give them the first and last rooms, 1 and 5: 5 - 1 = 4.
```

**Example 3:**

```text
Input:  n = 6, c = 4, positions = [6, 7, 9, 13, 15, 11]
Output: 2
Explanation: There is no way to allocate rooms so that every player is 3 or more away from every other
player. One allocation with focus 2 is 6, 9, 11, 13.
```

**Constraints:**

- $1 \le T \le 10$
- $2 \le N \le 10^4$
- $2 \le C \le N$
- $1 \le$ `positions[i]` $\le 10^9$, all distinct
- Time limit: 1 second

## Solution approach

### Intuition

Turn the optimisation into a yes/no question: *can the `c` players be placed so that every two of them are at least `d` apart?*

- The answer is **monotonic** in `d`: if a placement works for `d`, the same placement works for any smaller `d`. So the feasible values form a prefix `1, 2, ..., best`, and we can **binary search** for `best`.
- The check is **greedy** once the rooms are sorted: put the first player in the leftmost room, and every next player in the first room at least `d` to the right of the previous player. Taking the earliest valid room never hurts — any valid placement can be shifted left to the greedy one room by room without breaking a gap — so if the greedy fails to seat `c` players, nothing can.

The search range is small: `d = 1` always works (positions are distinct and `c <= n`), and `d` can never exceed `(max - min) / (c - 1)`, because `c - 1` gaps of at least `d` must fit between the extreme rooms.

### Algorithm

1. Sort `positions`.
2. Binary search `mid` in `[lo, hi] = [1, (positions[n-1] - positions[0]) / (c - 1)]`.
3. `canPlace(positions, c, mid)`: seat a player at `positions[0]` (`last`), then scan right and seat a player at every `positions[i]` with `positions[i] - last >= mid`, updating `last`. Stop early once `c` players are seated; return whether `placed >= c`.
4. If `mid` is feasible, record `ans = mid` and try larger (`lo = mid + 1`); otherwise try smaller (`hi = mid - 1`).
5. Return `ans`.

### Walkthrough

Example 3 after sorting: `[6, 7, 9, 11, 13, 15]`, `c = 4`, so `hi = (15 - 6) / 3 = 3`. Green rooms hold seated players, blue is a room just taken, red a room skipped as too close to `last`:

![Binary search on the minimum distance for rooms 6 7 9 11 13 15 with 4 players](/img/codes/chess-tournament/binary-search/01.webp)

### Complexity

- **Time:** $O(n \log n + n \log R)$ — sorting, then $O(\log R)$ binary-search steps of an $O(n)$ check, where `R = max - min` is at most $10^9$ (about 30 steps).
- **Space:** $O(1)$ extra — the function receives its own copy of `positions` and sorts it in place; the check uses two variables.

### Edge cases

- **`c == 2`:** `hi = max - min`, and that distance is feasible (first and last room), as in Example 2.
- **`c == n`:** every room must be used; the answer is the smallest adjacent gap, which the search finds because larger `d` fail the greedy check.
- **Unsorted input:** handled by the initial sort (Examples 2 and 3).

## Code

```cpp
bool canPlace(const vector<int> &positions, int c, int dist) {
    int placed = 1, last = positions[0];
    for (int i = 1; i < (int)positions.size() && placed < c; i++) {
        if (positions[i] - last >= dist) {
            placed++;
            last = positions[i];
        }
    }
    return placed >= c;
}

int chessTournament(vector<int> positions, int n, int c) {
    sort(positions.begin(), positions.end());
    int lo = 1, hi = (positions[n - 1] - positions[0]) / (c - 1), ans = 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (canPlace(positions, c, mid)) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}
```

```java
public class Solution {
    private static boolean canPlace(int[] positions, int c, int dist) {
        int placed = 1, last = positions[0];
        for (int i = 1; i < positions.length && placed < c; i++) {
            if (positions[i] - last >= dist) {
                placed++;
                last = positions[i];
            }
        }
        return placed >= c;
    }

    public static int chessTournament(int[] positions, int n, int c) {
        Arrays.sort(positions);
        int lo = 1, hi = (positions[n - 1] - positions[0]) / (c - 1), ans = 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (canPlace(positions, c, mid)) {
                ans = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}
```

```python
def canPlace(positions, c, dist):
    placed, last = 1, positions[0]
    for p in positions:
        if placed >= c:
            break
        if p - last >= dist:
            placed += 1
            last = p
    return placed >= c


def chessTournament(positions, n, c):
    positions.sort()
    lo, hi, ans = 1, (positions[n - 1] - positions[0]) // (c - 1), 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if canPlace(positions, c, mid):
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
```
