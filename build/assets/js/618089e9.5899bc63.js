"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7086],{3905:(e,r,t)=>{t.d(r,{Zo:()=>m,kt:()=>d});var a=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function o(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var s=a.createContext({}),c=function(e){var r=a.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},m=function(e){var r=c(e.components);return a.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},u=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),u=c(t),d=n,b=u["".concat(s,".").concat(d)]||u[d]||p[d]||i;return t?a.createElement(b,l(l({ref:r},m),{},{components:t})):a.createElement(b,l({ref:r},m))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var i=t.length,l=new Array(i);l[0]=u;var o={};for(var s in r)hasOwnProperty.call(r,s)&&(o[s]=r[s]);o.originalType=e,o.mdxType="string"==typeof e?e:n,l[1]=o;for(var c=2;c<i;c++)l[c]=t[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:(e,r,t)=>{t.d(r,{Z:()=>n});var a=t(7294);const n=function(e){let{children:r,hidden:t,className:n}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:n},r)}},9877:(e,r,t)=>{t.d(r,{Z:()=>m});var a=t(7462),n=t(7294),i=t(2389),l=t(5773),o=t(6010);const s="tabItem_LplD";function c(e){var r,t,i;const{lazy:c,block:m,defaultValue:p,values:u,groupId:d,className:b}=e,h=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),y=null!=u?u:h.map((e=>{let{props:{value:r,label:t,attributes:a}}=e;return{value:r,label:t,attributes:a}})),f=(0,l.lx)(y,((e,r)=>e.value===r.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===p?p:null!=(r=null!=p?p:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?r:null==(i=h[0])?void 0:i.props.value;if(null!==v&&!y.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+y.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:g}=(0,l.UB)(),[N,S]=(0,n.useState)(v),T=[],{blockElementScrollPositionUntilNextRender:D}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&y.some((r=>r.value===e))&&S(e)}const w=e=>{const r=e.currentTarget,t=T.indexOf(r),a=y[t].value;a!==N&&(D(r),S(a),null!=d&&g(d,a))},E=e=>{var r;let t=null;switch(e.key){case"ArrowRight":{const r=T.indexOf(e.currentTarget)+1;t=T[r]||T[0];break}case"ArrowLeft":{const r=T.indexOf(e.currentTarget)-1;t=T[r]||T[T.length-1];break}}null==(r=t)||r.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},b)},y.map((e=>{let{value:r,label:t,attributes:i}=e;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===r?0:-1,"aria-selected":N===r,key:r,ref:e=>T.push(e),onKeyDown:E,onFocus:w,onClick:w},i,{className:(0,o.Z)("tabs__item",s,null==i?void 0:i.className,{"tabs__item--active":N===r})}),null!=t?t:r)}))),c?(0,n.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},h.map(((e,r)=>(0,n.cloneElement)(e,{key:r,hidden:e.props.value!==N})))))}function m(e){const r=(0,i.Z)();return n.createElement(c,(0,a.Z)({key:String(r)},e))}},9773:(e,r,t)=>{t.r(r),t.d(r,{frontMatter:()=>o,contentTitle:()=>s,metadata:()=>c,toc:()=>m,default:()=>u});var a=t(7462),n=(t(7294),t(3905)),i=t(9877),l=t(8215);const o={sidebar_position:8,tags:["Tree","Breadth-First Search","Binary Tree"]},s="Serialize and Deserialize Binary Tree",c={unversionedId:"Problems/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree",id:"Problems/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree",title:"Serialize and Deserialize Binary Tree",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree.md",sourceDirName:"Problems/StriverSDESheet/Day21",slug:"/Problems/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Breadth-First Search",permalink:"/CodePrime/docs/tags/breadth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8,tags:["Tree","Breadth-First Search","Binary Tree"]},sidebar:"api",previous:{title:"Maximum Sum BST in Binary Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day21/Maximum Sum BST in Binary Tree"},next:{title:"Flatten Binary Tree to Linked List",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day22/Flatten Binary Tree to Linked List"}},m=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:m};function u(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,a.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"serialize-and-deserialize-binary-tree"},"Serialize and Deserialize Binary Tree"),(0,n.kt)("h2",{id:"problem-link"},"Problem Link"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"},"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/")),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(i.Z,{mdxType:"Tabs"},(0,n.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Codec {\n   public:\n    string s = \"\";\n    void serial(TreeNode* root) {\n        string a = to_string(root->val);\n        s += a;\n        if (root->left) {\n            s += \"L(\";\n            serial(root->left);\n            s.push_back(')');\n        }\n        if (root->right) {\n            s += \"R(\";\n            serial(root->right);\n            s.push_back(')');\n        }\n    }\n\n    string serialize(TreeNode* root) {\n        if (!root) return \"\";\n        serial(root);\n        cout << s << \"\\n\";\n        return s;\n    }\n\n    string d;\n    TreeNode* deserial(int& i) {\n        int j = i;\n        while ((d[j] >= '0' && d[j] <= '9') || d[j] == '-') j++;\n        string num(d.begin() + i, d.begin() + j);\n        int val = stoi(num);\n        TreeNode* root = new TreeNode(val);\n        i = j;\n        if (d[i] == 'L') {\n            i += 2;\n            root->left = deserial(i);\n            i++;\n        }\n        if (d[i] == 'R') {\n            i += 2;\n            root->right = deserial(i);\n            i++;\n        }\n        return root;\n    }\n\n    TreeNode* deserialize(string data) {\n        if (data.length() == 0) return NULL;\n        this->d = data;\n        int j = 0;\n        return deserial(j);\n    }\n};\n"))))))}u.isMDXComponent=!0}}]);