---
title: "Chess Tournament"
description: "Chess tournament is going to be organized in Ninjaland. There will be C chess players going to attend the tournament. All the players will be staying in a…"
source: "https://www.codingninjas.com/codestudio/problems/chess-tournament_981299?topList=striver-sde-sheet-problems"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(n \\log n + n \\log R)"
  space: "O(n)"
---

## Problem

Chess tournament is going to be organized in Ninjaland. There will be C chess players going to attend the tournament. All the players will be staying in a hotel. The hotel has N free rooms available for the players, where one player will choose one room to live in. The ith room is at position[i] in the hotel. All rooms are in distinct positions.

Focus level of a chess player is defined as the minimum distance between his room and the room of another player. The overall focus of a tournament is defined as the minimum focus level among all players. You as an organizer obviously want the overall focus as high as possible so you assign the rooms to players such that the overall focus is as high as possible.

## Solution approach

### Intuition

This is a **binary search on the answer**, a divide-and-conquer idea combined with a greedy check. If we can seat all `c` players so that every pair is at least `d` apart, then any smaller distance is also achievable, so feasibility is monotonic in `d`. We binary search for the largest feasible `d`.

For a fixed `d`, after sorting the rooms, it is always best to put the first player in the first room and each next player in the first room that is at least `d` away from the previous player. Placing a player earlier never leaves less room for the others.

### Algorithm

1. Sort `A` and binary search `mid` between `0` and `max - min` (the largest possible gap).
2. `possible(A, n, c, mid)` walks the sorted rooms, adding each gap `abs(A[i] - A[i - 1])` to `curr_sum`. When `curr_sum` plus the next gap reaches `curr_min` (the candidate distance `mid`), it places another player (`required++`) and resets `curr_sum`.
3. If at least `c` players were placed, `mid` is feasible: store it in `ans` and search higher. Otherwise search lower.
4. Return `ans`.

### Complexity

- **Time:** $O(n \log n + n \log R)$ — sorting, then $\log R$ binary-search steps of $O(n)$ each, where $R$ is the distance between the farthest rooms.
- **Space:** $O(n)$ — `possible` receives a copy of `A` because it is passed by value.

## Code

```cpp title="C++"
bool possible(vector<int> A, int n, int c, int curr_min) {
    int required = 1;
    int curr_sum = 0;
    for (int i = 1; i < n; i++) {
        if (abs(A[i] - A[i - 1]) + curr_sum >= curr_min) {
            required++;
            curr_sum = 0;
        } else
            curr_sum += abs(A[i] - A[i - 1]);
    }
    if (required < c) return false;
    return true;
}

int chessTournament(vector<int> A, int n, int c) {
    int max = *max_element(A.begin(), A.end());
    int min = *min_element(A.begin(), A.end());
    sort(A.begin(), A.end());

    int ans = -1, mid;
    max = max - min;
    min = 0;
    while (min <= max) {
        mid = min + (max - min) / 2;
        if (possible(A, n, c, mid)) {
            ans = mid;
            min = mid + 1;
        } else
            max = mid - 1;
    }
    return ans;
}
```
