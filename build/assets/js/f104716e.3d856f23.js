"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6776],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,b=d["".concat(u,".").concat(m)]||d[m]||p[m]||l;return n?r.createElement(b,o(o({ref:t},c),{},{components:n})):r.createElement(b,o({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=d;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);const a=function(e){let{children:t,hidden:n,className:a}=e;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var r=n(7462),a=n(7294),l=n(2389),o=n(5773),i=n(6010);const u="tabItem_LplD";function s(e){var t,n,l;const{lazy:s,block:c,defaultValue:p,values:d,groupId:m,className:b}=e,f=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=d?d:f.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),v=(0,o.lx)(h,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===p?p:null!=(t=null!=p?p:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==y&&!h.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:k}=(0,o.UB)(),[w,O]=(0,a.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:E}=(0,o.o5)();if(null!=m){const e=g[m];null!=e&&e!==w&&h.some((t=>t.value===e))&&O(e)}const P=e=>{const t=e.currentTarget,n=T.indexOf(t),r=h[n].value;r!==w&&(E(t),O(r),null!=m&&k(m,r))},N=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;n=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;n=T[t]||T[T.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},b)},h.map((e=>{let{value:t,label:n,attributes:l}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:N,onFocus:P,onClick:P},l,{className:(0,i.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),s?(0,a.cloneElement)(f.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,l.Z)();return a.createElement(s,(0,r.Z)({key:String(t)},e))}},8979:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>u,metadata:()=>s,toc:()=>c,default:()=>d});var r=n(7462),a=(n(7294),n(3905)),l=n(9877),o=n(8215);const i={displayed_sidebar:null,sidebar_position:12,tags:["Array","Two Pointers","Binary Search","Bit Manipulation"]},u="Find the Duplicate Number",s={unversionedId:"codes/find-the-duplicate-number",id:"codes/find-the-duplicate-number",title:"Find the Duplicate Number",description:"Problem",source:"@site/docs/codes/find-the-duplicate-number.md",sourceDirName:"codes",slug:"/codes/find-the-duplicate-number",permalink:"/docs/codes/find-the-duplicate-number",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/find-the-duplicate-number.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Two Pointers",permalink:"/docs/tags/two-pointers"},{label:"Binary Search",permalink:"/docs/tags/binary-search"},{label:"Bit Manipulation",permalink:"/docs/tags/bit-manipulation"}],version:"current",sidebarPosition:12,frontMatter:{displayed_sidebar:null,sidebar_position:12,tags:["Array","Two Pointers","Binary Search","Bit Manipulation"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:c};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"find-the-duplicate-number"},"Find the Duplicate Number"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/find-the-duplicate-number/"},"Problem")),(0,a.kt)("p",null,"Given an array of integers ",(0,a.kt)("code",null,"nums")," containing\xa0",(0,a.kt)("code",null,"n + 1")," integers where each integer is in the range ",(0,a.kt)("code",null,"[1, n]")," inclusive."),(0,a.kt)("p",null,"There is only ",(0,a.kt)("strong",null,"one repeated number")," in ",(0,a.kt)("code",null,"nums"),", return ",(0,a.kt)("em",null,"this\xa0repeated\xa0number"),"."),(0,a.kt)("p",null,"You must solve the problem ",(0,a.kt)("strong",null,"without")," modifying the array ",(0,a.kt)("code",null,"nums"),"\xa0and uses only constant extra space."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int findDuplicate(vector<int>& nums) {\n        if (nums.size() > 1) {\n            int slow = nums[0];\n            int fast = nums[nums[0]];\n            while (slow != fast) {\n                slow = nums[slow];\n                fast = nums[nums[fast]];\n            }\n\n            fast = 0;\n            while (fast != slow) {\n                fast = nums[fast];\n                slow = nums[slow];\n            }\n            return slow;\n        }\n        return -1;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);