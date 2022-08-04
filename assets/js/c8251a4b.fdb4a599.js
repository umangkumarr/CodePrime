"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9734],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),c=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(r),d=n,v=u["".concat(i,".").concat(d)]||u[d]||m[d]||l;return r?a.createElement(v,o(o({ref:t},p),{},{components:r})):a.createElement(v,o({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=r.length,o=new Array(l);o[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<l;c++)o[c]=r[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},5162:(e,t,r)=>{r.d(t,{Z:()=>o});var a=r(7294),n=r(4334);const l="tabItem_Ymn6";function o(e){let{children:t,hidden:r,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,n.Z)(l,o),hidden:r},t)}},5488:(e,t,r)=>{r.d(t,{Z:()=>d});var a=r(3117),n=r(7294),l=r(4334),o=r(2389),s=r(7392),i=r(7094),c=r(2466);const p="tabList__CuJ",m="tabItem_LNqP";function u(e){var t,r;const{lazy:o,block:u,defaultValue:d,values:v,groupId:h,className:b}=e,f=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=v?v:f.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),y=(0,s.l)(g,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===d?d:null!=(t=null!=d?d:null==(r=f.find((e=>e.props.default)))?void 0:r.props.value)?t:f[0].props.value;if(null!==k&&!g.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:T}=(0,i.U)(),[w,O]=(0,n.useState)(k),x=[],{blockElementScrollPositionUntilNextRender:z}=(0,c.o5)();if(null!=h){const e=N[h];null!=e&&e!==w&&g.some((t=>t.value===e))&&O(e)}const P=e=>{const t=e.currentTarget,r=x.indexOf(t),a=g[r].value;a!==w&&(z(t),O(a),null!=h&&T(h,String(a)))},E=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{var a;const t=x.indexOf(e.currentTarget)+1;r=null!=(a=x[t])?a:x[0];break}case"ArrowLeft":{var n;const t=x.indexOf(e.currentTarget)-1;r=null!=(n=x[t])?n:x[x.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:(0,l.Z)("tabs-container",p)},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},b)},g.map((e=>{let{value:t,label:r,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>x.push(e),onKeyDown:E,onFocus:P,onClick:P},o,{className:(0,l.Z)("tabs__item",m,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=r?r:t)}))),o?(0,n.cloneElement)(f.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):n.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function d(e){const t=(0,o.Z)();return n.createElement(u,(0,a.Z)({key:String(t)},e))}},2341:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>c,toc:()=>m});var a=r(3117),n=(r(7294),r(3905)),l=r(5488),o=r(5162);const s={sidebar_position:113,tags:["Tree","Breadth-First Search","Binary Tree"]},i="Binary Tree Zigzag Level Order Traversal",c={unversionedId:"codes/binary-tree-zigzag-level-order-traversal",id:"codes/binary-tree-zigzag-level-order-traversal",title:"Binary Tree Zigzag Level Order Traversal",description:"Problem",source:"@site/docs/codes/binary-tree-zigzag-level-order-traversal.md",sourceDirName:"codes",slug:"/codes/binary-tree-zigzag-level-order-traversal",permalink:"/CodePrime/docs/codes/binary-tree-zigzag-level-order-traversal",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/binary-tree-zigzag-level-order-traversal.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:113,frontMatter:{sidebar_position:113,tags:["Tree","Breadth-First Search","Binary Tree"]},sidebar:"Leetcode",previous:{title:"Binary Tree Part-II",permalink:"/CodePrime/docs/category/binary-tree-part-ii"},next:{title:"Binary Tree Level Order Traversal",permalink:"/CodePrime/docs/codes/binary-tree-level-order-traversal"}},p={},m=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:m};function d(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"binary-tree-zigzag-level-order-traversal"},"Binary Tree Zigzag Level Order Traversal"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"},"Problem")),(0,n.kt)("p",null,"Given the ",(0,n.kt)("code",null,"root")," of a binary tree, return ",(0,n.kt)("em",null,"the zigzag level order traversal of its nodes' values"),". (i.e., from left to right, then right to left for the next level and alternate between)."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<vector<int>> ans;\n    int h = -1;\n\n   public:\n    void maxHeight(TreeNode* temp, int ht) {\n        if (temp == NULL) return;\n        h = max(ht, h);\n        maxHeight(temp->left, ht + 1);\n        maxHeight(temp->right, ht + 1);\n    }\n\n    void build(TreeNode* temp, int ht) {\n        if (temp == NULL) return;\n        ans[ht].push_back(temp->val);\n        build(temp->left, ht + 1);\n        build(temp->right, ht + 1);\n    }\n\n    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {\n        TreeNode* temp;\n        temp = new TreeNode;\n        temp = root;\n        maxHeight(temp, 0);\n        ans.resize(h + 1);\n        temp = root;\n        build(temp, 0);\n        for (int i = 1; i <= h; i += 2) {\n            reverse(ans[i].begin(), ans[i].end());\n        }\n        return ans;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);