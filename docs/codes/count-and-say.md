---
sidebar_position : 100
tags: [String]
---

# Count and Say

## [Problem](https://leetcode.com/problems/count-and-say/)

<p>The <strong>count-and-say</strong> sequence is a sequence of digit strings defined by the recursive formula:</p>

<ul>
	<li><code>countAndSay(1) = &quot;1&quot;</code></li>
	<li><code>countAndSay(n)</code> is the way you would &quot;say&quot; the digit string from <code>countAndSay(n-1)</code>, which is then converted into a different digit string.</li>
</ul>

<p>To determine how you &quot;say&quot; a digit string, split it into the <strong>minimal</strong> number of substrings such that each substring contains exactly <strong>one</strong> unique digit. Then for each substring, say the number of digits, then say the digit. Finally, concatenate every said digit.</p>

<p>For example, the saying and conversion for digit string <code>&quot;3322251&quot;</code>:</p>
<img alt="" src="https://assets.leetcode.com/uploads/2020/10/23/countandsay.jpg" />
<p>Given a positive integer <code>n</code>, return <em>the </em><code>nth</code><em> term of the <strong>count-and-say</strong> sequence</em>.</p>

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
    string find_next(string s) {
        int cnt = 1;
        int n = s.length();
        string ss = "";
        for (int i = 1; i < n; i++) {
            if (s[i] != s[i - 1]) {
                ss.push_back(cnt + '0');
                ss.push_back(s[i - 1]);
                cnt = 0;
            }
            cnt++;
        }
        if (cnt) {
            ss.push_back(cnt + '0');
            ss.push_back(s[n - 1]);
        }
        return ss;
    }

    string countAndSay(int n) {
        if (n == 1) return "1";
        string s = find_next("1");
        for (int i = 3; i <= n; i++) {
            s = find_next(s);
        }
        return s;
    }
};

```
</TabItem>
</Tabs>

</details>
