"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3273],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=m(n),d=r,g=u["".concat(i,".").concat(d)]||u[d]||c[d]||s;return n?a.createElement(g,l(l({ref:t},p),{},{components:n})):a.createElement(g,l({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,l=new Array(s);l[0]=u;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var m=2;m<s;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294),r=n(4334);const s="tabItem_Ymn6";function l(e){let{children:t,hidden:n,className:l}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(s,l),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(3117),r=n(7294),s=n(4334),l=n(2389),o=n(7392),i=n(7094),m=n(2466);const p="tabList__CuJ",c="tabItem_LNqP";function u(e){var t,n;const{lazy:l,block:u,defaultValue:d,values:g,groupId:h,className:k}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=g?g:f.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),b=(0,o.l)(v,((e,t)=>e.value===t.value));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:f[0].props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:x}=(0,i.U)(),[w,O]=(0,r.useState)(y),j=[],{blockElementScrollPositionUntilNextRender:E}=(0,m.o5)();if(null!=h){const e=N[h];null!=e&&e!==w&&v.some((t=>t.value===e))&&O(e)}const T=e=>{const t=e.currentTarget,n=j.indexOf(t),a=v[n].value;a!==w&&(E(t),O(a),null!=h&&x(h,String(a)))},P=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=j.indexOf(e.currentTarget)+1;n=null!=(a=j[t])?a:j[0];break}case"ArrowLeft":{var r;const t=j.indexOf(e.currentTarget)-1;n=null!=(r=j[t])?r:j[j.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,s.Z)("tabs-container",p)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},k)},v.map((e=>{let{value:t,label:n,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>j.push(e),onKeyDown:P,onFocus:T,onClick:T},l,{className:(0,s.Z)("tabs__item",c,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),l?(0,r.cloneElement)(f.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function d(e){const t=(0,l.Z)();return r.createElement(u,(0,a.Z)({key:String(t)},e))}},644:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>m,toc:()=>c});var a=n(3117),r=(n(7294),n(3905)),s=n(5488),l=n(5162);const o={sidebar_position:1,tags:["Array","Breadth-First Search","Matrix"]},i="Rotting Oranges",m={unversionedId:"codes/rotting-oranges",id:"codes/rotting-oranges",title:"Rotting Oranges",description:"Problem",source:"@site/docs/codes/rotting-oranges.md",sourceDirName:"codes",slug:"/codes/rotting-oranges",permalink:"/CodePrime/docs/codes/rotting-oranges",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/rotting-oranges.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Matrix",permalink:"/CodePrime/docs/tags/matrix"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Array","Breadth-First Search","Matrix"]},sidebar:"Leetcode",previous:{title:"Nearest Smaller Element",permalink:"/CodePrime/docs/codes/nearest-smaller-element"},next:{title:"LFU Cache",permalink:"/CodePrime/docs/codes/lfu-cache"}},p={},c=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:c};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"rotting-oranges"},"Rotting Oranges"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/rotting-oranges/"},"Problem")),(0,r.kt)("p",null,"You are given an ",(0,r.kt)("code",null,"m x n")," ",(0,r.kt)("code",null,"grid")," where each cell can have one of three values:"),(0,r.kt)("ul",null,(0,r.kt)("li",null,(0,r.kt)("code",null,"0")," representing an empty cell,"),(0,r.kt)("li",null,(0,r.kt)("code",null,"1")," representing a fresh orange, or"),(0,r.kt)("li",null,(0,r.kt)("code",null,"2")," representing a rotten orange.")),(0,r.kt)("p",null,"Every minute, any fresh orange that is ",(0,r.kt)("strong",null,"4-directionally adjacent")," to a rotten orange becomes rotten."),(0,r.kt)("p",null,"Return ",(0,r.kt)("em",null,"the minimum number of minutes that must elapse until no cell has a fresh orange"),". If ",(0,r.kt)("em",null,"this is impossible, return")," ",(0,r.kt)("code",null,"-1"),"."),(0,r.kt)("p",null,"\xa0"),(0,r.kt)("p",null,(0,r.kt)("strong",null,"Example 1:")),(0,r.kt)("img",{alt:"",src:"https://assets.leetcode.com/uploads/2019/02/16/oranges.png",style:{width:"650px",height:"137px"}})," ",(0,r.kt)("br",null),(0,r.kt)("pre",null,(0,r.kt)("strong",null,"Input:")," grid = [[2,1,1],[1,1,0],[0,1,1]] ",(0,r.kt)("br",null),(0,r.kt)("strong",null,"Output:")," 4 ",(0,r.kt)("br",null)),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mi",{parentName:"msup"},"n")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    deque<pair<int, int>> dq;\n    vector<vector<int>> ans, vis, vis1;\n    int n, m;\n    vector<vector<int>> g;\n\n   public:\n    void dfs(int i, int j, int time) {\n        if (vis[i][j] == 1 && ans[i][j] < time) return;\n        vis[i][j] = 1;\n        ans[i][j] = min(ans[i][j], time);\n\n        int dx[] = {1, -1, 0, 0};\n        int dy[] = {0, 0, 1, -1};\n        for (int k = 0; k < 4; k++) {\n            int x = i + dx[k];\n            int y = j + dy[k];\n            if ((!(x < 0 || x >= n || y < 0 || y >= m)) && g[x][y] == 1) {\n                dfs(x, y, time + 1);\n            }\n        }\n    }\n\n    int orangesRotting(vector<vector<int>>& grid) {\n        g = grid;\n        n = grid.size();\n        m = grid[0].size();\n        ans.resize(n, vector<int>(m, INT_MAX));\n        vis = ans;\n        vis1 = vis;\n\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (grid[i][j] == 2) {\n                    g = grid;\n                    vis = vis1;\n                    dfs(i, j, 0);\n                }\n            }\n        }\n\n        int res = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (grid[i][j] != 0) {\n                    res = max(res, ans[i][j]);\n                    if (res == INT_MAX) return -1;\n                }\n            }\n        }\n\n        return res;\n    }\n};\n"))))))}d.isMDXComponent=!0}}]);