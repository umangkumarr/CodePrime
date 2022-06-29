"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4330],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return d}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),m=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},c=function(e){var n=m(e.components);return r.createElement(l.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=m(t),d=a,f=p["".concat(l,".").concat(d)]||p[d]||u[d]||i;return t?r.createElement(f,s(s({ref:n},c),{},{components:t})):r.createElement(f,s({ref:n},c))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,s=new Array(i);s[0]=p;var o={};for(var l in n)hasOwnProperty.call(n,l)&&(o[l]=n[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var m=2;m<i;m++)s[m]=t[m];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,n,t){var r=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:t,className:a},n)}},9877:function(e,n,t){t.d(n,{Z:function(){return c}});var r=t(7462),a=t(7294),i=t(2389),s=t(9548),o=t(6010),l="tabItem_LplD";function m(e){var n,t,i,m=e.lazy,c=e.block,u=e.defaultValue,p=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=p?p:v.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),b=(0,s.lx)(g,(function(e,n){return e.value===n.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var h=null===u?u:null!=(n=null!=u?u:null==(t=v.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(i=v[0])?void 0:i.props.value;if(null!==h&&!g.some((function(e){return e.value===h})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,s.UB)(),y=k.tabGroupChoices,N=k.setTabGroupChoices,S=(0,a.useState)(h),O=S[0],D=S[1],w=[],j=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var x=y[d];null!=x&&x!==O&&g.some((function(e){return e.value===x}))&&D(x)}var E=function(e){var n=e.currentTarget,t=w.indexOf(n),r=g[t].value;r!==O&&(j(n),D(r),null!=d&&N(d,r))},P=function(e){var n,t=null;switch(e.key){case"ArrowRight":var r=w.indexOf(e.currentTarget)+1;t=w[r]||w[0];break;case"ArrowLeft":var a=w.indexOf(e.currentTarget)-1;t=w[a]||w[w.length-1]}null==(n=t)||n.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":c},f)},g.map((function(e){var n=e.value,t=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:O===n?0:-1,"aria-selected":O===n,key:n,ref:function(e){return w.push(e)},onKeyDown:P,onFocus:E,onClick:E},i,{className:(0,o.Z)("tabs__item",l,null==i?void 0:i.className,{"tabs__item--active":O===n})}),null!=t?t:n)}))),m?(0,a.cloneElement)(v.filter((function(e){return e.props.value===O}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,n){return(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==O})}))))}function c(e){var n=(0,i.Z)();return a.createElement(m,(0,r.Z)({key:String(n)},e))}},5806:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return m},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return p},default:function(){return f}});var r=t(7462),a=t(3366),i=(t(7294),t(3905)),s=t(9877),o=t(8215),l=["components"],m={sidebar_position:7,tags:["Array","DFS","Deque","Stack"]},c="Rotting Oranges",u={unversionedId:"Problems/StriverSDESheet/Day14/Rotting Oranges",id:"Problems/StriverSDESheet/Day14/Rotting Oranges",title:"Rotting Oranges",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day14/Rotting Oranges.md",sourceDirName:"Problems/StriverSDESheet/Day14",slug:"/Problems/StriverSDESheet/Day14/Rotting Oranges",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day14/Rotting Oranges",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day14/Rotting Oranges.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"DFS",permalink:"/CodePrime/docs/tags/dfs"},{label:"Deque",permalink:"/CodePrime/docs/tags/deque"},{label:"Stack",permalink:"/CodePrime/docs/tags/stack"}],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,tags:["Array","DFS","Deque","Stack"]},sidebar:"api",previous:{title:"Min Stack",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day14/Min Stack"},next:{title:"Online Stock Span",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day14/Online Stock Span"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var n=e.components,t=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"rotting-oranges"},"Rotting Oranges"),(0,i.kt)("h2",{id:"problem-link"},"Problem Link"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/rotting-oranges/"},"https://leetcode.com/problems/rotting-oranges/")),(0,i.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,i.kt)("p",null,"Expected Time complexity: ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mi",{parentName:"mrow"},"O"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msup",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msup"},"n"),(0,i.kt)("mi",{parentName:"msup"},"n")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^n)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Click - to see solution code"),(0,i.kt)(s.Z,{mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    deque<pair<int, int>> dq;\n    vector<vector<int>> ans, vis, vis1;\n    int n, m;\n    vector<vector<int>> g;\n\n   public:\n    void dfs(int i, int j, int time) {\n        if (vis[i][j] == 1 && ans[i][j] < time) return;\n        vis[i][j] = 1;\n        ans[i][j] = min(ans[i][j], time);\n\n        int dx[] = {1, -1, 0, 0};\n        int dy[] = {0, 0, 1, -1};\n        for (int k = 0; k < 4; k++) {\n            int x = i + dx[k];\n            int y = j + dy[k];\n            if ((!(x < 0 || x >= n || y < 0 || y >= m)) && g[x][y] == 1) {\n                dfs(x, y, time + 1);\n            }\n        }\n    }\n\n    int orangesRotting(vector<vector<int>>& grid) {\n        g = grid;\n        n = grid.size();\n        m = grid[0].size();\n        ans.resize(n, vector<int>(m, INT_MAX));\n        vis = ans;\n        vis1 = vis;\n\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (grid[i][j] == 2) {\n                    g = grid;\n                    vis = vis1;\n                    dfs(i, j, 0);\n                }\n            }\n        }\n\n        int res = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (grid[i][j] != 0) {\n                    res = max(res, ans[i][j]);\n                    if (res == INT_MAX) return -1;\n                }\n            }\n        }\n\n        return res;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);