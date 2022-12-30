"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3679],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),u=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(n),d=r,f=m["".concat(i,".").concat(d)]||m[d]||p[d]||o;return n?a.createElement(f,l(l({ref:t},c),{},{components:n})):a.createElement(f,l({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,l[1]=s;for(var u=2;u<o;u++)l[u]=n[u];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294),r=n(4334);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:n,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,l),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(3117),r=n(7294),o=n(4334),l=n(2389),s=n(7392),i=n(7094),u=n(2466);const c="tabList__CuJ",p="tabItem_LNqP";function m(e){var t,n;const{lazy:l,block:m,defaultValue:d,values:f,groupId:b,className:h}=e,y=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=f?f:y.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,s.l)(k,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===d?d:null!=(t=null!=d?d:null==(n=y.find((e=>e.props.default)))?void 0:n.props.value)?t:y[0].props.value;if(null!==g&&!k.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:x,setTabGroupChoices:N}=(0,i.U)(),[w,O]=(0,r.useState)(g),P=[],{blockElementScrollPositionUntilNextRender:E}=(0,u.o5)();if(null!=b){const e=x[b];null!=e&&e!==w&&k.some((t=>t.value===e))&&O(e)}const T=e=>{const t=e.currentTarget,n=P.indexOf(t),a=k[n].value;a!==w&&(E(t),O(a),null!=b&&N(b,String(a)))},C=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=P.indexOf(e.currentTarget)+1;n=null!=(a=P[t])?a:P[0];break}case"ArrowLeft":{var r;const t=P.indexOf(e.currentTarget)-1;n=null!=(r=P[t])?r:P[P.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},h)},k.map((e=>{let{value:t,label:n,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>P.push(e),onKeyDown:C,onFocus:T,onClick:T},l,{className:(0,o.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),l?(0,r.cloneElement)(y.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},y.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function d(e){const t=(0,l.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},2132:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var a=n(3117),r=(n(7294),n(3905)),o=n(5488),l=n(5162);const s={sidebar_position:2,tags:["Array","Prefix Sum"]},i="Product of Array Except Self",u={unversionedId:"codes/product-of-array-except-self",id:"codes/product-of-array-except-self",title:"Product of Array Except Self",description:"Problem",source:"@site/docs/codes/product-of-array-except-self.md",sourceDirName:"codes",slug:"/codes/product-of-array-except-self",permalink:"/CodePrime/docs/codes/product-of-array-except-self",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/product-of-array-except-self.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Prefix Sum",permalink:"/CodePrime/docs/tags/prefix-sum"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Array","Prefix Sum"]},sidebar:"Leetcode",previous:{title:"Contains Duplicate",permalink:"/CodePrime/docs/codes/contains-duplicate"},next:{title:"Maximum Subarray",permalink:"/CodePrime/docs/codes/maximum-subarray"}},c={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:p};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"product-of-array-except-self"},"Product of Array Except Self"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/product-of-array-except-self/"},"Problem")),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"nums"),", return ",(0,r.kt)("em",null,"an array")," ",(0,r.kt)("code",null,"answer")," ",(0,r.kt)("em",null,"such that")," ",(0,r.kt)("code",null,"answer[i]")," ",(0,r.kt)("em",null,"is equal to the product of all the elements of")," ",(0,r.kt)("code",null,"nums")," ",(0,r.kt)("em",null,"except")," ",(0,r.kt)("code",null,"nums[i]"),"."),(0,r.kt)("p",null,"The product of any prefix or suffix of ",(0,r.kt)("code",null,"nums")," is ",(0,r.kt)("strong",null,"guaranteed")," to fit in a ",(0,r.kt)("strong",null,"32-bit")," integer."),(0,r.kt)("p",null,"You must write an algorithm that runs in\xa0",(0,r.kt)("code",null,"O(n)"),"\xa0time and without using the division operation."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        long long prod = 1;\n        int n = nums.size();\n        int cnt = 0;\n        for (int i = 0; i < n; i++) {\n            if (nums[i])\n                prod *= nums[i];\n            else\n                cnt++;\n        }\n        if (cnt > 1) {\n            nums.clear();\n            nums.resize(n);\n            return nums;\n        }\n        for (int i = 0; i < n; i++) {\n            if (nums[i] == 0)\n                nums[i] = prod;\n            else\n                nums[i] = (prod * (cnt ^ 1)) / nums[i];\n        }\n        return nums;\n    }\n};\n"))))))}d.isMDXComponent=!0}}]);