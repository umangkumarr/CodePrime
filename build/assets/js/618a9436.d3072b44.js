"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7559],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=m(n),d=r,b=p["".concat(i,".").concat(d)]||p[d]||u[d]||s;return n?a.createElement(b,o(o({ref:t},c),{},{components:n})):a.createElement(b,o({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=p;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var m=2;m<s;m++)o[m]=n[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(7462),r=n(7294),s=n(2389),o=n(5773),l=n(6010);const i="tabItem_LplD";function m(e){var t,n,s;const{lazy:m,block:c,defaultValue:u,values:p,groupId:d,className:b}=e,g=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=p?p:g.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),f=(0,o.lx)(h,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===u?u:null!=(t=null!=u?u:null==(n=g.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(s=g[0])?void 0:s.props.value;if(null!==k&&!h.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:y}=(0,o.UB)(),[N,w]=(0,r.useState)(k),x=[],{blockElementScrollPositionUntilNextRender:O}=(0,o.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&h.some((t=>t.value===e))&&w(e)}const j=e=>{const t=e.currentTarget,n=x.indexOf(t),a=h[n].value;a!==N&&(O(t),w(a),null!=d&&y(d,a))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=x.indexOf(e.currentTarget)+1;n=x[t]||x[0];break}case"ArrowLeft":{const t=x.indexOf(e.currentTarget)-1;n=x[t]||x[x.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":c},b)},h.map((e=>{let{value:t,label:n,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>x.push(e),onKeyDown:E,onFocus:j,onClick:j},s,{className:(0,l.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(g.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},g.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function c(e){const t=(0,s.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},8735:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>m,toc:()=>c,default:()=>p});var a=n(7462),r=(n(7294),n(3905)),s=n(9877),o=n(8215);const l={displayed_sidebar:null,sidebar_position:163,tags:["String","Dynamic Programming"]},i="Longest Common Subsequence",m={unversionedId:"codes/longest-common-subsequence",id:"codes/longest-common-subsequence",title:"Longest Common Subsequence",description:"Problem",source:"@site/docs/codes/longest-common-subsequence.md",sourceDirName:"codes",slug:"/codes/longest-common-subsequence",permalink:"/CodePrime/docs/codes/longest-common-subsequence",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/longest-common-subsequence.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:163,frontMatter:{displayed_sidebar:null,sidebar_position:163,tags:["String","Dynamic Programming"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:c};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"longest-common-subsequence"},"Longest Common Subsequence"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/longest-common-subsequence/"},"Problem")),(0,r.kt)("p",null,"Given two strings ",(0,r.kt)("code",null,"text1")," and ",(0,r.kt)("code",null,"text2"),", return ",(0,r.kt)("em",null,"the length of their longest ",(0,r.kt)("strong",null,"common subsequence"),". "),"If there is no ",(0,r.kt)("strong",null,"common subsequence"),", return ",(0,r.kt)("code",null,"0"),"."),(0,r.kt)("p",null,"A ",(0,r.kt)("strong",null,"subsequence")," of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters."),(0,r.kt)("ul",null,(0,r.kt)("li",null,"For example, ",(0,r.kt)("code",null,'"ace"')," is a subsequence of ",(0,r.kt)("code",null,'"abcde"'),".")),(0,r.kt)("p",null,"A ",(0,r.kt)("strong",null,"common subsequence")," of two strings is a subsequence that is common to both strings."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int longestCommonSubsequence(string text1, string text2) {\n        int n = text1.size();\n        int m = text2.size();\n\n        vector<vector<int>> dp(n + 1, vector<int>(m + 1));\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= m; j++) {\n                if (text1[i - 1] == text2[j - 1]) {\n                    dp[i][j] = dp[i - 1][j - 1] + 1;\n                }\n                dp[i][j] = max(dp[i][j], dp[i - 1][j]);\n                dp[i][j] = max(dp[i][j], dp[i][j - 1]);\n            }\n        }\n        return dp[n][m];\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);