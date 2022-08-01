"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1456],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),u=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(r),m=n,h=d["".concat(i,".").concat(m)]||d[m]||p[m]||o;return r?a.createElement(h,l(l({ref:t},c),{},{components:r})):a.createElement(h,l({ref:t},c))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=d;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var u=2;u<o;u++)l[u]=r[u];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var a=r(7462),n=r(7294),o=r(2389),l=r(5773),s=r(6010);const i="tabItem_LplD";function u(e){var t,r,o;const{lazy:u,block:c,defaultValue:p,values:d,groupId:m,className:h}=e,f=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=d?d:f.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),y=(0,l.lx)(b,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===p?p:null!=(t=null!=p?p:null==(r=f.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,l.UB)(),[N,w]=(0,n.useState)(v),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=m){const e=k[m];null!=e&&e!==N&&b.some((t=>t.value===e))&&w(e)}const x=e=>{const t=e.currentTarget,r=T.indexOf(t),a=b[r].value;a!==N&&(O(t),w(a),null!=m&&g(m,a))},E=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":c},h)},b.map((e=>{let{value:t,label:r,attributes:o}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>T.push(e),onKeyDown:E,onFocus:x,onClick:x},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),u?(0,n.cloneElement)(f.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function c(e){const t=(0,o.Z)();return n.createElement(u,(0,a.Z)({key:String(t)},e))}},8797:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>u,toc:()=>c,default:()=>d});var a=r(7462),n=(r(7294),r(3905)),o=r(9877),l=r(8215);const s={displayed_sidebar:null,sidebar_position:8,tags:["Tree","Depth-First Search","Binary Tree"]},i="Boundary Traversal of binary tree",u={unversionedId:"codes/boundary-traversal-of-binary-tree",id:"codes/boundary-traversal-of-binary-tree",title:"Boundary Traversal of binary tree",description:"Problem",source:"@site/docs/codes/boundary-traversal-of-binary-tree.md",sourceDirName:"codes",slug:"/codes/boundary-traversal-of-binary-tree",permalink:"/docs/codes/boundary-traversal-of-binary-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/boundary-traversal-of-binary-tree.md",tags:[{label:"Tree",permalink:"/docs/tags/tree"},{label:"Depth-First Search",permalink:"/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/docs/tags/binary-tree"}],version:"current",sidebarPosition:8,frontMatter:{displayed_sidebar:null,sidebar_position:8,tags:["Tree","Depth-First Search","Binary Tree"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:c};function d(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"boundary-traversal-of-binary-tree"},"Boundary Traversal of binary tree"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1/"},"Problem")),(0,n.kt)("p",null,(0,n.kt)("span",null,"Given a Binary Tree, find its Boundary Traversal. The traversal should be in the following order:\xa0")),(0,n.kt)("ol",null,(0,n.kt)("li",null,(0,n.kt)("span",null,(0,n.kt)("strong",null,"Left boundary nodes:"),"\xa0defined as the path from the root to the left-most node\xa0"),(0,n.kt)("span",null,"ie- the\xa0leaf node you could reach when you always travel preferring\xa0the left subtree over the\xa0right subtree.\xa0")),(0,n.kt)("li",null,(0,n.kt)("span",null,(0,n.kt)("strong",null,"Leaf nodes:\xa0"),"All the leaf nodes except for the ones that are part of left or right boundary.")),(0,n.kt)("li",null,(0,n.kt)("span",null,(0,n.kt)("strong",null,"Reverse right boundary nodes:"),"\xa0defined as the path from\xa0the right-most node to the\xa0root. The\xa0right-most node is\xa0the\xa0leaf node you could reach when you always travel preferring\xa0the right subtree over the\xa0left subtree.\xa0Exclude the root from this as it was already included in the traversal of left boundary nodes."))),(0,n.kt)("span",null,(0,n.kt)("strong",null,"Note:")," If the root doesn't have a left subtree or right subtree, then the root itself is the left\xa0or right boundary."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    void printleft(Node *root, vector<int> &ans) {\n        if (root == NULL) {\n            return;\n        }\n        if (root->left != NULL) {\n            ans.push_back(root->data);\n            printleft(root->left, ans);\n        } else if (root->right != NULL) {\n            ans.push_back(root->data);\n            printleft(root->right, ans);\n        }\n    }\n\n    void printleaf(Node *root, vector<int> &ans) {\n        if (root == NULL) {\n            return;\n        }\n        if (root->left == NULL && root->right == NULL) {\n            ans.push_back(root->data);\n            return;\n        }\n        printleaf(root->left, ans);\n        printleaf(root->right, ans);\n    }\n\n    void printright(Node *root, vector<int> &ans) {\n        if (root == NULL) {\n            return;\n        }\n        if (root->right != NULL) {\n            printright(root->right, ans);\n            ans.push_back(root->data);\n        } else if (root->left != NULL) {\n            printright(root->left, ans);\n            ans.push_back(root->data);\n        }\n    }\n\n    vector<int> boundary(Node *root) {\n        vector<int> ans;\n        ans.push_back(root->data);\n        printleft(root->left, ans);\n        printleaf(root->left, ans);\n        printleaf(root->right, ans);\n        printright(root->right, ans);\n        return ans;\n    }\n};\n"))))))}d.isMDXComponent=!0}}]);