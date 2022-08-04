"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2606],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(n),d=a,b=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return n?r.createElement(b,l(l({ref:t},c),{},{components:n})):r.createElement(b,l({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var r=n(7294),a=n(4334);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:n,className:l}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,l),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var r=n(3117),a=n(7294),o=n(4334),l=n(2389),i=n(7392),s=n(7094),u=n(2466);const c="tabList__CuJ",p="tabItem_LNqP";function m(e){var t,n;const{lazy:l,block:m,defaultValue:d,values:b,groupId:f,className:v}=e,y=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=b?b:y.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),g=(0,i.l)(h,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===d?d:null!=(t=null!=d?d:null==(n=y.find((e=>e.props.default)))?void 0:n.props.value)?t:y[0].props.value;if(null!==k&&!h.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:j,setTabGroupChoices:O}=(0,s.U)(),[w,E]=(0,a.useState)(k),P=[],{blockElementScrollPositionUntilNextRender:T}=(0,u.o5)();if(null!=f){const e=j[f];null!=e&&e!==w&&h.some((t=>t.value===e))&&E(e)}const C=e=>{const t=e.currentTarget,n=P.indexOf(t),r=h[n].value;r!==w&&(T(t),E(r),null!=f&&O(f,String(r)))},x=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var r;const t=P.indexOf(e.currentTarget)+1;n=null!=(r=P[t])?r:P[0];break}case"ArrowLeft":{var a;const t=P.indexOf(e.currentTarget)-1;n=null!=(a=P[t])?a:P[P.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:(0,o.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},v)},h.map((e=>{let{value:t,label:n,attributes:l}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>P.push(e),onKeyDown:x,onFocus:C,onClick:C},l,{className:(0,o.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),l?(0,a.cloneElement)(y.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},y.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function d(e){const t=(0,l.Z)();return a.createElement(m,(0,r.Z)({key:String(t)},e))}},8585:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>u,toc:()=>p});var r=n(3117),a=(n(7294),n(3905)),o=n(5488),l=n(5162);const i={sidebar_position:16,tags:["Array","Hash Table","Sorting","Counting"]},s="Majority Element II",u={unversionedId:"codes/majority-element-ii",id:"codes/majority-element-ii",title:"Majority Element II",description:"Problem",source:"@site/docs/codes/majority-element-ii.md",sourceDirName:"codes",slug:"/codes/majority-element-ii",permalink:"/CodePrime/docs/codes/majority-element-ii",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/majority-element-ii.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"},{label:"Counting",permalink:"/CodePrime/docs/tags/counting"}],version:"current",sidebarPosition:16,frontMatter:{sidebar_position:16,tags:["Array","Hash Table","Sorting","Counting"]},sidebar:"Leetcode",previous:{title:"Pow(x, n)",permalink:"/CodePrime/docs/codes/powx-n"},next:{title:"Unique Paths",permalink:"/CodePrime/docs/codes/unique-paths"}},c={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:p};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"majority-element-ii"},"Majority Element II"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/majority-element-ii/"},"Problem")),(0,a.kt)("p",null,"Given an integer array of size ",(0,a.kt)("code",null,"n"),", find all elements that appear more than ",(0,a.kt)("code",null,"\u230a n/3 \u230b")," times."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> majorityElement(vector<int>& nums) {\n        unordered_map<int, int> mp;\n        int n = nums.size();\n        for (int i = 0; i < n; i++) mp[nums[i]]++;\n\n        vector<int> ans;\n        for (auto i : mp) {\n            if (i.second > n / 3) ans.push_back(i.first);\n        }\n        return ans;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);