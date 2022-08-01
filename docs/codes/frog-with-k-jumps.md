---
sidebar_position : 1
tags: [Dynamic Programming]
displayed_sidebar: null
---

# Frog with k jumps

## [Problem](https://atcoder.jp/contests/dp/tasks/dp_b)

There are $N$ stones, numbered $1,2,…,N$. For each $i (1≤i≤N)$, the height of Stone $i$ is $h_i$.

There is a frog who is initially on Stone $1$. He will repeat the following action some number of times to reach Stone $N$:
1. If the frong is currently on stone $i$, jump to one of following: Stone $i+1,i+2,...,i+K$. Here, a cost of $|h_i-h_j|$ is incurred, where j is the stone to land on.

Find the minimum possible total cost incurred before the frog reaches Stone $N$.

## Solution Approach

Expected Time Complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
void solve() {
    cin >> n >> k;
    vl a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    vl ans(n, INT_MAX);
    ans[0] = 0;
    for (int i = 1; i < n; i++) {
        for (int j = i - 1; j >= 0 && j >= i - k; j--) {
            ans[i] = min(ans[i], abs(a[i] - a[j]) + ans[j]);
        }
    }
    cout << ans[n - 1];
}
```
</TabItem>
</Tabs>

</details>
