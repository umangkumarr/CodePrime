---
sidebar_position : 1
tags: [String, Greedy]
---

# Maximum Number of Non-Overlapping Substrings

## [Problem](https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/)

<p>Given a string <code>s</code> of lowercase letters, you need to find the maximum number of <strong>non-empty</strong> substrings of <code>s</code> that meet the following conditions:</p>

<ol>
	<li>The substrings do not overlap, that is for any two substrings <code>s[i..j]</code> and <code>s[x..y]</code>, either <code>j &lt; x</code> or <code>i &gt; y</code> is true.</li>
	<li>A substring that contains a certain character <code>c</code> must also contain all occurrences of <code>c</code>.</li>
</ol>

<p>Find <em>the maximum number of substrings that meet the above conditions</em>. If there are multiple solutions with the same number of substrings, <em>return the one with minimum total length. </em>It can be shown that there exists a unique solution of minimum total length.</p>

<p>Notice that you can return the substrings in <strong>any</strong> order.</p>

<p>&nbsp;</p>


## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<string> maxNumOfSubstrings(string s) {
        vector<int> start(26, INT_MAX), end(26, INT_MIN), skip(26, 0);
        vector<string> result;

        for (int i = 0; i < s.size(); ++i)
            start[s[i] - 'a'] = min(start[s[i] - 'a'], i), end[s[i] - 'a'] = i;

        for (int i = 0; i < 26; ++i)
            for (int j = start[i]; j <= end[i]; ++j)
                if (start[s[j] - 'a'] < start[i])
                    skip[i] = 1;
                else
                    end[i] = max(end[i], end[s[j] - 'a']);

        for (int i = s.size() - 1, cut = INT_MAX; i >= 0; --i)
            if (i == start[s[i] - 'a'] && end[s[i] - 'a'] < cut &&
                !skip[s[i] - 'a'])
                result.push_back(s.substr((cut = i), end[s[i] - 'a'] - i + 1));

        return result;
    }
};
```
</TabItem>
</Tabs>

</details>
