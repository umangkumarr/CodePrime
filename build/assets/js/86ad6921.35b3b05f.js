"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9960],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=u(r),m=a,b=d["".concat(s,".").concat(m)]||d[m]||p[m]||o;return r?n.createElement(b,l(l({ref:t},c),{},{components:r})):n.createElement(b,l({ref:t},c))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(7294);const a=function(e){let{children:t,hidden:r,className:a}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),a=r(7294),o=r(2389),l=r(5773),i=r(6010);const s="tabItem_LplD";function u(e){var t,r,o;const{lazy:u,block:c,defaultValue:p,values:d,groupId:m,className:b}=e,v=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=d?d:v.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),f=(0,l.lx)(h,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===p?p:null!=(t=null!=p?p:null==(r=v.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=v[0])?void 0:o.props.value;if(null!==g&&!h.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:S}=(0,l.UB)(),[w,k]=(0,a.useState)(g),E=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=m){const e=y[m];null!=e&&e!==w&&h.some((t=>t.value===e))&&k(e)}const D=e=>{const t=e.currentTarget,r=E.indexOf(t),n=h[r].value;n!==w&&(O(t),k(n),null!=m&&S(m,n))},P=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=E.indexOf(e.currentTarget)+1;r=E[t]||E[0];break}case"ArrowLeft":{const t=E.indexOf(e.currentTarget)-1;r=E[t]||E[E.length-1];break}}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},b)},h.map((e=>{let{value:t,label:r,attributes:o}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>E.push(e),onKeyDown:P,onFocus:D,onClick:D},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),u?(0,a.cloneElement)(v.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,o.Z)();return a.createElement(u,(0,n.Z)({key:String(t)},e))}},2525:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>u,toc:()=>c,default:()=>d});var n=r(7462),a=(r(7294),r(3905)),o=r(9877),l=r(8215);const i={sidebar_position:6},s="Longest Substring without repeat",u={unversionedId:"Problems/StriverSDESheet/Day4/Longest Substring without repeat",id:"Problems/StriverSDESheet/Day4/Longest Substring without repeat",title:"Longest Substring without repeat",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day4/Longest Substring without repeat.md",sourceDirName:"Problems/StriverSDESheet/Day4",slug:"/Problems/StriverSDESheet/Day4/Longest Substring without repeat",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day4/Longest Substring without repeat",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day4/Longest Substring without repeat.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"api",previous:{title:"Subarray with given XOR",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day4/Subarray with given XOR"},next:{title:"Reverse Linked List",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day5/Reverse Linked List"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],p={toc:c};function d(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"longest-substring-without-repeat"},"Longest Substring without repeat"),(0,a.kt)("h2",{id:"problem-link"},"Problem Link"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/longest-substring-without-repeating-characters/"},"https://leetcode.com/problems/longest-substring-without-repeating-characters/")),(0,a.kt)("h2",{id:"solution-code"},"Solution Code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int lengthOfLongestSubstring(string s) {\n        vector<int> dict(256, -1);\n        int maxLen = 0, start = -1;\n        for (int i = 0; i != s.length(); i++) {\n            if (dict[s[i]] > start) start = dict[s[i]];\n            dict[s[i]] = i;\n            maxLen = max(maxLen, i - start);\n        }\n        return maxLen;\n    }\n};\n")))))}d.isMDXComponent=!0}}]);