"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3544],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>d});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var i=r.createContext({}),u=function(e){var n=r.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},c=function(e){var n=u(e.components);return r.createElement(i.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(t),d=a,b=m["".concat(i,".").concat(d)]||m[d]||p[d]||o;return t?r.createElement(b,l(l({ref:n},c),{},{components:t})):r.createElement(b,l({ref:n},c))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,l=new Array(o);l[0]=m;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var u=2;u<o;u++)l[u]=t[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},5162:(e,n,t)=>{t.d(n,{Z:()=>l});var r=t(7294),a=t(4334);const o="tabItem_Ymn6";function l(e){let{children:n,hidden:t,className:l}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,l),hidden:t},n)}},5488:(e,n,t)=>{t.d(n,{Z:()=>d});var r=t(3117),a=t(7294),o=t(4334),l=t(2389),s=t(7392),i=t(7094),u=t(2466);const c="tabList__CuJ",p="tabItem_LNqP";function m(e){var n,t;const{lazy:l,block:m,defaultValue:d,values:b,groupId:v,className:f}=e,h=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=b?b:h.map((e=>{let{props:{value:n,label:t,attributes:r}}=e;return{value:n,label:t,attributes:r}})),y=(0,s.l)(g,((e,n)=>e.value===n.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===d?d:null!=(n=null!=d?d:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?n:h[0].props.value;if(null!==k&&!g.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:O,setTabGroupChoices:w}=(0,i.U)(),[C,T]=(0,a.useState)(k),P=[],{blockElementScrollPositionUntilNextRender:E}=(0,u.o5)();if(null!=v){const e=O[v];null!=e&&e!==C&&g.some((n=>n.value===e))&&T(e)}const x=e=>{const n=e.currentTarget,t=P.indexOf(n),r=g[t].value;r!==C&&(E(n),T(r),null!=v&&w(v,String(r)))},j=e=>{var n;let t=null;switch(e.key){case"ArrowRight":{var r;const n=P.indexOf(e.currentTarget)+1;t=null!=(r=P[n])?r:P[0];break}case"ArrowLeft":{var a;const n=P.indexOf(e.currentTarget)-1;t=null!=(a=P[n])?a:P[P.length-1];break}}null==(n=t)||n.focus()};return a.createElement("div",{className:(0,o.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},f)},g.map((e=>{let{value:n,label:t,attributes:l}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:C===n?0:-1,"aria-selected":C===n,key:n,ref:e=>P.push(e),onKeyDown:j,onFocus:x,onClick:x},l,{className:(0,o.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":C===n})}),null!=t?t:n)}))),l?(0,a.cloneElement)(h.filter((e=>e.props.value===C))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},h.map(((e,n)=>(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==C})))))}function d(e){const n=(0,l.Z)();return a.createElement(m,(0,r.Z)({key:String(n)},e))}},3522:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var r=t(3117),a=(t(7294),t(3905)),o=t(5488),l=t(5162);const s={sidebar_position:20,tags:["Array","Hash Table","Union Find"]},i="Longest Consecutive Sequence",u={unversionedId:"codes/longest-consecutive-sequence",id:"codes/longest-consecutive-sequence",title:"Longest Consecutive Sequence",description:"Problem",source:"@site/docs/codes/longest-consecutive-sequence.md",sourceDirName:"codes",slug:"/codes/longest-consecutive-sequence",permalink:"/CodePrime/docs/codes/longest-consecutive-sequence",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/longest-consecutive-sequence.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Union Find",permalink:"/CodePrime/docs/tags/union-find"}],version:"current",sidebarPosition:20,frontMatter:{sidebar_position:20,tags:["Array","Hash Table","Union Find"]},sidebar:"Leetcode",previous:{title:"4Sum",permalink:"/CodePrime/docs/codes/4sum"},next:{title:"Subarray with given XOR",permalink:"/CodePrime/docs/codes/subarray-with-given-xor"}},c={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:p};function d(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"longest-consecutive-sequence"},"Longest Consecutive Sequence"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/longest-consecutive-sequence/"},"Problem")),(0,a.kt)("p",null,"Given an unsorted array of integers ",(0,a.kt)("code",null,"nums"),", return ",(0,a.kt)("em",null,"the length of the longest consecutive elements sequence.")),(0,a.kt)("p",null,"You must write an algorithm that runs in\xa0",(0,a.kt)("code",null,"O(n)"),"\xa0time."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    map<int, int> mp, mp1;\n\n   public:\n    int findlongestConsecutive(int a) {\n        if (mp1[a]) return mp1[a];\n        if (mp[a] == 0) return 0;\n        mp1[a] = 1;\n        mp1[a] += findlongestConsecutive(a - 1);\n        return mp1[a];\n    }\n\n    int longestConsecutive(vector<int>& nums) {\n        int n = nums.size();\n        for (int i = 0; i < n; i++) {\n            mp[nums[i]]++;\n        }\n\n        int ans = 0;\n        for (auto i : mp) {\n            ans = max(ans, findlongestConsecutive(i.first));\n        }\n        return ans;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);