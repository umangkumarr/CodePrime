"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1366],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=c(r),d=a,v=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(v,l(l({ref:t},u),{},{components:r})):n.createElement(v,l({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var c=2;c<o;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:function(e,t,r){var n=r(7294);t.Z=function(e){var t=e.children,r=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:function(e,t,r){r.d(t,{Z:function(){return u}});var n=r(7462),a=r(7294),o=r(2389),l=r(9548),i=r(6010),s="tabItem_LplD";function c(e){var t,r,o,c=e.lazy,u=e.block,p=e.defaultValue,m=e.values,d=e.groupId,v=e.className,h=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,l.lx)(f,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===p?p:null!=(t=null!=p?p:null==(r=h.find((function(e){return e.props.default})))?void 0:r.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==y&&!f.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.UB)(),N=k.tabGroupChoices,g=k.setTabGroupChoices,w=(0,a.useState)(y),P=w[0],T=w[1],S=[],D=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var O=N[d];null!=O&&O!==P&&f.some((function(e){return e.value===O}))&&T(O)}var E=function(e){var t=e.currentTarget,r=S.indexOf(t),n=f[r].value;n!==P&&(D(t),T(n),null!=d&&g(d,n))},x=function(e){var t,r=null;switch(e.key){case"ArrowRight":var n=S.indexOf(e.currentTarget)+1;r=S[n]||S[0];break;case"ArrowLeft":var a=S.indexOf(e.currentTarget)-1;r=S[a]||S[S.length-1]}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},v)},f.map((function(e){var t=e.value,r=e.label,o=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:P===t?0:-1,"aria-selected":P===t,key:t,ref:function(e){return S.push(e)},onKeyDown:x,onFocus:E,onClick:E},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":P===t})}),null!=r?r:t)}))),c?(0,a.cloneElement)(h.filter((function(e){return e.props.value===P}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==P})}))))}function u(e){var t=(0,o.Z)();return a.createElement(c,(0,n.Z)({key:String(t)},e))}},2129:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return p},toc:function(){return m},default:function(){return v}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),l=r(9877),i=r(8215),s=["components"],c={sidebar_position:11,tags:["Hash Table","Tree","Depth-First Search","Binary Tree"]},u="Path to Given Node",p={unversionedId:"Problems/StriverSDESheet/Day17/Path to Given Node",id:"Problems/StriverSDESheet/Day17/Path to Given Node",title:"Path to Given Node",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day17/Path to Given Node.md",sourceDirName:"Problems/StriverSDESheet/Day17",slug:"/Problems/StriverSDESheet/Day17/Path to Given Node",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day17/Path to Given Node",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day17/Path to Given Node.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Depth-First Search",permalink:"/CodePrime/docs/tags/depth-first-search"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"}],version:"current",sidebarPosition:11,frontMatter:{sidebar_position:11,tags:["Hash Table","Tree","Depth-First Search","Binary Tree"]},sidebar:"api",previous:{title:"Vertical Order Traversal of a Binary Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day17/Vertical Order Traversal of a Binary Tree"},next:{title:"Maximum Width of Binary Tree",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day17/Maximum Width of Binary Tree"}},m=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function v(e){var t=e.components,r=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"path-to-given-node"},"Path to Given Node"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.interviewbit.com/problems/path-to-given-node/"},"https://www.interviewbit.com/problems/path-to-given-node/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"vector<int> ans;\nint check = 0;\nvoid traversal(TreeNode* root, int B) {\n    if (!root) return;\n    if (root->val == B) {\n        check = 1;\n        ans.push_back(root->val);\n        return;\n    }\n    traversal(root->left, B);\n    if (check == 1) {\n        ans.push_back(root->val);\n        return;\n    }\n    traversal(root->right, B);\n    if (check == 1) ans.push_back(root->val);\n}\n\nvector<int> Solution::solve(TreeNode* A, int B) {\n    ans.clear();\n    check = 0;\n    traversal(A, B);\n    reverse(ans.begin(), ans.end());\n    return ans;\n}\n"))))))}v.isMDXComponent=!0}}]);