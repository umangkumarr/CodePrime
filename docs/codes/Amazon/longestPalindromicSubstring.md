# Longest Palindromic Substring

#### Tags
```two-pointer```, ```string-matching```, ```dynamic programming```

## Solution Approach

Use two pointer to find the palindromic substring starting at index $i$ and store the ending index(say $j$) of the current palindromic substring because the next palindromic substring of bigger length will end at any index greater than $j$.

Expected Time complexity: $O(n^2)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.length();
        if (n <= 1) {
            return s;
        }
        int mx = 0; // store max length of any palindromic substring
        int indx, last = 0;
        for (int i = 0; i < n; i++) {
            last = max(last, i);
            for (int j = n - 1; j >= last; j--) {
                int itr = j, itr1 = i;
                int len = 0;

                // check if i to j is a palindrome 
                while (itr1 <= itr && s[itr1] == s[itr]) {
                    if (itr1 != itr) len += 2;
                    else len++;
                    itr1++;
                    itr--;
                }

                // if substring i to j is a palindrome update ans
                if (itr1 >= itr && mx < len) {
                    mx = len;
                    indx = i;
                    last = max(last, j);
                }
            }
        }
        string ans = string(s.begin() + indx, s.begin() + indx + mx);
        return ans;
    }
};
```
</TabItem>
</Tabs>

</details>