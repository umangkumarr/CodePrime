"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2703],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,a=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(r),m=l,f=d["".concat(i,".").concat(m)]||d[m]||p[m]||a;return r?n.createElement(f,o(o({ref:t},c),{},{components:r})):n.createElement(f,o({ref:t},c))}));function m(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=r.length,o=new Array(a);o[0]=d;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:l,o[1]=s;for(var u=2;u<a;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>l});var n=r(7294);const l=function(e){let{children:t,hidden:r,className:l}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:l},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),l=r(7294),a=r(2389),o=r(5773),s=r(6010);const i="tabItem_LplD";function u(e){var t,r,a;const{lazy:u,block:c,defaultValue:p,values:d,groupId:m,className:f}=e,h=l.Children.map(e.children,(e=>{if((0,l.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=d?d:h.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),v=(0,o.lx)(b,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===p?p:null!=(t=null!=p?p:null==(r=h.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(a=h[0])?void 0:a.props.value;if(null!==y&&!b.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,o.UB)(),[w,O]=(0,l.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:E}=(0,o.o5)();if(null!=m){const e=k[m];null!=e&&e!==w&&b.some((t=>t.value===e))&&O(e)}const x=e=>{const t=e.currentTarget,r=T.indexOf(t),n=b[r].value;n!==w&&(E(t),O(n),null!=m&&g(m,n))},N=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return l.createElement("div",{className:"tabs-container"},l.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":c},f)},b.map((e=>{let{value:t,label:r,attributes:a}=e;return l.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:N,onFocus:x,onClick:x},a,{className:(0,s.Z)("tabs__item",i,null==a?void 0:a.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),u?(0,l.cloneElement)(h.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):l.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,l.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,a.Z)();return l.createElement(u,(0,n.Z)({key:String(t)},e))}},1319:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>u,toc:()=>c,default:()=>d});var n=r(7462),l=(r(7294),r(3905)),a=r(9877),o=r(8215);const s={displayed_sidebar:null,sidebar_position:39,tags:["Array","Two Pointers"]},i="Remove Duplicates from Sorted Array",u={unversionedId:"codes/remove-duplicates-from-sorted-array",id:"codes/remove-duplicates-from-sorted-array",title:"Remove Duplicates from Sorted Array",description:"Problem",source:"@site/docs/codes/remove-duplicates-from-sorted-array.md",sourceDirName:"codes",slug:"/codes/remove-duplicates-from-sorted-array",permalink:"/docs/codes/remove-duplicates-from-sorted-array",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/remove-duplicates-from-sorted-array.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Two Pointers",permalink:"/docs/tags/two-pointers"}],version:"current",sidebarPosition:39,frontMatter:{displayed_sidebar:null,sidebar_position:39,tags:["Array","Two Pointers"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:c};function d(e){let{components:t,...r}=e;return(0,l.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"remove-duplicates-from-sorted-array"},"Remove Duplicates from Sorted Array"),(0,l.kt)("h2",{id:"problem"},(0,l.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/"},"Problem")),(0,l.kt)("p",null,"Given an integer array ",(0,l.kt)("code",null,"nums")," sorted in ",(0,l.kt)("strong",null,"non-decreasing order"),", remove the duplicates ",(0,l.kt)("a",{href:"https://en.wikipedia.org/wiki/In-place_algorithm",target:"_blank"},(0,l.kt)("strong",null,"in-place"))," such that each unique element appears only ",(0,l.kt)("strong",null,"once"),". The ",(0,l.kt)("strong",null,"relative order")," of the elements should be kept the ",(0,l.kt)("strong",null,"same"),"."),(0,l.kt)("p",null,"Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the ",(0,l.kt)("strong",null,"first part")," of the array ",(0,l.kt)("code",null,"nums"),". More formally, if there are ",(0,l.kt)("code",null,"k")," elements after removing the duplicates, then the first ",(0,l.kt)("code",null,"k")," elements of ",(0,l.kt)("code",null,"nums"),"\xa0should hold the final result. It does not matter what you leave beyond the first\xa0",(0,l.kt)("code",null,"k"),"\xa0elements."),(0,l.kt)("p",null,"Return ",(0,l.kt)("code",null,"k"),(0,l.kt)("em",null," after placing the final result in the first "),(0,l.kt)("code",null,"k"),(0,l.kt)("em",null," slots of "),(0,l.kt)("code",null,"nums"),"."),(0,l.kt)("p",null,"Do ",(0,l.kt)("strong",null,"not")," allocate extra space for another array. You must do this by ",(0,l.kt)("strong",null,"modifying the input array ",(0,l.kt)("a",{href:"https://en.wikipedia.org/wiki/In-place_algorithm",target:"_blank"},"in-place"))," with O(1) extra memory."),(0,l.kt)("p",null,(0,l.kt)("strong",null,"Custom Judge:")),(0,l.kt)("p",null,"The judge will test your solution with the following code:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"int[] nums = [...]; // Input array\nint[] expectedNums = [...]; // The expected answer with correct length\n\nint k = removeDuplicates(nums); // Calls your implementation\n\nassert k == expectedNums.length;\nfor (int i = 0; i &lt; k; i++) {\n    assert nums[i] == expectedNums[i];\n}\n")),(0,l.kt)("p",null,"If all assertions pass, then your solution will be ",(0,l.kt)("strong",null,"accepted"),"."),(0,l.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Click - to see solution code"),(0,l.kt)(a.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int removeDuplicates(vector<int>& A) {\n        int count = 0;\n        int n = A.size();\n        for (int i = 1; i < n; i++) {\n            if (A[i] == A[i - 1])\n                count++;\n            else\n                A[i - count] = A[i];\n        }\n        return n - count;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);