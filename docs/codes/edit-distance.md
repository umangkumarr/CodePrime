---
sidebar_position : 165
tags: [String, Dynamic Programming]
---

# Edit Distance

## [Problem](https://leetcode.com/problems/edit-distance/)

<p>Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of operations required to convert <code>word1</code> to <code>word2</code></em>.</p>

<p>You have the following three operations permitted on a word:</p>

<ul>
	<li>Insert a character</li>
	<li>Delete a character</li>
	<li>Replace a character</li>
</ul>

## Solution Approach

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    int minDistance(string word1, string word2) {
        int m = word1.size();
        int n = word2.size();
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, INT_MAX));

        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int i = 0; i <= m; i++) dp[0][i] = i;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                dp[i][j] = min(dp[i][j], dp[i - 1][j] + 1);
                if (word1[j - 1] == word2[i - 1])
                    dp[i][j] = min(dp[i][j], dp[i - 1][j - 1]);
                dp[i][j] = min(dp[i][j], dp[i - 1][j - 1] + 1);
                dp[i][j] = min(dp[i][j], dp[i][j - 1] + 1);
            }
        }
        return dp[n][m];
    }
};

```
</TabItem>
</Tabs>

</details>
