"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[788],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),c=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(r),d=n,h=m["".concat(i,".").concat(d)]||m[d]||p[d]||l;return r?a.createElement(h,o(o({ref:t},u),{},{components:r})):a.createElement(h,o({ref:t},u))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=r.length,o=new Array(l);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<l;c++)o[c]=r[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>u});var a=r(7462),n=r(7294),l=r(2389),o=r(5773),s=r(6010);const i="tabItem_LplD";function c(e){var t,r,l;const{lazy:c,block:u,defaultValue:p,values:m,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:b.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),y=(0,o.lx)(v,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===p?p:null!=(t=null!=p?p:null==(r=b.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(l=b[0])?void 0:l.props.value;if(null!==f&&!v.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,o.UB)(),[N,T]=(0,n.useState)(f),w=[],{blockElementScrollPositionUntilNextRender:O}=(0,o.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&v.some((t=>t.value===e))&&T(e)}const x=e=>{const t=e.currentTarget,r=w.indexOf(t),a=v[r].value;a!==N&&(O(t),T(a),null!=d&&g(d,a))},P=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;r=w[t]||w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;r=w[t]||w[w.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},h)},v.map((e=>{let{value:t,label:r,attributes:l}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>w.push(e),onKeyDown:P,onFocus:x,onClick:x},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,l.Z)();return n.createElement(c,(0,a.Z)({key:String(t)},e))}},2003:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>m});var a=r(7462),n=(r(7294),r(3905)),l=r(9877),o=r(8215);const s={sidebar_position:131,tags:["Tree","Depth-First Search","Binary Search Tree","Binary Tree"]},i="Validate Binary Search Tree",c={unversionedId:"codes/validate-binary-search-tree",id:"codes/validate-binary-search-tree",title:"Validate Binary Search Tree",description:"Problem",source:"@site/docs/codes/validate-binary-search-tree.md",sourceDirName:"codes",slug:"/codes/validate-binary-search-tree",permalink:"/CodePrime/docs/codes/validate-binary-search-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/validate-binary-search-tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Search Tree",permalink:"/CodePrime/docs/tags/binary-search-tree"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:131,frontMatter:{sidebar_position:131,tags:["Tree","Depth-First Search","Binary Search Tree","Binary Tree"]},sidebar:"main",previous:{title:"Construct Binary Search Tree from Preorder Traversal",permalink:"/CodePrime/docs/codes/construct-binary-search-tree-from-preorder-traversal"},next:{title:"Convert Sorted Array to Binary Search Tree",permalink:"/CodePrime/docs/codes/convert-sorted-array-to-binary-search-tree"}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:u};function m(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"validate-binary-search-tree"},"Validate Binary Search Tree"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/validate-binary-search-tree/"},"Problem")),(0,n.kt)("p",null,"Given the ",(0,n.kt)("code",null,"root")," of a binary tree, ",(0,n.kt)("em",null,"determine if it is a valid binary search tree (BST)"),"."),(0,n.kt)("p",null,"A ",(0,n.kt)("strong",null,"valid BST")," is defined as follows:"),(0,n.kt)("ul",null,(0,n.kt)("li",null,"The left subtree of a node contains only nodes with keys ",(0,n.kt)("strong",null,"less than")," the node's key."),(0,n.kt)("li",null,"The right subtree of a node contains only nodes with keys ",(0,n.kt)("strong",null,"greater than")," the node's key."),(0,n.kt)("li",null,"Both the left and right subtrees must also be binary search trees.")),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    bool traversal(TreeNode* root, long long min, long long max) {\n        if (!root) return true;\n        if (root->val < min || root->val > max) return false;\n        return (traversal(root->left, min, (long long)root->val - 1ll) &\n                traversal(root->right, (long long)root->val + 1ll, max));\n    }\n\n    bool isValidBST(TreeNode* root) {\n        return traversal(root, INT_MIN, INT_MAX);\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);