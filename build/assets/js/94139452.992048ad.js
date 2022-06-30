"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3969],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>p});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(r),p=o,v=m["".concat(s,".").concat(p)]||m[p]||d[p]||a;return r?n.createElement(v,l(l({ref:t},c),{},{components:r})):n.createElement(v,l({ref:t},c))}));function p(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var u=2;u<a;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>o});var n=r(7294);const o=function(e){let{children:t,hidden:r,className:o}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:o},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),o=r(7294),a=r(2389),l=r(5773),i=r(6010);const s="tabItem_LplD";function u(e){var t,r,a;const{lazy:u,block:c,defaultValue:d,values:m,groupId:p,className:v}=e,b=o.Children.map(e.children,(e=>{if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:b.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),h=(0,l.lx)(f,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(r=b.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(a=b[0])?void 0:a.props.value;if(null!==y&&!f.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:E,setTabGroupChoices:N}=(0,l.UB)(),[g,S]=(0,o.useState)(y),k=[],{blockElementScrollPositionUntilNextRender:w}=(0,l.o5)();if(null!=p){const e=E[p];null!=e&&e!==g&&f.some((t=>t.value===e))&&S(e)}const D=e=>{const t=e.currentTarget,r=k.indexOf(t),n=f[r].value;n!==g&&(w(t),S(n),null!=p&&N(p,n))},O=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=k.indexOf(e.currentTarget)+1;r=k[t]||k[0];break}case"ArrowLeft":{const t=k.indexOf(e.currentTarget)-1;r=k[t]||k[k.length-1];break}}null==(t=r)||t.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},v)},f.map((e=>{let{value:t,label:r,attributes:a}=e;return o.createElement("li",(0,n.Z)({role:"tab",tabIndex:g===t?0:-1,"aria-selected":g===t,key:t,ref:e=>k.push(e),onKeyDown:O,onFocus:D,onClick:D},a,{className:(0,i.Z)("tabs__item",s,null==a?void 0:a.className,{"tabs__item--active":g===t})}),null!=r?r:t)}))),u?(0,o.cloneElement)(b.filter((e=>e.props.value===g))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==g})))))}function c(e){const t=(0,a.Z)();return o.createElement(u,(0,n.Z)({key:String(t)},e))}},7009:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>u,toc:()=>c,default:()=>m});var n=r(7462),o=(r(7294),r(3905)),a=r(9877),l=r(8215);const i={sidebar_position:4},s="Remove Nth Node From End of List",u={unversionedId:"Problems/StriverSDESheet/Day5/Remove Nth Node From End of List",id:"Problems/StriverSDESheet/Day5/Remove Nth Node From End of List",title:"Remove Nth Node From End of List",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day5/Remove Nth Node From End of List.md",sourceDirName:"Problems/StriverSDESheet/Day5",slug:"/Problems/StriverSDESheet/Day5/Remove Nth Node From End of List",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day5/Remove Nth Node From End of List",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day5/Remove Nth Node From End of List.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"api",previous:{title:"Merge Two Sorted Lists",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day5/Merge Two Sorted Lists"},next:{title:"Add Two Numbers",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day5/Add Two Numbers"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],d={toc:c};function m(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"remove-nth-node-from-end-of-list"},"Remove Nth Node From End of List"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/"},"https://leetcode.com/problems/remove-nth-node-from-end-of-list/")),(0,o.kt)("h2",{id:"solution-code"},"Solution Code"),(0,o.kt)(a.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        ListNode* t;\n        t = new ListNode;\n        t = head;\n        int cnt = 0;\n        while (t) {\n            cnt++;\n            t = t->next;\n        }\n        if (cnt == n) {\n            head = head->next;\n            return head;\n        }\n        n = cnt - n + 1;\n        int j = 1;\n        t = head;\n        while (j < n - 1) {\n            j++;\n            t = t->next;\n        }\n        t->next = t->next->next;\n        return head;\n    }\n};\n")))))}m.isMDXComponent=!0}}]);