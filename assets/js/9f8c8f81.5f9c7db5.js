"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6303],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),p=u(n),d=a,h=p["".concat(s,".").concat(d)]||p[d]||c[d]||l;return n?r.createElement(h,i(i({ref:t},m),{},{components:n})):r.createElement(h,i({ref:t},m))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,i=new Array(l);i[0]=p;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var u=2;u<l;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){var r=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(7462),a=n(7294),l=n(2389),i=n(9548),o=n(6010),s="tabItem_LplD";function u(e){var t,n,l,u=e.lazy,m=e.block,c=e.defaultValue,p=e.values,d=e.groupId,h=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),k=(0,i.lx)(v,(function(e,t){return e.value===t.value}));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===c?c:null!=(t=null!=c?c:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==b&&!v.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,i.UB)(),y=g.tabGroupChoices,S=g.setTabGroupChoices,N=(0,a.useState)(b),E=N[0],D=N[1],w=[],O=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var T=y[d];null!=T&&T!==E&&v.some((function(e){return e.value===T}))&&D(T)}var P=function(e){var t=e.currentTarget,n=w.indexOf(t),r=v[n].value;r!==E&&(O(t),D(r),null!=d&&S(d,r))},x=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=w.indexOf(e.currentTarget)+1;n=w[r]||w[0];break;case"ArrowLeft":var a=w.indexOf(e.currentTarget)-1;n=w[a]||w[w.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":m},h)},v.map((function(e){var t=e.value,n=e.label,l=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:E===t?0:-1,"aria-selected":E===t,key:t,ref:function(e){return w.push(e)},onKeyDown:x,onFocus:P,onClick:P},l,{className:(0,o.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":E===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(f.filter((function(e){return e.props.value===E}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==E})}))))}function m(e){var t=(0,l.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},8481:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return m},metadata:function(){return c},toc:function(){return p},default:function(){return h}});var r=n(7462),a=n(3366),l=(n(7294),n(3905)),i=n(9877),o=n(8215),s=["components"],u={sidebar_position:3,tags:["Tree","Binary Search Tree","Heap(Priority-Queue)","Data Stream"]},m="Kth Largest Element in a Stream",c={unversionedId:"StriverSDESheet/Day22/Kth Largest Element in a Stream",id:"StriverSDESheet/Day22/Kth Largest Element in a Stream",title:"Kth Largest Element in a Stream",description:"Problem",source:"@site/docs/StriverSDESheet/Day22/Kth Largest Element in a Stream.md",sourceDirName:"StriverSDESheet/Day22",slug:"/StriverSDESheet/Day22/Kth Largest Element in a Stream",permalink:"/CodePrime/docs/StriverSDESheet/Day22/Kth Largest Element in a Stream",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day22/Kth Largest Element in a Stream.md",tags:[{label:"Tree",permalink:"/CodePrime/docs/tags/tree"},{label:"Binary Search Tree",permalink:"/CodePrime/docs/tags/binary-search-tree"},{label:"Heap(Priority-Queue)",permalink:"/CodePrime/docs/tags/heap-priority-queue"},{label:"Data Stream",permalink:"/CodePrime/docs/tags/data-stream"}],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,tags:["Tree","Binary Search Tree","Heap(Priority-Queue)","Data Stream"]},sidebar:"tutorialSidebar",previous:{title:"Find Median from Data Stream",permalink:"/CodePrime/docs/StriverSDESheet/Day22/Find Median from Data Stream"},next:{title:"Distinct Numbers in Window",permalink:"/CodePrime/docs/StriverSDESheet/Day22/Distinct Numbers in Window"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function h(e){var t=e.components,n=(0,a.Z)(e,s);return(0,l.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"kth-largest-element-in-a-stream"},"Kth Largest Element in a Stream"),(0,l.kt)("h2",{id:"problem"},(0,l.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/kth-largest-element-in-a-stream/"},"Problem")),(0,l.kt)("p",null,"Design a class to find the ",(0,l.kt)("code",null,"kth")," largest element in a stream. Note that it is the ",(0,l.kt)("code",null,"kth")," largest element in the sorted order, not the ",(0,l.kt)("code",null,"kth")," distinct element."),(0,l.kt)("p",null,"Implement ",(0,l.kt)("code",null,"KthLargest")," class:"),(0,l.kt)("ul",null,(0,l.kt)("li",null,(0,l.kt)("code",null,"KthLargest(int k, int[] nums)")," Initializes the object with the integer ",(0,l.kt)("code",null,"k")," and the stream of integers ",(0,l.kt)("code",null,"nums"),"."),(0,l.kt)("li",null,(0,l.kt)("code",null,"int add(int val)")," Appends the integer ",(0,l.kt)("code",null,"val")," to the stream and returns the element representing the ",(0,l.kt)("code",null,"kth")," largest element in the stream.")),(0,l.kt)("p",null,"\xa0"),(0,l.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,l.kt)("p",null,"Expected Time complexity: ",(0,l.kt)("span",{parentName:"p",className:"math math-inline"},(0,l.kt)("span",{parentName:"span",className:"katex"},(0,l.kt)("span",{parentName:"span",className:"katex-mathml"},(0,l.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,l.kt)("semantics",{parentName:"math"},(0,l.kt)("mrow",{parentName:"semantics"},(0,l.kt)("mi",{parentName:"mrow"},"O"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,l.kt)("mi",{parentName:"mrow"},"n"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,l.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,l.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,l.kt)("span",{parentName:"span",className:"base"},(0,l.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,l.kt)("span",{parentName:"span",className:"mopen"},"("),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,l.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Click - to see solution code"),(0,l.kt)(i.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class KthLargest {\n    vector<int> num;\n    int k;\n    int n;\n\n   public:\n    KthLargest(int kk, vector<int>& nums) {\n        this->num = nums;\n        this->k = kk;\n        this->n = nums.size();\n    }\n\n    int add(int val) {\n        num.push_back(val);\n        n++;\n        nth_element(num.begin(), num.begin() + n - k, num.end());\n        return num[n - k];\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);