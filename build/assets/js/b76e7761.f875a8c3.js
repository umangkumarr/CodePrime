"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4614],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return d}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),m=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},u=function(e){var t=m(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),p=m(a),d=r,h=p["".concat(s,".").concat(d)]||p[d]||c[d]||i;return a?n.createElement(h,l(l({ref:t},u),{},{components:a})):n.createElement(h,l({ref:t},u))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=p;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var m=2;m<i;m++)l[m]=a[m];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},8215:function(e,t,a){var n=a(7294);t.Z=function(e){var t=e.children,a=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:function(e,t,a){a.d(t,{Z:function(){return u}});var n=a(7462),r=a(7294),i=a(2389),l=a(9548),o=a(6010),s="tabItem_LplD";function m(e){var t,a,i,m=e.lazy,u=e.block,c=e.defaultValue,p=e.values,d=e.groupId,h=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,l.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===c?c:null!=(t=null!=c?c:null==(a=f.find((function(e){return e.props.default})))?void 0:a.props.value)?t:null==(i=f[0])?void 0:i.props.value;if(null!==y&&!v.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.UB)(),g=k.tabGroupChoices,N=k.setTabGroupChoices,x=(0,r.useState)(y),w=x[0],S=x[1],P=[],D=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var M=g[d];null!=M&&M!==w&&v.some((function(e){return e.value===M}))&&S(M)}var E=function(e){var t=e.currentTarget,a=P.indexOf(t),n=v[a].value;n!==w&&(D(t),S(n),null!=d&&N(d,n))},O=function(e){var t,a=null;switch(e.key){case"ArrowRight":var n=P.indexOf(e.currentTarget)+1;a=P[n]||P[0];break;case"ArrowLeft":var r=P.indexOf(e.currentTarget)-1;a=P[r]||P[P.length-1]}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":u},h)},v.map((function(e){var t=e.value,a=e.label,i=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return P.push(e)},onKeyDown:O,onFocus:E,onClick:E},i,{className:(0,o.Z)("tabs__item",s,null==i?void 0:i.className,{"tabs__item--active":w===t})}),null!=a?a:t)}))),m?(0,r.cloneElement)(f.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function u(e){var t=(0,i.Z)();return r.createElement(m,(0,n.Z)({key:String(t)},e))}},1408:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return m},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return p},default:function(){return h}});var n=a(7462),r=a(3366),i=(a(7294),a(3905)),l=a(9877),o=a(8215),s=["components"],m={sidebar_position:7,tags:["Matrix","Dynamic Programming"]},u="Matrix Chain Multiplication",c={unversionedId:"Problems/StriverSDESheet/Day25/Matrix Chain Multiplication",id:"Problems/StriverSDESheet/Day25/Matrix Chain Multiplication",title:"Matrix Chain Multiplication",description:"Problem",source:"@site/docs/Problems/StriverSDESheet/Day25/Matrix Chain Multiplication.md",sourceDirName:"Problems/StriverSDESheet/Day25",slug:"/Problems/StriverSDESheet/Day25/Matrix Chain Multiplication",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day25/Matrix Chain Multiplication",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day25/Matrix Chain Multiplication.md",tags:[{label:"Matrix",permalink:"/CodePrime/docs/tags/matrix"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,tags:["Matrix","Dynamic Programming"]},sidebar:"api",previous:{title:"Maximum sum increasing subsequence",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day25/Maximum sum increasing subsequence"},next:{title:"Minimum Path Sum",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day26/Minimum Path Sum"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function h(e){var t=e.components,a=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"matrix-chain-multiplication"},"Matrix Chain Multiplication"),(0,i.kt)("h2",{id:"problem"},(0,i.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1"},"Problem")),(0,i.kt)("p",null,"Given a sequence of matrices, find the most efficient way to multiply these matrices together. The efficient way is the one that involves the least number of multiplications."),(0,i.kt)("p",null,"The dimensions of the matrices are given in an array arr[] of size N (such that N = number of matrices + 1) where the ith matrix has the dimensions ",(0,i.kt)("strong",null,"(arr","[i-1]"," x arr","[i]",")"),"."),(0,i.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,i.kt)("p",null,"Expected Time complexity: ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mi",{parentName:"mrow"},"O"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msup",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msup"},"n"),(0,i.kt)("mn",{parentName:"msup"},"3")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^3)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mtight"},"3")))))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Click - to see solution code"),(0,i.kt)(l.Z,{mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int matrixMultiplication(int N, int A[]) {\n        int dp[200][200] = {0};\n        memset(dp, 0, sizeof dp);\n        int n = N - 1;\n        for (int i = 1; i < n; i++) {\n            int r = 0, c = i;\n            while (c < n) {\n                int val = INT_MAX;\n                for (int pivot = r; pivot < c; pivot++) {\n                    val = min(val, dp[r][pivot] + dp[pivot + 1][c] +\n                                       A[r] * A[pivot + 1] * A[c + 1]);\n                }\n                dp[r][c] = val;\n                r++;\n                c++;\n            }\n        }\n        return dp[0][n - 1];\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);