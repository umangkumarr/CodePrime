"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6470],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,a=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=c(r),m=l,b=d["".concat(s,".").concat(m)]||d[m]||p[m]||a;return r?n.createElement(b,o(o({ref:t},u),{},{components:r})):n.createElement(b,o({ref:t},u))}));function m(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=r.length,o=new Array(a);o[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:l,o[1]=i;for(var c=2;c<a;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>l});var n=r(7294);const l=function(e){let{children:t,hidden:r,className:l}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:l},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>u});var n=r(7462),l=r(7294),a=r(2389),o=r(5773),i=r(6010);const s="tabItem_LplD";function c(e){var t,r,a;const{lazy:c,block:u,defaultValue:p,values:d,groupId:m,className:b}=e,v=l.Children.map(e.children,(e=>{if((0,l.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=d?d:v.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),y=(0,o.lx)(f,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const h=null===p?p:null!=(t=null!=p?p:null==(r=v.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(a=v[0])?void 0:a.props.value;if(null!==h&&!f.some((e=>e.value===h)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:L}=(0,o.UB)(),[g,S]=(0,l.useState)(h),E=[],{blockElementScrollPositionUntilNextRender:D}=(0,o.o5)();if(null!=m){const e=k[m];null!=e&&e!==g&&f.some((t=>t.value===e))&&S(e)}const P=e=>{const t=e.currentTarget,r=E.indexOf(t),n=f[r].value;n!==g&&(D(t),S(n),null!=m&&L(m,n))},O=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=E.indexOf(e.currentTarget)+1;r=E[t]||E[0];break}case"ArrowLeft":{const t=E.indexOf(e.currentTarget)-1;r=E[t]||E[E.length-1];break}}null==(t=r)||t.focus()};return l.createElement("div",{className:"tabs-container"},l.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},b)},f.map((e=>{let{value:t,label:r,attributes:a}=e;return l.createElement("li",(0,n.Z)({role:"tab",tabIndex:g===t?0:-1,"aria-selected":g===t,key:t,ref:e=>E.push(e),onKeyDown:O,onFocus:P,onClick:P},a,{className:(0,i.Z)("tabs__item",s,null==a?void 0:a.className,{"tabs__item--active":g===t})}),null!=r?r:t)}))),c?(0,l.cloneElement)(v.filter((e=>e.props.value===g))[0],{className:"margin-vert--md"}):l.createElement("div",{className:"margin-vert--md"},v.map(((e,t)=>(0,l.cloneElement)(e,{key:t,hidden:e.props.value!==g})))))}function u(e){const t=(0,a.Z)();return l.createElement(c,(0,n.Z)({key:String(t)},e))}},233:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>c,toc:()=>u,default:()=>d});var n=r(7462),l=(r(7294),r(3905)),a=r(9877),o=r(8215);const i={sidebar_position:5},s="Linked List Cycle II",c={unversionedId:"Problems/StriverSDESheet/Day6/Linked List Cycle II",id:"Problems/StriverSDESheet/Day6/Linked List Cycle II",title:"Linked List Cycle II",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day6/Linked List Cycle II.md",sourceDirName:"Problems/StriverSDESheet/Day6",slug:"/Problems/StriverSDESheet/Day6/Linked List Cycle II",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day6/Linked List Cycle II",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day6/Linked List Cycle II.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"api",previous:{title:"Palindrome Linked List",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day6/Palindrome Linked List"},next:{title:"Flattening a Linked List",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day6/Flattening a Linked List"}},u=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],p={toc:u};function d(e){let{components:t,...r}=e;return(0,l.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"linked-list-cycle-ii"},"Linked List Cycle II"),(0,l.kt)("h2",{id:"problem-link"},"Problem Link"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/linked-list-cycle-ii/"},"https://leetcode.com/problems/linked-list-cycle-ii/")),(0,l.kt)("h2",{id:"solution-code"},"Solution Code"),(0,l.kt)(a.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    ListNode *detectCycle(ListNode *head) {\n        map<ListNode *, int> mp;\n        ListNode *temp;\n        temp = head;\n        int i = 0;\n        while (temp != NULL) {\n            mp[temp] = i;\n            if (mp.find(temp->next) != mp.end()) {\n                return temp->next;\n                break;\n            }\n            temp = temp->next;\n            i++;\n        }\n        return NULL;\n    }\n};\n")))))}d.isMDXComponent=!0}}]);