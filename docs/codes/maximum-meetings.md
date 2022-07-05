---
displayed_sidebar: null
sidebar_position : 1
tags: [Greedy, Sorting]
---

# Maximum Meetings

## [Problem](https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1)

<span>There is <strong>one</strong> meeting room in a firm. There are <strong>N</strong> meetings in the form of <strong>(start[i], end[i])</strong> where <strong>start[i]&nbsp;</strong>is start time of meeting <strong>i </strong>and <strong>end[i] </strong>is finish time of meeting <strong>i.</strong><br/>
What is the <strong>maximum</strong> number of meetings that can be accommodated in the meeting room when only one meeting can be held in the meeting room at a particular time? </span>
<p><span><strong>Note:</strong>&nbsp;Start time of one chosen meeting can't be equal to the end time of the other chosen meeting.</span></p>

## Solution Approach
1. Sort all pairs(Meetings) in increasing order of second number(Finish time) of each pair.
2. Select first meeting of sorted pair as the first Meeting in the room and push it into result vector and set a variable time_limit(say) with the second value(Finishing time) of the first selected meeting.
3. Iterate from the second pair to last pair of the array and if the value of the first element(Starting time of meeting) of the current pair is greater then previously selected pair finish time (time_limit) then select the current pair and update the result vector (push selected meeting number into vector) and variable time_limit.
4. Print the Order of meeting from vector.


Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int maxMeetings(int start[], int end[], int n) {
        vector<pair<int, int>> v(n);
        for (int i = 0; i < n; i++) {
            v[i] = {end[i], start[i]};
        }
        sort(v.begin(), v.end());
        int ans = 1;
        int j = 0;
        for (int i = 1; i < n; i++) {
            if (v[i].second > v[j].first) {
                ans++;
                j = i;
            }
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
