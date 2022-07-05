"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[47],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),m=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=m(n),d=r,h=p["".concat(s,".").concat(d)]||p[d]||u[d]||o;return n?a.createElement(h,l(l({ref:t},c),{},{components:n})):a.createElement(h,l({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var m=2;m<o;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(7462),r=n(7294),o=n(2389),l=n(5773),i=n(6010);const s="tabItem_LplD";function m(e){var t,n,o;const{lazy:m,block:c,defaultValue:u,values:p,groupId:d,className:h}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=p?p:f.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),y=(0,l.lx)(b,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===u?u:null!=(t=null!=u?u:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:k}=(0,l.UB)(),[w,N]=(0,r.useState)(v),x=[],{blockElementScrollPositionUntilNextRender:T}=(0,l.o5)();if(null!=d){const e=g[d];null!=e&&e!==w&&b.some((t=>t.value===e))&&N(e)}const O=e=>{const t=e.currentTarget,n=x.indexOf(t),a=b[n].value;a!==w&&(T(t),N(a),null!=d&&k(d,a))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=x.indexOf(e.currentTarget)+1;n=x[t]||x[0];break}case"ArrowLeft":{const t=x.indexOf(e.currentTarget)-1;n=x[t]||x[x.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},h)},b.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>x.push(e),onKeyDown:E,onFocus:O,onClick:O},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(f.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function c(e){const t=(0,o.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},7721:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>m,toc:()=>c,default:()=>p});var a=n(7462),r=(n(7294),n(3905)),o=n(9877),l=n(8215);const i={displayed_sidebar:null,sidebar_position:102,tags:["Tree","Depth-First Search","Breadth-First Search","Binary Tree"]},s="Maximum Width of Binary Tree",m={unversionedId:"codes/maximum-width-of-binary-tree",id:"codes/maximum-width-of-binary-tree",title:"Maximum Width of Binary Tree",description:"Problem",source:"@site/docs/codes/maximum-width-of-binary-tree.md",sourceDirName:"codes",slug:"/codes/maximum-width-of-binary-tree",permalink:"/CodePrime/docs/codes/maximum-width-of-binary-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/maximum-width-of-binary-tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:102,frontMatter:{displayed_sidebar:null,sidebar_position:102,tags:["Tree","Depth-First Search","Breadth-First Search","Binary Tree"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:c};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"maximum-width-of-binary-tree"},"Maximum Width of Binary Tree"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/maximum-width-of-binary-tree/"},"Problem")),(0,r.kt)("p",null,"Given the ",(0,r.kt)("code",null,"root")," of a binary tree, return ",(0,r.kt)("em",null,"the ",(0,r.kt)("strong",null,"maximum width")," of the given tree"),"."),(0,r.kt)("p",null,"The ",(0,r.kt)("strong",null,"maximum width")," of a tree is the maximum ",(0,r.kt)("strong",null,"width")," among all levels."),(0,r.kt)("p",null,"The ",(0,r.kt)("strong",null,"width")," of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation."),(0,r.kt)("p",null,"It is ",(0,r.kt)("strong",null,"guaranteed")," that the answer will in the range of a ",(0,r.kt)("strong",null,"32-bit")," signed integer."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int widthOfBinaryTree(TreeNode* root) {\n        queue<pair<TreeNode*, int>> q;\n        q.push({root, 0});\n        int ans = 0;\n        while (!q.empty()) {\n            int n = q.size();\n            int start = q.front().second;\n            int end = q.back().second;\n            ans = max(ans, end - start + 1);\n            for (int i = 0; i < n; i++) {\n                TreeNode* node = q.front().first;\n                int p = q.front().second;\n                q.pop();\n                if (node->left != NULL) {\n                    q.push({node->left, (long long)2 * p + 1});\n                }\n                if (node->right != NULL) {\n                    q.push({node->right, (long long)2 * p + 2});\n                }\n            }\n        }\n        return ans;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);