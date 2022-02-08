# Two sum

## Solution Approach

Iterate over all the elements and check for the number $target - arr[i]$ exist in the array other than the index $i$.

Expected Time complexity: $O(logn)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int n = nums.size();
        unordered_map<int, vector<int>> mp;
        vector<int> ans(2);
        for(int i = 0; i < n; i++){
            mp[nums[i]].push_back(i);
        }
        for(int i = 0; i < n; i++){
            for(int j = 0; j < mp[target - nums[i]].size(); j++){
                if(mp[target - nums[i]][j] != i){
                    ans = {i, mp[target - nums[i]][j]};
                    return ans;
                }
            }
        }
        return ans;
    }
};
```
</TabItem>
</Tabs>