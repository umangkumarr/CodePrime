"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[937],{3905:function(e,r,t){t.d(r,{Zo:function(){return u},kt:function(){return d}});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},u=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},p=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(t),d=a,f=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return t?n.createElement(f,l(l({ref:r},u),{},{components:t})):n.createElement(f,l({ref:r},u))}));function d(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,l=new Array(o);l[0]=p;var i={};for(var s in r)hasOwnProperty.call(r,s)&&(i[s]=r[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var c=2;c<o;c++)l[c]=t[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,r,t){var n=t(7294);r.Z=function(e){var r=e.children,t=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:a},r)}},9877:function(e,r,t){t.d(r,{Z:function(){return u}});var n=t(7462),a=t(7294),o=t(2389),l=t(9548),i=t(6010),s="tabItem_LplD";function c(e){var r,t,o,c=e.lazy,u=e.block,m=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=p?p:h.map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes}})),v=(0,l.lx)(b,(function(e,r){return e.value===r.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===m?m:null!=(r=null!=m?m:null==(t=h.find((function(e){return e.props.default})))?void 0:t.props.value)?r:null==(o=h[0])?void 0:o.props.value;if(null!==y&&!b.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.UB)(),S=k.tabGroupChoices,g=k.setTabGroupChoices,N=(0,a.useState)(y),w=N[0],T=N[1],E=[],O=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var P=S[d];null!=P&&P!==w&&b.some((function(e){return e.value===P}))&&T(P)}var D=function(e){var r=e.currentTarget,t=E.indexOf(r),n=b[t].value;n!==w&&(O(r),T(n),null!=d&&g(d,n))},C=function(e){var r,t=null;switch(e.key){case"ArrowRight":var n=E.indexOf(e.currentTarget)+1;t=E[n]||E[0];break;case"ArrowLeft":var a=E.indexOf(e.currentTarget)-1;t=E[a]||E[E.length-1]}null==(r=t)||r.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},f)},b.map((function(e){var r=e.value,t=e.label,o=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===r?0:-1,"aria-selected":w===r,key:r,ref:function(e){return E.push(e)},onKeyDown:C,onFocus:D,onClick:D},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===r})}),null!=t?t:r)}))),c?(0,a.cloneElement)(h.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map((function(e,r){return(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==w})}))))}function u(e){var r=(0,o.Z)();return a.createElement(c,(0,n.Z)({key:String(r)},e))}},6186:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return m},toc:function(){return p},default:function(){return f}});var n=t(7462),a=t(3366),o=(t(7294),t(3905)),l=t(9877),i=t(8215),s=["components"],c={sidebar_position:6,tags:["Tree","Breadth-First Search","Binary Tree"]},u="Lowest Common Ancestor of a Binary Search Tree",m={unversionedId:"Problems/StriverSDESheet/Day20/Lowest Common Ancestor of a Binary Search Tree",id:"Problems/StriverSDESheet/Day20/Lowest Common Ancestor of a Binary Search Tree",title:"Lowest Common Ancestor of a Binary Search Tree",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day20/Lowest Common Ancestor of a Binary Search Tree.md",sourceDirName:"Problems/StriverSDESheet/Day20",slug:"/Problems/StriverSDESheet/Day20/Lowest Common Ancestor of a Binary Search Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Lowest Common Ancestor of a Binary Search Tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day20/Lowest Common Ancestor of a Binary Search Tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Tree","Breadth-First Search","Binary Tree"]},sidebar:"api",previous:{title:"Validate Binary Search Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Validate Binary Search Tree"},next:{title:"Floor in BST",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day21/Floor in BST"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var r=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"lowest-common-ancestor-of-a-binary-search-tree"},"Lowest Common Ancestor of a Binary Search Tree"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"},"https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        if (!root) return NULL;\n\n        if (root == p || root == q) return root;\n        TreeNode* left = lowestCommonAncestor(root->left, p, q);\n        TreeNode* right = lowestCommonAncestor(root->right, p, q);\n\n        if (left && right) return root;\n        if (!left)\n            return right;\n        else\n            return left;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);