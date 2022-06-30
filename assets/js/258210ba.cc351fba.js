"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3010],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),m=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=m(e.components);return n.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=m(a),d=r,h=u["".concat(l,".").concat(d)]||u[d]||c[d]||i;return a?n.createElement(h,s(s({ref:t},p),{},{components:a})):n.createElement(h,s({ref:t},p))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,s=new Array(i);s[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:r,s[1]=o;for(var m=2;m<i;m++)s[m]=a[m];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);const r=function(e){let{children:t,hidden:a,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>p});var n=a(7462),r=a(7294),i=a(2389),s=a(5773),o=a(6010);const l="tabItem_LplD";function m(e){var t,a,i;const{lazy:m,block:p,defaultValue:c,values:u,groupId:d,className:h}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=u?u:b.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),g=(0,s.lx)(k,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===c?c:null!=(t=null!=c?c:null==(a=b.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(i=b[0])?void 0:i.props.value;if(null!==v&&!k.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:f,setTabGroupChoices:y}=(0,s.UB)(),[N,P]=(0,r.useState)(v),S=[],{blockElementScrollPositionUntilNextRender:w}=(0,s.o5)();if(null!=d){const e=f[d];null!=e&&e!==N&&k.some((t=>t.value===e))&&P(e)}const D=e=>{const t=e.currentTarget,a=S.indexOf(t),n=k[a].value;n!==N&&(w(t),P(n),null!=d&&y(d,n))},E=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=S.indexOf(e.currentTarget)+1;a=S[t]||S[0];break}case"ArrowLeft":{const t=S.indexOf(e.currentTarget)-1;a=S[t]||S[S.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},h)},k.map((e=>{let{value:t,label:a,attributes:i}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>S.push(e),onKeyDown:E,onFocus:D,onClick:D},i,{className:(0,o.Z)("tabs__item",l,null==i?void 0:i.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),m?(0,r.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,i.Z)();return r.createElement(m,(0,n.Z)({key:String(t)},e))}},9106:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>o,contentTitle:()=>l,metadata:()=>m,toc:()=>p,default:()=>u});var n=a(7462),r=(a(7294),a(3905)),i=a(9877),s=a(8215);const o={sidebar_position:5,tags:["String","Backtracking","Dynamic Programming"]},l="Palindrome Partitioning",m={unversionedId:"Problems/StriverSDESheet/Day9/Palindrome Partitioning",id:"Problems/StriverSDESheet/Day9/Palindrome Partitioning",title:"Palindrome Partitioning",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day9/Palindrome Partitioning.md",sourceDirName:"Problems/StriverSDESheet/Day9",slug:"/Problems/StriverSDESheet/Day9/Palindrome Partitioning",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day9/Palindrome Partitioning",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day9/Palindrome Partitioning.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,tags:["String","Backtracking","Dynamic Programming"]},sidebar:"api",previous:{title:"Combination Sum II",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day9/Combination Sum II"},next:{title:"Permutation Sequence",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day9/Permutation Sequence"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:p};function u(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"palindrome-partitioning"},"Palindrome Partitioning"),(0,r.kt)("h2",{id:"problem-link"},"Problem Link"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/palindrome-partitioning/"},"https://leetcode.com/problems/palindrome-partitioning/")),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"View Backtracting take the all the possible prefix string of s and check if it is palindrome. If it is"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"add it in the arr and check for the palindrome starting after this string"),(0,r.kt)("li",{parentName:"ul"},"not, check for different prefix palindrome")),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(i.Z,{mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},'class Solution {\n    int n;\n    string w;\n    vector<string> arr;\n    vector<vector<string>> ans;\n\n   public:\n    void partition(int indx) {\n        if (indx == n) {\n            ans.push_back(arr);\n            return;\n        }\n        string s = "", revs;\n        for (int j = indx; j < n; j++) {\n            s.push_back(w[j]);\n            revs = s;\n            reverse(revs.begin(), revs.end());\n            if (revs == s) {\n                arr.push_back(s);\n                partition(j + 1);\n                arr.pop_back();\n            }\n        }\n    }\n\n    vector<vector<string>> partition(string s) {\n        this->n = s.length();\n        this->w = s;\n        partition(0);\n        return ans;\n    }\n};\n'))))))}u.isMDXComponent=!0}}]);