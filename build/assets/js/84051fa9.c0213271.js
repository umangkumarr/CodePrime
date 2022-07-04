"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3310],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),c=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(a),d=r,h=p["".concat(i,".").concat(d)]||p[d]||m[d]||l;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);const r=function(e){let{children:t,hidden:a,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>u});var n=a(7462),r=a(7294),l=a(2389),o=a(5773),s=a(6010);const i="tabItem_LplD";function c(e){var t,a,l;const{lazy:c,block:u,defaultValue:m,values:p,groupId:d,className:h}=e,k=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=p?p:k.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),y=(0,o.lx)(b,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===m?m:null!=(t=null!=m?m:null==(a=k.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(l=k[0])?void 0:l.props.value;if(null!==f&&!b.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:g}=(0,o.UB)(),[N,w]=(0,r.useState)(f),O=[],{blockElementScrollPositionUntilNextRender:E}=(0,o.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&b.some((t=>t.value===e))&&w(e)}const P=e=>{const t=e.currentTarget,a=O.indexOf(t),n=b[a].value;n!==N&&(E(t),w(n),null!=d&&g(d,n))},x=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;a=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;a=O[t]||O[O.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},h)},b.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>O.push(e),onKeyDown:x,onFocus:P,onClick:P},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),c?(0,r.cloneElement)(k.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,l.Z)();return r.createElement(c,(0,n.Z)({key:String(t)},e))}},5199:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>p});var n=a(7462),r=(a(7294),a(3905)),l=a(9877),o=a(8215);const s={sidebar_position:142,tags:["Array","Divide and Conquer","Sorting","Heap (Priority Queue)","Quickselect"]},i="Kth Largest Element in an Array",c={unversionedId:"codes/kth-largest-element-in-an-array",id:"codes/kth-largest-element-in-an-array",title:"Kth Largest Element in an Array",description:"Problem",source:"@site/docs/codes/kth-largest-element-in-an-array.md",sourceDirName:"codes",slug:"/codes/kth-largest-element-in-an-array",permalink:"/CodePrime/docs/codes/kth-largest-element-in-an-array",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/kth-largest-element-in-an-array.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Divide and Conquer",permalink:"/CodePrime/docs/tags/divide-and-conquer"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"},{label:"Heap (Priority Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"},{label:"Quickselect",permalink:"/CodePrime/docs/tags/quickselect"}],version:"current",sidebarPosition:142,frontMatter:{sidebar_position:142,tags:["Array","Divide and Conquer","Sorting","Heap (Priority Queue)","Quickselect"]},sidebar:"main",previous:{title:"Merge K Sorted Arrays",permalink:"/CodePrime/docs/codes/merge-k-sorted-arrays"},next:{title:"Top K Frequent Elements",permalink:"/CodePrime/docs/codes/top-k-frequent-elements"}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:u};function p(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"kth-largest-element-in-an-array"},"Kth Largest Element in an Array"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/kth-largest-element-in-an-array/"},"Problem")),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"nums")," and an integer ",(0,r.kt)("code",null,"k"),", return ",(0,r.kt)("em",null,"the")," ",(0,r.kt)("code",null,"kth")," ",(0,r.kt)("em",null,"largest element in the array"),"."),(0,r.kt)("p",null,"Note that it is the ",(0,r.kt)("code",null,"kth")," largest element in the sorted order, not the ",(0,r.kt)("code",null,"kth")," distinct element."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int findKthLargest(vector<int>& nums, int k) {\n        int n = nums.size();\n        nth_element(nums.begin(), nums.begin() + n - k, nums.end());\n        return nums[n - k];\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);