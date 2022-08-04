"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5107],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,h=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return n?r.createElement(h,l(l({ref:t},p),{},{components:n})):r.createElement(h,l({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var c=2;c<o;c++)l[c]=n[c];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>l});var r=n(7294),a=n(4334);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:n,className:l}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(o,l),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var r=n(3117),a=n(7294),o=n(4334),l=n(2389),i=n(7392),s=n(7094),c=n(2466);const p="tabList__CuJ",u="tabItem_LNqP";function m(e){var t,n;const{lazy:l,block:m,defaultValue:d,values:h,groupId:b,className:f}=e,g=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=h?h:g.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),k=(0,i.l)(v,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=g.find((e=>e.props.default)))?void 0:n.props.value)?t:g[0].props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:x}=(0,s.U)(),[w,P]=(0,a.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:O}=(0,c.o5)();if(null!=b){const e=N[b];null!=e&&e!==w&&v.some((t=>t.value===e))&&P(e)}const E=e=>{const t=e.currentTarget,n=T.indexOf(t),r=v[n].value;r!==w&&(O(t),P(r),null!=b&&x(b,String(r)))},j=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var r;const t=T.indexOf(e.currentTarget)+1;n=null!=(r=T[t])?r:T[0];break}case"ArrowLeft":{var a;const t=T.indexOf(e.currentTarget)-1;n=null!=(a=T[t])?a:T[T.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:(0,o.Z)("tabs-container",p)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},f)},v.map((e=>{let{value:t,label:n,attributes:l}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>T.push(e),onKeyDown:j,onFocus:E,onClick:E},l,{className:(0,o.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),l?(0,a.cloneElement)(g.filter((e=>e.props.value===w))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},g.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function d(e){const t=(0,l.Z)();return a.createElement(m,(0,r.Z)({key:String(t)},e))}},8973:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>u});var r=n(3117),a=(n(7294),n(3905)),o=n(5488),l=n(5162);const i={sidebar_position:133,tags:["Linked List","Tree","Depth-First Search","Breadth-First Search","Binary Tree"]},s="Populating Next Right Pointers in Each Node",c={unversionedId:"codes/populating-next-right-pointers-in-each-node",id:"codes/populating-next-right-pointers-in-each-node",title:"Populating Next Right Pointers in Each Node",description:"Problem",source:"@site/docs/codes/populating-next-right-pointers-in-each-node.md",sourceDirName:"codes",slug:"/codes/populating-next-right-pointers-in-each-node",permalink:"/CodePrime/docs/codes/populating-next-right-pointers-in-each-node",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/populating-next-right-pointers-in-each-node.md",tags:[{label:"Linked List",permalink:"/CodePrime/docs/tags/linked-list"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:133,frontMatter:{sidebar_position:133,tags:["Linked List","Tree","Depth-First Search","Breadth-First Search","Binary Tree"]},sidebar:"Leetcode",previous:{title:"Convert Sorted Array to Binary Search Tree",permalink:"/CodePrime/docs/codes/convert-sorted-array-to-binary-search-tree"},next:{title:"Binary Search Tree Part-II",permalink:"/CodePrime/docs/category/binary-search-tree-part-ii"}},p={},u=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:u};function d(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"populating-next-right-pointers-in-each-node"},"Populating Next Right Pointers in Each Node"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/populating-next-right-pointers-in-each-node/"},"Problem")),(0,a.kt)("p",null,"You are given a ",(0,a.kt)("strong",null,"perfect binary tree")," where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"struct Node {\n  int val;\n  Node *left;\n  Node *right;\n  Node *next;\n}\n")),(0,a.kt)("p",null,"Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to ",(0,a.kt)("code",null,"NULL"),"."),(0,a.kt)("p",null,"Initially, all next pointers are set to ",(0,a.kt)("code",null,"NULL"),"."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(o.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    map<int, vector<Node*>> mp;\n\n   public:\n    void traversal(Node* root, int h) {\n        if (!root) return;\n        mp[h].push_back(root);\n        traversal(root->left, h + 1);\n        traversal(root->right, h + 1);\n    }\n\n    Node* connect(Node* root) {\n        traversal(root, 0);\n        for (auto i : mp) {\n            for (int j = 0; j < i.second.size() - 1; j++) {\n                i.second[j]->next = i.second[j + 1];\n            }\n        }\n        return root;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);