"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9383],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(a),d=n,h=m["".concat(i,".").concat(d)]||m[d]||u[d]||o;return a?r.createElement(h,l(l({ref:t},p),{},{components:a})):r.createElement(h,l({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,l=new Array(o);l[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var c=2;c<o;c++)l[c]=a[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>n});var r=a(7294);const n=function(e){let{children:t,hidden:a,className:n}=e;return r.createElement("div",{role:"tabpanel",hidden:a,className:n},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>p});var r=a(7462),n=a(7294),o=a(2389),l=a(5773),s=a(6010);const i="tabItem_LplD";function c(e){var t,a,o;const{lazy:c,block:p,defaultValue:u,values:m,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:b.map((e=>{let{props:{value:t,label:a,attributes:r}}=e;return{value:t,label:a,attributes:r}})),v=(0,l.lx)(f,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===u?u:null!=(t=null!=u?u:null==(a=b.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(o=b[0])?void 0:o.props.value;if(null!==g&&!f.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,l.UB)(),[N,w]=(0,n.useState)(g),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&f.some((t=>t.value===e))&&w(e)}const E=e=>{const t=e.currentTarget,a=T.indexOf(t),r=f[a].value;r!==N&&(O(t),w(r),null!=d&&y(d,r))},x=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;a=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;a=T[t]||T[T.length-1];break}}null==(t=a)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},h)},f.map((e=>{let{value:t,label:a,attributes:o}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>T.push(e),onKeyDown:x,onFocus:E,onClick:E},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,o.Z)();return n.createElement(c,(0,r.Z)({key:String(t)},e))}},9127:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>m});var r=a(7462),n=(a(7294),a(3905)),o=a(9877),l=a(8215);const s={displayed_sidebar:null,sidebar_position:6,tags:["Hash Table","Depth-First Search","Breadth-First Search","Graph"]},i="Topological sort",c={unversionedId:"codes/topological-sort",id:"codes/topological-sort",title:"Topological sort",description:"Problem",source:"@site/docs/codes/topological-sort.md",sourceDirName:"codes",slug:"/codes/topological-sort",permalink:"/CodePrime/docs/codes/topological-sort",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/topological-sort.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Graph",permalink:"/CodePrime/docs/tags/graph"}],version:"current",sidebarPosition:6,frontMatter:{displayed_sidebar:null,sidebar_position:6,tags:["Hash Table","Depth-First Search","Breadth-First Search","Graph"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:p};function m(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"topological-sort"},"Topological sort"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/topological-sort/1"},"Problem")),(0,n.kt)("p",null,"Given a Directed Acyclic Graph (DAG) with V vertices and E edges, Find any Topological Sorting of that Graph."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    void findTopoSort(int node, vector<int>& vis, stack<int>& st,\n                      vector<int> adj[]) {\n        vis[node] = 1;\n\n        for (auto it : adj[node]) {\n            if (!vis[it]) {\n                findTopoSort(it, vis, st, adj);\n            }\n        }\n        st.push(node);\n    }\n\n   public:\n    vector<int> topoSort(int N, vector<int> adj[]) {\n        stack<int> st;\n        vector<int> vis(N, 0);\n        for (int i = 0; i < N; i++) {\n            if (vis[i] == 0) {\n                findTopoSort(i, vis, st, adj);\n            }\n        }\n        vector<int> topo;\n        while (!st.empty()) {\n            topo.push_back(st.top());\n            st.pop();\n        }\n        return topo;\n    }\n};\n"))))))}m.isMDXComponent=!0}}]);