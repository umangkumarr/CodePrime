"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5334],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),m=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=m(e.components);return n.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=m(a),d=r,k=u["".concat(i,".").concat(d)]||u[d]||c[d]||s;return a?n.createElement(k,o(o({ref:t},p),{},{components:a})):n.createElement(k,o({ref:t},p))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,o=new Array(s);o[0]=u;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var m=2;m<s;m++)o[m]=a[m];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(7294),r=a(4334);const s="tabItem_Ymn6";function o(e){let{children:t,hidden:a,className:o}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(s,o),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(3117),r=a(7294),s=a(4334),o=a(2389),l=a(7392),i=a(7094),m=a(2466);const p="tabList__CuJ",c="tabItem_LNqP";function u(e){var t,a;const{lazy:o,block:u,defaultValue:d,values:k,groupId:b,className:h}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=k?k:f.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),v=(0,l.l)(g,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(a=f.find((e=>e.props.default)))?void 0:a.props.value)?t:f[0].props.value;if(null!==y&&!g.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,i.U)(),[O,P]=(0,r.useState)(y),C=[],{blockElementScrollPositionUntilNextRender:T}=(0,m.o5)();if(null!=b){const e=N[b];null!=e&&e!==O&&g.some((t=>t.value===e))&&P(e)}const E=e=>{const t=e.currentTarget,a=C.indexOf(t),n=g[a].value;n!==O&&(T(t),P(n),null!=b&&w(b,String(n)))},x=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=C.indexOf(e.currentTarget)+1;a=null!=(n=C[t])?n:C[0];break}case"ArrowLeft":{var r;const t=C.indexOf(e.currentTarget)-1;a=null!=(r=C[t])?r:C[C.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,s.Z)("tabs-container",p)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},h)},g.map((e=>{let{value:t,label:a,attributes:o}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>C.push(e),onKeyDown:x,onFocus:E,onClick:E},o,{className:(0,s.Z)("tabs__item",c,null==o?void 0:o.className,{"tabs__item--active":O===t})}),null!=a?a:t)}))),o?(0,r.cloneElement)(f.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,o.Z)();return r.createElement(u,(0,n.Z)({key:String(t)},e))}},3803:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>m,toc:()=>c});var n=a(3117),r=(a(7294),a(3905)),s=a(5488),o=a(5162);const l={sidebar_position:70,tags:["Array","Hash Table","Divide and Conquer","Sorting","Heap (Priority Queue)","Bucket Sort","Counting","Quickselect"]},i="Top K Frequent Elements",m={unversionedId:"codes/top-k-frequent-elements",id:"codes/top-k-frequent-elements",title:"Top K Frequent Elements",description:"Problem",source:"@site/docs/codes/top-k-frequent-elements.md",sourceDirName:"codes",slug:"/codes/top-k-frequent-elements",permalink:"/CodePrime/docs/codes/top-k-frequent-elements",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/top-k-frequent-elements.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Divide and Conquer",permalink:"/CodePrime/docs/tags/divide-and-conquer"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"},{label:"Heap (Priority Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"},{label:"Bucket Sort",permalink:"/CodePrime/docs/tags/bucket-sort"},{label:"Counting",permalink:"/CodePrime/docs/tags/counting"},{label:"Quickselect",permalink:"/CodePrime/docs/tags/quickselect"}],version:"current",sidebarPosition:70,frontMatter:{sidebar_position:70,tags:["Array","Hash Table","Divide and Conquer","Sorting","Heap (Priority Queue)","Bucket Sort","Counting","Quickselect"]},sidebar:"Leetcode",previous:{title:"Kth Largest Element in an Array",permalink:"/CodePrime/docs/codes/kth-largest-element-in-an-array"},next:{title:"Maximum Sum Combinations",permalink:"/CodePrime/docs/codes/maximum-sum-combinations"}},p={},c=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:c};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"top-k-frequent-elements"},"Top K Frequent Elements"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/top-k-frequent-elements/"},"Problem")),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"nums")," and an integer ",(0,r.kt)("code",null,"k"),", return ",(0,r.kt)("em",null,"the")," ",(0,r.kt)("code",null,"k")," ",(0,r.kt)("em",null,"most frequent elements"),". You may return the answer in ",(0,r.kt)("strong",null,"any order"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow"},"\u2217"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n*log(n))")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,r.kt)("span",{parentName:"span",className:"mbin"},"\u2217"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},"))")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        int n = nums.size();\n        map<int, int> mp;\n        vector<pair<int, int>> distinct;\n        for (int i = 0; i < n; i++) {\n            mp[nums[i]]++;\n        }\n\n        for (auto i : mp) {\n            distinct.push_back(make_pair(i.second, i.first));\n        }\n\n        sort(distinct.begin(), distinct.end());\n        reverse(distinct.begin(), distinct.end());\n        vector<int> ans;\n        for (int i = 0; i < k; i++) {\n            ans.push_back(distinct[i].second);\n        }\n        return ans;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);