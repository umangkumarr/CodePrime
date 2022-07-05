---
displayed_sidebar: null
sidebar_position : 92
tags: [String]
---

# String to Integer (atoi)

## [Problem](https://leetcode.com/problems/string-to-integer-atoi/)

<p>Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer (similar to C/C++&#39;s <code>atoi</code> function).</p>

<p>The algorithm for <code>myAtoi(string s)</code> is as follows:</p>

<ol>
	<li>Read in and ignore any leading whitespace.</li>
	<li>Check if the next character (if not already at the end of the string) is <code>&#39;-&#39;</code> or <code>&#39;+&#39;</code>. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present.</li>
	<li>Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.</li>
	<li>Convert these digits into an integer (i.e. <code>&quot;123&quot; -&gt; 123</code>, <code>&quot;0032&quot; -&gt; 32</code>). If no digits were read, then the integer is <code>0</code>. Change the sign as necessary (from step 2).</li>
	<li>If the integer is out of the 32-bit signed integer range <code>[-231, 231 - 1]</code>, then clamp the integer so that it remains in the range. Specifically, integers less than <code>-231</code> should be clamped to <code>-231</code>, and integers greater than <code>231 - 1</code> should be clamped to <code>231 - 1</code>.</li>
	<li>Return the integer as the final result.</li>
</ol>

<p><strong>Note:</strong></p>

<ul>
	<li>Only the space character <code>&#39; &#39;</code> is considered a whitespace character.</li>
	<li><strong>Do not ignore</strong> any characters other than the leading whitespace or the rest of the string after the digits.</li>
</ul>

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
    int myAtoi(string s) {
        long long ans = 0;
        int n = s.length();
        int i = 0, check = 0;
        while (i < n && s[i] == ' ') i++;
        if (s[i] == '-') check = 1;
        if (s[i] == '+' || s[i] == '-') i++;
        if (!(i < n && s[i] - '0' < 10 && s[i] - '0' >= 0)) return 0;

        while (i < n && s[i] - '0' < 10 && s[i] - '0' >= 0) {
            int num = s[i++] - '0';
            ans = ans * 10 + num;
            if (ans >= 2147483647 && check == 0)
                return 2147483647;
            else if (ans >= 2147483648 && check == 1)
                return -2147483648;
        }

        if (check) ans *= -1;
        return ans;
    }
};

```
</TabItem>
</Tabs>

</details>
