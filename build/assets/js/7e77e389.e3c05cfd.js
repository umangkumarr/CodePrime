"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9696],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=m(n),d=r,h=u["".concat(i,".").concat(d)]||u[d]||c[d]||s;return n?a.createElement(h,l(l({ref:t},p),{},{components:n})):a.createElement(h,l({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,l=new Array(s);l[0]=u;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var m=2;m<s;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294),r=n(4334);const s="tabItem_Ymn6";function l(e){let{children:t,hidden:n,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(s,l),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(3117),r=n(7294),s=n(4334),l=n(2389),o=n(7392),i=n(7094),m=n(2466);const p="tabList__CuJ",c="tabItem_LNqP";function u(e){var t,n;const{lazy:l,block:u,defaultValue:d,values:h,groupId:f,className:g}=e,k=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=h?h:k.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,o.l)(b,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const w=null===d?d:null!=(t=null!=d?d:null==(n=k.find((e=>e.props.default)))?void 0:n.props.value)?t:k[0].props.value;if(null!==w&&!b.some((e=>e.value===w)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+w+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:N}=(0,i.U)(),[O,x]=(0,r.useState)(w),T=[],{blockElementScrollPositionUntilNextRender:P}=(0,m.o5)();if(null!=f){const e=y[f];null!=e&&e!==O&&b.some((t=>t.value===e))&&x(e)}const _=e=>{const t=e.currentTarget,n=T.indexOf(t),a=b[n].value;a!==O&&(P(t),x(a),null!=f&&N(f,String(a)))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=T.indexOf(e.currentTarget)+1;n=null!=(a=T[t])?a:T[0];break}case"ArrowLeft":{var r;const t=T.indexOf(e.currentTarget)-1;n=null!=(r=T[t])?r:T[T.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,s.Z)("tabs-container",p)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},g)},b.map((e=>{let{value:t,label:n,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>T.push(e),onKeyDown:E,onFocus:_,onClick:_},l,{className:(0,s.Z)("tabs__item",c,null==l?void 0:l.className,{"tabs__item--active":O===t})}),null!=n?n:t)}))),l?(0,r.cloneElement)(k.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},k.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,l.Z)();return r.createElement(u,(0,a.Z)({key:String(t)},e))}},1405:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>m,toc:()=>c});var a=n(3117),r=(n(7294),n(3905)),s=n(5488),l=n(5162);const o={sidebar_position:98,tags:["Two Pointers","String","String Matching"]},i="Implement strStr()",m={unversionedId:"codes/implement-strstr",id:"codes/implement-strstr",title:"Implement strStr()",description:"Problem",source:"@site/docs/codes/implement-strstr.md",sourceDirName:"codes",slug:"/codes/implement-strstr",permalink:"/CodePrime/docs/codes/implement-strstr",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/implement-strstr.md",tags:[{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"},{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"String Matching",permalink:"/CodePrime/docs/tags/string-matching"}],version:"current",sidebarPosition:98,frontMatter:{sidebar_position:98,tags:["Two Pointers","String","String Matching"]},sidebar:"Leetcode",previous:{title:"Minimum Characters required to make a String Palindromic",permalink:"/CodePrime/docs/codes/minimum-characters-required-to-make-a-string-palindromic"},next:{title:"Compare Version Numbers",permalink:"/CodePrime/docs/codes/compare-version-numbers"}},p={},c=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:c};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"implement-strstr"},"Implement strStr()"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/implement-strstr/"},"Problem")),(0,r.kt)("p",null,"Implement ",(0,r.kt)("a",{href:"http://www.cplusplus.com/reference/cstring/strstr/",target:"_blank"},"strStr()"),"."),(0,r.kt)("p",null,"Given two strings ",(0,r.kt)("code",null,"needle")," and ",(0,r.kt)("code",null,"haystack"),", return the index of the first occurrence of ",(0,r.kt)("code",null,"needle")," in ",(0,r.kt)("code",null,"haystack"),", or ",(0,r.kt)("code",null,"-1")," if ",(0,r.kt)("code",null,"needle")," is not part of ",(0,r.kt)("code",null,"haystack"),"."),(0,r.kt)("p",null,(0,r.kt)("strong",null,"Clarification:")),(0,r.kt)("p",null,"What should we return when ",(0,r.kt)("code",null,"needle")," is an empty string? This is a great question to ask during an interview."),(0,r.kt)("p",null,"For the purpose of this problem, we will return 0 when ",(0,r.kt)("code",null,"needle")," is an empty string. This is consistent to C's ",(0,r.kt)("a",{href:"http://www.cplusplus.com/reference/cstring/strstr/",target:"_blank"},"strstr()")," and Java's ",(0,r.kt)("a",{href:"https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#indexOf(java.lang.String)",target:"_blank"},"indexOf()"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlog(n))")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},"))")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"const int mod = 1e9 + 7;\nconst int p = 31;\n\nint powr(int a, int b) {\n    int ans = 1;\n    while (b) {\n        if (b & 1ll) {\n            ans *= (long long)a;\n            ans %= mod;\n        }\n        a *= (long long)a;\n        b >>= 1ll;\n        a %= mod;\n    }\n    return ans;\n}\n\nint inv(int a) { return powr(a, mod - 2); }\n\nint hashit(string s) {\n    int res = 0;\n    int m = s.length();\n    for (int i = 0; i < m; i++) {\n        res += powr(p, i) * (s[i] - 'a' + 1);\n        res %= mod;\n    }\n    return res;\n}\n\nclass Solution {\n   public:\n    int strStr(string s, string pat) {\n        int pat_hash = hashit(pat);\n        int m = pat.length();\n        int n = s.length();\n        int text_hash = hashit(s.substr(0, m));\n        if (text_hash == pat_hash) {\n            return 0;\n        }\n\n        int new_hash = text_hash;\n\n        for (int i = m; i < n; i++) {\n            new_hash -= (s[i - m] - 'a' + 1);\n            new_hash *= (long long)inv(p);\n            new_hash %= mod;\n            new_hash += (s[i] - 'a' + 1) * powr(p, m - 1);\n            new_hash %= mod;\n\n            if (new_hash == pat_hash) {\n                return i - m + 1;\n            }\n        }\n        return -1;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);