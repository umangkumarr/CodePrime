"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5687],{3905:(e,r,n)=>{n.d(r,{Zo:()=>c,kt:()=>m});var t=n(7294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=t.createContext({}),p=function(e){var r=t.useContext(i),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},c=function(e){var r=p(e.components);return t.createElement(i.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},u=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(n),m=a,b=u["".concat(i,".").concat(m)]||u[m]||d[m]||o;return n?t.createElement(b,l(l({ref:r},c),{},{components:n})):t.createElement(b,l({ref:r},c))}));function m(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=u;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var p=2;p<o;p++)l[p]=n[p];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5162:(e,r,n)=>{n.d(r,{Z:()=>l});var t=n(7294),a=n(4334);const o="tabItem_Ymn6";function l(e){let{children:r,hidden:n,className:l}=e;return t.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,l),hidden:n},r)}},5488:(e,r,n)=>{n.d(r,{Z:()=>m});var t=n(3117),a=n(7294),o=n(4334),l=n(2389),s=n(7392),i=n(7094),p=n(2466);const c="tabList__CuJ",d="tabItem_LNqP";function u(e){var r,n;const{lazy:l,block:u,defaultValue:m,values:b,groupId:f,className:v}=e,h=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),y=null!=b?b:h.map((e=>{let{props:{value:r,label:n,attributes:t}}=e;return{value:r,label:n,attributes:t}})),k=(0,s.l)(y,((e,r)=>e.value===r.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===m?m:null!=(r=null!=m?m:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?r:h[0].props.value;if(null!==g&&!y.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+y.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:T,setTabGroupChoices:N}=(0,i.U)(),[w,O]=(0,a.useState)(g),P=[],{blockElementScrollPositionUntilNextRender:C}=(0,p.o5)();if(null!=f){const e=T[f];null!=e&&e!==w&&y.some((r=>r.value===e))&&O(e)}const x=e=>{const r=e.currentTarget,n=P.indexOf(r),t=y[n].value;t!==w&&(C(r),O(t),null!=f&&N(f,String(t)))},E=e=>{var r;let n=null;switch(e.key){case"ArrowRight":{var t;const r=P.indexOf(e.currentTarget)+1;n=null!=(t=P[r])?t:P[0];break}case"ArrowLeft":{var a;const r=P.indexOf(e.currentTarget)-1;n=null!=(a=P[r])?a:P[P.length-1];break}}null==(r=n)||r.focus()};return a.createElement("div",{className:(0,o.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":u},v)},y.map((e=>{let{value:r,label:n,attributes:l}=e;return a.createElement("li",(0,t.Z)({role:"tab",tabIndex:w===r?0:-1,"aria-selected":w===r,key:r,ref:e=>P.push(e),onKeyDown:E,onFocus:x,onClick:x},l,{className:(0,o.Z)("tabs__item",d,null==l?void 0:l.className,{"tabs__item--active":w===r})}),null!=n?n:r)}))),l?(0,a.cloneElement)(h.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},h.map(((e,r)=>(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==w})))))}function m(e){const r=(0,l.Z)();return a.createElement(u,(0,t.Z)({key:String(r)},e))}},7660:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>p,toc:()=>d});var t=n(3117),a=(n(7294),n(3905)),o=n(5488),l=n(5162);const s={sidebar_position:121,tags:["Array","Hash Table","Divide and Conquer","Tree","Binary Tree"]},i="Construct Binary Tree from Preorder and Inorder Traversal",p={unversionedId:"codes/construct-binary-tree-from-preorder-and-inorder-traversal",id:"codes/construct-binary-tree-from-preorder-and-inorder-traversal",title:"Construct Binary Tree from Preorder and Inorder Traversal",description:"Problem",source:"@site/docs/codes/construct-binary-tree-from-preorder-and-inorder-traversal.md",sourceDirName:"codes",slug:"/codes/construct-binary-tree-from-preorder-and-inorder-traversal",permalink:"/CodePrime/docs/codes/construct-binary-tree-from-preorder-and-inorder-traversal",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/construct-binary-tree-from-preorder-and-inorder-traversal.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Divide and Conquer",permalink:"/CodePrime/docs/tags/divide-and-conquer"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:121,frontMatter:{sidebar_position:121,tags:["Array","Hash Table","Divide and Conquer","Tree","Binary Tree"]},sidebar:"Leetcode",previous:{title:"Binary Tree part-III",permalink:"/CodePrime/docs/category/binary-tree-part-iii"},next:{title:"Construct Binary Tree from Inorder and Postorder Traversal",permalink:"/CodePrime/docs/codes/construct-binary-tree-from-inorder-and-postorder-traversal"}},c={},d=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:d};function m(e){let{components:r,...n}=e;return(0,a.kt)("wrapper",(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"construct-binary-tree-from-preorder-and-inorder-traversal"},"Construct Binary Tree from Preorder and Inorder Traversal"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"},"Problem")),(0,a.kt)("p",null,"Given two integer arrays ",(0,a.kt)("code",null,"preorder")," and ",(0,a.kt)("code",null,"inorder")," where ",(0,a.kt)("code",null,"preorder")," is the preorder traversal of a binary tree and ",(0,a.kt)("code",null,"inorder")," is the inorder traversal of the same tree, construct and return ",(0,a.kt)("em",null,"the binary tree"),"."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<int> preorder;\n    vector<int> inorder;\n\n   public:\n    TreeNode* createTree(int p1, int p2, int n1, int n2) {\n        if (p2 < p1 || n1 > n2) return NULL;\n        TreeNode* root = new TreeNode(preorder[p1]);\n        if (p1 == p2 || n1 == n2) return root;\n        int pp1, pp2, nn1, nn2;\n\n        nn1 = n1, nn2 = n1;\n        while (inorder[nn2] != preorder[p1]) {\n            nn2++;\n        }\n        nn2--;\n        pp1 = p1 + 1;\n        pp2 = p1 + (nn2 - nn1) + 1;\n\n        root->left = createTree(pp1, pp2, nn1, nn2);\n\n        nn2 = n2;\n        nn1 = n2;\n        while (inorder[nn1] != preorder[p1]) nn1--;\n        nn1++;\n        pp2 = p2;\n        pp1 = pp2 - (nn2 - nn1);\n        root->right = createTree(pp1, pp2, nn1, nn2);\n        return root;\n    }\n\n    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n        this->preorder = preorder;\n        this->inorder = inorder;\n        int n = preorder.size();\n        return createTree(0, n - 1, 0, n - 1);\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);