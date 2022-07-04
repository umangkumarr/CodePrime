---
sidebar_position : 4
tags: [Dynamic Programming, Sorting]
---

# Fractional Knapsack

## [Problem](https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1)

<p><span>Given <em>weights</em> and <em>values</em> of <strong>N</strong> items, we need to put these items in a knapsack of capacity <strong>W</strong> to get the <em>maximum</em> total value in the knapsack.<br/>
<strong>Note:</strong> Unlike 0/1 knapsack, you are allowed to break&nbsp;the item.&nbsp;</span></p>

## Solution Approach
An efficient solution is to use the Greedy approach. The basic idea of the greedy approach is to calculate the ratio value/weight for each item and sort the item on basis of this ratio. Then take the item with the highest ratio and add them until we can’t add the next item as a whole and at the end add the next item as much as we can.

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    double fractionalKnapsack(int W, Item arr[], int n) {
        sort(arr, arr + n, [&](auto &a, auto &b) {
            return (double(a.value) / double(a.weight)) >
                   (double(b.value) / double(b.weight));
        });
        double ans = 0;
        for (int i = 0; i < n; i++) {
            if (W >= arr[i].weight) {
                W -= arr[i].weight;
                ans += arr[i].value;
            } else {
                double per_gm = double(arr[i].value) / double(arr[i].weight);
                double money = per_gm * double(W);
                ans += money;
                break;
            }
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
