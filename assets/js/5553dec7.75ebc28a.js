"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[76],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),m=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=m(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=m(r),d=n,h=u["".concat(s,".").concat(d)]||u[d]||c[d]||o;return r?a.createElement(h,i(i({ref:t},p),{},{components:r})):a.createElement(h,i({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var m=2;m<o;m++)i[m]=r[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>p});var a=r(7462),n=r(7294),o=r(2389),i=r(5773),l=r(6010);const s="tabItem_LplD";function m(e){var t,r,o;const{lazy:m,block:p,defaultValue:c,values:u,groupId:d,className:h}=e,v=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=u?u:v.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),g=(0,i.lx)(b,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===c?c:null!=(t=null!=c?c:null==(r=v.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=v[0])?void 0:o.props.value;if(null!==f&&!b.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,i.UB)(),[N,w]=(0,n.useState)(f),D=[],{blockElementScrollPositionUntilNextRender:S}=(0,i.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&b.some((t=>t.value===e))&&w(e)}const P=e=>{const t=e.currentTarget,r=D.indexOf(t),a=b[r].value;a!==N&&(S(t),w(a),null!=d&&y(d,a))},j=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=D.indexOf(e.currentTarget)+1;r=D[t]||D[0];break}case"ArrowLeft":{const t=D.indexOf(e.currentTarget)-1;r=D[t]||D[D.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},h)},b.map((e=>{let{value:t,label:r,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>D.push(e),onKeyDown:j,onFocus:P,onClick:P},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),m?(0,n.cloneElement)(v.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},v.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,o.Z)();return n.createElement(m,(0,a.Z)({key:String(t)},e))}},3986:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>l,contentTitle:()=>s,metadata:()=>m,toc:()=>p,default:()=>u});var a=r(7462),n=(r(7294),r(3905)),o=r(9877),i=r(8215);const l={sidebar_position:2,tags:["Graph","Dynamic Programming","Heap(Priority_Queue)"]},s="Dijkstra Algorithm",m={unversionedId:"Problems/StriverSDESheet/Day24/Dijkstra Algorithm",id:"Problems/StriverSDESheet/Day24/Dijkstra Algorithm",title:"Dijkstra Algorithm",description:"Problem",source:"@site/docs/Problems/StriverSDESheet/Day24/Dijkstra Algorithm.md",sourceDirName:"Problems/StriverSDESheet/Day24",slug:"/Problems/StriverSDESheet/Day24/Dijkstra Algorithm",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day24/Dijkstra Algorithm",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day24/Dijkstra Algorithm.md",tags:[{label:"Graph",permalink:"/CodePrime/docs/tags/graph"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Heap(Priority_Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Graph","Dynamic Programming","Heap(Priority_Queue)"]},sidebar:"api",previous:{title:"Maximum Number of Non-Overlapping Substrings",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day24/Maximum Number of Non-Overlapping Substrings"},next:{title:"Bellman-Ford Algorithm",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day24/Bellman-Ford Algorithm"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:p};function u(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"dijkstra-algorithm"},"Dijkstra Algorithm"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1"},"Problem")),(0,n.kt)("p",null,"Given a weighted, undirected and connected graph of V vertices and E edges, Find the shortest distance of all the vertex's from the source vertex S."),(0,n.kt)("strong",null,"Note:")," The Graph doesn't contain any negative weight cycle.",(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mi",{parentName:"mrow"},"l"),(0,n.kt)("mi",{parentName:"mrow"},"o"),(0,n.kt)("mi",{parentName:"mrow"},"g"),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> vis;\n    priority_queue<pair<int, int>, vector<pair<int, int>>,\n                   greater<pair<int, int>>>\n        q;\n    vector<int> wt;\n    void dfs(int cur, int par, vector<vector<int>> adj[], int wth) {\n        if (vis[cur]) return;\n        wt[cur] = wth;\n        vis[cur] = 1;\n        for (auto i : adj[cur]) {\n            if (i[0] != par) {\n                q.push({wt[cur] + i[1], i[0]});\n            }\n        }\n\n        while (!q.empty()) {\n            pair<int, int> p = q.top();\n            q.pop();\n            dfs(p.second, cur, adj, p.first);\n        }\n    }\n\n    vector<int> dijkstra(int V, vector<vector<int>> adj[], int S) {\n        vis.resize(V);\n        wt.resize(V, INT_MAX);\n        dfs(S, -1, adj, 0);\n        return wt;\n    }\n};\n\n"))))))}u.isMDXComponent=!0}}]);