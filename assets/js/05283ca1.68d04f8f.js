"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[392],{3905:(e,r,t)=>{t.d(r,{Zo:()=>c,kt:()=>p});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var i=n.createContext({}),u=function(e){var r=n.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},c=function(e){var r=u(e.components);return n.createElement(i.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(t),p=a,b=m["".concat(i,".").concat(p)]||m[p]||d[p]||o;return t?n.createElement(b,l(l({ref:r},c),{},{components:t})):n.createElement(b,l({ref:r},c))}));function p(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,l=new Array(o);l[0]=m;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var u=2;u<o;u++)l[u]=t[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},5162:(e,r,t)=>{t.d(r,{Z:()=>l});var n=t(7294),a=t(4334);const o="tabItem_Ymn6";function l(e){let{children:r,hidden:t,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,l),hidden:t},r)}},5488:(e,r,t)=>{t.d(r,{Z:()=>p});var n=t(3117),a=t(7294),o=t(4334),l=t(2389),s=t(7392),i=t(7094),u=t(2466);const c="tabList__CuJ",d="tabItem_LNqP";function m(e){var r,t;const{lazy:l,block:m,defaultValue:p,values:b,groupId:f,className:g}=e,h=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=b?b:h.map((e=>{let{props:{value:r,label:t,attributes:n}}=e;return{value:r,label:t,attributes:n}})),y=(0,s.l)(v,((e,r)=>e.value===r.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===p?p:null!=(r=null!=p?p:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?r:h[0].props.value;if(null!==k&&!v.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:O}=(0,i.U)(),[T,P]=(0,a.useState)(k),j=[],{blockElementScrollPositionUntilNextRender:E}=(0,u.o5)();if(null!=f){const e=w[f];null!=e&&e!==T&&v.some((r=>r.value===e))&&P(e)}const C=e=>{const r=e.currentTarget,t=j.indexOf(r),n=v[t].value;n!==T&&(E(r),P(n),null!=f&&O(f,String(n)))},N=e=>{var r;let t=null;switch(e.key){case"ArrowRight":{var n;const r=j.indexOf(e.currentTarget)+1;t=null!=(n=j[r])?n:j[0];break}case"ArrowLeft":{var a;const r=j.indexOf(e.currentTarget)-1;t=null!=(a=j[r])?a:j[j.length-1];break}}null==(r=t)||r.focus()};return a.createElement("div",{className:(0,o.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},g)},v.map((e=>{let{value:r,label:t,attributes:l}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:T===r?0:-1,"aria-selected":T===r,key:r,ref:e=>j.push(e),onKeyDown:N,onFocus:C,onClick:C},l,{className:(0,o.Z)("tabs__item",d,null==l?void 0:l.className,{"tabs__item--active":T===r})}),null!=t?t:r)}))),l?(0,a.cloneElement)(h.filter((e=>e.props.value===T))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},h.map(((e,r)=>(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==T})))))}function p(e){const r=(0,l.Z)();return a.createElement(m,(0,n.Z)({key:String(r)},e))}},7823:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>s,metadata:()=>u,toc:()=>d});var n=t(3117),a=(t(7294),t(3905)),o=t(5488),l=t(5162);const s={sidebar_position:8,tags:["Array","Two Pointers","Sorting"]},i="Merge Sorted Array",u={unversionedId:"codes/merge-sorted-array",id:"codes/merge-sorted-array",title:"Merge Sorted Array",description:"Problem",source:"@site/docs/codes/merge-sorted-array.md",sourceDirName:"codes",slug:"/codes/merge-sorted-array",permalink:"/CodePrime/docs/codes/merge-sorted-array",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/merge-sorted-array.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"}],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8,tags:["Array","Two Pointers","Sorting"]},sidebar:"Leetcode",previous:{title:"Merge Intervals",permalink:"/CodePrime/docs/codes/merge-intervals"},next:{title:"Repeat and Missing Number Array",permalink:"/CodePrime/docs/codes/repeat-and-missing-number-array"}},c={},d=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:d};function p(e){let{components:r,...t}=e;return(0,a.kt)("wrapper",(0,n.Z)({},m,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"merge-sorted-array"},"Merge Sorted Array"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/merge-sorted-array/"},"Problem")),(0,a.kt)("p",null,"You are given two integer arrays ",(0,a.kt)("code",null,"nums1")," and ",(0,a.kt)("code",null,"nums2"),", sorted in ",(0,a.kt)("strong",null,"non-decreasing order"),", and two integers ",(0,a.kt)("code",null,"m")," and ",(0,a.kt)("code",null,"n"),", representing the number of elements in ",(0,a.kt)("code",null,"nums1")," and ",(0,a.kt)("code",null,"nums2")," respectively."),(0,a.kt)("p",null,(0,a.kt)("strong",null,"Merge")," ",(0,a.kt)("code",null,"nums1")," and ",(0,a.kt)("code",null,"nums2")," into a single array sorted in ",(0,a.kt)("strong",null,"non-decreasing order"),"."),(0,a.kt)("p",null,"The final sorted array should not be returned by the function, but instead be ",(0,a.kt)("em",null,"stored inside the array "),(0,a.kt)("code",null,"nums1"),". To accommodate this, ",(0,a.kt)("code",null,"nums1")," has a length of ",(0,a.kt)("code",null,"m + n"),", where the first ",(0,a.kt)("code",null,"m")," elements denote the elements that should be merged, and the last ",(0,a.kt)("code",null,"n")," elements are set to ",(0,a.kt)("code",null,"0")," and should be ignored. ",(0,a.kt)("code",null,"nums2")," has a length of ",(0,a.kt)("code",null,"n"),"."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    void merge(vector<int>& arr1, int m, vector<int>& arr2, int n) {\n        vector<int> arr(m + n);\n        int i = 0, j = 0, k = 0;\n        while (i < m && j < n) {\n            if (arr1[i] <= arr2[j])\n                arr[k++] = arr1[i++];\n            else\n                arr[k++] = arr2[j++];\n        }\n        while (i < m) arr[k++] = arr1[i++];\n        while (j < n) arr[k++] = arr2[j++];\n        arr1 = arr;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);