"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3219],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(r),d=a,h=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(h,l(l({ref:t},c),{},{components:r})):n.createElement(h,l({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:function(e,t,r){var n=r(7294);t.Z=function(e){var t=e.children,r=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:function(e,t,r){r.d(t,{Z:function(){return c}});var n=r(7462),a=r(7294),o=r(2389),l=r(9548),i=r(6010),s="tabItem_LplD";function u(e){var t,r,o,u=e.lazy,c=e.block,p=e.defaultValue,m=e.values,d=e.groupId,h=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,l.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===p?p:null!=(t=null!=p?p:null==(r=f.find((function(e){return e.props.default})))?void 0:r.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==k&&!v.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,l.UB)(),g=y.tabGroupChoices,S=y.setTabGroupChoices,N=(0,a.useState)(k),w=N[0],D=N[1],C=[],E=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var O=g[d];null!=O&&O!==w&&v.some((function(e){return e.value===O}))&&D(O)}var x=function(e){var t=e.currentTarget,r=C.indexOf(t),n=v[r].value;n!==w&&(E(t),D(n),null!=d&&S(d,n))},T=function(e){var t,r=null;switch(e.key){case"ArrowRight":var n=C.indexOf(e.currentTarget)+1;r=C[n]||C[0];break;case"ArrowLeft":var a=C.indexOf(e.currentTarget)-1;r=C[a]||C[C.length-1]}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},h)},v.map((function(e){var t=e.value,r=e.label,o=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return C.push(e)},onKeyDown:T,onFocus:x,onClick:x},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),u?(0,a.cloneElement)(f.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function c(e){var t=(0,o.Z)();return a.createElement(u,(0,n.Z)({key:String(t)},e))}},9404:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return m},default:function(){return h}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),l=r(9877),i=r(8215),s=["components"],u={sidebar_position:3,tags:["Depth-First Search","Breadth-First Search","Graph","Topological Sort"]},c="Course Schedule",p={unversionedId:"StriverSDESheet/Day23/Course Schedule",id:"StriverSDESheet/Day23/Course Schedule",title:"Course Schedule",description:"Problem",source:"@site/docs/StriverSDESheet/Day23/Course Schedule.md",sourceDirName:"StriverSDESheet/Day23",slug:"/StriverSDESheet/Day23/Course Schedule",permalink:"/CodePrime/docs/StriverSDESheet/Day23/Course Schedule",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day23/Course Schedule.md",tags:[{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Graph",permalink:"/CodePrime/docs/tags/graph"},{label:"Topological Sort",permalink:"/CodePrime/docs/tags/topological-sort"}],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,tags:["Depth-First Search","Breadth-First Search","Graph","Topological Sort"]},sidebar:"tutorialSidebar",previous:{title:"Number of Islands",permalink:"/CodePrime/docs/StriverSDESheet/Day23/Number of Islands"},next:{title:"DFS of Graph",permalink:"/CodePrime/docs/StriverSDESheet/Day23/DFS of Graph"}},m=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function h(e){var t=e.components,r=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"course-schedule"},"Course Schedule"),(0,o.kt)("h2",{id:"problem"},(0,o.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/course-schedule/"},"Problem")),(0,o.kt)("p",null,"There are a total of ",(0,o.kt)("code",null,"numCourses")," courses you have to take, labeled from ",(0,o.kt)("code",null,"0")," to ",(0,o.kt)("code",null,"numCourses - 1"),". You are given an array ",(0,o.kt)("code",null,"prerequisites")," where ",(0,o.kt)("code",null,"prerequisites[i] = [ai, bi]")," indicates that you ",(0,o.kt)("strong",null,"must")," take course ",(0,o.kt)("code",null,"bi")," first if you want to take course ",(0,o.kt)("code",null,"ai"),"."),(0,o.kt)("ul",null,(0,o.kt)("li",null,"For example, the pair ",(0,o.kt)("code",null,"[0, 1]"),", indicates that to take course ",(0,o.kt)("code",null,"0")," you have to first take course ",(0,o.kt)("code",null,"1"),".")),(0,o.kt)("p",null,"Return ",(0,o.kt)("code",null,"true")," if you can finish all courses. Otherwise, return ",(0,o.kt)("code",null,"false"),"."),(0,o.kt)("p",null,"\xa0"),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int check = 1;\n    vector<int> vis, st;\n    unordered_map<int, vector<int>> edges;\n\n    void dfs(int cur) {\n        if (vis[cur] || check == 0) {\n            check = 0;\n            return;\n        }\n        vis[cur] = 1;\n        st[cur] = 1;\n        for (auto nbr : edges[cur]) {\n            if (!vis[nbr])\n                dfs(nbr);\n            else if (st[nbr])\n                check = 0;\n        }\n        st[cur] = 0;\n    }\n\n    bool canFinish(int numCourses, vector<vector<int>>& pre) {\n        vis.resize(numCourses);\n        st.resize(numCourses);\n        for (int i = 0; i < pre.size(); i++) {\n            int x = pre[i][0];\n            int y = pre[i][1];\n            edges[x].push_back(y);\n            // edges[y].push_back(x);\n        }\n\n        for (int i = 0; i < numCourses; i++) {\n            if (!vis[i]) {\n                dfs(i);\n            }\n        }\n        return check;\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);