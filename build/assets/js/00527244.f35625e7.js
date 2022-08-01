"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6131],{3905:(e,a,t)=>{t.d(a,{Zo:()=>u,kt:()=>d});var r=t(7294);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);a&&(r=r.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function s(e,a){if(null==e)return{};var t,r,n=function(e,a){if(null==e)return{};var t,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var i=r.createContext({}),c=function(e){var a=r.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},u=function(e){var a=c(e.components);return r.createElement(i.Provider,{value:a},e.children)},p={inlineCode:"code",wrapper:function(e){var a=e.children;return r.createElement(r.Fragment,{},a)}},m=r.forwardRef((function(e,a){var t=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(t),d=n,h=m["".concat(i,".").concat(d)]||m[d]||p[d]||l;return t?r.createElement(h,o(o({ref:a},u),{},{components:t})):r.createElement(h,o({ref:a},u))}));function d(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var l=t.length,o=new Array(l);o[0]=m;var s={};for(var i in a)hasOwnProperty.call(a,i)&&(s[i]=a[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<l;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:(e,a,t)=>{t.d(a,{Z:()=>n});var r=t(7294);const n=function(e){let{children:a,hidden:t,className:n}=e;return r.createElement("div",{role:"tabpanel",hidden:t,className:n},a)}},9877:(e,a,t)=>{t.d(a,{Z:()=>u});var r=t(7462),n=t(7294),l=t(2389),o=t(5773),s=t(6010);const i="tabItem_LplD";function c(e){var a,t,l;const{lazy:c,block:u,defaultValue:p,values:m,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:b.map((e=>{let{props:{value:a,label:t,attributes:r}}=e;return{value:a,label:t,attributes:r}})),v=(0,o.lx)(f,((e,a)=>e.value===a.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===p?p:null!=(a=null!=p?p:null==(t=b.find((e=>e.props.default)))?void 0:t.props.value)?a:null==(l=b[0])?void 0:l.props.value;if(null!==y&&!f.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,o.UB)(),[N,T]=(0,n.useState)(y),w=[],{blockElementScrollPositionUntilNextRender:O}=(0,o.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&f.some((a=>a.value===e))&&T(e)}const x=e=>{const a=e.currentTarget,t=w.indexOf(a),r=f[t].value;r!==N&&(O(a),T(r),null!=d&&g(d,r))},E=e=>{var a;let t=null;switch(e.key){case"ArrowRight":{const a=w.indexOf(e.currentTarget)+1;t=w[a]||w[0];break}case"ArrowLeft":{const a=w.indexOf(e.currentTarget)-1;t=w[a]||w[w.length-1];break}}null==(a=t)||a.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},h)},f.map((e=>{let{value:a,label:t,attributes:l}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===a?0:-1,"aria-selected":N===a,key:a,ref:e=>w.push(e),onKeyDown:E,onFocus:x,onClick:x},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===a})}),null!=t?t:a)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,a)=>(0,n.cloneElement)(e,{key:a,hidden:e.props.value!==N})))))}function u(e){const a=(0,l.Z)();return n.createElement(c,(0,r.Z)({key:String(a)},e))}},650:(e,a,t)=>{t.r(a),t.d(a,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>m});var r=t(7462),n=(t(7294),t(3905)),l=t(9877),o=t(8215);const s={displayed_sidebar:null,sidebar_position:129,tags:["Tree","Binary Search Tree","Binary Tree"]},i="Search in a Binary Search Tree",c={unversionedId:"codes/search-in-a-binary-search-tree",id:"codes/search-in-a-binary-search-tree",title:"Search in a Binary Search Tree",description:"Problem",source:"@site/docs/codes/search-in-a-binary-search-tree.md",sourceDirName:"codes",slug:"/codes/search-in-a-binary-search-tree",permalink:"/docs/codes/search-in-a-binary-search-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/search-in-a-binary-search-tree.md",tags:[{label:"Tree",permalink:"/docs/tags/tree"},{label:"Binary Search Tree",permalink:"/docs/tags/binary-search-tree"},{label:"Binary Tree",permalink:"/docs/tags/binary-tree"}],version:"current",sidebarPosition:129,frontMatter:{displayed_sidebar:null,sidebar_position:129,tags:["Tree","Binary Search Tree","Binary Tree"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:u};function m(e){let{components:a,...t}=e;return(0,n.kt)("wrapper",(0,r.Z)({},p,t,{components:a,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"search-in-a-binary-search-tree"},"Search in a Binary Search Tree"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/search-in-a-binary-search-tree/"},"Problem")),(0,n.kt)("p",null,"You are given the ",(0,n.kt)("code",null,"root")," of a binary search tree (BST) and an integer ",(0,n.kt)("code",null,"val"),"."),(0,n.kt)("p",null,"Find the node in the BST that the node's value equals ",(0,n.kt)("code",null,"val")," and return the subtree rooted with that node. If such a node does not exist, return ",(0,n.kt)("code",null,"null"),"."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    TreeNode* searchBST(TreeNode* root, int val) {\n        if (root == NULL) return root;\n        if (root->val == val) return root;\n        if (root->val > val)\n            root = root->left;\n        else\n            root = root->right;\n        return searchBST(root, val);\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);