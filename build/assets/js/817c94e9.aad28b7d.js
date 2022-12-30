"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7043],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),m=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},c=function(e){var t=m(e.components);return n.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=m(a),d=r,b=u["".concat(i,".").concat(d)]||u[d]||p[d]||o;return a?n.createElement(b,l(l({ref:t},c),{},{components:a})):n.createElement(b,l({ref:t},c))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,l=new Array(o);l[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,l[1]=s;for(var m=2;m<o;m++)l[m]=a[m];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(7294),r=a(4334);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:a,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,l),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(3117),r=a(7294),o=a(4334),l=a(2389),s=a(7392),i=a(7094),m=a(2466);const c="tabList__CuJ",p="tabItem_LNqP";function u(e){var t,a;const{lazy:l,block:u,defaultValue:d,values:b,groupId:k,className:h}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=b?b:f.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),y=(0,s.l)(g,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const N=null===d?d:null!=(t=null!=d?d:null==(a=f.find((e=>e.props.default)))?void 0:a.props.value)?t:f[0].props.value;if(null!==N&&!g.some((e=>e.value===N)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+N+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:w}=(0,i.U)(),[O,x]=(0,r.useState)(N),A=[],{blockElementScrollPositionUntilNextRender:E}=(0,m.o5)();if(null!=k){const e=v[k];null!=e&&e!==O&&g.some((t=>t.value===e))&&x(e)}const T=e=>{const t=e.currentTarget,a=A.indexOf(t),n=g[a].value;n!==O&&(E(t),x(n),null!=k&&w(k,String(n)))},P=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=A.indexOf(e.currentTarget)+1;a=null!=(n=A[t])?n:A[0];break}case"ArrowLeft":{var r;const t=A.indexOf(e.currentTarget)-1;a=null!=(r=A[t])?r:A[A.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":u},h)},g.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>A.push(e),onKeyDown:P,onFocus:T,onClick:T},l,{className:(0,o.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":O===t})}),null!=a?a:t)}))),l?(0,r.cloneElement)(f.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,l.Z)();return r.createElement(u,(0,n.Z)({key:String(t)},e))}},9333:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>m,toc:()=>p});var n=a(3117),r=(a(7294),a(3905)),o=a(5488),l=a(5162);const s={sidebar_position:7,tags:["Array","Binary Search"]},i="Allocate Books",m={unversionedId:"codes/allocate-books",id:"codes/allocate-books",title:"Allocate Books",description:"Problem",source:"@site/docs/codes/allocate-books.md",sourceDirName:"codes",slug:"/codes/allocate-books",permalink:"/CodePrime/docs/codes/allocate-books",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/allocate-books.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Binary Search",permalink:"/CodePrime/docs/tags/binary-search"}],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,tags:["Array","Binary Search"]},sidebar:"Leetcode",previous:{title:"Binary Search",permalink:"/CodePrime/docs/category/binary-search"},next:{title:"K-th element of two sorted Arrays",permalink:"/CodePrime/docs/codes/k-th-element-of-two-sorted-array"}},c={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:p};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"allocate-books"},"Allocate Books"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://www.interviewbit.com/problems/allocate-books/"},"Problem")),(0,r.kt)("p",null,"Given an array of integers ",(0,r.kt)("strong",null,"A")," of size ",(0,r.kt)("strong",null,"N")," and an integer ",(0,r.kt)("strong",null,"B"),"."),(0,r.kt)("p",null,"College library has ",(0,r.kt)("strong",null,"N")," bags,the ",(0,r.kt)("strong",null,"ith")," book has ",(0,r.kt)("strong",null,"A[i]")," number of pages."),(0,r.kt)("p",null,"You have to allocate books to ",(0,r.kt)("strong",null,"B")," number of students so that maximum number of pages alloted to a student is minimum."),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"A book will be allocated to exactly one student.\nEach student has to be allocated at least one book.\nAllotment should be in contiguous order, for example: A student cannot be allocated book 1 and book 3, skipping book 2.")),(0,r.kt)("p",null,"Calculate and return that minimum possible number."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Divide and Conquer and implementation."),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow"},"\u2217"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n*log(n))")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,r.kt)("span",{parentName:"span",className:"mbin"},"\u2217"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},"))")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"bool possible(vector<int> A, int B, int n, long long curr_min) {\n    long long curr_sum = 0;\n    int student_required = 1;\n\n    for (int i = 0; i < n; i++) {\n        if (A[i] > curr_min) return false;\n        if (A[i] + curr_sum > curr_min) {\n            student_required++;\n            curr_sum = A[i];\n            if (student_required > B) return false;\n        } else\n            curr_sum += A[i];\n    }\n    return true;\n}\n\nint Solution::books(vector<int> &A, int B) {\n    int n = A.size();\n    if (B > n) return -1;\n    if (n == 1) return A[0];\n    long long sm = 0;\n    for (int i = 0; i < n; i++) {\n        sm += A[i];\n    }\n    long long min = 0, max = sm, ans = -1;\n    while (min <= max) {\n        long long mid = min + (max - min) / 2;\n        if (possible(A, B, n, mid)) {\n            ans = mid;\n            max = mid - 1;\n        } else {\n            min = mid + 1;\n        }\n    }\n    return ans;\n}\n"))))))}d.isMDXComponent=!0}}]);