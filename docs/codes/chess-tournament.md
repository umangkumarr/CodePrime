---
displayed_sidebar: null
sidebar_position : 8
tags: [Array, Binary Search]
---

# Chess Tournament

## [Problem](https://www.codingninjas.com/codestudio/problems/chess-tournament_981299?topList=striver-sde-sheet-problems)

Chess tournament is going to be organized in Ninjaland. There will be C chess players going to attend the tournament. All the players will be staying in a hotel. The hotel has N free rooms available for the players, where one player will choose one room to live in. The ith room is at position[i] in the hotel. All rooms are in distinct positions.

Focus level of a chess player is defined as the minimum distance between his room and the room of another player. The overall focus of a tournament is defined as the minimum focus level among all players. You as an organizer obviously want the overall focus as high as possible so you assign the rooms to players such that the overall focus is as high as possible.

## Solution Approach
Divide and Conquer and implementation.

Expected Time complexity: $O(n*log(n))$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
