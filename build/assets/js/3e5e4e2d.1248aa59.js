"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9304],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),c=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(r),d=n,h=u["".concat(i,".").concat(d)]||u[d]||m[d]||o;return r?a.createElement(h,l(l({ref:t},p),{},{components:r})):a.createElement(h,l({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var c=2;c<o;c++)l[c]=r[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>p});var a=r(7462),n=r(7294),o=r(2389),l=r(5773),s=r(6010);const i="tabItem_LplD";function c(e){var t,r,o;const{lazy:c,block:p,defaultValue:m,values:u,groupId:d,className:h}=e,f=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=u?u:f.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),y=(0,l.lx)(b,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===m?m:null!=(t=null!=m?m:null==(r=f.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,l.UB)(),[N,w]=(0,n.useState)(v),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&b.some((t=>t.value===e))&&w(e)}const x=e=>{const t=e.currentTarget,r=T.indexOf(t),a=b[r].value;a!==N&&(O(t),w(a),null!=d&&g(d,a))},E=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},h)},b.map((e=>{let{value:t,label:r,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>T.push(e),onKeyDown:E,onFocus:x,onClick:x},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),c?(0,n.cloneElement)(f.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,o.Z)();return n.createElement(c,(0,a.Z)({key:String(t)},e))}},8284:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>u});var a=r(7462),n=(r(7294),r(3905)),o=r(9877),l=r(8215);const s={displayed_sidebar:null,sidebar_position:120,tags:["Tree","Depth-First Search","Binary Tree"]},i="Diameter of Binary Tree",c={unversionedId:"codes/diameter-of-binary-tree",id:"codes/diameter-of-binary-tree",title:"Diameter of Binary Tree",description:"Problem",source:"@site/docs/codes/diameter-of-binary-tree.md",sourceDirName:"codes",slug:"/codes/diameter-of-binary-tree",permalink:"/CodePrime/docs/codes/diameter-of-binary-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/diameter-of-binary-tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:120,frontMatter:{displayed_sidebar:null,sidebar_position:120,tags:["Tree","Depth-First Search","Binary Tree"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:p};function u(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"diameter-of-binary-tree"},"Diameter of Binary Tree"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/diameter-of-binary-tree/"},"Problem")),(0,n.kt)("p",null,"Given the ",(0,n.kt)("code",null,"root")," of a binary tree, return ",(0,n.kt)("em",null,"the length of the ",(0,n.kt)("strong",null,"diameter")," of the tree"),"."),(0,n.kt)("p",null,"The ",(0,n.kt)("strong",null,"diameter")," of a binary tree is the ",(0,n.kt)("strong",null,"length")," of the longest path between any two nodes in a tree. This path may or may not pass through the ",(0,n.kt)("code",null,"root"),"."),(0,n.kt)("p",null,"The ",(0,n.kt)("strong",null,"length")," of a path between two nodes is represented by the number of edges between them."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    int ans;\n    map<TreeNode*, int> mp;\n\n   public:\n    void traverse(TreeNode* root) {\n        if (!root) return;\n        traverse(root->left);\n        traverse(root->right);\n        int dist = 0;\n        mp[root] = 0;\n        if (root->left) {\n            dist += mp[root->left] + 1;\n            mp[root] = mp[root->left] + 1;\n        }\n        if (root->right) {\n            dist += mp[root->right] + 1;\n            mp[root] = max(mp[root], mp[root->right] + 1);\n        }\n        ans = max(ans, dist);\n    }\n\n    int diameterOfBinaryTree(TreeNode* root) {\n        ans = 0;\n        traverse(root);\n        return ans;\n    }\n};\n\n"))))))}u.isMDXComponent=!0}}]);