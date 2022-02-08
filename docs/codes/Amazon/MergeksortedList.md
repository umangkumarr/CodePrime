# Merge k Sorted Lists

#### Tags
```LinkedList```, ```recursion```, ```implementation```

## Solution Approach
[Merge two linked list](/docs/codes/Amazon/Merge2sortedlist) and merge the third with resultant of the first two and so on.


Expected Time complexity: $O(nk)$

*Bonus: Can you solve it in $O(nlog(n))$*
<details><summary>Hint</summary>

Use priority queues
(never heard of it? [Click](https://www.programiz.com/dsa/priority-queue))

</details>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        if (list1 == NULL) return list2;
        if (list2 == NULL) return list1;

        if (list1->val > list2->val) swap(list1, list2);
        ListNode *head;
        head = (ListNode*)malloc(sizeof(ListNode*));
        head = list1;

        while (list1->next != NULL && list2 != NULL) {
            if (list1->next->val <= list2->val) {
                list1 = list1->next;
                continue;
            }
            ListNode *temp;
            temp = (ListNode*)malloc(sizeof(ListNode*));
            temp = list2;
            list2 = list2->next;
            temp->next = list1->next;
            list1->next = temp;
            list1 = list1->next;
        }
        if (list2 != NULL) {
            list1->next = list2;
        }
        return head;
    }
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        ListNode *head;
        head = (ListNode*)malloc(sizeof(ListNode*));

        if (lists.size() == 0) {
            head = NULL;
            return head;
        }

        head = lists[0];
        for (int i = 1; i < lists.size(); i++) {
            head = mergeTwoLists(head, lists[i]);
        }
        return head;
    }
};        
```
</TabItem>
</Tabs>

</details>