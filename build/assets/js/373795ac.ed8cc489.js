"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5996],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=u(n),d=a,f=m["".concat(l,".").concat(d)]||m[d]||c[d]||o;return n?r.createElement(f,s(s({ref:t},p),{},{components:n})):r.createElement(f,s({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var u=2;u<o;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8215:function(e,t,n){var r=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return p}});var r=n(7462),a=n(7294),o=n(2389),s=n(9548),i=n(6010),l="tabItem_LplD";function u(e){var t,n,o,u=e.lazy,p=e.block,c=e.defaultValue,m=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=m?m:v.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,s.lx)(h,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===c?c:null!=(t=null!=c?c:null==(n=v.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=v[0])?void 0:o.props.value;if(null!==k&&!h.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,s.UB)(),y=g.tabGroupChoices,N=g.setTabGroupChoices,w=(0,a.useState)(k),T=w[0],O=w[1],q=[],x=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=y[d];null!=E&&E!==T&&h.some((function(e){return e.value===E}))&&O(E)}var C=function(e){var t=e.currentTarget,n=q.indexOf(t),r=h[n].value;r!==T&&(x(t),O(r),null!=d&&N(d,r))},j=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=q.indexOf(e.currentTarget)+1;n=q[r]||q[0];break;case"ArrowLeft":var a=q.indexOf(e.currentTarget)-1;n=q[a]||q[q.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":p},f)},h.map((function(e){var t=e.value,n=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,key:t,ref:function(e){return q.push(e)},onKeyDown:j,onFocus:C,onClick:C},o,{className:(0,i.Z)("tabs__item",l,null==o?void 0:o.className,{"tabs__item--active":T===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(v.filter((function(e){return e.props.value===T}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==T})}))))}function p(e){var t=(0,o.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},5195:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return m},default:function(){return f}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),s=n(9877),i=n(8215),l=["components"],u={},p="Top K Frequent Words",c={unversionedId:"codes/Amazon/TopKFrequentWords",id:"codes/Amazon/TopKFrequentWords",title:"Top K Frequent Words",description:"Tags",source:"@site/docs/codes/Amazon/TopKFrequentWords.md",sourceDirName:"codes/Amazon",slug:"/codes/Amazon/TopKFrequentWords",permalink:"/CodePrime/docs/codes/Amazon/TopKFrequentWords",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/Amazon/TopKFrequentWords.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Merge k Sorted Lists",permalink:"/CodePrime/docs/codes/Amazon/MergeksortedList"},next:{title:"Trapping Rain Water",permalink:"/CodePrime/docs/codes/Amazon/TrappingRainWater"}},m=[{value:"Tags",id:"tags",children:[],level:4},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function f(e){var t=e.components,n=(0,a.Z)(e,l);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"top-k-frequent-words"},"Top K Frequent Words"),(0,o.kt)("h4",{id:"tags"},"Tags"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"Hash Table"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"Sorting"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"Heap(Priority Queue)"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"Counting")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(s.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<string> topKFrequent(vector<string>& words, int k) {\n        unordered_map<string, int> freq;\n        for (auto w : words) {\n            freq[w]++;\n        }\n\n        auto comp = [&](const pair<string, int>& a,\n                        const pair<string, int>& b) {\n            return a.second > b.second ||\n                   (a.second == b.second && a.first < b.first);\n        };\n        typedef priority_queue<pair<string, int>, vector<pair<string, int>>,\n                               decltype(comp)>\n            my_priority_queue_t;\n        my_priority_queue_t pq(comp);\n\n        for (auto w : freq) {\n            pq.emplace(w.first, w.second);\n            if (pq.size() > k) pq.pop();\n        }\n\n        vector<string> output;\n        while (!pq.empty()) {\n            output.insert(output.begin(), pq.top().first);\n            pq.pop();\n        }\n        return output;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);