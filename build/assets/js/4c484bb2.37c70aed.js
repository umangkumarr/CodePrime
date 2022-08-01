"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[719],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>d});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=a.createContext({}),u=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(i.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},p=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(t),d=r,b=p["".concat(i,".").concat(d)]||p[d]||m[d]||o;return t?a.createElement(b,s(s({ref:n},c),{},{components:t})):a.createElement(b,s({ref:n},c))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,s=new Array(o);s[0]=p;var l={};for(var i in n)hasOwnProperty.call(n,i)&&(l[i]=n[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,s[1]=l;for(var u=2;u<o;u++)s[u]=t[u];return a.createElement.apply(null,s)}return a.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>c});var a=t(7462),r=t(7294),o=t(2389),s=t(5773),l=t(6010);const i="tabItem_LplD";function u(e){var n,t,o;const{lazy:u,block:c,defaultValue:m,values:p,groupId:d,className:b}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:h.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),y=(0,s.lx)(f,((e,n)=>e.value===n.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===m?m:null!=(n=null!=m?m:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?n:null==(o=h[0])?void 0:o.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:k}=(0,s.UB)(),[N,w]=(0,r.useState)(v),O=[],{blockElementScrollPositionUntilNextRender:x}=(0,s.o5)();if(null!=d){const e=g[d];null!=e&&e!==N&&f.some((n=>n.value===e))&&w(e)}const E=e=>{const n=e.currentTarget,t=O.indexOf(n),a=f[t].value;a!==N&&(x(n),w(a),null!=d&&k(d,a))},T=e=>{var n;let t=null;switch(e.key){case"ArrowRight":{const n=O.indexOf(e.currentTarget)+1;t=O[n]||O[0];break}case"ArrowLeft":{const n=O.indexOf(e.currentTarget)-1;t=O[n]||O[O.length-1];break}}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":c},b)},f.map((e=>{let{value:n,label:t,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===n?0:-1,"aria-selected":N===n,key:n,ref:e=>O.push(e),onKeyDown:T,onFocus:E,onClick:E},o,{className:(0,l.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===n})}),null!=t?t:n)}))),u?(0,r.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==N})))))}function c(e){const n=(0,o.Z)();return r.createElement(u,(0,a.Z)({key:String(n)},e))}},966:(e,n,t)=>{t.r(n),t.d(n,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>u,toc:()=>c,default:()=>p});var a=t(7462),r=(t(7294),t(3905)),o=t(9877),s=t(8215);const l={sidebar_position:3,tags:["Array","Dynamic Programming"],displayed_sidebar:null},i="House Robber II",u={unversionedId:"codes/house-robber-ii",id:"codes/house-robber-ii",title:"House Robber II",description:"Problem",source:"@site/docs/codes/house-robber-ii.md",sourceDirName:"codes",slug:"/codes/house-robber-ii",permalink:"/CodePrime/docs/codes/house-robber-ii",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/house-robber-ii.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,tags:["Array","Dynamic Programming"],displayed_sidebar:null}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:c};function p(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"house-robber-ii"},"House Robber II"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/house-robber-ii/"},"Problem")),(0,r.kt)("p",null,"You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are ",(0,r.kt)("strong",null,"arranged in a circle.")," That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and\xa0",(0,r.kt)("b",null,"it will automatically contact the police if two adjacent houses were broken into on the same night"),"."),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"nums")," representing the amount of money of each house, return ",(0,r.kt)("em",null,"the maximum amount of money you can rob tonight ",(0,r.kt)("strong",null,"without alerting the police")),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"#define f first\n#define s second\n\nclass Solution {\n   public:\n    int rob(vector<int>& nums) {\n        int n = nums.size();\n        if (n == 1) return nums[0];\n        vector<pair<int, int>> ans(n);\n        ans[0].f = nums[0];\n        ans[1].f = nums[1];\n        ans[1].s = nums[0];\n        for (int i = 2; i < n; i++) {\n            ans[i].f = nums[i] + ans[i - 1].s;\n            ans[i].s = max(ans[i - 1].f, ans[i - 1].s);\n        }\n        auto a = ans[n - 1];\n        ans[1].s = 0;\n\n        for (int i = 2; i < n; i++) {\n            ans[i].f = nums[i] + ans[i - 1].s;\n            ans[i].s = max(ans[i - 1].f, ans[i - 1].s);\n        }\n        int b = max(ans[n - 1].f, ans[n - 1].s);\n        if (max(a.f, a.s) == b) return b;\n        return max(b, a.s);\n    }\n};\n"))))))}p.isMDXComponent=!0}}]);