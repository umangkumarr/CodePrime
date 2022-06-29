"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5714],{3905:function(e,r,t){t.d(r,{Zo:function(){return u},kt:function(){return d}});var a=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var s=a.createContext({}),c=function(e){var r=a.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},u=function(e){var r=c(e.components);return a.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},m=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(t),d=n,h=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return t?a.createElement(h,i(i({ref:r},u),{},{components:t})):a.createElement(h,i({ref:r},u))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,i=new Array(o);i[0]=m;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var c=2;c<o;c++)i[c]=t[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:function(e,r,t){var a=t(7294);r.Z=function(e){var r=e.children,t=e.hidden,n=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:n},r)}},9877:function(e,r,t){t.d(r,{Z:function(){return u}});var a=t(7462),n=t(7294),o=t(2389),i=t(9548),l=t(6010),s="tabItem_LplD";function c(e){var r,t,o,c=e.lazy,u=e.block,p=e.defaultValue,m=e.values,d=e.groupId,h=e.className,f=n.Children.map(e.children,(function(e){if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:f.map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes}})),b=(0,i.lx)(v,(function(e,r){return e.value===r.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===p?p:null!=(r=null!=p?p:null==(t=f.find((function(e){return e.props.default})))?void 0:t.props.value)?r:null==(o=f[0])?void 0:o.props.value;if(null!==y&&!v.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,i.UB)(),S=k.tabGroupChoices,g=k.setTabGroupChoices,N=(0,n.useState)(y),T=N[0],P=N[1],w=[],E=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var O=S[d];null!=O&&O!==T&&v.some((function(e){return e.value===O}))&&P(O)}var D=function(e){var r=e.currentTarget,t=w.indexOf(r),a=v[t].value;a!==T&&(E(r),P(a),null!=d&&g(d,a))},x=function(e){var r,t=null;switch(e.key){case"ArrowRight":var a=w.indexOf(e.currentTarget)+1;t=w[a]||w[0];break;case"ArrowLeft":var n=w.indexOf(e.currentTarget)-1;t=w[n]||w[w.length-1]}null==(r=t)||r.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},h)},v.map((function(e){var r=e.value,t=e.label,o=e.attributes;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:T===r?0:-1,"aria-selected":T===r,key:r,ref:function(e){return w.push(e)},onKeyDown:x,onFocus:D,onClick:D},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":T===r})}),null!=t?t:r)}))),c?(0,n.cloneElement)(f.filter((function(e){return e.props.value===T}))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},f.map((function(e,r){return(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==T})}))))}function u(e){var r=(0,o.Z)();return n.createElement(c,(0,a.Z)({key:String(r)},e))}},6601:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return p},toc:function(){return m},default:function(){return h}});var a=t(7462),n=t(3366),o=(t(7294),t(3905)),i=t(9877),l=t(8215),s=["components"],c={sidebar_position:2,tags:["Tree","Breadth-First Search","Binary Tree"]},u="Search in a Binary Search Tree",p={unversionedId:"Problems/StriverSDESheet/Day20/Search in a Binary Search Tree",id:"Problems/StriverSDESheet/Day20/Search in a Binary Search Tree",title:"Search in a Binary Search Tree",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day20/Search in a Binary Search Tree.md",sourceDirName:"Problems/StriverSDESheet/Day20",slug:"/Problems/StriverSDESheet/Day20/Search in a Binary Search Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Search in a Binary Search Tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day20/Search in a Binary Search Tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Tree","Breadth-First Search","Binary Tree"]},sidebar:"api",previous:{title:"Populating Next Right Pointers in Each Node",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Populating Next Right Pointers in Each Node"},next:{title:"Convert Sorted Array to Binary Search Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree"}},m=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function h(e){var r=e.components,t=(0,n.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"search-in-a-binary-search-tree"},"Search in a Binary Search Tree"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/search-in-a-binary-search-tree/"},"https://leetcode.com/problems/search-in-a-binary-search-tree/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    TreeNode* searchBST(TreeNode* root, int val) {\n        if (root == NULL) return root;\n        if (root->val == val) return root;\n        if (root->val > val)\n            root = root->left;\n        else\n            root = root->right;\n        return searchBST(root, val);\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);