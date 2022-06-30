"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9361],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=s(r),d=a,b=m["".concat(u,".").concat(d)]||m[d]||p[d]||l;return r?n.createElement(b,o(o({ref:t},c),{},{components:r})):n.createElement(b,o({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=m;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(7294);const a=function(e){let{children:t,hidden:r,className:a}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),a=r(7294),l=r(2389),o=r(5773),i=r(6010);const u="tabItem_LplD";function s(e){var t,r,l;const{lazy:s,block:c,defaultValue:p,values:m,groupId:d,className:b}=e,f=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:f.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),h=(0,o.lx)(v,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===p?p:null!=(t=null!=p?p:null==(r=f.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:D,setTabGroupChoices:g}=(0,o.UB)(),[w,S]=(0,a.useState)(y),k=[],{blockElementScrollPositionUntilNextRender:E}=(0,o.o5)();if(null!=d){const e=D[d];null!=e&&e!==w&&v.some((t=>t.value===e))&&S(e)}const O=e=>{const t=e.currentTarget,r=k.indexOf(t),n=v[r].value;n!==w&&(E(t),S(n),null!=d&&g(d,n))},P=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=k.indexOf(e.currentTarget)+1;r=k[t]||k[0];break}case"ArrowLeft":{const t=k.indexOf(e.currentTarget)-1;r=k[t]||k[k.length-1];break}}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},b)},v.map((e=>{let{value:t,label:r,attributes:l}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>k.push(e),onKeyDown:P,onFocus:O,onClick:O},l,{className:(0,i.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),s?(0,a.cloneElement)(f.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,l.Z)();return a.createElement(s,(0,n.Z)({key:String(t)},e))}},7747:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>u,metadata:()=>s,toc:()=>c,default:()=>m});var n=r(7462),a=(r(7294),r(3905)),l=r(9877),o=r(8215);const i={sidebar_position:4},u="Find the Duplicate Number",s={unversionedId:"Problems/StriverSDESheet/Day2/Find the Duplicate Number",id:"Problems/StriverSDESheet/Day2/Find the Duplicate Number",title:"Find the Duplicate Number",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day2/Find the Duplicate Number.md",sourceDirName:"Problems/StriverSDESheet/Day2",slug:"/Problems/StriverSDESheet/Day2/Find the Duplicate Number",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day2/Find the Duplicate Number",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day2/Find the Duplicate Number.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"api",previous:{title:"Merge two sorted Arrays without extra space",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day2/Merge Sorted Array"},next:{title:"Repeat and Missing Number Array",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day2/Repeat and Missing Number Array"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],p={toc:c};function m(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"find-the-duplicate-number"},"Find the Duplicate Number"),(0,a.kt)("h2",{id:"problem-link"},"Problem Link"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/find-the-duplicate-number/"},"https://leetcode.com/problems/find-the-duplicate-number/")),(0,a.kt)("h2",{id:"solution-code"},"Solution Code"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int findDuplicate(vector<int>& nums) {\n        if (nums.size() > 1) {\n            int slow = nums[0];\n            int fast = nums[nums[0]];\n            while (slow != fast) {\n                slow = nums[slow];\n                fast = nums[nums[fast]];\n            }\n\n            fast = 0;\n            while (fast != slow) {\n                fast = nums[fast];\n                slow = nums[slow];\n            }\n            return slow;\n        }\n        return -1;\n    }\n};\n")))))}m.isMDXComponent=!0}}]);