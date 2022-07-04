"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5316],{3905:(e,r,t)=>{t.d(r,{Zo:()=>m,kt:()=>d});var a=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var i=a.createContext({}),c=function(e){var r=a.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},m=function(e){var r=c(e.components);return a.createElement(i.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},u=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),u=c(t),d=n,h=u["".concat(i,".").concat(d)]||u[d]||p[d]||o;return t?a.createElement(h,l(l({ref:r},m),{},{components:t})):a.createElement(h,l({ref:r},m))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,l=new Array(o);l[0]=u;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var c=2;c<o;c++)l[c]=t[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:(e,r,t)=>{t.d(r,{Z:()=>n});var a=t(7294);const n=function(e){let{children:r,hidden:t,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:n},r)}},9877:(e,r,t)=>{t.d(r,{Z:()=>m});var a=t(7462),n=t(7294),o=t(2389),l=t(5773),s=t(6010);const i="tabItem_LplD";function c(e){var r,t,o;const{lazy:c,block:m,defaultValue:p,values:u,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=u?u:b.map((e=>{let{props:{value:r,label:t,attributes:a}}=e;return{value:r,label:t,attributes:a}})),v=(0,l.lx)(f,((e,r)=>e.value===r.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===p?p:null!=(r=null!=p?p:null==(t=b.find((e=>e.props.default)))?void 0:t.props.value)?r:null==(o=b[0])?void 0:o.props.value;if(null!==k&&!f.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,l.UB)(),[N,T]=(0,n.useState)(k),w=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=y[d];null!=e&&e!==N&&f.some((r=>r.value===e))&&T(e)}const x=e=>{const r=e.currentTarget,t=w.indexOf(r),a=f[t].value;a!==N&&(O(r),T(a),null!=d&&g(d,a))},P=e=>{var r;let t=null;switch(e.key){case"ArrowRight":{const r=w.indexOf(e.currentTarget)+1;t=w[r]||w[0];break}case"ArrowLeft":{const r=w.indexOf(e.currentTarget)-1;t=w[r]||w[w.length-1];break}}null==(r=t)||r.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":m},h)},f.map((e=>{let{value:r,label:t,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===r?0:-1,"aria-selected":N===r,key:r,ref:e=>w.push(e),onKeyDown:P,onFocus:x,onClick:x},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===r})}),null!=t?t:r)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,r)=>(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==N})))))}function m(e){const r=(0,o.Z)();return n.createElement(c,(0,a.Z)({key:String(r)},e))}},2974:(e,r,t)=>{t.r(r),t.d(r,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>m,default:()=>u});var a=t(7462),n=(t(7294),t(3905)),o=t(9877),l=t(8215);const s={sidebar_position:6,tags:["Tree","Binary Tree","Depth-First Search","Linked List"]},i="Mirror Tree",c={unversionedId:"codes/mirror-tree",id:"codes/mirror-tree",title:"Mirror Tree",description:"Problem",source:"@site/docs/codes/mirror-tree.md",sourceDirName:"codes",slug:"/codes/mirror-tree",permalink:"/CodePrime/docs/codes/mirror-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/mirror-tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Linked List",permalink:"/CodePrime/docs/tags/linked-list"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Tree","Binary Tree","Depth-First Search","Linked List"]},sidebar:"main",previous:{title:"Binary Tree Maximum Path Sum",permalink:"/CodePrime/docs/codes/binary-tree-maximum-path-sum"},next:{title:"Binary Search Tree",permalink:"/CodePrime/docs/category/binary-search-tree"}},m=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:m};function u(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,a.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"mirror-tree"},"Mirror Tree"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/mirror-tree/1"},"Problem")),(0,n.kt)("p",null,(0,n.kt)("span",null,"Given a Binary Tree, convert it into its mirror.",(0,n.kt)("br",null),(0,n.kt)("img",{alt:"MirrorTree1",src:"https://contribute.geeksforgeeks.org/wp-content/uploads/mirrortrees.jpg",title:"MirrorTree1"}))),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"void mirror(struct Node* node) {\n    if (!node) return;\n\n    struct Node* t1 = node->left;\n    struct Node* t2 = node->right;\n    node->left = t2;\n    node->right = t1;\n\n    mirror(node->left);\n    mirror(node->right);\n}\n"))))))}u.isMDXComponent=!0}}]);