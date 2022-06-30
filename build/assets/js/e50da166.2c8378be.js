"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5259],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,l=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=u(r),m=o,b=p["".concat(s,".").concat(m)]||p[m]||d[m]||l;return r?n.createElement(b,a(a({ref:t},c),{},{components:r})):n.createElement(b,a({ref:t},c))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=r.length,a=new Array(l);a[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var u=2;u<l;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>o});var n=r(7294);const o=function(e){let{children:t,hidden:r,className:o}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:o},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),o=r(7294),l=r(2389),a=r(5773),i=r(6010);const s="tabItem_LplD";function u(e){var t,r,l;const{lazy:u,block:c,defaultValue:d,values:p,groupId:m,className:b}=e,v=o.Children.map(e.children,(e=>{if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:v.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),h=(0,a.lx)(f,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(r=v.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(l=v[0])?void 0:l.props.value;if(null!==y&&!f.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:D}=(0,a.UB)(),[g,S]=(0,o.useState)(y),E=[],{blockElementScrollPositionUntilNextRender:w}=(0,a.o5)();if(null!=m){const e=k[m];null!=e&&e!==g&&f.some((t=>t.value===e))&&S(e)}const N=e=>{const t=e.currentTarget,r=E.indexOf(t),n=f[r].value;n!==g&&(w(t),S(n),null!=m&&D(m,n))},O=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=E.indexOf(e.currentTarget)+1;r=E[t]||E[0];break}case"ArrowLeft":{const t=E.indexOf(e.currentTarget)-1;r=E[t]||E[E.length-1];break}}null==(t=r)||t.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},b)},f.map((e=>{let{value:t,label:r,attributes:l}=e;return o.createElement("li",(0,n.Z)({role:"tab",tabIndex:g===t?0:-1,"aria-selected":g===t,key:t,ref:e=>E.push(e),onKeyDown:O,onFocus:N,onClick:N},l,{className:(0,i.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":g===t})}),null!=r?r:t)}))),u?(0,o.cloneElement)(v.filter((e=>e.props.value===g))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},v.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==g})))))}function c(e){const t=(0,l.Z)();return o.createElement(u,(0,n.Z)({key:String(t)},e))}},6724:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>u,toc:()=>c,default:()=>p});var n=r(7462),o=(r(7294),r(3905)),l=r(9877),a=r(8215);const i={sidebar_position:6},s="Delete Node in a Linked List",u={unversionedId:"Problems/StriverSDESheet/Day5/Delete Node in a Linked List",id:"Problems/StriverSDESheet/Day5/Delete Node in a Linked List",title:"Delete Node in a Linked List",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day5/Delete Node in a Linked List.md",sourceDirName:"Problems/StriverSDESheet/Day5",slug:"/Problems/StriverSDESheet/Day5/Delete Node in a Linked List",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day5/Delete Node in a Linked List",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day5/Delete Node in a Linked List.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"api",previous:{title:"Add Two Numbers",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day5/Add Two Numbers"},next:{title:"Intersection of Two Linked Lists",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day6/Intersection of Two Linked Lists"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],d={toc:c};function p(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"delete-node-in-a-linked-list"},"Delete Node in a Linked List"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/delete-node-in-a-linked-list/"},"https://leetcode.com/problems/delete-node-in-a-linked-list/")),(0,o.kt)("h2",{id:"solution-code"},"Solution Code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(a.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\npublic:\n    void deleteNode(ListNode* node) {\n        *node = *node->next;\n    }\n};\n")))))}p.isMDXComponent=!0}}]);