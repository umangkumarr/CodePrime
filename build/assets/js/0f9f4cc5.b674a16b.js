"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[572],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),m=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=m(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=m(n),d=r,f=p["".concat(s,".").concat(d)]||p[d]||c[d]||o;return n?a.createElement(f,l(l({ref:t},u),{},{components:n})):a.createElement(f,l({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var m=2;m<o;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(7462),r=n(7294),o=n(2389),l=n(9548),i=n(6010),s="tabItem_LplD";function m(e){var t,n,o,m=e.lazy,u=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),k=(0,l.lx)(v,(function(e,t){return e.value===t.value}));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===c?c:null!=(t=null!=c?c:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==b&&!v.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,l.UB)(),N=y.tabGroupChoices,g=y.setTabGroupChoices,w=(0,r.useState)(b),S=w[0],E=w[1],D=[],O=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var A=N[d];null!=A&&A!==S&&v.some((function(e){return e.value===A}))&&E(A)}var x=function(e){var t=e.currentTarget,n=D.indexOf(t),a=v[n].value;a!==S&&(O(t),E(a),null!=d&&g(d,a))},T=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=D.indexOf(e.currentTarget)+1;n=D[a]||D[0];break;case"ArrowLeft":var r=D.indexOf(e.currentTarget)-1;n=D[r]||D[D.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},f)},v.map((function(e){var t=e.value,n=e.label,o=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:function(e){return D.push(e)},onKeyDown:T,onFocus:x,onClick:x},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":S===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(h.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==S})}))))}function u(e){var t=(0,o.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},4497:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return m},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),l=n(9877),i=n(8215),s=["components"],m={sidebar_position:7,tags:["Array","Binary Search"]},u="Allocate Books",c={unversionedId:"StriverSDESheet/Day11/Allocate Books",id:"StriverSDESheet/Day11/Allocate Books",title:"Allocate Books",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day11/Allocate Books.md",sourceDirName:"StriverSDESheet/Day11",slug:"/StriverSDESheet/Day11/Allocate Books",permalink:"/CodePrime/docs/StriverSDESheet/Day11/Allocate Books",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day11/Allocate Books.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Binary Search",permalink:"/CodePrime/docs/tags/binary-search"}],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,tags:["Array","Binary Search"]},sidebar:"tutorialSidebar",previous:{title:"K-th element of two sorted Arrays",permalink:"/CodePrime/docs/StriverSDESheet/Day11/Kth element of two sorted Arrays"},next:{title:"Chess Tournament",permalink:"/CodePrime/docs/StriverSDESheet/Day11/Chess Tournament"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var t=e.components,n=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"allocate-books"},"Allocate Books"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.interviewbit.com/problems/allocate-books/"},"https://www.interviewbit.com/problems/allocate-books/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Divide and Conquer and implementation."),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow"},"\u2217"),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n*log(n))")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,o.kt)("span",{parentName:"span",className:"mbin"},"\u2217"),(0,o.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},"))")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"bool possible(vector<int> A, int B, int n, long long curr_min) {\n    long long curr_sum = 0;\n    int student_required = 1;\n\n    for (int i = 0; i < n; i++) {\n        if (A[i] > curr_min) return false;\n        if (A[i] + curr_sum > curr_min) {\n            student_required++;\n            curr_sum = A[i];\n            if (student_required > B) return false;\n        } else\n            curr_sum += A[i];\n    }\n    return true;\n}\n\nint Solution::books(vector<int> &A, int B) {\n    int n = A.size();\n    if (B > n) return -1;\n    if (n == 1) return A[0];\n    long long sm = 0;\n    for (int i = 0; i < n; i++) {\n        sm += A[i];\n    }\n    long long min = 0, max = sm, ans = -1;\n    while (min <= max) {\n        long long mid = min + (max - min) / 2;\n        if (possible(A, B, n, mid)) {\n            ans = mid;\n            max = mid - 1;\n        } else {\n            min = mid + 1;\n        }\n    }\n    return ans;\n}\n"))))))}f.isMDXComponent=!0}}]);