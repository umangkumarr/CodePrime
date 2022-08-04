"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3758],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),m=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},c=function(e){var t=m(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=m(a),d=r,h=p["".concat(i,".").concat(d)]||p[d]||u[d]||l;return a?n.createElement(h,s(s({ref:t},c),{},{components:a})):n.createElement(h,s({ref:t},c))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,s=new Array(l);s[0]=p;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,s[1]=o;for(var m=2;m<l;m++)s[m]=a[m];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7294),r=a(4334);const l="tabItem_Ymn6";function s(e){let{children:t,hidden:a,className:s}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,s),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(3117),r=a(7294),l=a(4334),s=a(2389),o=a(7392),i=a(7094),m=a(2466);const c="tabList__CuJ",u="tabItem_LNqP";function p(e){var t,a;const{lazy:s,block:p,defaultValue:d,values:h,groupId:k,className:b}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=h?h:f.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),v=(0,o.l)(g,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(a=f.find((e=>e.props.default)))?void 0:a.props.value)?t:f[0].props.value;if(null!==y&&!g.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,i.U)(),[T,O]=(0,r.useState)(y),P=[],{blockElementScrollPositionUntilNextRender:E}=(0,m.o5)();if(null!=k){const e=N[k];null!=e&&e!==T&&g.some((t=>t.value===e))&&O(e)}const x=e=>{const t=e.currentTarget,a=P.indexOf(t),n=g[a].value;n!==T&&(E(t),O(n),null!=k&&w(k,String(n)))},C=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=P.indexOf(e.currentTarget)+1;a=null!=(n=P[t])?n:P[0];break}case"ArrowLeft":{var r;const t=P.indexOf(e.currentTarget)-1;a=null!=(r=P[t])?r:P[P.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},b)},g.map((e=>{let{value:t,label:a,attributes:s}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,key:t,ref:e=>P.push(e),onKeyDown:C,onFocus:x,onClick:x},s,{className:(0,l.Z)("tabs__item",u,null==s?void 0:s.className,{"tabs__item--active":T===t})}),null!=a?a:t)}))),s?(0,r.cloneElement)(f.filter((e=>e.props.value===T))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==T})))))}function d(e){const t=(0,s.Z)();return r.createElement(p,(0,n.Z)({key:String(t)},e))}},7361:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>m,toc:()=>u});var n=a(3117),r=(a(7294),a(3905)),l=a(5488),s=a(5162);const o={sidebar_position:145,tags:["Tree","Design","Binary Search Tree","Heap (Priority Queue)","Binary Tree","Data Stream"]},i="Kth Largest Element in a Stream",m={unversionedId:"codes/kth-largest-element-in-a-stream",id:"codes/kth-largest-element-in-a-stream",title:"Kth Largest Element in a Stream",description:"Problem",source:"@site/docs/codes/kth-largest-element-in-a-stream.md",sourceDirName:"codes",slug:"/codes/kth-largest-element-in-a-stream",permalink:"/CodePrime/docs/codes/kth-largest-element-in-a-stream",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/kth-largest-element-in-a-stream.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Design",permalink:"/CodePrime/docs/tags/design"},{label:"Binary Search Tree",permalink:"/CodePrime/docs/tags/binary-search-tree"},{label:"Heap (Priority Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"},{label:"Binary Tree",permalink:"/CodePrime/docs/tags/binary-tree"},{label:"Data Stream",permalink:"/CodePrime/docs/tags/data-stream"}],version:"current",sidebarPosition:145,frontMatter:{sidebar_position:145,tags:["Tree","Design","Binary Search Tree","Heap (Priority Queue)","Binary Tree","Data Stream"]},sidebar:"Leetcode",previous:{title:"Flatten Binary Tree to Linked List",permalink:"/CodePrime/docs/codes/flatten-binary-tree-to-linked-list"},next:{title:"Find Median from Data Stream",permalink:"/CodePrime/docs/codes/find-median-from-data-stream"}},c={},u=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],p={toc:u};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"kth-largest-element-in-a-stream"},"Kth Largest Element in a Stream"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/kth-largest-element-in-a-stream/"},"Problem")),(0,r.kt)("p",null,"Design a class to find the ",(0,r.kt)("code",null,"kth")," largest element in a stream. Note that it is the ",(0,r.kt)("code",null,"kth")," largest element in the sorted order, not the ",(0,r.kt)("code",null,"kth")," distinct element."),(0,r.kt)("p",null,"Implement ",(0,r.kt)("code",null,"KthLargest")," class:"),(0,r.kt)("ul",null,(0,r.kt)("li",null,(0,r.kt)("code",null,"KthLargest(int k, int[] nums)")," Initializes the object with the integer ",(0,r.kt)("code",null,"k")," and the stream of integers ",(0,r.kt)("code",null,"nums"),"."),(0,r.kt)("li",null,(0,r.kt)("code",null,"int add(int val)")," Appends the integer ",(0,r.kt)("code",null,"val")," to the stream and returns the element representing the ",(0,r.kt)("code",null,"kth")," largest element in the stream.")),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class KthLargest {\n    vector<int> num;\n    int k;\n    int n;\n\n   public:\n    KthLargest(int kk, vector<int>& nums) {\n        this->num = nums;\n        this->k = kk;\n        this->n = nums.size();\n    }\n\n    int add(int val) {\n        num.push_back(val);\n        n++;\n        nth_element(num.begin(), num.begin() + n - k, num.end());\n        return num[n - k];\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);