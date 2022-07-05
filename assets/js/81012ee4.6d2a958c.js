"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6770],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(a),d=n,h=u["".concat(i,".").concat(d)]||u[d]||m[d]||o;return a?r.createElement(h,l(l({ref:t},p),{},{components:a})):r.createElement(h,l({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,l=new Array(o);l[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var c=2;c<o;c++)l[c]=a[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>n});var r=a(7294);const n=function(e){let{children:t,hidden:a,className:n}=e;return r.createElement("div",{role:"tabpanel",hidden:a,className:n},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>p});var r=a(7462),n=a(7294),o=a(2389),l=a(5773),s=a(6010);const i="tabItem_LplD";function c(e){var t,a,o;const{lazy:c,block:p,defaultValue:m,values:u,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=u?u:b.map((e=>{let{props:{value:t,label:a,attributes:r}}=e;return{value:t,label:a,attributes:r}})),f=(0,l.lx)(g,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===m?m:null!=(t=null!=m?m:null==(a=b.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(o=b[0])?void 0:o.props.value;if(null!==v&&!g.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,l.UB)(),[N,w]=(0,n.useState)(v),x=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&g.some((t=>t.value===e))&&w(e)}const T=e=>{const t=e.currentTarget,a=x.indexOf(t),r=g[a].value;r!==N&&(O(t),w(r),null!=d&&y(d,r))},E=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=x.indexOf(e.currentTarget)+1;a=x[t]||x[0];break}case"ArrowLeft":{const t=x.indexOf(e.currentTarget)-1;a=x[t]||x[x.length-1];break}}null==(t=a)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},h)},g.map((e=>{let{value:t,label:a,attributes:o}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>x.push(e),onKeyDown:E,onFocus:T,onClick:T},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,o.Z)();return n.createElement(c,(0,r.Z)({key:String(t)},e))}},1259:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>u});var r=a(7462),n=(a(7294),a(3905)),o=a(9877),l=a(8215);const s={displayed_sidebar:null,sidebar_position:4,tags:["Array","Backtracking"]},i="M-Coloring Problem",c={unversionedId:"codes/m-coloring-problem",id:"codes/m-coloring-problem",title:"M-Coloring Problem",description:"Problem",source:"@site/docs/codes/m-coloring-problem.md",sourceDirName:"codes",slug:"/codes/m-coloring-problem",permalink:"/CodePrime/docs/codes/m-coloring-problem",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/m-coloring-problem.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"}],version:"current",sidebarPosition:4,frontMatter:{displayed_sidebar:null,sidebar_position:4,tags:["Array","Backtracking"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:p};function u(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"m-coloring-problem"},"M-Coloring Problem"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1#"},"Problem")),(0,n.kt)("span",null,"Given an undirected graph and an integer\xa0",(0,n.kt)("strong",null,"M"),". The task is to determine if the graph can be colored with at most M\xa0colors such that no two adjacent vertices of the graph are colored with the same color. Here coloring of a graph means the assignment of colors to all vertices. Print 1\xa0if it is possible to colour vertices and 0\xa0otherwise."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Use Backtracking and find all the possible states of graph and pick the valid one accordingly."),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("msup",{parentName:"mrow"},(0,n.kt)("mi",{parentName:"msup"},"M"),(0,n.kt)("mi",{parentName:"msup"},"N")),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(M^N)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0913em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord"},(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.10903em"}},"M"),(0,n.kt)("span",{parentName:"span",className:"msupsub"},(0,n.kt)("span",{parentName:"span",className:"vlist-t"},(0,n.kt)("span",{parentName:"span",className:"vlist-r"},(0,n.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8413em"}},(0,n.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,n.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,n.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,n.kt)("span",{parentName:"span",className:"mord mathnormal mtight",style:{marginRight:"0.10903em"}},"N")))))))),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"bool isGood(bool graph[101][101], int vertex, int color[], int n) {\n    for (int i = 0; i < n; i++) {\n        if (graph[vertex][i] && color[vertex] == color[i]) return false;\n    }\n    return true;\n}\n\nbool graphColor(bool graph[101][101], int vertex, int n, int m, int color[]) {\n    if (n == vertex) return true;\n\n    for (int j = 1; j <= m; j++) {\n        color[vertex] = j;\n        if (isGood(graph, vertex, color, n)) {\n            if (graphColor(graph, vertex + 1, n, m, color)) return true;\n        }\n        color[vertex] = 0;\n    }\n    return false;\n}\n\nbool graphColoring(bool graph[101][101], int m, int n) {\n    int color[n];\n    memset(color, 0, sizeof(color));\n    return graphColor(graph, 0, n, m, color);\n}\n\n"))))))}u.isMDXComponent=!0}}]);