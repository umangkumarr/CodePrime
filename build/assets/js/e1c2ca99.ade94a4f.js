"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4578],{3905:(e,a,t)=>{t.d(a,{Zo:()=>u,kt:()=>d});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function s(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=n.createContext({}),m=function(e){var a=n.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},u=function(e){var a=m(e.components);return n.createElement(i.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},p=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=m(t),d=r,b=p["".concat(i,".").concat(d)]||p[d]||c[d]||l;return t?n.createElement(b,o(o({ref:a},u),{},{components:t})):n.createElement(b,o({ref:a},u))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var l=t.length,o=new Array(l);o[0]=p;var s={};for(var i in a)hasOwnProperty.call(a,i)&&(s[i]=a[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var m=2;m<l;m++)o[m]=t[m];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:(e,a,t)=>{t.d(a,{Z:()=>r});var n=t(7294);const r=function(e){let{children:a,hidden:t,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:(e,a,t)=>{t.d(a,{Z:()=>u});var n=t(7462),r=t(7294),l=t(2389),o=t(5773),s=t(6010);const i="tabItem_LplD";function m(e){var a,t,l;const{lazy:m,block:u,defaultValue:c,values:p,groupId:d,className:b}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:h.map((e=>{let{props:{value:a,label:t,attributes:n}}=e;return{value:a,label:t,attributes:n}})),y=(0,o.lx)(f,((e,a)=>e.value===a.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===c?c:null!=(a=null!=c?c:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?a:null==(l=h[0])?void 0:l.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:k}=(0,o.UB)(),[x,N]=(0,r.useState)(v),w=[],{blockElementScrollPositionUntilNextRender:O}=(0,o.o5)();if(null!=d){const e=g[d];null!=e&&e!==x&&f.some((a=>a.value===e))&&N(e)}const _=e=>{const a=e.currentTarget,t=w.indexOf(a),n=f[t].value;n!==x&&(O(a),N(n),null!=d&&k(d,n))},E=e=>{var a;let t=null;switch(e.key){case"ArrowRight":{const a=w.indexOf(e.currentTarget)+1;t=w[a]||w[0];break}case"ArrowLeft":{const a=w.indexOf(e.currentTarget)-1;t=w[a]||w[w.length-1];break}}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},b)},f.map((e=>{let{value:a,label:t,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===a?0:-1,"aria-selected":x===a,key:a,ref:e=>w.push(e),onKeyDown:E,onFocus:_,onClick:_},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":x===a})}),null!=t?t:a)}))),m?(0,r.cloneElement)(h.filter((e=>e.props.value===x))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,a)=>(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==x})))))}function u(e){const a=(0,l.Z)();return r.createElement(m,(0,n.Z)({key:String(a)},e))}},1986:(e,a,t)=>{t.r(a),t.d(a,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>m,toc:()=>u,default:()=>p});var n=t(7462),r=(t(7294),t(3905)),l=t(9877),o=t(8215);const s={displayed_sidebar:null,sidebar_position:5,tags:["Array","Divide and Conquer","Dynamic Programming"]},i="Maximum Subarray",m={unversionedId:"codes/maximum-subarray",id:"codes/maximum-subarray",title:"Maximum Subarray",description:"Problem",source:"@site/docs/codes/maximum-subarray.md",sourceDirName:"codes",slug:"/codes/maximum-subarray",permalink:"/docs/codes/maximum-subarray",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/maximum-subarray.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Divide and Conquer",permalink:"/docs/tags/divide-and-conquer"},{label:"Dynamic Programming",permalink:"/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:5,frontMatter:{displayed_sidebar:null,sidebar_position:5,tags:["Array","Divide and Conquer","Dynamic Programming"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:u};function p(e){let{components:a,...t}=e;return(0,r.kt)("wrapper",(0,n.Z)({},c,t,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"maximum-subarray"},"Maximum Subarray"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/maximum-subarray/"},"Problem")),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"nums"),", find the contiguous subarray (containing at least one number) which has the largest sum and return ",(0,r.kt)("em",null,"its sum"),"."),(0,r.kt)("p",null,"A ",(0,r.kt)("strong",null,"subarray")," is a ",(0,r.kt)("strong",null,"contiguous")," part of an array."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Can we solve it using kadane's Algorithm?"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int maxSubArray(vector<int>& nums) {\n        int ans = *max_element(nums.begin(), nums.end());\n        int n = nums.size();\n        int max_so_far = 0, max_till_here = 0;\n\n        for (int i = 0; i < n; i++) {\n            max_till_here += nums[i];\n            if (max_till_here > max_so_far) max_so_far = max_till_here;\n            if (max_till_here < 0) max_till_here = 0;\n        }\n        if (ans < 0) return ans;\n        return max_so_far;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);