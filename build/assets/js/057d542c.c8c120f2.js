"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6687],{3905:function(e,r,t){t.d(r,{Zo:function(){return c},kt:function(){return d}});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=n.createContext({}),u=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},c=function(e){var r=u(e.components);return n.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=u(t),d=a,f=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return t?n.createElement(f,i(i({ref:r},c),{},{components:t})):n.createElement(f,i({ref:r},c))}));function d(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=t[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:function(e,r,t){var n=t(7294);r.Z=function(e){var r=e.children,t=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:a},r)}},9877:function(e,r,t){t.d(r,{Z:function(){return c}});var n=t(7462),a=t(7294),o=t(2389),i=t(9548),l=t(6010),s="tabItem_LplD";function u(e){var r,t,o,u=e.lazy,c=e.block,p=e.defaultValue,m=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=m?m:v.map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes}})),h=(0,i.lx)(b,(function(e,r){return e.value===r.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===p?p:null!=(r=null!=p?p:null==(t=v.find((function(e){return e.props.default})))?void 0:t.props.value)?r:null==(o=v[0])?void 0:o.props.value;if(null!==y&&!b.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,i.UB)(),g=k.tabGroupChoices,N=k.setTabGroupChoices,T=(0,a.useState)(y),S=T[0],w=T[1],D=[],O=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var P=g[d];null!=P&&P!==S&&b.some((function(e){return e.value===P}))&&w(P)}var E=function(e){var r=e.currentTarget,t=D.indexOf(r),n=b[t].value;n!==S&&(O(r),w(n),null!=d&&N(d,n))},x=function(e){var r,t=null;switch(e.key){case"ArrowRight":var n=D.indexOf(e.currentTarget)+1;t=D[n]||D[0];break;case"ArrowLeft":var a=D.indexOf(e.currentTarget)-1;t=D[a]||D[D.length-1]}null==(r=t)||r.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":c},f)},b.map((function(e){var r=e.value,t=e.label,o=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:S===r?0:-1,"aria-selected":S===r,key:r,ref:function(e){return D.push(e)},onKeyDown:x,onFocus:E,onClick:E},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":S===r})}),null!=t?t:r)}))),u?(0,a.cloneElement)(v.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,r){return(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==S})}))))}function c(e){var r=(0,o.Z)();return a.createElement(u,(0,n.Z)({key:String(r)},e))}},1596:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return m},default:function(){return f}});var n=t(7462),a=t(3366),o=(t(7294),t(3905)),i=t(9877),l=t(8215),s=["components"],u={sidebar_position:8,tags:["Tree","Depth-First Search","Binary Tree"]},c="Boundary Traversal of binary tree",p={unversionedId:"Problems/StriverSDESheet/Day18/Boundary Traversal of binary tree",id:"Problems/StriverSDESheet/Day18/Boundary Traversal of binary tree",title:"Boundary Traversal of binary tree",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day18/Boundary Traversal of binary tree.md",sourceDirName:"Problems/StriverSDESheet/Day18",slug:"/Problems/StriverSDESheet/Day18/Boundary Traversal of binary tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day18/Boundary Traversal of binary tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day18/Boundary Traversal of binary tree.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8,tags:["Tree","Depth-First Search","Binary Tree"]},sidebar:"api",previous:{title:"Binary Tree Zigzag Level Order Traversal",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day18/Binary Tree Zigzag Level Order Traversal"},next:{title:"Binary Tree Maximum Path Sum",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day19/Binary Tree Maximum Path Sum"}},m=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function f(e){var r=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"boundary-traversal-of-binary-tree"},"Boundary Traversal of binary tree"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1/"},"https://practice.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    void printleft(Node *root, vector<int> &ans) {\n        if (root == NULL) {\n            return;\n        }\n        if (root->left != NULL) {\n            ans.push_back(root->data);\n            printleft(root->left, ans);\n        } else if (root->right != NULL) {\n            ans.push_back(root->data);\n            printleft(root->right, ans);\n        }\n    }\n\n    void printleaf(Node *root, vector<int> &ans) {\n        if (root == NULL) {\n            return;\n        }\n        if (root->left == NULL && root->right == NULL) {\n            ans.push_back(root->data);\n            return;\n        }\n        printleaf(root->left, ans);\n        printleaf(root->right, ans);\n    }\n\n    void printright(Node *root, vector<int> &ans) {\n        if (root == NULL) {\n            return;\n        }\n        if (root->right != NULL) {\n            printright(root->right, ans);\n            ans.push_back(root->data);\n        } else if (root->left != NULL) {\n            printright(root->left, ans);\n            ans.push_back(root->data);\n        }\n    }\n\n    vector<int> boundary(Node *root) {\n        vector<int> ans;\n        ans.push_back(root->data);\n        printleft(root->left, ans);\n        printleaf(root->left, ans);\n        printleaf(root->right, ans);\n        printright(root->right, ans);\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);