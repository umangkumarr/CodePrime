"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7972],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=c(r),d=a,b=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(b,l(l({ref:t},u),{},{components:r})):n.createElement(b,l({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var c=2;c<o;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(7294);const a=function(e){let{children:t,hidden:r,className:a}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>u});var n=r(7462),a=r(7294),o=r(2389),l=r(5773),i=r(6010);const s="tabItem_LplD";function c(e){var t,r,o;const{lazy:c,block:u,defaultValue:p,values:m,groupId:d,className:b}=e,h=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:h.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),k=(0,l.lx)(f,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===p?p:null!=(t=null!=p?p:null==(r=h.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,l.UB)(),[w,N]=(0,a.useState)(v),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=y[d];null!=e&&e!==w&&f.some((t=>t.value===e))&&N(e)}const x=e=>{const t=e.currentTarget,r=T.indexOf(t),n=f[r].value;n!==w&&(O(t),N(n),null!=d&&g(d,n))},E=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},b)},f.map((e=>{let{value:t,label:r,attributes:o}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:E,onFocus:x,onClick:x},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),c?(0,a.cloneElement)(h.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function u(e){const t=(0,o.Z)();return a.createElement(c,(0,n.Z)({key:String(t)},e))}},343:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>c,toc:()=>u,default:()=>m});var n=r(7462),a=(r(7294),r(3905)),o=r(9877),l=r(8215);const i={sidebar_position:7,tags:["Stack","Tree","Depth-First Search","Binary Tree"]},s="Bottom View of Binary Tree",c={unversionedId:"codes/bottom-view-of-binary-tree",id:"codes/bottom-view-of-binary-tree",title:"Bottom View of Binary Tree",description:"Problem",source:"@site/docs/codes/bottom-view-of-binary-tree.md",sourceDirName:"codes",slug:"/codes/bottom-view-of-binary-tree",permalink:"/CodePrime/docs/codes/bottom-view-of-binary-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/bottom-view-of-binary-tree.md",tags:[{label:"Stack",permalink:"/CodePrime/docs/tags/stack"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7,tags:["Stack","Tree","Depth-First Search","Binary Tree"]},sidebar:"main",previous:{title:"Top View of Binary Tree",permalink:"/CodePrime/docs/codes/top-view-of-binary-tree"},next:{title:"Binary Tree Inorder Traversal",permalink:"/CodePrime/docs/codes/binary-tree-inorder-traversal"}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:u};function m(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"bottom-view-of-binary-tree"},"Bottom View of Binary Tree"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1"},"Problem")),(0,a.kt)("p",null),(0,a.kt)("p",null,(0,a.kt)("span",null,"Given a binary tree, print the bottom view from left to right.",(0,a.kt)("br",null),"A node is included in bottom view if it can be seen when we look at the tree from bottom.")),(0,a.kt)("p",null,(0,a.kt)("span",null,"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 20",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 /\xa0\xa0\xa0 \\",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 8\xa0\xa0\xa0\xa0\xa0\xa0 22",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 /\xa0\xa0 \\\xa0\xa0\xa0\xa0\xa0\xa0\xa0 \\",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 5\xa0\xa0\xa0\xa0\xa0 3\xa0\xa0\xa0\xa0 \xa0 25",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 /\xa0\xa0 \\\xa0\xa0\xa0\xa0 \xa0",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 10\xa0\xa0\xa0 14")),(0,a.kt)("p",null,(0,a.kt)("span",null,"For the above tree, the bottom view is 5 10 3 14 25."),(0,a.kt)("br",null),(0,a.kt)("span",null,"If there are ",(0,a.kt)("strong",null,"multiple "),"bottom-most nodes for a horizontal distance from root, then print the later one in level traversal. For example, in the below diagram, 3 and 4 are both the bottommost nodes at horizontal distance 0, we need to print 4.")),(0,a.kt)("p",null,(0,a.kt)("span",null,"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 20",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 /\xa0\xa0\xa0 \\",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 8\xa0\xa0\xa0\xa0\xa0\xa0 22",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 /\xa0\xa0 \\\xa0\xa0 \xa0 /\xa0\xa0 \\",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 5\xa0\xa0\xa0\xa0\xa0 3 4\xa0\xa0\xa0\xa0 25",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 \xa0 \xa0\xa0\xa0 /\xa0 \xa0 \\\xa0\xa0\xa0\xa0 \xa0",(0,a.kt)("br",null),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0 10 \xa0\xa0 \xa0\xa0 14")),(0,a.kt)("p",null,(0,a.kt)("span",null,"For the above tree the output should be 5 10 4 14 25."),(0,a.kt)("br",null),"\xa0"),(0,a.kt)("p",null,(0,a.kt)("span",null,(0,a.kt)("strong",null,"Your Task:"),(0,a.kt)("br",null),"This is a functional problem, you ",(0,a.kt)("strong",null,"don't "),"need to care about input, just complete the function ",(0,a.kt)("strong",null,"bottomView"),"() which takes the root node of the tree as input and returns an array\xa0containing the bottom view of the given tree.")),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    map<int, int> mp, height;\n\n   public:\n    void traversal(Node *root, int c, int h) {\n        if (!root) return;\n        if (height.find(c) == height.end() || height[c] <= h) {\n            mp[c] = root->data;\n            height[c] = h;\n        }\n        traversal(root->left, c + 1, h + 1);\n        traversal(root->right, c - 1, h + 1);\n    }\n\n    vector<int> bottomView(Node *root) {\n        vector<int> view;\n        traversal(root, 0, 0);\n        for (auto i : mp) {\n            view.push_back(i.second);\n        }\n        reverse(view.begin(), view.end());\n        return view;\n    }\n};\n"))))))}m.isMDXComponent=!0}}]);