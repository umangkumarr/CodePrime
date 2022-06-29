"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5686],{3905:function(e,t,a){a.d(t,{Zo:function(){return m},kt:function(){return d}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var u=n.createContext({}),s=function(e){var t=n.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},m=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,u=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),p=s(a),d=r,f=p["".concat(u,".").concat(d)]||p[d]||c[d]||l;return a?n.createElement(f,o(o({ref:t},m),{},{components:a})):n.createElement(f,o({ref:t},m))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=p;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var s=2;s<l;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},8215:function(e,t,a){var n=a(7294);t.Z=function(e){var t=e.children,a=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:function(e,t,a){a.d(t,{Z:function(){return m}});var n=a(7462),r=a(7294),l=a(2389),o=a(9548),i=a(6010),u="tabItem_LplD";function s(e){var t,a,l,s=e.lazy,m=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,o.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===c?c:null!=(t=null!=c?c:null==(a=h.find((function(e){return e.props.default})))?void 0:a.props.value)?t:null==(l=h[0])?void 0:l.props.value;if(null!==k&&!v.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,o.UB)(),g=y.tabGroupChoices,S=y.setTabGroupChoices,N=(0,r.useState)(k),w=N[0],D=N[1],E=[],O=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var P=g[d];null!=P&&P!==w&&v.some((function(e){return e.value===P}))&&D(P)}var T=function(e){var t=e.currentTarget,a=E.indexOf(t),n=v[a].value;n!==w&&(O(t),D(n),null!=d&&S(d,n))},x=function(e){var t,a=null;switch(e.key){case"ArrowRight":var n=E.indexOf(e.currentTarget)+1;a=E[n]||E[0];break;case"ArrowLeft":var r=E.indexOf(e.currentTarget)-1;a=E[r]||E[E.length-1]}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":m},f)},v.map((function(e){var t=e.value,a=e.label,l=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return E.push(e)},onKeyDown:x,onFocus:T,onClick:T},l,{className:(0,i.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":w===t})}),null!=a?a:t)}))),s?(0,r.cloneElement)(h.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function m(e){var t=(0,l.Z)();return r.createElement(s,(0,n.Z)({key:String(t)},e))}},1569:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return m},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),o=a(9877),i=a(8215),u=["components"],s={sidebar_position:2,tags:["Two Pointer","Sorting","Heap(Priority-Queue)","Data Stream"]},m="Find Median from Data Stream",c={unversionedId:"StriverSDESheet/Day22/Find Median from Data Stream",id:"StriverSDESheet/Day22/Find Median from Data Stream",title:"Find Median from Data Stream",description:"Problem",source:"@site/docs/StriverSDESheet/Day22/Find Median from Data Stream.md",sourceDirName:"StriverSDESheet/Day22",slug:"/StriverSDESheet/Day22/Find Median from Data Stream",permalink:"/CodePrime/docs/StriverSDESheet/Day22/Find Median from Data Stream",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day22/Find Median from Data Stream.md",tags:[{label:"Two Pointer",permalink:"/CodePrime/docs/tags/two-pointer"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"},{label:"Heap(Priority-Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"},{label:"Data Stream",permalink:"/CodePrime/docs/tags/data-stream"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Two Pointer","Sorting","Heap(Priority-Queue)","Data Stream"]},sidebar:"tutorialSidebar",previous:{title:"Flatten Binary Tree to Linked List",permalink:"/CodePrime/docs/StriverSDESheet/Day22/Flatten Binary Tree to Linked List"},next:{title:"Kth Largest Element in a Stream",permalink:"/CodePrime/docs/StriverSDESheet/Day22/Kth Largest Element in a Stream"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var t=e.components,a=(0,r.Z)(e,u);return(0,l.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"find-median-from-data-stream"},"Find Median from Data Stream"),(0,l.kt)("h2",{id:"problem"},(0,l.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/find-median-from-data-stream/"},"Problem")),(0,l.kt)("p",null,"The ",(0,l.kt)("strong",null,"median")," is the middle value in an ordered integer list. If the size of the list is even, there is no middle value and the median is the mean of the two middle values."),(0,l.kt)("ul",null,(0,l.kt)("li",null,"For example, for ",(0,l.kt)("code",null,"arr = [2,3,4]"),", the median is ",(0,l.kt)("code",null,"3"),"."),(0,l.kt)("li",null,"For example, for ",(0,l.kt)("code",null,"arr = [2,3]"),", the median is ",(0,l.kt)("code",null,"(2 + 3) / 2 = 2.5"),".")),(0,l.kt)("p",null,"Implement the MedianFinder class:"),(0,l.kt)("ul",null,(0,l.kt)("li",null,(0,l.kt)("code",null,"MedianFinder()")," initializes the ",(0,l.kt)("code",null,"MedianFinder")," object."),(0,l.kt)("li",null,(0,l.kt)("code",null,"void addNum(int num)")," adds the integer ",(0,l.kt)("code",null,"num")," from the data stream to the data structure."),(0,l.kt)("li",null,(0,l.kt)("code",null,"double findMedian()")," returns the median of all elements so far. Answers within ",(0,l.kt)("code",null,"10",(0,l.kt)("sup",null,"-5"))," of the actual answer will be accepted.")),(0,l.kt)("p",null,"\xa0"),(0,l.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,l.kt)("p",null,"Expected Time complexity: ",(0,l.kt)("span",{parentName:"p",className:"math math-inline"},(0,l.kt)("span",{parentName:"span",className:"katex"},(0,l.kt)("span",{parentName:"span",className:"katex-mathml"},(0,l.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,l.kt)("semantics",{parentName:"math"},(0,l.kt)("mrow",{parentName:"semantics"},(0,l.kt)("mi",{parentName:"mrow"},"O"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,l.kt)("mi",{parentName:"mrow"},"n"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,l.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,l.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,l.kt)("span",{parentName:"span",className:"base"},(0,l.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,l.kt)("span",{parentName:"span",className:"mopen"},"("),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,l.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Click - to see solution code"),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class MedianFinder {\n    priority_queue<long> small, large;\n\n   public:\n    void addNum(int num) {\n        small.push(num);\n        large.push(-small.top());\n        small.pop();\n        if (small.size() < large.size()) {\n            small.push(-large.top());\n            large.pop();\n        }\n    }\n\n    double findMedian() {\n        return small.size() > large.size() ? small.top() : (small.top() - large.top()) / 2.0;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);