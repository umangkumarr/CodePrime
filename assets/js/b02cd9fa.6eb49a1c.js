"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7038],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var i=r.createContext({}),u=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(i.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,l=e.mdxType,o=e.originalType,i=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),p=u(n),m=l,f=p["".concat(i,".").concat(m)]||p[m]||d[m]||o;return n?r.createElement(f,s(s({ref:t},c),{},{components:n})):r.createElement(f,s({ref:t},c))}));function m(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var o=n.length,s=new Array(o);s[0]=p;var a={};for(var i in t)hasOwnProperty.call(t,i)&&(a[i]=t[i]);a.originalType=e,a.mdxType="string"==typeof e?e:l,s[1]=a;for(var u=2;u<o;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(7294),l=n(4334);const o="tabItem_Ymn6";function s(e){let{children:t,hidden:n,className:s}=e;return r.createElement("div",{role:"tabpanel",className:(0,l.Z)(o,s),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>m});var r=n(3117),l=n(7294),o=n(4334),s=n(2389),a=n(7392),i=n(7094),u=n(2466);const c="tabList__CuJ",d="tabItem_LNqP";function p(e){var t,n;const{lazy:s,block:p,defaultValue:m,values:f,groupId:b,className:h}=e,v=l.Children.map(e.children,(e=>{if((0,l.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=f?f:v.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),y=(0,a.l)(g,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===m?m:null!=(t=null!=m?m:null==(n=v.find((e=>e.props.default)))?void 0:n.props.value)?t:v[0].props.value;if(null!==k&&!g.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:L}=(0,i.U)(),[N,O]=(0,l.useState)(k),T=[],{blockElementScrollPositionUntilNextRender:x}=(0,u.o5)();if(null!=b){const e=w[b];null!=e&&e!==N&&g.some((t=>t.value===e))&&O(e)}const E=e=>{const t=e.currentTarget,n=T.indexOf(t),r=g[n].value;r!==N&&(x(t),O(r),null!=b&&L(b,String(r)))},P=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var r;const t=T.indexOf(e.currentTarget)+1;n=null!=(r=T[t])?r:T[0];break}case"ArrowLeft":{var l;const t=T.indexOf(e.currentTarget)-1;n=null!=(l=T[t])?l:T[T.length-1];break}}null==(t=n)||t.focus()};return l.createElement("div",{className:(0,o.Z)("tabs-container",c)},l.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},h)},g.map((e=>{let{value:t,label:n,attributes:s}=e;return l.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>T.push(e),onKeyDown:P,onFocus:E,onClick:E},s,{className:(0,o.Z)("tabs__item",d,null==s?void 0:s.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),s?(0,l.cloneElement)(v.filter((e=>e.props.value===N))[0],{className:"margin-top--md"}):l.createElement("div",{className:"margin-top--md"},v.map(((e,t)=>(0,l.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function m(e){const t=(0,s.Z)();return l.createElement(p,(0,r.Z)({key:String(t)},e))}},2521:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>u,toc:()=>d});var r=n(3117),l=(n(7294),n(3905)),o=n(5488),s=n(5162);const a={sidebar_position:29,tags:["Linked List","Recursion"]},i="Merge Two Sorted Lists",u={unversionedId:"codes/merge-two-sorted-lists",id:"codes/merge-two-sorted-lists",title:"Merge Two Sorted Lists",description:"Problem",source:"@site/docs/codes/merge-two-sorted-lists.md",sourceDirName:"codes",slug:"/codes/merge-two-sorted-lists",permalink:"/CodePrime/docs/codes/merge-two-sorted-lists",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/merge-two-sorted-lists.md",tags:[{label:"Linked List",permalink:"/CodePrime/docs/tags/linked-list"},{label:"Recursion",permalink:"/CodePrime/docs/tags/recursion"}],version:"current",sidebarPosition:29,frontMatter:{sidebar_position:29,tags:["Linked List","Recursion"]},sidebar:"Leetcode",previous:{title:"Middle of the Linked List",permalink:"/CodePrime/docs/codes/middle-of-the-linked-list"},next:{title:"Remove Nth Node From End of List",permalink:"/CodePrime/docs/codes/remove-nth-node-from-end-of-list"}},c={},d=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],p={toc:d};function m(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"merge-two-sorted-lists"},"Merge Two Sorted Lists"),(0,l.kt)("h2",{id:"problem"},(0,l.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/merge-two-sorted-lists/"},"Problem")),(0,l.kt)("p",null,"You are given the heads of two sorted linked lists ",(0,l.kt)("code",null,"list1")," and ",(0,l.kt)("code",null,"list2"),"."),(0,l.kt)("p",null,"Merge the two lists in a one ",(0,l.kt)("strong",null,"sorted")," list. The list should be made by splicing together the nodes of the first two lists."),(0,l.kt)("p",null,"Return ",(0,l.kt)("em",null,"the head of the merged linked list"),"."),(0,l.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Click - to see solution code"),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        if (list1 == NULL) return list2;\n        if (list2 == NULL) return list1;\n\n        if (list1->val > list2->val) swap(list1, list2);\n        ListNode* head;\n        head = (ListNode*)malloc(sizeof(ListNode*));\n        head = list1;\n\n        while (list1->next != NULL && list2 != NULL) {\n            if (list1->next->val <= list2->val) {\n                list1 = list1->next;\n                continue;\n            }\n            ListNode* temp;\n            temp = (ListNode*)malloc(sizeof(ListNode*));\n            temp = list2;\n            list2 = list2->next;\n            temp->next = list1->next;\n            list1->next = temp;\n            list1 = list1->next;\n        }\n        if (list2 != NULL) {\n            list1->next = list2;\n        }\n        return head;\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);