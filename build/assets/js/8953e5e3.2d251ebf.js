"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[8737],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>d});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=a.createContext({}),m=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=m(e.components);return a.createElement(l.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=m(t),d=r,v=u["".concat(l,".").concat(d)]||u[d]||c[d]||i;return t?a.createElement(v,o(o({ref:n},p),{},{components:t})):a.createElement(v,o({ref:n},p))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var m=2;m<i;m++)o[m]=t[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>p});var a=t(7462),r=t(7294),i=t(2389),o=t(5773),s=t(6010);const l="tabItem_LplD";function m(e){var n,t,i;const{lazy:m,block:p,defaultValue:c,values:u,groupId:d,className:v}=e,g=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=u?u:g.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),f=(0,o.lx)(h,((e,n)=>e.value===n.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const b=null===c?c:null!=(n=null!=c?c:null==(t=g.find((e=>e.props.default)))?void 0:t.props.value)?n:null==(i=g[0])?void 0:i.props.value;if(null!==b&&!h.some((e=>e.value===b)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,o.UB)(),[N,w]=(0,r.useState)(b),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,o.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&h.some((n=>n.value===e))&&w(e)}const P=e=>{const n=e.currentTarget,t=T.indexOf(n),a=h[t].value;a!==N&&(O(n),w(a),null!=d&&y(d,a))},x=e=>{var n;let t=null;switch(e.key){case"ArrowRight":{const n=T.indexOf(e.currentTarget)+1;t=T[n]||T[0];break}case"ArrowLeft":{const n=T.indexOf(e.currentTarget)-1;t=T[n]||T[T.length-1];break}}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},v)},h.map((e=>{let{value:n,label:t,attributes:i}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===n?0:-1,"aria-selected":N===n,key:n,ref:e=>T.push(e),onKeyDown:x,onFocus:P,onClick:P},i,{className:(0,s.Z)("tabs__item",l,null==i?void 0:i.className,{"tabs__item--active":N===n})}),null!=t?t:n)}))),m?(0,r.cloneElement)(g.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},g.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==N})))))}function p(e){const n=(0,i.Z)();return r.createElement(m,(0,a.Z)({key:String(n)},e))}},3716:(e,n,t)=>{t.r(n),t.d(n,{frontMatter:()=>s,contentTitle:()=>l,metadata:()=>m,toc:()=>p,default:()=>u});var a=t(7462),r=(t(7294),t(3905)),i=t(9877),o=t(8215);const s={sidebar_position:6,tags:["Graph","Dynamic Programming","Heap(Priority_Queue)"]},l="Minimum Spanning Tree",m={unversionedId:"codes/minimum-spanning-tree",id:"codes/minimum-spanning-tree",title:"Minimum Spanning Tree",description:"Problem",source:"@site/docs/codes/minimum-spanning-tree.md",sourceDirName:"codes",slug:"/codes/minimum-spanning-tree",permalink:"/CodePrime/docs/codes/minimum-spanning-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/minimum-spanning-tree.md",tags:[{label:"Graph",permalink:"/CodePrime/docs/tags/graph"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Heap(Priority_Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Graph","Dynamic Programming","Heap(Priority_Queue)"]},sidebar:"main",previous:{title:"Bellman-Ford Algorithm",permalink:"/CodePrime/docs/codes/distance-from-the-source-bellman-ford-algorithm"},next:{title:"Dynamic Programming",permalink:"/CodePrime/docs/category/dynamic-programming"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:p};function u(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"minimum-spanning-tree"},"Minimum Spanning Tree"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1"},"Problem")),(0,r.kt)("p",null,"Given a weighted, undirected and connected graph of V vertices and E edges. The task is to find the sum of weights of the edges of the Minimum Spanning Tree."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Kruskal's Algorithm"),(0,r.kt)(i.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> par;\n\n    void make(int v) { par[v] = v; }\n\n    int find(int v) {\n        if (par[v] == v) return v;\n        return par[v] = find(par[v]);\n    }\n\n    void Union(int a, int b) {\n        int pa = find(a);\n        int pb = find(b);\n        par[pb] = pa;\n    }\n\n    int spanningTree(int V, vector<vector<int>> adj[]) {\n        // code here\n        par.resize(V);\n        vector<pair<int, pair<int, int>>> edges;\n        int ans = 0;\n        for (int i = 0; i < V; i++) {\n            for (auto j : adj[i]) {\n                edges.push_back({j[1], {i, j[0]}});\n            }\n            make(i);\n        }\n        sort(edges.begin(), edges.end());\n        for (auto e : edges) {\n            int w = e.first;\n            int u = e.second.first;\n            int v = e.second.second;\n            if (find(u) == find(v)) continue;\n            ans += w;\n            Union(u, v);\n        }\n        return ans;\n    }\n};\n"))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Prim's Algorithm"),(0,r.kt)(i.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int spanningTree(int V, vector<vector<int>> adj[]) {\n        priority_queue<pair<int, int>, vector<pair<int, int>>,\n                       greater<pair<int, int>>>\n            pq;\n        vector<int> vis(V, 0);\n        vector<int> key(V, INT_MAX);\n        key[0] = 0;\n        pq.push({0, 0});\n        while (!pq.empty()) {\n            int u = pq.top().second;\n            pq.pop();\n            vis[u] = 1;\n            for (auto it : adj[u]) {\n                int v = it[0];\n                int w = it[1];\n                if (vis[v] == 0 && w < key[v]) {\n                    key[v] = w;\n                    pq.push({key[v], v});\n                }\n            }\n        }\n        int sum = 0;\n        for (int i = 0; i < V; i++) {\n            sum += key[i];\n        }\n        return sum;\n    }\n};\n"))))))}u.isMDXComponent=!0}}]);