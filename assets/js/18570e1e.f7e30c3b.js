"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2983],{3905:(e,a,t)=>{t.d(a,{Zo:()=>p,kt:()=>d});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function s(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?s(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function o(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=n.createContext({}),c=function(e){var a=n.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):l(l({},a),e)),t},p=function(e){var a=c(e.components);return n.createElement(i.Provider,{value:a},e.children)},m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},u=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=c(t),d=r,b=u["".concat(i,".").concat(d)]||u[d]||m[d]||s;return t?n.createElement(b,l(l({ref:a},p),{},{components:t})):n.createElement(b,l({ref:a},p))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var s=t.length,l=new Array(s);l[0]=u;var o={};for(var i in a)hasOwnProperty.call(a,i)&&(o[i]=a[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var c=2;c<s;c++)l[c]=t[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:(e,a,t)=>{t.d(a,{Z:()=>r});var n=t(7294);const r=function(e){let{children:a,hidden:t,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:(e,a,t)=>{t.d(a,{Z:()=>p});var n=t(7462),r=t(7294),s=t(2389),l=t(5773),o=t(6010);const i="tabItem_LplD";function c(e){var a,t,s;const{lazy:c,block:p,defaultValue:m,values:u,groupId:d,className:b}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=u?u:h.map((e=>{let{props:{value:a,label:t,attributes:n}}=e;return{value:a,label:t,attributes:n}})),g=(0,l.lx)(k,((e,a)=>e.value===a.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===m?m:null!=(a=null!=m?m:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?a:null==(s=h[0])?void 0:s.props.value;if(null!==f&&!k.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:y}=(0,l.UB)(),[N,w]=(0,r.useState)(f),O=[],{blockElementScrollPositionUntilNextRender:P}=(0,l.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&k.some((a=>a.value===e))&&w(e)}const T=e=>{const a=e.currentTarget,t=O.indexOf(a),n=k[t].value;n!==N&&(P(a),w(n),null!=d&&y(d,n))},x=e=>{var a;let t=null;switch(e.key){case"ArrowRight":{const a=O.indexOf(e.currentTarget)+1;t=O[a]||O[0];break}case"ArrowLeft":{const a=O.indexOf(e.currentTarget)-1;t=O[a]||O[O.length-1];break}}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},b)},k.map((e=>{let{value:a,label:t,attributes:s}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:N===a?0:-1,"aria-selected":N===a,key:a,ref:e=>O.push(e),onKeyDown:x,onFocus:T,onClick:T},s,{className:(0,o.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":N===a})}),null!=t?t:a)}))),c?(0,r.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,a)=>(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==N})))))}function p(e){const a=(0,s.Z)();return r.createElement(c,(0,n.Z)({key:String(a)},e))}},8424:(e,a,t)=>{t.r(a),t.d(a,{frontMatter:()=>o,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>u});var n=t(7462),r=(t(7294),t(3905)),s=t(9877),l=t(8215);const o={sidebar_position:1,tags:["Array","Dynamic Programming"]},i="Pascal's Triangle",c={unversionedId:"codes/pascals-triangle",id:"codes/pascals-triangle",title:"Pascal's Triangle",description:"Problem",source:"@site/docs/codes/pascals-triangle.md",sourceDirName:"codes",slug:"/codes/pascals-triangle",permalink:"/CodePrime/docs/codes/pascals-triangle",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/pascals-triangle.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Array","Dynamic Programming"]},sidebar:"main",previous:{title:"Arrays",permalink:"/CodePrime/docs/category/arrays"},next:{title:"Next Permutation",permalink:"/CodePrime/docs/codes/next-permutation"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:p};function u(e){let{components:a,...t}=e;return(0,r.kt)("wrapper",(0,n.Z)({},m,t,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"pascals-triangle"},"Pascal's Triangle"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/pascals-triangle/"},"Problem")),(0,r.kt)("p",null,"Given an integer ",(0,r.kt)("code",null,"numRows"),", return the first numRows of ",(0,r.kt)("strong",null,"Pascal's triangle"),"."),(0,r.kt)("p",null,"In ",(0,r.kt)("strong",null,"Pascal's triangle"),", each number is the sum of the two numbers directly above it as shown:"),(0,r.kt)("img",{alt:"",src:"https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif"}),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<vector<int>> generate(int n) {\n        vector<vector<int>> ans;\n        vector<int> a, b;\n        a = {1};\n        ans.push_back(a);\n        if (n == 1) return ans;\n        for (int i = 2; i <= n; i++) {\n            b.push_back(1);\n            for (int k = 0; k < a.size() - 1; k++) {\n                b.push_back(a[k] + a[k + 1]);\n            }\n            b.push_back(1);\n            ans.push_back(b);\n            a = b;\n            b.clear();\n        }\n        return ans;\n    }\n};\n\n"))))))}u.isMDXComponent=!0}}]);