"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9564],{3905:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=a.createContext({}),c=function(e){var t=a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(r),m=n,h=p["".concat(l,".").concat(m)]||p[m]||u[m]||i;return r?a.createElement(h,o(o({ref:t},d),{},{components:r})):a.createElement(h,o({ref:t},d))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<i;c++)o[c]=r[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){let{children:t,hidden:r,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>d});var a=r(7462),n=r(7294),i=r(2389),o=r(5773),s=r(6010);const l="tabItem_LplD";function c(e){var t,r,i;const{lazy:c,block:d,defaultValue:u,values:p,groupId:m,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:b.map((e=>{let{props:{value:t,label:r,attributes:a}}=e;return{value:t,label:r,attributes:a}})),g=(0,o.lx)(f,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===u?u:null!=(t=null!=u?u:null==(r=b.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(i=b[0])?void 0:i.props.value;if(null!==y&&!f.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:k}=(0,o.UB)(),[N,w]=(0,n.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:z}=(0,o.o5)();if(null!=m){const e=v[m];null!=e&&e!==N&&f.some((t=>t.value===e))&&w(e)}const O=e=>{const t=e.currentTarget,r=T.indexOf(t),a=f[r].value;a!==N&&(z(t),w(a),null!=m&&k(m,a))},j=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;r=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;r=T[t]||T[T.length-1];break}}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":d},h)},f.map((e=>{let{value:t,label:r,attributes:i}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>T.push(e),onKeyDown:j,onFocus:O,onClick:O},i,{className:(0,s.Z)("tabs__item",l,null==i?void 0:i.className,{"tabs__item--active":N===t})}),null!=r?r:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function d(e){const t=(0,i.Z)();return n.createElement(c,(0,a.Z)({key:String(t)},e))}},3248:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>s,contentTitle:()=>l,metadata:()=>c,toc:()=>d,default:()=>p});var a=r(7462),n=(r(7294),r(3905)),i=r(9877),o=r(8215);const s={sidebar_position:140,tags:["String","Tree","Depth-First Search","Breadth-First Search","Design","Binary Tree"]},l="Serialize and Deserialize Binary Tree",c={unversionedId:"codes/serialize-and-deserialize-binary-tree",id:"codes/serialize-and-deserialize-binary-tree",title:"Serialize and Deserialize Binary Tree",description:"Problem",source:"@site/docs/codes/serialize-and-deserialize-binary-tree.md",sourceDirName:"codes",slug:"/codes/serialize-and-deserialize-binary-tree",permalink:"/CodePrime/docs/codes/serialize-and-deserialize-binary-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/serialize-and-deserialize-binary-tree.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Design",permalink:"/CodePrime/docs/tags/design"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:140,frontMatter:{sidebar_position:140,tags:["String","Tree","Depth-First Search","Breadth-First Search","Design","Binary Tree"]},sidebar:"main",previous:{title:"Kth Smallest Element in a BST",permalink:"/CodePrime/docs/codes/kth-smallest-element-in-a-bst"},next:{title:"Floor in BST",permalink:"/CodePrime/docs/codes/floor-in-bst"}},d=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:d};function p(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"serialize-and-deserialize-binary-tree"},"Serialize and Deserialize Binary Tree"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"},"Problem")),(0,n.kt)("p",null,"Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment."),(0,n.kt)("p",null,"Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure."),(0,n.kt)("p",null,(0,n.kt)("strong",null,"Clarification:")," The input/output format is the same as ",(0,n.kt)("a",{href:"/faq/#binary-tree",target:"_blank"},"how LeetCode serializes a binary tree"),". You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(i.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Codec {\n   public:\n    string s = \"\";\n    void serial(TreeNode* root) {\n        string a = to_string(root->val);\n        s += a;\n        if (root->left) {\n            s += \"L(\";\n            serial(root->left);\n            s.push_back(')');\n        }\n        if (root->right) {\n            s += \"R(\";\n            serial(root->right);\n            s.push_back(')');\n        }\n    }\n\n    string serialize(TreeNode* root) {\n        if (!root) return \"\";\n        serial(root);\n        cout << s << \"\\n\";\n        return s;\n    }\n\n    string d;\n    TreeNode* deserial(int& i) {\n        int j = i;\n        while ((d[j] >= '0' && d[j] <= '9') || d[j] == '-') j++;\n        string num(d.begin() + i, d.begin() + j);\n        int val = stoi(num);\n        TreeNode* root = new TreeNode(val);\n        i = j;\n        if (d[i] == 'L') {\n            i += 2;\n            root->left = deserial(i);\n            i++;\n        }\n        if (d[i] == 'R') {\n            i += 2;\n            root->right = deserial(i);\n            i++;\n        }\n        return root;\n    }\n\n    TreeNode* deserialize(string data) {\n        if (data.length() == 0) return NULL;\n        this->d = data;\n        int j = 0;\n        return deserial(j);\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);