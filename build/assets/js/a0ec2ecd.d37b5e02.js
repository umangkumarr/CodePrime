"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4213],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var l=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,l,r=function(e,t){if(null==e)return{};var n,l,r={},a=Object.keys(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=l.createContext({}),u=function(e){var t=l.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return l.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},p=l.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=u(n),m=r,b=p["".concat(s,".").concat(m)]||p[m]||d[m]||a;return n?l.createElement(b,o(o({ref:t},c),{},{components:n})):l.createElement(b,o({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var u=2;u<a;u++)o[u]=n[u];return l.createElement.apply(null,o)}return l.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var l=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return l.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var l=n(7462),r=n(7294),a=n(2389),o=n(5773),i=n(6010);const s="tabItem_LplD";function u(e){var t,n,a;const{lazy:u,block:c,defaultValue:d,values:p,groupId:m,className:b}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:f.map((e=>{let{props:{value:t,label:n,attributes:l}}=e;return{value:t,label:n,attributes:l}})),h=(0,o.lx)(v,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===d?d:null!=(t=null!=d?d:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(a=f[0])?void 0:a.props.value;if(null!==k&&!v.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,o.UB)(),[O,w]=(0,r.useState)(k),E=[],{blockElementScrollPositionUntilNextRender:T}=(0,o.o5)();if(null!=m){const e=y[m];null!=e&&e!==O&&v.some((t=>t.value===e))&&w(e)}const N=e=>{const t=e.currentTarget,n=E.indexOf(t),l=v[n].value;l!==O&&(T(t),w(l),null!=m&&g(m,l))},j=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=E.indexOf(e.currentTarget)+1;n=E[t]||E[0];break}case"ArrowLeft":{const t=E.indexOf(e.currentTarget)-1;n=E[t]||E[E.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},b)},v.map((e=>{let{value:t,label:n,attributes:a}=e;return r.createElement("li",(0,l.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>E.push(e),onKeyDown:j,onFocus:N,onClick:N},a,{className:(0,i.Z)("tabs__item",s,null==a?void 0:a.className,{"tabs__item--active":O===t})}),null!=n?n:t)}))),u?(0,r.cloneElement)(f.filter((e=>e.props.value===O))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function c(e){const t=(0,a.Z)();return r.createElement(u,(0,l.Z)({key:String(t)},e))}},8701:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>u,toc:()=>c,default:()=>p});var l=n(7462),r=(n(7294),n(3905)),a=n(9877),o=n(8215);const i={displayed_sidebar:null,sidebar_position:26,tags:["Linked List"]},s="Delete Node in a Linked List",u={unversionedId:"codes/delete-node-in-a-linked-list",id:"codes/delete-node-in-a-linked-list",title:"Delete Node in a Linked List",description:"Problem",source:"@site/docs/codes/delete-node-in-a-linked-list.md",sourceDirName:"codes",slug:"/codes/delete-node-in-a-linked-list",permalink:"/docs/codes/delete-node-in-a-linked-list",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/delete-node-in-a-linked-list.md",tags:[{label:"Linked List",permalink:"/docs/tags/linked-list"}],version:"current",sidebarPosition:26,frontMatter:{displayed_sidebar:null,sidebar_position:26,tags:["Linked List"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:c};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,l.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"delete-node-in-a-linked-list"},"Delete Node in a Linked List"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/delete-node-in-a-linked-list/"},"Problem")),(0,r.kt)("p",null,"Write a function to ",(0,r.kt)("strong",null,"delete a node")," in a singly-linked list. You will ",(0,r.kt)("strong",null,"not")," be given access to the ",(0,r.kt)("code",null,"head")," of the list, instead you will be given access to ",(0,r.kt)("strong",null,"the node to be deleted")," directly."),(0,r.kt)("p",null,"It is ",(0,r.kt)("strong",null,"guaranteed")," that the node to be deleted is ",(0,r.kt)("strong",null,"not a tail node")," in the list."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(a.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\npublic:\n    void deleteNode(ListNode* node) {\n        *node = *node->next;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);