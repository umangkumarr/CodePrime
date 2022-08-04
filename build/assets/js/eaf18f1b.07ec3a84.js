"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9506],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),c=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},m=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),u=c(a),d=r,h=u["".concat(i,".").concat(d)]||u[d]||p[d]||s;return a?n.createElement(h,l(l({ref:t},m),{},{components:a})):n.createElement(h,l({ref:t},m))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,l=new Array(s);l[0]=u;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var c=2;c<s;c++)l[c]=a[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(7294),r=a(4334);const s="tabItem_Ymn6";function l(e){let{children:t,hidden:a,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(s,l),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(3117),r=a(7294),s=a(4334),l=a(2389),o=a(7392),i=a(7094),c=a(2466);const m="tabList__CuJ",p="tabItem_LNqP";function u(e){var t,a;const{lazy:l,block:u,defaultValue:d,values:h,groupId:b,className:k}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=h?h:f.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),g=(0,o.l)(v,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const N=null===d?d:null!=(t=null!=d?d:null==(a=f.find((e=>e.props.default)))?void 0:a.props.value)?t:f[0].props.value;if(null!==N&&!v.some((e=>e.value===N)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+N+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:w}=(0,i.U)(),[j,O]=(0,r.useState)(N),z=[],{blockElementScrollPositionUntilNextRender:x}=(0,c.o5)();if(null!=b){const e=y[b];null!=e&&e!==j&&v.some((t=>t.value===e))&&O(e)}const P=e=>{const t=e.currentTarget,a=z.indexOf(t),n=v[a].value;n!==j&&(x(t),O(n),null!=b&&w(b,String(n)))},T=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=z.indexOf(e.currentTarget)+1;a=null!=(n=z[t])?n:z[0];break}case"ArrowLeft":{var r;const t=z.indexOf(e.currentTarget)-1;a=null!=(r=z[t])?r:z[z.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,s.Z)("tabs-container",m)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},k)},v.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:j===t?0:-1,"aria-selected":j===t,key:t,ref:e=>z.push(e),onKeyDown:T,onFocus:P,onClick:P},l,{className:(0,s.Z)("tabs__item",p,null==l?void 0:l.className,{"tabs__item--active":j===t})}),null!=a?a:t)}))),l?(0,r.cloneElement)(f.filter((e=>e.props.value===j))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==j})))))}function d(e){const t=(0,l.Z)();return r.createElement(u,(0,n.Z)({key:String(t)},e))}},63:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>c,toc:()=>p});var n=a(3117),r=(a(7294),a(3905)),s=a(5488),l=a(5162);const o={sidebar_position:5,tags:["Array","Backtracking"]},i="Rat in a Maze Problem I",c={unversionedId:"codes/rat-in-a-maze-problemI",id:"codes/rat-in-a-maze-problemI",title:"Rat in a Maze Problem I",description:"Problem",source:"@site/docs/codes/rat-in-a-maze-problemI.md",sourceDirName:"codes",slug:"/codes/rat-in-a-maze-problemI",permalink:"/CodePrime/docs/codes/rat-in-a-maze-problemI",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/rat-in-a-maze-problemI.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"}],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,tags:["Array","Backtracking"]},sidebar:"Leetcode",previous:{title:"Word Break",permalink:"/CodePrime/docs/codes/word-break"},next:{title:"N-Queens",permalink:"/CodePrime/docs/codes/n-queens"}},m={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:p};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"rat-in-a-maze-problem-i"},"Rat in a Maze Problem I"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1"},"Problem")),(0,r.kt)("p",null,(0,r.kt)("span",null,"Consider a rat placed at ",(0,r.kt)("strong",null,"(0, 0)")," in a square matrix",(0,r.kt)("strong",null," "),"of order ",(0,r.kt)("strong",null,"N * N"),". It has to reach the destination at ",(0,r.kt)("strong",null,"(N - 1, N - 1)"),". Find all possible paths that the rat can take to reach from source to destination. The directions in which the rat can move are ",(0,r.kt)("strong",null,"'U'(up)"),", ",(0,r.kt)("strong",null,"'D'(down)"),", ",(0,r.kt)("strong",null,"'L' (left)"),", ",(0,r.kt)("strong",null,"'R' (right)"),". Value 0 at a cell in the matrix represents that it is blocked and rat cannot move to it while value 1 at a cell in the matrix represents that\xa0rat\xa0can be travel\xa0through it.",(0,r.kt)("br",null),(0,r.kt)("strong",null,"Note"),": In a path, no cell can be visited more than one time."),"\xa0",(0,r.kt)("span",null,"If the source cell is\xa00, the rat cannot move to any other cell.")),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Use Backtracking and find all the possible ways of reaching the cell ","[N, N]",";"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mn",{parentName:"msup"},"3"),(0,r.kt)("mi",{parentName:"msup"},"n")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(3^n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord"},"3"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<vector<int>> maze;\n    vector<string> ans;\n    string s;\n    int n;\n\n   public:\n    void compute(int i, int j) {\n        if (i == n - 1 && j == n - 1) {\n            ans.push_back(s);\n            return;\n        }\n\n        if (i > 0 && maze[i - 1][j]) {\n            maze[i][j] = 0;\n            s.push_back('U');\n            compute(i - 1, j);\n            s.pop_back();\n            maze[i][j] = 1;\n        }\n\n        if (j > 0 && maze[i][j - 1]) {\n            maze[i][j] = 0;\n            s.push_back('L');\n            compute(i, j - 1);\n            s.pop_back();\n            maze[i][j] = 1;\n        }\n\n        if (i < n - 1 && maze[i + 1][j]) {\n            maze[i][j] = 0;\n            s.push_back('D');\n            compute(i + 1, j);\n            s.pop_back();\n            maze[i][j] = 1;\n        }\n\n        if (j < n - 1 && maze[i][j + 1]) {\n            maze[i][j] = 0;\n            s.push_back('R');\n            compute(i, j + 1);\n            s.pop_back();\n            maze[i][j] = 1;\n        }\n    }\n\n    vector<string> findPath(vector<vector<int>> &m, int n) {\n        this->n = n;\n        this->maze = m;\n        s = \"\";\n        this->n = n;\n        if (maze[0][0]) compute(0, 0);\n        return ans;\n    }\n};\n"))))))}d.isMDXComponent=!0}}]);