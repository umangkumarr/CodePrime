---
sidebar_position: 4
---

# Maximum Binary Tree

## Problem Statement
You are given an integer array nums with no duplicates. A **maximum binary tree** can be built recursively from nums using the following algorithm:

- Create a root node whose value is the maximum value in *nums*.
- Recursively build the left subtree on the **subarray prefix** to the **left** of the maximum value.
- Recursively build the right subtree on the **subarray suffix** to the **right** of the maximum value.

Return the maximum binary tree built from *nums*.

## Example
```txt
Input: nums = [3,2,1,6,0,5]
Output: [6,3,5,null,2,0,null,null,1]

Input: nums = [3,2,1]
Output: [3,null,2,null,1]
```

## Solution
Expected Time Complexity: $(n<sup>2<sup>)$

<details><summary>Click - to see solution</summary>
We make use of a function **builtTree(nums, lo, up)**, which returns the maximum binary tree consisting of numbers within the indices *lo* and *up* in the given numsnums array.

** Algorithm **

1. Start with the function call builtTree(nums, 0, n). Here, n refers to the number of elements in the given nums array.

2. Find the index, *ind* , of the largest element in the current range of indices *(lo:up)*. Make this largest element, *nums[ ind ]* as the local root node.

3. Determine the left child using construct(nums, lo, ind-1). Doing this recursively finds the largest element in the subarray left to the current largest element.

4. Similarly, determine the right child using construct(nums, ind+1, r).

Return the root node to the calling function.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp

class Solution {
public:
    TreeNode* constructMaximumBinaryTree(vector<int>& nums) {
        return builtTree(nums,0,nums.size()-1);
    }
    
    TreeNode* builtTree(vector<int> nums,int lo,int up)
    {
        if(lo > up)
        {
            return NULL;
        }
        if(lo == up)
        {
            return new TreeNode(nums[lo]);
        }
        int ind = lo;
        for(int i=lo;i<=up;i++)
        {
            if(nums[ind] < nums[i])
            {
                ind = i;
            }
        }
        TreeNode* root = new TreeNode(nums[ind]);
        root->left = builtTree(nums,lo,ind-1);
        root->right = builtTree(nums,ind+1,up);
        return root;
    }
};
```

</TabItem>
</Tabs>
</details>


## Author
[Deepak Sharma](https://www.linkedin.com/in/deepak-sharma-66968120a/)


