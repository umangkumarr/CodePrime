"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6886],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),c=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=c(r),d=n,b=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return r?a.createElement(b,l(l({ref:t},u),{},{components:r})):a.createElement(b,l({ref:t},u))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:n,l[1]=i;for(var c=2;c<o;c++)l[c]=r[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5162:(e,t,r)=>{r.d(t,{Z:()=>l});var a=r(7294),n=r(4334);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:r,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,n.Z)(o,l),hidden:r},t)}},5488:(e,t,r)=>{r.d(t,{Z:()=>d});var a=r(3117),n=r(7294),o=r(4334),l=r(2389),i=r(7392),s=r(7094),c=r(2466);const u="tabList__CuJ",p="tabItem_LNqP";function m(e){var t,r;const{lazy:l,block:m,defaultValue:d,values:b,groupId:f,className:v}=e,h=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=b?b:h.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),y=(0,i.l)(g,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===d?d:null!=(t=null!=d?d:null==(r=h.find((e=>e.props.default)))?void 0:r.props.value)?t:h[0].props.value;if(null!==k&&!g.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:x}=(0,s.U)(),[O,j]=(0,n.useState)(k),P=[],{blockElementScrollPositionUntilNextRender:T}=(0,c.o5)();if(null!=f){const e=w[f];null!=e&&e!==O&&g.some((t=>t.value===e))&&j(e)}const E=e=>{const t=e.currentTarget,r=P.indexOf(t),a=g[r].value;a!==O&&(T(t),j(a),null!=f&&x(f,String(a)))},C=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{var a;const t=P.indexOf(e.currentTarget)+1;r=null!=(a=P[t])?a:P[0];break}case"ArrowLeft":{var n;const t=P.indexOf(e.currentTarget)-1;r=null!=(n=P[t])?n:P[P.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:(0,o.Z)("tabs-container",u)},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},v)},g.map((e=>{let{value:t,label:r,attributes:l}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>P.push(e),onKeyDown:C,onFocus:E,onClick:E},l,{className:(0,o.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":O===t})}),null!=r?r:t)}))),l?(0,n.cloneElement)(h.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):n.createElement("div",{className:"margin-top--md"},h.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,l.Z)();return n.createElement(m,(0,a.Z)({key:String(t)},e))}},2679:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var a=r(3117),n=(r(7294),r(3905)),o=r(5488),l=r(5162);const i={sidebar_position:11,tags:["Array","Math","Matrix"]},s="Rotate Image",c={unversionedId:"codes/rotate-image",id:"codes/rotate-image",title:"Rotate Image",description:"Problem",source:"@site/docs/codes/rotate-image.md",sourceDirName:"codes",slug:"/codes/rotate-image",permalink:"/CodePrime/docs/codes/rotate-image",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/rotate-image.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Math",permalink:"/CodePrime/docs/tags/math"},{label:"Matrix",permalink:"/CodePrime/docs/tags/matrix"}],version:"current",sidebarPosition:11,frontMatter:{sidebar_position:11,tags:["Array","Math","Matrix"]},sidebar:"Leetcode",previous:{title:"Repeat and Missing Number Array",permalink:"/CodePrime/docs/codes/repeat-and-missing-number-array"},next:{title:"Count Inversions",permalink:"/CodePrime/docs/codes/count-inversions"}},u={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:p};function d(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"rotate-image"},"Rotate Image"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/rotate-image/"},"Problem")),(0,n.kt)("p",null,"You are given an ",(0,n.kt)("code",null,"n x n")," 2D ",(0,n.kt)("code",null,"matrix")," representing an image, rotate the image by ",(0,n.kt)("strong",null,"90")," degrees (clockwise)."),(0,n.kt)("p",null,"You have to rotate the image ",(0,n.kt)("a",{href:"https://en.wikipedia.org/wiki/In-place_algorithm",target:"_blank"},(0,n.kt)("strong",null,"in-place")),", which means you have to modify the input 2D matrix directly. ",(0,n.kt)("strong",null,"DO NOT")," allocate another 2D matrix and do the rotation."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    void rotate(vector<vector<int>>& matrix) {\n        int n = matrix.size();\n        for (int i = 0; i < n / 2; i++) {\n            for (int j = 0; j < n - 2 * i - 1; j++) {\n                swap(matrix[i][i + j], matrix[n - i - 1 - j][i]);\n                swap(matrix[n - i - 1 - j][i],\n                     matrix[n - i - 1][n - i - 1 - j]);\n                swap(matrix[n - i - 1][n - i - 1 - j],\n                     matrix[i + j][n - i - 1]);\n            }\n        }\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);