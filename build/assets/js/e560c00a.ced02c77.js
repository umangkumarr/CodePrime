"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4147],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),c=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(r),d=n,v=m["".concat(i,".").concat(d)]||m[d]||u[d]||o;return r?a.createElement(v,s(s({ref:t},p),{},{components:r})):a.createElement(v,s({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,s=new Array(o);s[0]=m;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:n,s[1]=l;for(var c=2;c<o;c++)s[c]=r[c];return a.createElement.apply(null,s)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>p});var a=r(7462),n=r(7294),o=r(2389),s=r(5773),l=r(6010);const i="tabItem_LplD";function c(e){var t,r,o;const{lazy:c,block:p,defaultValue:u,values:m,groupId:d,className:v}=e,h=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=m?m:h.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),f=(0,s.lx)(b,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===u?u:null!=(t=null!=u?u:null==(r=h.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==k&&!b.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,s.UB)(),[N,T]=(0,n.useState)(k),w=[],{blockElementScrollPositionUntilNextRender:O}=(0,s.o5)();if(null!=d){const e=y[d];null!=e&&e!==N&&b.some((t=>t.value===e))&&T(e)}const x=e=>{const t=e.currentTarget,r=w.indexOf(t),a=b[r].value;a!==N&&(O(t),T(a),null!=d&&g(d,a))},E=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;r=w[t]||w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;r=w[t]||w[w.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},v)},b.map((e=>{let{value:t,label:r,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>w.push(e),onKeyDown:E,onFocus:x,onClick:x},o,{className:(0,l.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),c?(0,n.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,o.Z)();return n.createElement(c,(0,a.Z)({key:String(t)},e))}},2875:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>m});var a=r(7462),n=(r(7294),r(3905)),o=r(9877),s=r(8215);const l={displayed_sidebar:null,sidebar_position:9,tags:["Stack","Tree","Depth-First Search","Binary Tree"]},i="Tree Traversals",c={unversionedId:"codes/tree-traversals",id:"codes/tree-traversals",title:"Tree Traversals",description:"Problem",source:"@site/docs/codes/tree-traversals.md",sourceDirName:"codes",slug:"/codes/tree-traversals",permalink:"/docs/codes/tree-traversals",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/tree-traversals.md",tags:[{label:"Stack",permalink:"/docs/tags/stack"},{label:"Tree",permalink:"/docs/tags/tree"},{label:"Depth-First Search",permalink:"/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/docs/tags/binary-tree"}],version:"current",sidebarPosition:9,frontMatter:{displayed_sidebar:null,sidebar_position:9,tags:["Stack","Tree","Depth-First Search","Binary Tree"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:p};function m(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"tree-traversals"},"Tree Traversals"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://www.codingninjas.com/codestudio/problems/981269?topList=striver-sde-sheet-problems&utm_source=striver&utm_medium=website"},"Problem")),(0,n.kt)("p",null,"You have been given a Binary Tree of 'N' nodes, where the nodes have integer values. Your task is to find the ln-Order, Pre-Order, and Post-Order traversals of the given binary tree."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"void traverse(BinaryTreeNode<int> *root, vector<int> &pre, vector<int> &in,\n              vector<int> &post) {\n    if (!root) return;\n    pre.push_back(root->data);\n    traverse(root->left, pre, in, post);\n    in.push_back(root->data);\n    traverse(root->right, pre, in, post);\n    post.push_back(root->data);\n}\n\nvector<vector<int>> getTreeTraversal(BinaryTreeNode<int> *root) {\n    vector<int> pre, in, post;\n    traverse(root, pre, in, post);\n    return {in, pre, post};\n}\n"))))))}m.isMDXComponent=!0}}]);