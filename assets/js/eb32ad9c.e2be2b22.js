"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[135],{3905:function(e,n,t){t.d(n,{Zo:function(){return m},kt:function(){return d}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),u=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},m=function(e){var n=u(e.components);return r.createElement(s.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=u(t),d=a,f=p["".concat(s,".").concat(d)]||p[d]||c[d]||o;return t?r.createElement(f,i(i({ref:n},m),{},{components:t})):r.createElement(f,i({ref:n},m))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=p;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,n,t){var r=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:t,className:a},n)}},9877:function(e,n,t){t.d(n,{Z:function(){return m}});var r=t(7462),a=t(7294),o=t(2389),i=t(9548),l=t(6010),s="tabItem_LplD";function u(e){var n,t,o,u=e.lazy,m=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=p?p:v.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),h=(0,i.lx)(g,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===c?c:null!=(n=null!=c?c:null==(t=v.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(o=v[0])?void 0:o.props.value;if(null!==b&&!g.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,i.UB)(),y=k.tabGroupChoices,N=k.setTabGroupChoices,S=(0,a.useState)(b),w=S[0],T=S[1],E=[],D=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var O=y[d];null!=O&&O!==w&&g.some((function(e){return e.value===O}))&&T(O)}var P=function(e){var n=e.currentTarget,t=E.indexOf(n),r=g[t].value;r!==w&&(D(n),T(r),null!=d&&N(d,r))},x=function(e){var n,t=null;switch(e.key){case"ArrowRight":var r=E.indexOf(e.currentTarget)+1;t=E[r]||E[0];break;case"ArrowLeft":var a=E.indexOf(e.currentTarget)-1;t=E[a]||E[E.length-1]}null==(n=t)||n.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":m},f)},g.map((function(e){var n=e.value,t=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===n?0:-1,"aria-selected":w===n,key:n,ref:function(e){return E.push(e)},onKeyDown:x,onFocus:P,onClick:P},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===n})}),null!=t?t:n)}))),u?(0,a.cloneElement)(v.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,n){return(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==w})}))))}function m(e){var n=(0,o.Z)();return a.createElement(u,(0,r.Z)({key:String(n)},e))}},2552:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return m},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),i=t(9877),l=t(8215),s=["components"],u={sidebar_position:6,tags:["Graph","Dynamic Programming","Heap(Priority_Queue)"]},m="MST using Kruskal's Algo",c={unversionedId:"StriverSDESheet/Day24/MST using Kruskal Algo",id:"StriverSDESheet/Day24/MST using Kruskal Algo",title:"MST using Kruskal's Algo",description:"Problem",source:"@site/docs/StriverSDESheet/Day24/MST using Kruskal Algo.md",sourceDirName:"StriverSDESheet/Day24",slug:"/StriverSDESheet/Day24/MST using Kruskal Algo",permalink:"/CodePrime/docs/StriverSDESheet/Day24/MST using Kruskal Algo",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day24/MST using Kruskal Algo.md",tags:[{label:"Graph",permalink:"/CodePrime/docs/tags/graph"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Heap(Priority_Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Graph","Dynamic Programming","Heap(Priority_Queue)"]},sidebar:"tutorialSidebar",previous:{title:"MST using Prim's Algo",permalink:"/CodePrime/docs/StriverSDESheet/Day24/MST using Prims Algo"},next:{title:"3 Sum",permalink:"/CodePrime/docs/codes/3Sum"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var n=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"mst-using-kruskals-algo"},"MST using Kruskal's Algo"),(0,o.kt)("h2",{id:"problem"},(0,o.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1"},"Problem")),(0,o.kt)("p",null,"Given a weighted, undirected and connected graph of V vertices and E edges. The task is to find the sum of weights of the edges of the Minimum Spanning Tree."),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> par;\n\n    void make(int v) { par[v] = v; }\n\n    int find(int v) {\n        if (par[v] == v) return v;\n        return par[v] = find(par[v]);\n    }\n\n    void Union(int a, int b) {\n        int pa = find(a);\n        int pb = find(b);\n        par[pb] = pa;\n    }\n\n    int spanningTree(int V, vector<vector<int>> adj[]) {\n        // code here\n        par.resize(V);\n        vector<pair<int, pair<int, int>>> edges;\n        int ans = 0;\n        for (int i = 0; i < V; i++) {\n            for (auto j : adj[i]) {\n                edges.push_back({j[1], {i, j[0]}});\n            }\n            make(i);\n        }\n        sort(edges.begin(), edges.end());\n        for (auto e : edges) {\n            int w = e.first;\n            int u = e.second.first;\n            int v = e.second.second;\n            if (find(u) == find(v)) continue;\n            ans += w;\n            Union(u, v);\n        }\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);