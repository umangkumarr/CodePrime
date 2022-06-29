"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4438],{3905:function(e,a,t){t.d(a,{Zo:function(){return u},kt:function(){return d}});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function s(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?s(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function l(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=n.createContext({}),c=function(e){var a=n.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},u=function(e){var a=c(e.components);return n.createElement(i.Provider,{value:a},e.children)},m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},p=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(t),d=r,h=p["".concat(i,".").concat(d)]||p[d]||m[d]||s;return t?n.createElement(h,o(o({ref:a},u),{},{components:t})):n.createElement(h,o({ref:a},u))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var s=t.length,o=new Array(s);o[0]=p;var l={};for(var i in a)hasOwnProperty.call(a,i)&&(l[i]=a[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<s;c++)o[c]=t[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,a,t){var n=t(7294);a.Z=function(e){var a=e.children,t=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:function(e,a,t){t.d(a,{Z:function(){return u}});var n=t(7462),r=t(7294),s=t(2389),o=t(9548),l=t(6010),i="tabItem_LplD";function c(e){var a,t,s,c=e.lazy,u=e.block,m=e.defaultValue,p=e.values,d=e.groupId,h=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=p?p:f.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),v=(0,o.lx)(k,(function(e,a){return e.value===a.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var N=null===m?m:null!=(a=null!=m?m:null==(t=f.find((function(e){return e.props.default})))?void 0:t.props.value)?a:null==(s=f[0])?void 0:s.props.value;if(null!==N&&!k.some((function(e){return e.value===N})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+N+'" but none of its children has the corresponding value. Available values are: '+k.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,o.UB)(),y=b.tabGroupChoices,g=b.setTabGroupChoices,w=(0,r.useState)(N),x=w[0],O=w[1],T=[],C=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=y[d];null!=E&&E!==x&&k.some((function(e){return e.value===E}))&&O(E)}var S=function(e){var a=e.currentTarget,t=T.indexOf(a),n=k[t].value;n!==x&&(C(a),O(n),null!=d&&g(d,n))},P=function(e){var a,t=null;switch(e.key){case"ArrowRight":var n=T.indexOf(e.currentTarget)+1;t=T[n]||T[0];break;case"ArrowLeft":var r=T.indexOf(e.currentTarget)-1;t=T[r]||T[T.length-1]}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},h)},k.map((function(e){var a=e.value,t=e.label,s=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===a?0:-1,"aria-selected":x===a,key:a,ref:function(e){return T.push(e)},onKeyDown:P,onFocus:S,onClick:S},s,{className:(0,l.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":x===a})}),null!=t?t:a)}))),c?(0,r.cloneElement)(f.filter((function(e){return e.props.value===x}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==x})}))))}function u(e){var a=(0,s.Z)();return r.createElement(c,(0,n.Z)({key:String(a)},e))}},6795:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return m},toc:function(){return p},default:function(){return h}});var n=t(7462),r=t(3366),s=(t(7294),t(3905)),o=t(9877),l=t(8215),i=["components"],c={sidebar_position:21,tags:["Depth-First Search","Breadth-First Search","Graph","Topological Sort"]},u="Course Schedule II",m={unversionedId:"codes/course-schedule-ii",id:"codes/course-schedule-ii",title:"Course Schedule II",description:"Problem",source:"@site/docs/codes/course-schedule-ii.md",sourceDirName:"codes",slug:"/codes/course-schedule-ii",permalink:"/CodePrime/docs/codes/course-schedule-ii",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/course-schedule-ii.md",tags:[{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Graph",permalink:"/CodePrime/docs/tags/graph"},{label:"Topological Sort",permalink:"/CodePrime/docs/tags/topological-sort"}],version:"current",sidebarPosition:21,frontMatter:{sidebar_position:21,tags:["Depth-First Search","Breadth-First Search","Graph","Topological Sort"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function h(e){var a=e.components,t=(0,r.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},d,t,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"course-schedule-ii"},"Course Schedule II"),(0,s.kt)("h2",{id:"problem"},(0,s.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/course-schedule-ii/"},"Problem")),(0,s.kt)("p",null,"There are a total of ",(0,s.kt)("code",null,"numCourses")," courses you have to take, labeled from ",(0,s.kt)("code",null,"0")," to ",(0,s.kt)("code",null,"numCourses - 1"),". You are given an array ",(0,s.kt)("code",null,"prerequisites")," where ",(0,s.kt)("code",null,"prerequisites[i] = [ai, bi]")," indicates that you ",(0,s.kt)("strong",null,"must")," take course ",(0,s.kt)("code",null,"bi")," first if you want to take course ",(0,s.kt)("code",null,"ai"),"."),(0,s.kt)("ul",null,(0,s.kt)("li",null,"For example, the pair ",(0,s.kt)("code",null,"[0, 1]"),", indicates that to take course ",(0,s.kt)("code",null,"0")," you have to first take course ",(0,s.kt)("code",null,"1"),".")),(0,s.kt)("p",null,"Return ",(0,s.kt)("em",null,"the ordering of courses you should take to finish all courses"),". If there are many valid answers, return ",(0,s.kt)("strong",null,"any")," of them. If it is impossible to finish all courses, return ",(0,s.kt)("strong",null,"an empty array"),"."),(0,s.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,s.kt)("p",null,"Make a directed graph from ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"a"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"["),(0,s.kt)("mi",{parentName:"mrow"},"i"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"]"),(0,s.kt)("mo",{parentName:"mrow"},"\u2212"),(0,s.kt)("mo",{parentName:"mrow"},">"),(0,s.kt)("mi",{parentName:"mrow"},"b"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"["),(0,s.kt)("mi",{parentName:"mrow"},"i"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"]")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"a[i] -> b[i]")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"a"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"["),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"i"),(0,s.kt)("span",{parentName:"span",className:"mclose"},"]"),(0,s.kt)("span",{parentName:"span",className:"mord"},"\u2212"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},">"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"b"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"["),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"i"),(0,s.kt)("span",{parentName:"span",className:"mclose"},"]"))))),". Then do a BFS to check if the graph is acyclic or not. If the graph is acyclic return then BFS traversal of the graph."),(0,s.kt)("p",null,"Expected Time complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"O"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("mi",{parentName:"mrow"},"n"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution code"),(0,s.kt)(o.Z,{mdxType:"Tabs"},(0,s.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"#include <unordered_map>\n#include <vector>\nclass Solution {\n    vector<vector<int>> G;\n    int N, ans = 1;\n    unordered_map<int, int> path;\n    vector<int> arr;\n\n   public:\n    void assign(int n) {\n        this->N = n;\n        G.resize(N);\n    }\n    void addedge(int x, int y) { G[x].push_back(y); }\n\n    void dfs(int cur, vector<int>& vis) {\n        if (ans == -1) return;\n        path[cur] = 1;\n        for (auto nbr : G[cur]) {\n            if (!vis[nbr] and path[nbr]) {\n                ans = -1;\n                return;\n            } else if (!vis[nbr]) {\n                dfs(nbr, vis);\n            }\n        }\n        vis[cur] = 1;\n        arr.push_back(cur);\n    }\n\n    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {\n        assign(numCourses);\n        for (auto i : prerequisites) {\n            addedge(i[0], i[1]);\n        }\n        vector<int> vis(N);\n        for (int i = 0; i < N; i++) {\n            vis[i] = 0;\n        }\n        for (int i = 0; i < N; i++) {\n            if (!vis[i]) {\n                path.clear();\n                dfs(i, vis);\n                if (ans == -1) {\n                    arr.clear();\n                    return arr;\n                }\n            }\n        }\n        return arr;\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);