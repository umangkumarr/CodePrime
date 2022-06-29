"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2155],{3905:function(e,r,t){t.d(r,{Zo:function(){return u},kt:function(){return d}});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},u=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},p=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(t),d=a,v=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return t?n.createElement(v,i(i({ref:r},u),{},{components:t})):n.createElement(v,i({ref:r},u))}));function d(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=p;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,r,t){var n=t(7294);r.Z=function(e){var r=e.children,t=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:a},r)}},9877:function(e,r,t){t.d(r,{Z:function(){return u}});var n=t(7462),a=t(7294),o=t(2389),i=t(9548),l=t(6010),s="tabItem_LplD";function c(e){var r,t,o,c=e.lazy,u=e.block,m=e.defaultValue,p=e.values,d=e.groupId,v=e.className,h=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:h.map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes}})),y=(0,i.lx)(f,(function(e,r){return e.value===r.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===m?m:null!=(r=null!=m?m:null==(t=h.find((function(e){return e.props.default})))?void 0:t.props.value)?r:null==(o=h[0])?void 0:o.props.value;if(null!==b&&!f.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var S=(0,i.UB)(),k=S.tabGroupChoices,T=S.setTabGroupChoices,g=(0,a.useState)(b),N=g[0],w=g[1],P=[],D=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var C=k[d];null!=C&&C!==N&&f.some((function(e){return e.value===C}))&&w(C)}var E=function(e){var r=e.currentTarget,t=P.indexOf(r),n=f[t].value;n!==N&&(D(r),w(n),null!=d&&T(d,n))},O=function(e){var r,t=null;switch(e.key){case"ArrowRight":var n=P.indexOf(e.currentTarget)+1;t=P[n]||P[0];break;case"ArrowLeft":var a=P.indexOf(e.currentTarget)-1;t=P[a]||P[P.length-1]}null==(r=t)||r.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},v)},f.map((function(e){var r=e.value,t=e.label,o=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:N===r?0:-1,"aria-selected":N===r,key:r,ref:function(e){return P.push(e)},onKeyDown:O,onFocus:E,onClick:E},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":N===r})}),null!=t?t:r)}))),c?(0,a.cloneElement)(h.filter((function(e){return e.props.value===N}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map((function(e,r){return(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==N})}))))}function u(e){var r=(0,o.Z)();return a.createElement(c,(0,n.Z)({key:String(r)},e))}},4338:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return m},toc:function(){return p},default:function(){return v}});var n=t(7462),a=t(3366),o=(t(7294),t(3905)),i=t(9877),l=t(8215),s=["components"],c={sidebar_position:3,tags:["Tree","Breadth-First Search","Binary Tree","Divide and Conquer"]},u="Convert Sorted Array to Binary Search Tree",m={unversionedId:"Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree",id:"Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree",title:"Convert Sorted Array to Binary Search Tree",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree.md",sourceDirName:"Problems/StriverSDESheet/Day20",slug:"/Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day20/Convert Sorted Array to Binary Search Tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"},{label:"Divide and Conquer",permalink:"/CodePrime/docs/tags/divide-and-conquer"}],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,tags:["Tree","Breadth-First Search","Binary Tree","Divide and Conquer"]},sidebar:"api",previous:{title:"Search in a Binary Search Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Search in a Binary Search Tree"},next:{title:"Construct Binary Search Tree from Preorder Traversal",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day20/Construct Binary Search Tree from Preorder Traversal"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function v(e){var r=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"convert-sorted-array-to-binary-search-tree"},"Convert Sorted Array to Binary Search Tree"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/"},"https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    TreeNode* createBST(vector<int> nums, int start, int end) {\n        if (start > end) return NULL;\n        int mid = (start + end) / 2;\n        TreeNode* root = new TreeNode(nums[mid]);\n        root->left = createBST(nums, start, mid - 1);\n        root->right = createBST(nums, mid + 1, end);\n        return root;\n    }\n\n    TreeNode* sortedArrayToBST(vector<int>& nums) {\n        return createBST(nums, 0, nums.size() - 1);\n    }\n};\n"))))))}v.isMDXComponent=!0}}]);