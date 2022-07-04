"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3524],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),c=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(n),d=r,f=m["".concat(i,".").concat(d)]||m[d]||p[d]||l;return n?a.createElement(f,o(o({ref:t},u),{},{components:n})):a.createElement(f,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(7462),r=n(7294),l=n(2389),o=n(5773),s=n(6010);const i="tabItem_LplD";function c(e){var t,n,l;const{lazy:c,block:u,defaultValue:p,values:m,groupId:d,className:f}=e,k=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=m?m:k.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),h=(0,o.lx)(b,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===p?p:null!=(t=null!=p?p:null==(n=k.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(l=k[0])?void 0:l.props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,o.UB)(),[N,w]=(0,r.useState)(v),O=[],{blockElementScrollPositionUntilNextRender:P}=(0,o.o5)();if(null!=d){const e=y[d];null!=e&&e!==N&&b.some((t=>t.value===e))&&w(e)}const x=e=>{const t=e.currentTarget,n=O.indexOf(t),a=b[n].value;a!==N&&(P(t),w(a),null!=d&&g(d,a))},T=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;n=O[t]||O[O.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},f)},b.map((e=>{let{value:t,label:n,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>O.push(e),onKeyDown:T,onFocus:x,onClick:x},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),c?(0,r.cloneElement)(k.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,l.Z)();return r.createElement(c,(0,a.Z)({key:String(t)},e))}},1684:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>m});var a=n(7462),r=(n(7294),n(3905)),l=n(9877),o=n(8215);const s={sidebar_position:49,tags:["Math","Recursion"]},i="Permutation Sequence",c={unversionedId:"codes/permutation-sequence",id:"codes/permutation-sequence",title:"Permutation Sequence",description:"Problem",source:"@site/docs/codes/permutation-sequence.md",sourceDirName:"codes",slug:"/codes/permutation-sequence",permalink:"/CodePrime/docs/codes/permutation-sequence",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/permutation-sequence.md",tags:[{label:"Math",permalink:"/CodePrime/docs/tags/math"},{label:"Recursion",permalink:"/CodePrime/docs/tags/recursion"}],version:"current",sidebarPosition:49,frontMatter:{sidebar_position:49,tags:["Math","Recursion"]},sidebar:"main",previous:{title:"Subset Sums",permalink:"/CodePrime/docs/codes/subset-sums"},next:{title:"Combination Sum",permalink:"/CodePrime/docs/codes/combination-sum"}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:u};function m(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"permutation-sequence"},"Permutation Sequence"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/permutation-sequence/"},"Problem")),(0,r.kt)("p",null,"The set ",(0,r.kt)("code",null,"[1, 2, 3, ...,\xa0n]")," contains a total of ",(0,r.kt)("code",null,"n!")," unique permutations."),(0,r.kt)("p",null,"By listing and labeling all of the permutations in order, we get the following sequence for ",(0,r.kt)("code",null,"n = 3"),":"),(0,r.kt)("ol",null,(0,r.kt)("li",null,(0,r.kt)("code",null,'"123"')),(0,r.kt)("li",null,(0,r.kt)("code",null,'"132"')),(0,r.kt)("li",null,(0,r.kt)("code",null,'"213"')),(0,r.kt)("li",null,(0,r.kt)("code",null,'"231"')),(0,r.kt)("li",null,(0,r.kt)("code",null,'"312"')),(0,r.kt)("li",null,(0,r.kt)("code",null,'"321"'))),(0,r.kt)("p",null,"Given ",(0,r.kt)("code",null,"n")," and ",(0,r.kt)("code",null,"k"),", return the ",(0,r.kt)("code",null,"kth")," permutation sequence."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Math and observation. "),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    string getPermutation(int n, int k) {\n        vector<int> fact(n + 1), vis(n + 1);\n        fact[0] = 1, fact[1] = 1;\n        for (int i = 2; i <= n; i++) fact[i] = fact[i - 1] * i;\n\n        string s(n, ' ');\n        int cnt = 1;\n        while (cnt <= n) {\n            int a = ceil(k / (1.0 * fact[n - cnt]));\n            if (k == 0)\n                a = 1;\n            else\n                k = abs((a - 1) * fact[n - cnt] - k);\n            int t = 0, v = 1;\n            while (t < a) {\n                if (vis[v])\n                    v++;\n                else\n                    t++, v++;\n            }\n            a = v - 1;\n            s[cnt - 1] = a + '0';\n            cnt++;\n            vis[a] = 1;\n        }\n\n        return s;\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);