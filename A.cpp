class Solution {
   public:
    Node* copyRandomList(Node* head) {
        Node* temp = head;
        map<Node*, Node*> mp;
        while (temp) {
            Node* newNode = new Node(temp->val);
            mp[temp] = newNode;
            temp = temp->next;
        }
        temp = head;
        while (temp) {
            mp[temp]->next = mp[temp->next];
            mp[temp]->random = mp[temp->random];
            temp = temp->next;
        }
        return mp[head];
    }
};