"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3710],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var m=a.createContext({}),s=function(e){var t=a.useContext(m),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(m.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,m=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=s(n),d=r,f=p["".concat(m,".").concat(d)]||p[d]||c[d]||i;return n?a.createElement(f,o(o({ref:t},u),{},{components:n})):a.createElement(f,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=p;var l={};for(var m in t)hasOwnProperty.call(t,m)&&(l[m]=t[m]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(7462),r=n(7294),i=n(2389),o=n(9548),l=n(6010),m="tabItem_LplD";function s(e){var t,n,i,s=e.lazy,u=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,o.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===c?c:null!=(t=null!=c?c:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=h[0])?void 0:i.props.value;if(null!==y&&!v.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,o.UB)(),k=g.tabGroupChoices,N=g.setTabGroupChoices,S=(0,r.useState)(y),w=S[0],P=S[1],j=[],D=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=k[d];null!=E&&E!==w&&v.some((function(e){return e.value===E}))&&P(E)}var x=function(e){var t=e.currentTarget,n=j.indexOf(t),a=v[n].value;a!==w&&(D(t),P(a),null!=d&&N(d,a))},O=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=j.indexOf(e.currentTarget)+1;n=j[a]||j[0];break;case"ArrowLeft":var r=j.indexOf(e.currentTarget)-1;n=j[r]||j[j.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},f)},v.map((function(e){var t=e.value,n=e.label,i=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return j.push(e)},onKeyDown:O,onFocus:x,onClick:x},i,{className:(0,l.Z)("tabs__item",m,null==i?void 0:i.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),s?(0,r.cloneElement)(h.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function u(e){var t=(0,i.Z)();return r.createElement(s,(0,a.Z)({key:String(t)},e))}},3931:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=n(9877),l=n(8215),m=["components"],s={sidebar_position:1,tags:["Array","Dynamic Programming","Matrix"]},u="Minimum Path Sum",c={unversionedId:"StriverSDESheet/Day26/Minimum Path Sum",id:"StriverSDESheet/Day26/Minimum Path Sum",title:"Minimum Path Sum",description:"Problem",source:"@site/docs/StriverSDESheet/Day26/Minimum Path Sum.md",sourceDirName:"StriverSDESheet/Day26",slug:"/StriverSDESheet/Day26/Minimum Path Sum",permalink:"/CodePrime/docs/StriverSDESheet/Day26/Minimum Path Sum",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day26/Minimum Path Sum.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Matrix",permalink:"/CodePrime/docs/tags/matrix"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Array","Dynamic Programming","Matrix"]},sidebar:"tutorialSidebar",previous:{title:"Matrix Chain Multiplication",permalink:"/CodePrime/docs/StriverSDESheet/Day25/Matrix Chain Multiplication"},next:{title:"Coin Change",permalink:"/CodePrime/docs/StriverSDESheet/Day26/Coin Change"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var t=e.components,n=(0,r.Z)(e,m);return(0,i.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"minimum-path-sum"},"Minimum Path Sum"),(0,i.kt)("h2",{id:"problem"},(0,i.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/minimum-path-sum/"},"Problem")),(0,i.kt)("p",null,"Given a ",(0,i.kt)("code",null,"m x n")," ",(0,i.kt)("code",null,"grid")," filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path."),(0,i.kt)("p",null,(0,i.kt)("strong",null,"Note:")," You can only move either down or right at any point in time."),(0,i.kt)("p",null,"\xa0"),(0,i.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,i.kt)("p",null,"Expected Time complexity: ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mi",{parentName:"mrow"},"O"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("mi",{parentName:"mrow"},"n"),(0,i.kt)("mo",{parentName:"mrow"},"\u2217"),(0,i.kt)("mi",{parentName:"mrow"},"m"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n*m)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,i.kt)("span",{parentName:"span",className:"mbin"},"\u2217"),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"m"),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Click - to see solution code"),(0,i.kt)(o.Z,{mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int minPathSum(vector<vector<int>>& grid) {\n        int ans = 0;\n        int n = grid.size(), m = grid[0].size();\n        int cost[n][m];\n\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) cost[i][j] = INT_MAX;\n        }\n\n        cost[0][0] = grid[0][0];\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (i == 0 && j == 0) continue;\n                if (i > 0)\n                    cost[i][j] = min(cost[i][j], cost[i - 1][j] + grid[i][j]);\n                if (j > 0)\n                    cost[i][j] = min(cost[i][j], cost[i][j - 1] + grid[i][j]);\n            }\n        }\n        return cost[n - 1][m - 1];\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);