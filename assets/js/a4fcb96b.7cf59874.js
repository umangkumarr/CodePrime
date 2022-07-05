"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3738],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=u(r),m=a,b=p["".concat(i,".").concat(m)]||p[m]||d[m]||o;return r?n.createElement(b,l(l({ref:t},c),{},{components:r})):n.createElement(b,l({ref:t},c))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var u=2;u<o;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(7294);const a=function(e){let{children:t,hidden:r,className:a}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),a=r(7294),o=r(2389),l=r(5773),s=r(6010);const i="tabItem_LplD";function u(e){var t,r,o;const{lazy:u,block:c,defaultValue:d,values:p,groupId:m,className:b}=e,f=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:f.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),h=(0,l.lx)(v,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(r=f.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:k}=(0,l.UB)(),[w,O]=(0,a.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:N}=(0,l.o5)();if(null!=m){const e=g[m];null!=e&&e!==w&&v.some((t=>t.value===e))&&O(e)}const E=e=>{const t=e.currentTarget,r=T.indexOf(t),n=v[r].value;n!==w&&(N(t),O(n),null!=m&&k(m,n))},x=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":c},b)},v.map((e=>{let{value:t,label:r,attributes:o}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:x,onFocus:E,onClick:E},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),u?(0,a.cloneElement)(f.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,o.Z)();return a.createElement(u,(0,n.Z)({key:String(t)},e))}},6112:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>u,toc:()=>c,default:()=>p});var n=r(7462),a=(r(7294),r(3905)),o=r(9877),l=r(8215);const s={displayed_sidebar:null,sidebar_position:25,tags:["Linked List","Math","Recursion"],displayed_sidebars:null},i="Add Two Numbers",u={unversionedId:"codes/add-two-numbers",id:"codes/add-two-numbers",title:"Add Two Numbers",description:"Problem",source:"@site/docs/codes/add-two-numbers.md",sourceDirName:"codes",slug:"/codes/add-two-numbers",permalink:"/CodePrime/docs/codes/add-two-numbers",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/add-two-numbers.md",tags:[{label:"Linked List",permalink:"/CodePrime/docs/tags/linked-list"},{label:"Math",permalink:"/CodePrime/docs/tags/math"},{label:"Recursion",permalink:"/CodePrime/docs/tags/recursion"}],version:"current",sidebarPosition:25,frontMatter:{displayed_sidebar:null,sidebar_position:25,tags:["Linked List","Math","Recursion"],displayed_sidebars:null}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:c};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"add-two-numbers"},"Add Two Numbers"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/add-two-numbers/"},"Problem")),(0,a.kt)("p",null,"You are given two ",(0,a.kt)("strong",null,"non-empty")," linked lists representing two non-negative integers. The digits are stored in ",(0,a.kt)("strong",null,"reverse order"),", and each of their nodes contains a single digit. Add the two numbers and return the sum\xa0as a linked list."),(0,a.kt)("p",null,"You may assume the two numbers do not contain any leading zero, except the number 0 itself."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        int carry = 0;\n        ListNode root(0), *p = &root;\n        while (l1 || l2 || carry) {\n            int sm = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;\n            p->next = new ListNode(sm % 10);\n            carry = sm / 10;\n            l1 = (l1 ? l1->next : l1);\n            l2 = (l2 ? l2->next : l2);\n            p = p->next;\n        }\n        return root.next;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);