"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2703],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(r),m=o,f=d["".concat(i,".").concat(m)]||d[m]||p[m]||a;return r?n.createElement(f,l(l({ref:t},c),{},{components:r})):n.createElement(f,l({ref:t},c))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=d;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:o,l[1]=s;for(var u=2;u<a;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5162:(e,t,r)=>{r.d(t,{Z:()=>l});var n=r(7294),o=r(4334);const a="tabItem_Ymn6";function l(e){let{children:t,hidden:r,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,o.Z)(a,l),hidden:r},t)}},5488:(e,t,r)=>{r.d(t,{Z:()=>m});var n=r(3117),o=r(7294),a=r(4334),l=r(2389),s=r(7392),i=r(7094),u=r(2466);const c="tabList__CuJ",p="tabItem_LNqP";function d(e){var t,r;const{lazy:l,block:d,defaultValue:m,values:f,groupId:h,className:b}=e,v=o.Children.map(e.children,(e=>{if((0,o.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),y=null!=f?f:v.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),k=(0,s.l)(y,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===m?m:null!=(t=null!=m?m:null==(r=v.find((e=>e.props.default)))?void 0:r.props.value)?t:v[0].props.value;if(null!==g&&!y.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+y.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:O}=(0,i.U)(),[T,P]=(0,o.useState)(g),x=[],{blockElementScrollPositionUntilNextRender:E}=(0,u.o5)();if(null!=h){const e=w[h];null!=e&&e!==T&&y.some((t=>t.value===e))&&P(e)}const C=e=>{const t=e.currentTarget,r=x.indexOf(t),n=y[r].value;n!==T&&(E(t),P(n),null!=h&&O(h,String(n)))},N=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{var n;const t=x.indexOf(e.currentTarget)+1;r=null!=(n=x[t])?n:x[0];break}case"ArrowLeft":{var o;const t=x.indexOf(e.currentTarget)-1;r=null!=(o=x[t])?o:x[x.length-1];break}}null==(t=r)||t.focus()};return o.createElement("div",{className:(0,a.Z)("tabs-container",c)},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":d},b)},y.map((e=>{let{value:t,label:r,attributes:l}=e;return o.createElement("li",(0,n.Z)({role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,key:t,ref:e=>x.push(e),onKeyDown:N,onFocus:C,onClick:C},l,{className:(0,a.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":T===t})}),null!=r?r:t)}))),l?(0,o.cloneElement)(v.filter((e=>e.props.value===T))[0],{className:"margin-top--md"}):o.createElement("div",{className:"margin-top--md"},v.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==T})))))}function m(e){const t=(0,l.Z)();return o.createElement(d,(0,n.Z)({key:String(t)},e))}},1319:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var n=r(3117),o=(r(7294),r(3905)),a=r(5488),l=r(5162);const s={sidebar_position:39,tags:["Array","Two Pointers"]},i="Remove Duplicates from Sorted Array",u={unversionedId:"codes/remove-duplicates-from-sorted-array",id:"codes/remove-duplicates-from-sorted-array",title:"Remove Duplicates from Sorted Array",description:"Problem",source:"@site/docs/codes/remove-duplicates-from-sorted-array.md",sourceDirName:"codes",slug:"/codes/remove-duplicates-from-sorted-array",permalink:"/CodePrime/docs/codes/remove-duplicates-from-sorted-array",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/remove-duplicates-from-sorted-array.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"}],version:"current",sidebarPosition:39,frontMatter:{sidebar_position:39,tags:["Array","Two Pointers"]},sidebar:"Leetcode",previous:{title:"Max Consecutive Ones",permalink:"/CodePrime/docs/codes/max-consecutive-ones"},next:{title:"3Sum",permalink:"/CodePrime/docs/3sum"}},c={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],d={toc:p};function m(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"remove-duplicates-from-sorted-array"},"Remove Duplicates from Sorted Array"),(0,o.kt)("h2",{id:"problem"},(0,o.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/"},"Problem")),(0,o.kt)("p",null,"Given an integer array ",(0,o.kt)("code",null,"nums")," sorted in ",(0,o.kt)("strong",null,"non-decreasing order"),", remove the duplicates ",(0,o.kt)("a",{href:"https://en.wikipedia.org/wiki/In-place_algorithm",target:"_blank"},(0,o.kt)("strong",null,"in-place"))," such that each unique element appears only ",(0,o.kt)("strong",null,"once"),". The ",(0,o.kt)("strong",null,"relative order")," of the elements should be kept the ",(0,o.kt)("strong",null,"same"),"."),(0,o.kt)("p",null,"Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the ",(0,o.kt)("strong",null,"first part")," of the array ",(0,o.kt)("code",null,"nums"),". More formally, if there are ",(0,o.kt)("code",null,"k")," elements after removing the duplicates, then the first ",(0,o.kt)("code",null,"k")," elements of ",(0,o.kt)("code",null,"nums"),"\xa0should hold the final result. It does not matter what you leave beyond the first\xa0",(0,o.kt)("code",null,"k"),"\xa0elements."),(0,o.kt)("p",null,"Return ",(0,o.kt)("code",null,"k"),(0,o.kt)("em",null," after placing the final result in the first "),(0,o.kt)("code",null,"k"),(0,o.kt)("em",null," slots of "),(0,o.kt)("code",null,"nums"),"."),(0,o.kt)("p",null,"Do ",(0,o.kt)("strong",null,"not")," allocate extra space for another array. You must do this by ",(0,o.kt)("strong",null,"modifying the input array ",(0,o.kt)("a",{href:"https://en.wikipedia.org/wiki/In-place_algorithm",target:"_blank"},"in-place"))," with O(1) extra memory."),(0,o.kt)("p",null,(0,o.kt)("strong",null,"Custom Judge:")),(0,o.kt)("p",null,"The judge will test your solution with the following code:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"int[] nums = [...]; // Input array\nint[] expectedNums = [...]; // The expected answer with correct length\n\nint k = removeDuplicates(nums); // Calls your implementation\n\nassert k == expectedNums.length;\nfor (int i = 0; i &lt; k; i++) {\n    assert nums[i] == expectedNums[i];\n}\n")),(0,o.kt)("p",null,"If all assertions pass, then your solution will be ",(0,o.kt)("strong",null,"accepted"),"."),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(a.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int removeDuplicates(vector<int>& A) {\n        int count = 0;\n        int n = A.size();\n        for (int i = 1; i < n; i++) {\n            if (A[i] == A[i - 1])\n                count++;\n            else\n                A[i - count] = A[i];\n        }\n        return n - count;\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);