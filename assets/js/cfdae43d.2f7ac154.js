"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[8521],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,h=d["".concat(s,".").concat(m)]||d[m]||u[m]||l;return n?a.createElement(h,o(o({ref:t},p),{},{components:n})):a.createElement(h,o({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var c=2;c<l;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(7462),r=n(7294),l=n(2389),o=n(5773),i=n(6010);const s="tabItem_LplD";function c(e){var t,n,l;const{lazy:c,block:p,defaultValue:u,values:d,groupId:m,className:h}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=d?d:b.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,o.lx)(f,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===u?u:null!=(t=null!=u?u:null==(n=b.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(l=b[0])?void 0:l.props.value;if(null!==k&&!f.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:y}=(0,o.UB)(),[N,w]=(0,r.useState)(k),O=[],{blockElementScrollPositionUntilNextRender:T}=(0,o.o5)();if(null!=m){const e=g[m];null!=e&&e!==N&&f.some((t=>t.value===e))&&w(e)}const x=e=>{const t=e.currentTarget,n=O.indexOf(t),a=f[n].value;a!==N&&(T(t),w(a),null!=m&&y(m,a))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;n=O[t]||O[O.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":p},h)},f.map((e=>{let{value:t,label:n,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>O.push(e),onKeyDown:E,onFocus:x,onClick:x},l,{className:(0,i.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),c?(0,r.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,l.Z)();return r.createElement(c,(0,a.Z)({key:String(t)},e))}},3494:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>c,toc:()=>p,default:()=>d});var a=n(7462),r=(n(7294),n(3905)),l=n(9877),o=n(8215);const i={displayed_sidebar:null,sidebar_position:149,tags:["Depth-First Search","Breadth-First Search","Union Find","Graph"]},s="Is Graph Bipartite?",c={unversionedId:"codes/is-graph-bipartite",id:"codes/is-graph-bipartite",title:"Is Graph Bipartite?",description:"Problem",source:"@site/docs/codes/is-graph-bipartite.md",sourceDirName:"codes",slug:"/codes/is-graph-bipartite",permalink:"/docs/codes/is-graph-bipartite",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/is-graph-bipartite.md",tags:[{label:"Depth-First Search",permalink:"/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/docs/tags/breadth-first-search"},{label:"Union Find",permalink:"/docs/tags/union-find"},{label:"Graph",permalink:"/docs/tags/graph"}],version:"current",sidebarPosition:149,frontMatter:{displayed_sidebar:null,sidebar_position:149,tags:["Depth-First Search","Breadth-First Search","Union Find","Graph"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:p};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"is-graph-bipartite"},"Is Graph Bipartite?"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/is-graph-bipartite/"},"Problem")),(0,r.kt)("p",null,"There is an ",(0,r.kt)("strong",null,"undirected")," graph with ",(0,r.kt)("code",null,"n")," nodes, where each node is numbered between ",(0,r.kt)("code",null,"0")," and ",(0,r.kt)("code",null,"n - 1"),". You are given a 2D array ",(0,r.kt)("code",null,"graph"),", where ",(0,r.kt)("code",null,"graph[u]")," is an array of nodes that node ",(0,r.kt)("code",null,"u")," is adjacent to. More formally, for each ",(0,r.kt)("code",null,"v")," in ",(0,r.kt)("code",null,"graph[u]"),", there is an undirected edge between node ",(0,r.kt)("code",null,"u")," and node ",(0,r.kt)("code",null,"v"),". The graph has the following properties:"),(0,r.kt)("ul",null,(0,r.kt)("li",null,"There are no self-edges (",(0,r.kt)("code",null,"graph[u]")," does not contain ",(0,r.kt)("code",null,"u"),")."),(0,r.kt)("li",null,"There are no parallel edges (",(0,r.kt)("code",null,"graph[u]")," does not contain duplicate values)."),(0,r.kt)("li",null,"If ",(0,r.kt)("code",null,"v")," is in ",(0,r.kt)("code",null,"graph[u]"),", then ",(0,r.kt)("code",null,"u")," is in ",(0,r.kt)("code",null,"graph[v]")," (the graph is undirected)."),(0,r.kt)("li",null,"The graph may not be connected, meaning there may be two nodes ",(0,r.kt)("code",null,"u")," and ",(0,r.kt)("code",null,"v")," such that there is no path between them.")),(0,r.kt)("p",null,"A graph is ",(0,r.kt)("strong",null,"bipartite")," if the nodes can be partitioned into two independent sets ",(0,r.kt)("code",null,"A")," and ",(0,r.kt)("code",null,"B")," such that ",(0,r.kt)("strong",null,"every")," edge in the graph connects a node in set ",(0,r.kt)("code",null,"A")," and a node in set ",(0,r.kt)("code",null,"B"),"."),(0,r.kt)("p",null,"Return ",(0,r.kt)("code",null,"true"),(0,r.kt)("em",null," if and only if it is ",(0,r.kt)("strong",null,"bipartite")),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    bool dfs_helper(vector<vector<int>> Graph, vector<int>& visited, int par,\n                    int node, int color) {\n        visited[node] = color;          // painted\n        for (auto nbr : Graph[node]) {  // traversing nbrs\n            if (nbr != par and visited[nbr] == 0) {\n                bool value = dfs_helper(Graph, visited, node, nbr, 3 - color);\n                if (value == false) return false;\n            } else if (visited[nbr] == color)\n                return false;\n        }\n        return true;\n    }\n\n    bool dfs(vector<vector<int>> Graph, int N) {\n        vector<int> visited(N + 1);\n        int color = 1;\n        for (int i = 0; i < N; i++) {\n            if (visited[i] == 0) {\n                bool ans = dfs_helper(Graph, visited, -1, i, 1);\n                if (ans == false) return ans;\n            }\n        }\n        return true;\n    }\n\n    bool isBipartite(vector<vector<int>>& graph) {\n        int n = graph.size();\n        return dfs(graph, n);\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);