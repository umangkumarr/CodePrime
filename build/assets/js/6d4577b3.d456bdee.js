"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7685],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),m=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=m(e.components);return n.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=m(a),d=r,h=c["".concat(i,".").concat(d)]||c[d]||p[d]||l;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=c;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var m=2;m<l;m++)o[m]=a[m];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);const r=function(e){let{children:t,hidden:a,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>u});var n=a(7462),r=a(7294),l=a(2389),o=a(5773),s=a(6010);const i="tabItem_LplD";function m(e){var t,a,l;const{lazy:m,block:u,defaultValue:p,values:c,groupId:d,className:h}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=c?c:f.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),k=(0,o.lx)(b,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===p?p:null!=(t=null!=p?p:null==(a=f.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==g&&!b.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:y}=(0,o.UB)(),[N,w]=(0,r.useState)(g),O=[],{blockElementScrollPositionUntilNextRender:P}=(0,o.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&b.some((t=>t.value===e))&&w(e)}const T=e=>{const t=e.currentTarget,a=O.indexOf(t),n=b[a].value;n!==N&&(P(t),w(n),null!=d&&y(d,n))},x=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;a=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;a=O[t]||O[O.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},h)},b.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>O.push(e),onKeyDown:x,onFocus:T,onClick:T},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),m?(0,r.cloneElement)(f.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,l.Z)();return r.createElement(m,(0,n.Z)({key:String(t)},e))}},6513:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>m,toc:()=>u,default:()=>c});var n=a(7462),r=(a(7294),a(3905)),l=a(9877),o=a(8215);const s={sidebar_position:23,tags:["Two Pointers","Design","Sorting","Heap (Priority Queue)","Data Stream"]},i="Find Median from Data Stream",m={unversionedId:"codes/find-median-from-data-stream",id:"codes/find-median-from-data-stream",title:"Find Median from Data Stream",description:"Problem",source:"@site/docs/codes/find-median-from-data-stream.md",sourceDirName:"codes",slug:"/codes/find-median-from-data-stream",permalink:"/CodePrime/docs/codes/find-median-from-data-stream",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/find-median-from-data-stream.md",tags:[{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"},{label:"Design",permalink:"/CodePrime/docs/tags/design"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"},{label:"Heap (Priority Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"},{label:"Data Stream",permalink:"/CodePrime/docs/tags/data-stream"}],version:"current",sidebarPosition:23,frontMatter:{sidebar_position:23,tags:["Two Pointers","Design","Sorting","Heap (Priority Queue)","Data Stream"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:u};function c(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"find-median-from-data-stream"},"Find Median from Data Stream"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/find-median-from-data-stream/"},"Problem")),(0,r.kt)("p",null,"The ",(0,r.kt)("strong",null,"median")," is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values."),(0,r.kt)("ul",null,(0,r.kt)("li",null,"For example, for ",(0,r.kt)("code",null,"arr = [2,3,4]"),", the median is ",(0,r.kt)("code",null,"3"),"."),(0,r.kt)("li",null,"For example, for ",(0,r.kt)("code",null,"arr = [2,3]"),", the median is ",(0,r.kt)("code",null,"(2 + 3) / 2 = 2.5"),".")),(0,r.kt)("p",null,"Implement the MedianFinder class:"),(0,r.kt)("ul",null,(0,r.kt)("li",null,(0,r.kt)("code",null,"MedianFinder()")," initializes the ",(0,r.kt)("code",null,"MedianFinder")," object."),(0,r.kt)("li",null,(0,r.kt)("code",null,"void addNum(int num)")," adds the integer ",(0,r.kt)("code",null,"num")," from the data stream to the data structure."),(0,r.kt)("li",null,(0,r.kt)("code",null,"double findMedian()")," returns the median of all elements so far. Answers within ",(0,r.kt)("code",null,"10-5")," of the actual answer will be accepted.")),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Maintain two priority queues small and high. If the new element is greater than small.top push it in high queue then equalise the size of both the queue. The median element will be the average of top elements of the queues."),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class MedianFinder {\n    priority_queue<long> small, large;\n\n   public:\n    void addNum(int num) {\n        small.push(num);\n        large.push(-small.top());\n        small.pop();\n        if (small.size() < large.size()) {\n            small.push(-large.top());\n            large.pop();\n        }\n    }\n\n    double findMedian() {\n        return small.size() > large.size() ? small.top() : (small.top() - large.top()) / 2.0;\n    }\n};\n"))))))}c.isMDXComponent=!0}}]);