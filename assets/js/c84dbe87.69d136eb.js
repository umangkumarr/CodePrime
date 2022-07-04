"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1032],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),c=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(r),d=n,h=p["".concat(i,".").concat(d)]||p[d]||m[d]||l;return r?a.createElement(h,o(o({ref:t},u),{},{components:r})):a.createElement(h,o({ref:t},u))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=r.length,o=new Array(l);o[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<l;c++)o[c]=r[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>u});var a=r(7462),n=r(7294),l=r(2389),o=r(5773),s=r(6010);const i="tabItem_LplD";function c(e){var t,r,l;const{lazy:c,block:u,defaultValue:m,values:p,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=p?p:b.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),y=(0,o.lx)(k,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===m?m:null!=(t=null!=m?m:null==(r=b.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(l=b[0])?void 0:l.props.value;if(null!==f&&!k.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:g}=(0,o.UB)(),[N,T]=(0,n.useState)(f),w=[],{blockElementScrollPositionUntilNextRender:x}=(0,o.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&k.some((t=>t.value===e))&&T(e)}const S=e=>{const t=e.currentTarget,r=w.indexOf(t),a=k[r].value;a!==N&&(x(t),T(a),null!=d&&g(d,a))},O=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;r=w[t]||w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;r=w[t]||w[w.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},h)},k.map((e=>{let{value:t,label:r,attributes:l}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>w.push(e),onKeyDown:O,onFocus:S,onClick:S},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,l.Z)();return n.createElement(c,(0,a.Z)({key:String(t)},e))}},4782:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>p});var a=r(7462),n=(r(7294),r(3905)),l=r(9877),o=r(8215);const s={sidebar_position:137,tags:["Stack","Tree","Design","Binary Search Tree","Binary Tree","Iterator"],displayed_sidebars:null},i="Binary Search Tree Iterator",c={unversionedId:"codes/binary-search-tree-iterator",id:"codes/binary-search-tree-iterator",title:"Binary Search Tree Iterator",description:"Problem",source:"@site/docs/codes/binary-search-tree-iterator.md",sourceDirName:"codes",slug:"/codes/binary-search-tree-iterator",permalink:"/CodePrime/docs/codes/binary-search-tree-iterator",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/binary-search-tree-iterator.md",tags:[{label:"Stack",permalink:"/CodePrime/docs/tags/stack"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Design",permalink:"/CodePrime/docs/tags/design"},{label:"Binary Search Tree",permalink:"/CodePrime/docs/tags/binary-search-tree"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"},{label:"Iterator",permalink:"/CodePrime/docs/tags/iterator"}],version:"current",sidebarPosition:137,frontMatter:{sidebar_position:137,tags:["Stack","Tree","Design","Binary Search Tree","Binary Tree","Iterator"],displayed_sidebars:null},sidebar:"main",previous:{title:"Maximum Sum BST in Binary Tree",permalink:"/CodePrime/docs/codes/maximum-sum-bst-in-binary-tree"},next:{title:"Ceil from BST",permalink:"/CodePrime/docs/codes/ceil-from-bst"}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:u};function p(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"binary-search-tree-iterator"},"Binary Search Tree Iterator"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/binary-search-tree-iterator/"},"Problem")),(0,n.kt)("p",null,"Implement the ",(0,n.kt)("code",null,"BSTIterator")," class that represents an iterator over the ",(0,n.kt)("strong",null,(0,n.kt)("a",{href:"https://en.wikipedia.org/wiki/Tree_traversal#In-order_(LNR)",target:"_blank"},"in-order traversal"))," of a binary search tree (BST):"),(0,n.kt)("ul",null,(0,n.kt)("li",null,(0,n.kt)("code",null,"BSTIterator(TreeNode root)")," Initializes an object of the ",(0,n.kt)("code",null,"BSTIterator")," class. The ",(0,n.kt)("code",null,"root")," of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST."),(0,n.kt)("li",null,(0,n.kt)("code",null,"boolean hasNext()")," Returns ",(0,n.kt)("code",null,"true")," if there exists a number in the traversal to the right of the pointer, otherwise returns ",(0,n.kt)("code",null,"false"),"."),(0,n.kt)("li",null,(0,n.kt)("code",null,"int next()")," Moves the pointer to the right, then returns the number at the pointer.")),(0,n.kt)("p",null,"Notice that by initializing the pointer to a non-existent smallest number, the first call to ",(0,n.kt)("code",null,"next()")," will return the smallest element in the BST."),(0,n.kt)("p",null,"You may assume that ",(0,n.kt)("code",null,"next()")," calls will always be valid. That is, there will be at least a next number in the in-order traversal when ",(0,n.kt)("code",null,"next()")," is called."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class BSTIterator {\n    stack<TreeNode *> myStack;\n\n   public:\n    BSTIterator(TreeNode *root) { pushAll(root); }\n\n    bool hasNext() { return !myStack.empty(); }\n\n    int next() {\n        TreeNode *tmpNode = myStack.top();\n        myStack.pop();\n        pushAll(tmpNode->right);\n        return tmpNode->val;\n    }\n\n   private:\n    void pushAll(TreeNode *node) {\n        for (; node != NULL; myStack.push(node), node = node->left)\n            ;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);