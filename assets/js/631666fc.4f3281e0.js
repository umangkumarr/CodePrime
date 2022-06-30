"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7654],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function m(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),o=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=o(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=m(e,["components","mdxType","originalType","parentName"]),c=o(a),d=r,h=c["".concat(i,".").concat(d)]||c[d]||u[d]||s;return a?n.createElement(h,l(l({ref:t},p),{},{components:a})):n.createElement(h,l({ref:t},p))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,l=new Array(s);l[0]=c;var m={};for(var i in t)hasOwnProperty.call(t,i)&&(m[i]=t[i]);m.originalType=e,m.mdxType="string"==typeof e?e:r,l[1]=m;for(var o=2;o<s;o++)l[o]=a[o];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);const r=function(e){let{children:t,hidden:a,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>p});var n=a(7462),r=a(7294),s=a(2389),l=a(5773),m=a(6010);const i="tabItem_LplD";function o(e){var t,a,s;const{lazy:o,block:p,defaultValue:u,values:c,groupId:d,className:h}=e,N=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=c?c:N.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),b=(0,l.lx)(k,((e,t)=>e.value===t.value));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===u?u:null!=(t=null!=u?u:null==(a=N.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(s=N[0])?void 0:s.props.value;if(null!==f&&!k.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:y}=(0,l.UB)(),[v,w]=(0,r.useState)(f),T=[],{blockElementScrollPositionUntilNextRender:x}=(0,l.o5)();if(null!=d){const e=g[d];null!=e&&e!==v&&k.some((t=>t.value===e))&&w(e)}const O=e=>{const t=e.currentTarget,a=T.indexOf(t),n=k[a].value;n!==v&&(x(t),w(n),null!=d&&y(d,n))},P=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;a=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;a=T[t]||T[T.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,m.Z)("tabs",{"tabs--block":p},h)},k.map((e=>{let{value:t,label:a,attributes:s}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:v===t?0:-1,"aria-selected":v===t,key:t,ref:e=>T.push(e),onKeyDown:P,onFocus:O,onClick:O},s,{className:(0,m.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":v===t})}),null!=a?a:t)}))),o?(0,r.cloneElement)(N.filter((e=>e.props.value===v))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},N.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==v})))))}function p(e){const t=(0,s.Z)();return r.createElement(o,(0,n.Z)({key:String(t)},e))}},4687:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>m,contentTitle:()=>i,metadata:()=>o,toc:()=>p,default:()=>c});var n=a(7462),r=(a(7294),a(3905)),s=a(9877),l=a(8215);const m={sidebar_position:4},i="Maximum Binary Tree",o={unversionedId:"Problems/DSA/Trees/Maximum_Binary_Tree",id:"Problems/DSA/Trees/Maximum_Binary_Tree",title:"Maximum Binary Tree",description:"Problem Statement",source:"@site/docs/Problems/DSA/Trees/Maximum_Binary_Tree.md",sourceDirName:"Problems/DSA/Trees",slug:"/Problems/DSA/Trees/Maximum_Binary_Tree",permalink:"/CodePrime/docs/Problems/DSA/Trees/Maximum_Binary_Tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/DSA/Trees/Maximum_Binary_Tree.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"api",previous:{title:"Sets bits from 1 to N",permalink:"/CodePrime/docs/Problems/DSA/Bit Magic/PlayingWithBits"},next:{title:"Exponentiation",permalink:"/CodePrime/docs/Problems/DSA/NumberTheory/Exponentiation"}},p=[{value:"Problem Statement",id:"problem-statement",children:[],level:2},{value:"Example",id:"example",children:[],level:2},{value:"Solution",id:"solution",children:[],level:2},{value:"Author",id:"author",children:[],level:2}],u={toc:p};function c(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"maximum-binary-tree"},"Maximum Binary Tree"),(0,r.kt)("h2",{id:"problem-statement"},"Problem Statement"),(0,r.kt)("p",null,"You are given an integer array nums with no duplicates. A ",(0,r.kt)("strong",{parentName:"p"},"maximum binary tree")," can be built recursively from nums using the following algorithm:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Create a root node whose value is the maximum value in ",(0,r.kt)("em",{parentName:"li"},"nums"),"."),(0,r.kt)("li",{parentName:"ul"},"Recursively build the left subtree on the ",(0,r.kt)("strong",{parentName:"li"},"subarray prefix")," to the ",(0,r.kt)("strong",{parentName:"li"},"left")," of the maximum value."),(0,r.kt)("li",{parentName:"ul"},"Recursively build the right subtree on the ",(0,r.kt)("strong",{parentName:"li"},"subarray suffix")," to the ",(0,r.kt)("strong",{parentName:"li"},"right")," of the maximum value.")),(0,r.kt)("p",null,"Return the maximum binary tree built from ",(0,r.kt)("em",{parentName:"p"},"nums"),"."),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},"Input: nums = [3,2,1,6,0,5]\nOutput: [6,3,5,null,2,0,null,null,1]\n\nInput: nums = [3,2,1]\nOutput: [3,null,2,null,1]\n")),(0,r.kt)("h2",{id:"solution"},"Solution"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow"},"<"),(0,r.kt)("mi",{parentName:"mrow"},"s"),(0,r.kt)("mi",{parentName:"mrow"},"u"),(0,r.kt)("mi",{parentName:"mrow"},"p"),(0,r.kt)("mo",{parentName:"mrow"},">"),(0,r.kt)("mn",{parentName:"mrow"},"2"),(0,r.kt)("mo",{parentName:"mrow"},"<"),(0,r.kt)("mi",{parentName:"mrow"},"s"),(0,r.kt)("mi",{parentName:"mrow"},"u"),(0,r.kt)("mi",{parentName:"mrow"},"p"),(0,r.kt)("mo",{parentName:"mrow"},">"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"(n<sup>2<sup>)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,r.kt)("span",{parentName:"span",className:"mrel"},"<"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.7335em",verticalAlign:"-0.1944em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"s"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"u"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"p"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,r.kt)("span",{parentName:"span",className:"mrel"},">"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6835em",verticalAlign:"-0.0391em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},"2"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,r.kt)("span",{parentName:"span",className:"mrel"},"<"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.7335em",verticalAlign:"-0.1944em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"s"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"u"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"p"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,r.kt)("span",{parentName:"span",className:"mrel"},">")),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution"),"We make use of a function **builtTree(nums, lo, up)**, which returns the maximum binary tree consisting of numbers within the indices *lo* and *up* in the given numsnums array.",(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"}," Algorithm ")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Start with the function call builtTree(nums, 0, n). Here, n refers to the number of elements in the given nums array.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Find the index, ",(0,r.kt)("em",{parentName:"p"},"ind")," , of the largest element in the current range of indices ",(0,r.kt)("em",{parentName:"p"},"(lo:up)"),". Make this largest element, ",(0,r.kt)("em",{parentName:"p"},"nums","[ ind ]")," as the local root node.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Determine the left child using construct(nums, lo, ind-1). Doing this recursively finds the largest element in the subarray left to the current largest element.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Similarly, determine the right child using construct(nums, ind+1, r)."))),(0,r.kt)("p",null,"Return the root node to the calling function."),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"\nclass Solution {\npublic:\n    TreeNode* constructMaximumBinaryTree(vector<int>& nums) {\n        return builtTree(nums,0,nums.size()-1);\n    }\n    \n    TreeNode* builtTree(vector<int> nums,int lo,int up)\n    {\n        if(lo > up)\n        {\n            return NULL;\n        }\n        if(lo == up)\n        {\n            return new TreeNode(nums[lo]);\n        }\n        int ind = lo;\n        for(int i=lo;i<=up;i++)\n        {\n            if(nums[ind] < nums[i])\n            {\n                ind = i;\n            }\n        }\n        TreeNode* root = new TreeNode(nums[ind]);\n        root->left = builtTree(nums,lo,ind-1);\n        root->right = builtTree(nums,ind+1,up);\n        return root;\n    }\n};\n"))))),(0,r.kt)("h2",{id:"author"},"Author"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://www.linkedin.com/in/deepak-sharma-66968120a/"},"Deepak Sharma")))}c.isMDXComponent=!0}}]);