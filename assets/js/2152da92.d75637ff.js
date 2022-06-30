"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[104],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>d});var a=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var i=a.createContext({}),c=function(e){var r=a.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},p=function(e){var r=c(e.components);return a.createElement(i.Provider,{value:r},e.children)},m={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},u=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),d=n,v=u["".concat(i,".").concat(d)]||u[d]||m[d]||o;return t?a.createElement(v,l(l({ref:r},p),{},{components:t})):a.createElement(v,l({ref:r},p))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,l=new Array(o);l[0]=u;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var c=2;c<o;c++)l[c]=t[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:(e,r,t)=>{t.d(r,{Z:()=>n});var a=t(7294);const n=function(e){let{children:r,hidden:t,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:n},r)}},9877:(e,r,t)=>{t.d(r,{Z:()=>p});var a=t(7462),n=t(7294),o=t(2389),l=t(5773),s=t(6010);const i="tabItem_LplD";function c(e){var r,t,o;const{lazy:c,block:p,defaultValue:m,values:u,groupId:d,className:v}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=u?u:b.map((e=>{let{props:{value:r,label:t,attributes:a}}=e;return{value:r,label:t,attributes:a}})),y=(0,l.lx)(h,((e,r)=>e.value===r.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===m?m:null!=(r=null!=m?m:null==(t=b.find((e=>e.props.default)))?void 0:t.props.value)?r:null==(o=b[0])?void 0:o.props.value;if(null!==f&&!h.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:T}=(0,l.UB)(),[g,N]=(0,n.useState)(f),S=[],{blockElementScrollPositionUntilNextRender:w}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==g&&h.some((r=>r.value===e))&&N(e)}const P=e=>{const r=e.currentTarget,t=S.indexOf(r),a=h[t].value;a!==g&&(w(r),N(a),null!=d&&T(d,a))},D=e=>{var r;let t=null;switch(e.key){case"ArrowRight":{const r=S.indexOf(e.currentTarget)+1;t=S[r]||S[0];break}case"ArrowLeft":{const r=S.indexOf(e.currentTarget)-1;t=S[r]||S[S.length-1];break}}null==(r=t)||r.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},v)},h.map((e=>{let{value:r,label:t,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:g===r?0:-1,"aria-selected":g===r,key:r,ref:e=>S.push(e),onKeyDown:D,onFocus:P,onClick:P},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":g===r})}),null!=t?t:r)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===g))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,r)=>(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==g})))))}function p(e){const r=(0,o.Z)();return n.createElement(c,(0,a.Z)({key:String(r)},e))}},2614:(e,r,t)=>{t.r(r),t.d(r,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>u});var a=t(7462),n=(t(7294),t(3905)),o=t(9877),l=t(8215);const s={sidebar_position:1,tags:["Stack","Tree","Depth-First Search","Binary Tree"]},i="Binary Tree Inorder Traversal",c={unversionedId:"Problems/StriverSDESheet/Day17/Binary Tree Inorder Traversal",id:"Problems/StriverSDESheet/Day17/Binary Tree Inorder Traversal",title:"Binary Tree Inorder Traversal",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day17/Binary Tree Inorder Traversal.md",sourceDirName:"Problems/StriverSDESheet/Day17",slug:"/Problems/StriverSDESheet/Day17/Binary Tree Inorder Traversal",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day17/Binary Tree Inorder Traversal",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day17/Binary Tree Inorder Traversal.md",tags:[{label:"Stack",permalink:"/CodePrime/docs/tags/stack"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Stack","Tree","Depth-First Search","Binary Tree"]},sidebar:"api",previous:{title:"Compare Version Numbers",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Compare Version Numbers"},next:{title:"Binary Tree Preorder Traversal",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day17/Binary Tree Preorder Traversal"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:p};function u(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,a.Z)({},m,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"binary-tree-inorder-traversal"},"Binary Tree Inorder Traversal"),(0,n.kt)("h2",{id:"problem-link"},"Problem Link"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/binary-tree-inorder-traversal/"},"https://leetcode.com/problems/binary-tree-inorder-traversal/")),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<int> inorder;\n\n   public:\n    void traversal(TreeNode* root) {\n        if (!root) return;\n        traversal(root->left);\n        inorder.push_back(root->val);\n        traversal(root->right);\n    }\n\n    vector<int> inorderTraversal(TreeNode* root) {\n        traversal(root);\n        return inorder;\n    }\n};\n"))))))}u.isMDXComponent=!0}}]);