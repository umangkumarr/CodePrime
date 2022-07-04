"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5896],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=m(n),d=r,g=u["".concat(i,".").concat(d)]||u[d]||c[d]||s;return n?a.createElement(g,l(l({ref:t},p),{},{components:n})):a.createElement(g,l({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,l=new Array(s);l[0]=u;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var m=2;m<s;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(7462),r=n(7294),s=n(2389),l=n(5773),o=n(6010);const i="tabItem_LplD";function m(e){var t,n,s;const{lazy:m,block:p,defaultValue:c,values:u,groupId:d,className:g}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=u?u:b.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),f=(0,l.lx)(h,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===c?c:null!=(t=null!=c?c:null==(n=b.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(s=b[0])?void 0:s.props.value;if(null!==v&&!h.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,l.UB)(),[N,x]=(0,r.useState)(v),w=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&h.some((t=>t.value===e))&&x(e)}const P=e=>{const t=e.currentTarget,n=w.indexOf(t),a=h[n].value;a!==N&&(O(t),x(a),null!=d&&y(d,a))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;n=w[t]||w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;n=w[t]||w[w.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},g)},h.map((e=>{let{value:t,label:n,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>w.push(e),onKeyDown:E,onFocus:P,onClick:P},s,{className:(0,o.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,s.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},3615:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>o,contentTitle:()=>i,metadata:()=>m,toc:()=>p,default:()=>u});var a=n(7462),r=(n(7294),n(3905)),s=n(9877),l=n(8215);const o={sidebar_position:94,tags:["String","Dynamic Programming"]},i="Longest Palindromic Substring",m={unversionedId:"codes/longest-palindromic-substring",id:"codes/longest-palindromic-substring",title:"Longest Palindromic Substring",description:"Problem",source:"@site/docs/codes/longest-palindromic-substring.md",sourceDirName:"codes",slug:"/codes/longest-palindromic-substring",permalink:"/CodePrime/docs/codes/longest-palindromic-substring",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/longest-palindromic-substring.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:94,frontMatter:{sidebar_position:94,tags:["String","Dynamic Programming"]},sidebar:"main",previous:{title:"Roman to Integer",permalink:"/CodePrime/docs/codes/roman-to-integer"},next:{title:"Longest Common Prefix",permalink:"/CodePrime/docs/codes/longest-common-prefix"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:p};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"longest-palindromic-substring"},"Longest Palindromic Substring"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/longest-palindromic-substring/"},"Problem")),(0,r.kt)("p",null,"Given a string ",(0,r.kt)("code",null,"s"),", return ",(0,r.kt)("em",null,"the longest palindromic substring")," in ",(0,r.kt)("code",null,"s"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    string longestPalindrome(string s) {\n        int n = s.length();\n        if (n <= 1) {\n            return s;\n        }\n        int mx = 0;\n        int indx, mxx = 0;\n        for (int i = 0; i < n; i++) {\n            mxx = max(mxx, i);\n            for (int j = n - 1; j >= mxx; j--) {\n                int itr = j, itr1 = i;\n                int len = 0;\n                while (itr1 <= itr && s[itr1] == s[itr]) {\n                    if (itr1 != itr)\n                        len += 2;\n                    else\n                        len++;\n                    itr1++;\n                    itr--;\n                }\n                if (itr1 >= itr && mx < len) {\n                    mx = len;\n                    indx = i;\n                    mxx = max(mxx, j);\n                }\n            }\n        }\n        string ans = string(s.begin() + indx, s.begin() + indx + mx);\n        return ans;\n    }\n};\n\n"))))))}u.isMDXComponent=!0}}]);