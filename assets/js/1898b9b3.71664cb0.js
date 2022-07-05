"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4728],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var l=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,l,r=function(e,t){if(null==e)return{};var n,l,r={},a=Object.keys(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=l.createContext({}),c=function(e){var t=l.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return l.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},p=l.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(n),m=r,b=p["".concat(s,".").concat(m)]||p[m]||d[m]||a;return n?l.createElement(b,o(o({ref:t},u),{},{components:n})):l.createElement(b,o({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var c=2;c<a;c++)o[c]=n[c];return l.createElement.apply(null,o)}return l.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var l=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return l.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>u});var l=n(7462),r=n(7294),a=n(2389),o=n(5773),i=n(6010);const s="tabItem_LplD";function c(e){var t,n,a;const{lazy:c,block:u,defaultValue:d,values:p,groupId:m,className:b}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:h.map((e=>{let{props:{value:t,label:n,attributes:l}}=e;return{value:t,label:n,attributes:l}})),y=(0,o.lx)(f,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===d?d:null!=(t=null!=d?d:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(a=h[0])?void 0:a.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,o.UB)(),[w,O]=(0,r.useState)(v),T=[],{blockElementScrollPositionUntilNextRender:P}=(0,o.o5)();if(null!=m){const e=k[m];null!=e&&e!==w&&f.some((t=>t.value===e))&&O(e)}const E=e=>{const t=e.currentTarget,n=T.indexOf(t),l=f[n].value;l!==w&&(P(t),O(l),null!=m&&g(m,l))},x=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;n=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;n=T[t]||T[T.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},b)},f.map((e=>{let{value:t,label:n,attributes:a}=e;return r.createElement("li",(0,l.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:x,onFocus:E,onClick:E},a,{className:(0,i.Z)("tabs__item",s,null==a?void 0:a.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),c?(0,r.cloneElement)(h.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function u(e){const t=(0,a.Z)();return r.createElement(c,(0,l.Z)({key:String(t)},e))}},2247:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>c,toc:()=>u,default:()=>p});var l=n(7462),r=(n(7294),n(3905)),a=n(9877),o=n(8215);const i={displayed_sidebar:null,sidebar_position:33,tags:["Hash Table","Linked List","Two Pointers"]},s="Linked List Cycle",c={unversionedId:"codes/linked-list-cycle",id:"codes/linked-list-cycle",title:"Linked List Cycle",description:"Problem",source:"@site/docs/codes/linked-list-cycle.md",sourceDirName:"codes",slug:"/codes/linked-list-cycle",permalink:"/CodePrime/docs/codes/linked-list-cycle",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/linked-list-cycle.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Linked List",permalink:"/CodePrime/docs/tags/linked-list"},{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"}],version:"current",sidebarPosition:33,frontMatter:{displayed_sidebar:null,sidebar_position:33,tags:["Hash Table","Linked List","Two Pointers"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:u};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,l.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"linked-list-cycle"},"Linked List Cycle"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/linked-list-cycle/"},"Problem")),(0,r.kt)("p",null,"Given ",(0,r.kt)("code",null,"head"),", the head of a linked list, determine if the linked list has a cycle in it."),(0,r.kt)("p",null,"There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the\xa0",(0,r.kt)("code",null,"next"),"\xa0pointer. Internally, ",(0,r.kt)("code",null,"pos"),"\xa0is used to denote the index of the node that\xa0tail's\xa0",(0,r.kt)("code",null,"next"),"\xa0pointer is connected to.\xa0",(0,r.kt)("strong",null,"Note that\xa0",(0,r.kt)("code",null,"pos"),"\xa0is not passed as a parameter"),"."),(0,r.kt)("p",null,"Return\xa0",(0,r.kt)("code",null,"true"),(0,r.kt)("em",null," if there is a cycle in the linked list"),". Otherwise, return ",(0,r.kt)("code",null,"false"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(a.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    bool hasCycle(ListNode* head) {\n        map<ListNode*, int> mp;\n        ListNode* temp;\n        temp = head;\n        while (temp != NULL) {\n            mp[temp] = 1;\n            if (mp.find(temp->next) != mp.end()) {\n                temp->next = NULL;\n                return true;\n                break;\n            }\n            temp = temp->next;\n        }\n        return false;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);