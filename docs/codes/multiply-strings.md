---
sidebar_position : 1
tags: [Math, String, Simulation]
displayed_sidebar: null
---

# Multiply Strings

## [Problem](https://leetcode.com/problems/multiply-strings/)

<p>Given two non-negative integers <code>num1</code> and <code>num2</code> represented as strings, return the product of <code>num1</code> and <code>num2</code>, also represented as a string.</p>

<p><strong>Note:</strong>&nbsp;You must not use any built-in BigInteger library or convert the inputs to integer directly.</p>

## Solution Approach

Expected Time Complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    string add(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();
        string s = "";
        int i = n - 1, j = m - 1, carry = 0;
        while (i >= 0 && j >= 0) {
            int a = (s1[i] - '0') + (s2[j] - '0') + carry;
            carry = a / 10;
            a = a % 10;
            s.push_back(a + '0');
            i--;
            j--;
        }
        while (i >= 0) {
            int a = s1[i] - '0' + carry;
            carry = a / 10;
            a = a % 10;
            s.push_back(a + '0');
            i--;
        }

        while (j >= 0) {
            int a = s2[j] - '0' + carry;
            carry = a / 10;
            a = a % 10;
            s.push_back(a + '0');
            j--;
        }

        if (carry) {
            s.push_back('0' + carry);
        }

        reverse(s.begin(), s.end());
        return s;
    }

    string multiply(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();
        if (n > m) {
            swap(s1, s2);
            swap(n, m);
        }
        reverse(s1.begin(), s1.end());
        reverse(s2.begin(), s2.end());

        int carry = 0;
        string s = "", ans = "";
        for (int i = 0; i < n; i++) {
            s = "";
            carry = 0;
            for (int k = 0; k < i; k++) s.push_back('0');
            for (int j = 0; j < m; j++) {
                int a = (s1[i] - '0') * (s2[j] - '0') + carry;
                carry = a / 10;
                a = a % 10;
                s.push_back(a + '0');
            }
            if (carry) {
                s.push_back(carry + '0');
            }
            reverse(s.begin(), s.end());
            ans = add(ans, s);
        }
        reverse(ans.begin(), ans.end());
        n = ans.length();
        int i = n - 1;
        while (i > 0 && ans[i] == '0') {
            ans.pop_back();
            i--;
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>
