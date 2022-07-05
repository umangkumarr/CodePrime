"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2966],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,h=m["".concat(i,".").concat(d)]||m[d]||u[d]||o;return r?n.createElement(h,l(l({ref:t},c),{},{components:r})):n.createElement(h,l({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var p=2;p<o;p++)l[p]=r[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(7294);const a=function(e){let{children:t,hidden:r,className:a}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),a=r(7294),o=r(2389),l=r(5773),s=r(6010);const i="tabItem_LplD";function p(e){var t,r,o;const{lazy:p,block:c,defaultValue:u,values:m,groupId:d,className:h}=e,b=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:b.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),v=(0,l.lx)(f,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===u?u:null!=(t=null!=u?u:null==(r=b.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=b[0])?void 0:o.props.value;if(null!==k&&!f.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,l.UB)(),[w,N]=(0,a.useState)(k),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=y[d];null!=e&&e!==w&&f.some((t=>t.value===e))&&N(e)}const x=e=>{const t=e.currentTarget,r=T.indexOf(t),n=f[r].value;n!==w&&(O(t),N(n),null!=d&&g(d,n))},E=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":c},h)},f.map((e=>{let{value:t,label:r,attributes:o}=e;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:E,onFocus:x,onClick:x},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),p?(0,a.cloneElement)(b.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,o.Z)();return a.createElement(p,(0,n.Z)({key:String(t)},e))}},531:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>p,toc:()=>c,default:()=>m});var n=r(7462),a=(r(7294),r(3905)),o=r(9877),l=r(8215);const s={displayed_sidebar:null,sidebar_position:8,tags:["Stack","Tree","Depth-First Search","Binary Tree"]},i="Top View of Binary Tree",p={unversionedId:"codes/top-view-of-binary-tree",id:"codes/top-view-of-binary-tree",title:"Top View of Binary Tree",description:"Problem",source:"@site/docs/codes/top-view-of-binary-tree.md",sourceDirName:"codes",slug:"/codes/top-view-of-binary-tree",permalink:"/CodePrime/docs/codes/top-view-of-binary-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/top-view-of-binary-tree.md",tags:[{label:"Stack",permalink:"/CodePrime/docs/tags/stack"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:8,frontMatter:{displayed_sidebar:null,sidebar_position:8,tags:["Stack","Tree","Depth-First Search","Binary Tree"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:c};function m(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"top-view-of-binary-tree"},"Top View of Binary Tree"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/top-view-of-binary-tree/1"},"Problem")),(0,a.kt)("p",null),(0,a.kt)("p",null,(0,a.kt)("span",null,"Given below is a binary tree. The task is to print the top view of binary tree. Top view of a binary tree is the set of nodes visible when the tree is viewed from the top. For the given below tree")),(0,a.kt)("p",null,(0,a.kt)("span",null,"\xa0\xa0\xa0\xa0\xa0\xa0 1",(0,a.kt)("br",null),"\xa0\xa0\xa0 /\xa0\xa0\xa0\xa0 \\",(0,a.kt)("br",null),"\xa0\xa0 2\xa0\xa0\xa0\xa0\xa0\xa0 3",(0,a.kt)("br",null),"\xa0 /\xa0 \\\xa0\xa0\xa0 /\xa0\xa0 \\",(0,a.kt)("br",null),"4\xa0\xa0\xa0 5\xa0 6\xa0\xa0 7")),(0,a.kt)("p",null,(0,a.kt)("span",null,"Top view will be: 4 2 1 3 7",(0,a.kt)("br",null),(0,a.kt)("strong",null,"Note: "),"Return nodes from ",(0,a.kt)("strong",null,"leftmost "),"node to ",(0,a.kt)("strong",null,"rightmost "),"node.")),(0,a.kt)("p",null,(0,a.kt)("strong",null,(0,a.kt)("span",null,"Your Task:")),(0,a.kt)("br",null),(0,a.kt)("span",null,"Since this is a function problem. You don't have to take input. Just complete the function",(0,a.kt)("strong",null,"\xa0topView() "),"that takes ",(0,a.kt)("strong",null,"root node "),"as parameter and returns a list of nodes visible from the top view from left to right.")),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    map<int, int> mp, height;\n\n   public:\n    void traversal(Node *root, int c, int h) {\n        if (!root) return;\n        if (height.find(c) == height.end() || height[c] > h) {\n            mp[c] = root->data;\n            height[c] = h;\n        }\n        traversal(root->left, c + 1, h + 1);\n        traversal(root->right, c - 1, h + 1);\n    }\n\n    vector<int> topView(Node *root) {\n        vector<int> view;\n        traversal(root, 0, 0);\n        for (auto i : mp) {\n            view.push_back(i.second);\n        }\n        reverse(view.begin(), view.end());\n        return view;\n    }\n};\n"))))))}m.isMDXComponent=!0}}]);