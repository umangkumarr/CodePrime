"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7350],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),m=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=m(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),u=m(n),d=a,h=u["".concat(s,".").concat(d)]||u[d]||p[d]||i;return n?r.createElement(h,l(l({ref:t},c),{},{components:n})):r.createElement(h,l({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var m=2;m<i;m++)l[m]=n[m];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);const a=function(e){let{children:t,hidden:n,className:a}=e;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var r=n(7462),a=n(7294),i=n(2389),l=n(5773),o=n(6010);const s="tabItem_LplD";function m(e){var t,n,i;const{lazy:m,block:c,defaultValue:p,values:u,groupId:d,className:h}=e,b=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=u?u:b.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),v=(0,l.lx)(k,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===p?p:null!=(t=null!=p?p:null==(n=b.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(i=b[0])?void 0:i.props.value;if(null!==f&&!k.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:y}=(0,l.UB)(),[S,w]=(0,a.useState)(f),N=[],{blockElementScrollPositionUntilNextRender:P}=(0,l.o5)();if(null!=d){const e=g[d];null!=e&&e!==S&&k.some((t=>t.value===e))&&w(e)}const E=e=>{const t=e.currentTarget,n=N.indexOf(t),r=k[n].value;r!==S&&(P(t),w(r),null!=d&&y(d,r))},O=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=N.indexOf(e.currentTarget)+1;n=N[t]||N[0];break}case"ArrowLeft":{const t=N.indexOf(e.currentTarget)-1;n=N[t]||N[N.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":c},h)},k.map((e=>{let{value:t,label:n,attributes:i}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:e=>N.push(e),onKeyDown:O,onFocus:E,onClick:E},i,{className:(0,o.Z)("tabs__item",s,null==i?void 0:i.className,{"tabs__item--active":S===t})}),null!=n?n:t)}))),m?(0,a.cloneElement)(b.filter((e=>e.props.value===S))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==S})))))}function c(e){const t=(0,i.Z)();return a.createElement(m,(0,r.Z)({key:String(t)},e))}},7273:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>o,contentTitle:()=>s,metadata:()=>m,toc:()=>c,default:()=>u});var r=n(7462),a=(n(7294),n(3905)),i=n(9877),l=n(8215);const o={sidebar_position:2,tags:["Two Pointer","String","String Matching"]},s="Minimum Characters required to make a String Palindromic",m={unversionedId:"Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic",id:"Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic",title:"Minimum Characters required to make a String Palindromic",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic.md",sourceDirName:"Problems/StriverSDESheet/Day16",slug:"/Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic.md",tags:[{label:"Two Pointer",permalink:"/CodePrime/docs/tags/two-pointer"},{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"String Matching",permalink:"/CodePrime/docs/tags/string-matching"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Two Pointer","String","String Matching"]},sidebar:"api",previous:{title:"Implement strStr()",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Implement strStr"},next:{title:"Valid Anagram",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Valid Anagram"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"minimum-characters-required-to-make-a-string-palindromic"},"Minimum Characters required to make a String Palindromic"),(0,a.kt)("h2",{id:"problem-link"},"Problem Link"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://www.interviewbit.com/problems/minimum-characters-required-to-make-a-string-palindromic/"},"https://www.interviewbit.com/problems/minimum-characters-required-to-make-a-string-palindromic/")),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(i.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"const int mod = 1e9 + 7;\nconst int p = 31;\n#define ll long long\n\nll powr(ll a, ll b) {\n    ll ans = 1;\n    while (b) {\n        if (b & 1ll) {\n            ans *= a;\n            ans %= mod;\n        }\n        a *= a;\n        b >>= 1ll;\n        a %= mod;\n    }\n    return ans;\n}\n\nll inv(ll a) { return powr(a, mod - 2); }\n\nint Solution::solve(string A) {\n    string s = A;\n    reverse(s.begin(), s.end());\n    int n = A.length();\n    ll dp[n];\n    dp[0] = A[0] - 'a' + 1;\n    for (int i = 1; i < n; i++) {\n        dp[i] = (dp[i - 1] + (powr(p, i) * (A[i] - 'a' + 1)) % mod) % mod;\n    }\n    ll kmp = 0;\n    for (int i = 0; i < n; i++) {\n        kmp += powr(p, i) * (s[i] - 'a' + 1);\n        kmp %= mod;\n    }\n    if (kmp == dp[n - 1]) {\n        return 0;\n    }\n    for (int i = 0; i < n; i++) {\n        kmp -= (s[i] - 'a' + 1);\n        kmp *= inv(p);\n        kmp %= mod;\n        kmp += mod;\n        kmp %= mod;\n        if (kmp == dp[n - i - 2]) {\n            return i + 1;\n        }\n    }\n}\n\n"))))))}u.isMDXComponent=!0}}]);