"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[388],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(n),m=o,f=p["".concat(s,".").concat(m)]||p[m]||d[m]||a;return n?r.createElement(f,l(l({ref:t},u),{},{components:n})):r.createElement(f,l({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var c=2;c<a;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(7294);const o=function(e){let{children:t,hidden:n,className:o}=e;return r.createElement("div",{role:"tabpanel",hidden:n,className:o},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>u});var r=n(7462),o=n(7294),a=n(2389),l=n(5773),i=n(6010);const s="tabItem_LplD";function c(e){var t,n,a;const{lazy:c,block:u,defaultValue:d,values:p,groupId:m,className:f}=e,h=o.Children.map(e.children,(e=>{if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:h.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),b=(0,l.lx)(v,((e,t)=>e.value===t.value));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(a=h[0])?void 0:a.props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,l.UB)(),[w,O]=(0,o.useState)(y),E=[],{blockElementScrollPositionUntilNextRender:N}=(0,l.o5)();if(null!=m){const e=k[m];null!=e&&e!==w&&v.some((t=>t.value===e))&&O(e)}const T=e=>{const t=e.currentTarget,n=E.indexOf(t),r=v[n].value;r!==w&&(N(t),O(r),null!=m&&g(m,r))},x=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=E.indexOf(e.currentTarget)+1;n=E[t]||E[0];break}case"ArrowLeft":{const t=E.indexOf(e.currentTarget)-1;n=E[t]||E[E.length-1];break}}null==(t=n)||t.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},f)},v.map((e=>{let{value:t,label:n,attributes:a}=e;return o.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>E.push(e),onKeyDown:x,onFocus:T,onClick:T},a,{className:(0,i.Z)("tabs__item",s,null==a?void 0:a.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),c?(0,o.cloneElement)(h.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function u(e){const t=(0,a.Z)();return o.createElement(c,(0,r.Z)({key:String(t)},e))}},9110:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>c,toc:()=>u,default:()=>p});var r=n(7462),o=(n(7294),n(3905)),a=n(9877),l=n(8215);const i={displayed_sidebar:null,sidebar_position:30,tags:["Linked List","Two Pointers"]},s="Remove Nth Node From End of List",c={unversionedId:"codes/remove-nth-node-from-end-of-list",id:"codes/remove-nth-node-from-end-of-list",title:"Remove Nth Node From End of List",description:"Problem",source:"@site/docs/codes/remove-nth-node-from-end-of-list.md",sourceDirName:"codes",slug:"/codes/remove-nth-node-from-end-of-list",permalink:"/docs/codes/remove-nth-node-from-end-of-list",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/remove-nth-node-from-end-of-list.md",tags:[{label:"Linked List",permalink:"/docs/tags/linked-list"},{label:"Two Pointers",permalink:"/docs/tags/two-pointers"}],version:"current",sidebarPosition:30,frontMatter:{displayed_sidebar:null,sidebar_position:30,tags:["Linked List","Two Pointers"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:u};function p(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"remove-nth-node-from-end-of-list"},"Remove Nth Node From End of List"),(0,o.kt)("h2",{id:"problem"},(0,o.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/"},"Problem")),(0,o.kt)("p",null,"Given the ",(0,o.kt)("code",null,"head")," of a linked list, remove the ",(0,o.kt)("code",null,"nth")," node from the end of the list and return its head."),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(a.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        ListNode* t;\n        t = new ListNode;\n        t = head;\n        int cnt = 0;\n        while (t) {\n            cnt++;\n            t = t->next;\n        }\n        if (cnt == n) {\n            head = head->next;\n            return head;\n        }\n        n = cnt - n + 1;\n        int j = 1;\n        t = head;\n        while (j < n - 1) {\n            j++;\n            t = t->next;\n        }\n        t->next = t->next->next;\n        return head;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);