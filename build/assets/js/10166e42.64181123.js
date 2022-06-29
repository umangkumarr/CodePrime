"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6427],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=c(n),d=r,h=m["".concat(s,".").concat(d)]||m[d]||p[d]||l;return n?a.createElement(h,o(o({ref:t},u),{},{components:n})):a.createElement(h,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var c=2;c<l;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(7462),r=n(7294),l=n(2389),o=n(9548),i=n(6010),s="tabItem_LplD";function c(e){var t,n,l,c=e.lazy,u=e.block,p=e.defaultValue,m=e.values,d=e.groupId,h=e.className,k=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=m?m:k.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,o.lx)(f,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var v=null===p?p:null!=(t=null!=p?p:null==(n=k.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(l=k[0])?void 0:l.props.value;if(null!==v&&!f.some((function(e){return e.value===v})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,o.UB)(),g=b.tabGroupChoices,N=b.setTabGroupChoices,w=(0,r.useState)(v),O=w[0],x=w[1],T=[],L=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var C=g[d];null!=C&&C!==O&&f.some((function(e){return e.value===C}))&&x(C)}var E=function(e){var t=e.currentTarget,n=T.indexOf(t),a=f[n].value;a!==O&&(L(t),x(a),null!=d&&N(d,a))},P=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=T.indexOf(e.currentTarget)+1;n=T[a]||T[0];break;case"ArrowLeft":var r=T.indexOf(e.currentTarget)-1;n=T[r]||T[T.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},h)},f.map((function(e){var t=e.value,n=e.label,l=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:function(e){return T.push(e)},onKeyDown:P,onFocus:E,onClick:E},l,{className:(0,i.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":O===t})}),null!=n?n:t)}))),c?(0,r.cloneElement)(k.filter((function(e){return e.props.value===O}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})}))))}function u(e){var t=(0,l.Z)();return r.createElement(c,(0,a.Z)({key:String(t)},e))}},6710:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return p},toc:function(){return m},default:function(){return h}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),o=n(9877),i=n(8215),s=["components"],c={sidebar_position:18,tags:["Hash Table","Linked List","Design","Doubly-Linked List"]},u="LRU Cache",p={unversionedId:"codes/lru-cache",id:"codes/lru-cache",title:"LRU Cache",description:"Problem",source:"@site/docs/codes/lru-cache.md",sourceDirName:"codes",slug:"/codes/lru-cache",permalink:"/CodePrime/docs/codes/lru-cache",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/lru-cache.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Linked List",permalink:"/CodePrime/docs/tags/linked-list"},{label:"Design",permalink:"/CodePrime/docs/tags/design"},{label:"Doubly-Linked List",permalink:"/CodePrime/docs/tags/doubly-linked-list"}],version:"current",sidebarPosition:18,frontMatter:{sidebar_position:18,tags:["Hash Table","Linked List","Design","Doubly-Linked List"]}},m=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function h(e){var t=e.components,n=(0,r.Z)(e,s);return(0,l.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"lru-cache"},"LRU Cache"),(0,l.kt)("h2",{id:"problem"},(0,l.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/lru-cache/"},"Problem")),(0,l.kt)("p",null,"Design a data structure that follows the constraints of a ",(0,l.kt)("strong",null,(0,l.kt)("a",{href:"https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU",target:"_blank"},"Least Recently Used (LRU) cache")),"."),(0,l.kt)("p",null,"Implement the ",(0,l.kt)("code",null,"LRUCache")," class:"),(0,l.kt)("ul",null,(0,l.kt)("li",null,(0,l.kt)("code",null,"LRUCache(int capacity)")," Initialize the LRU cache with ",(0,l.kt)("strong",null,"positive")," size ",(0,l.kt)("code",null,"capacity"),"."),(0,l.kt)("li",null,(0,l.kt)("code",null,"int get(int key)")," Return the value of the ",(0,l.kt)("code",null,"key")," if the key exists, otherwise return ",(0,l.kt)("code",null,"-1"),"."),(0,l.kt)("li",null,(0,l.kt)("code",null,"void put(int key, int value)"),"\xa0Update the value of the ",(0,l.kt)("code",null,"key")," if the ",(0,l.kt)("code",null,"key")," exists. Otherwise, add the ",(0,l.kt)("code",null,"key-value")," pair to the cache. If the number of keys exceeds the ",(0,l.kt)("code",null,"capacity")," from this operation, ",(0,l.kt)("strong",null,"evict")," the least recently used key.")),(0,l.kt)("p",null,"The functions\xa0",(0,l.kt)("code",{"data-stringify-type":"code"},"get"),"\xa0and\xa0",(0,l.kt)("code",{"data-stringify-type":"code"},"put"),"\xa0must each run in ",(0,l.kt)("code",null,"O(1)")," average time complexity."),(0,l.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,l.kt)("p",null,"Expected Time complexity: ",(0,l.kt)("span",{parentName:"p",className:"math math-inline"},(0,l.kt)("span",{parentName:"span",className:"katex"},(0,l.kt)("span",{parentName:"span",className:"katex-mathml"},(0,l.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,l.kt)("semantics",{parentName:"math"},(0,l.kt)("mrow",{parentName:"semantics"},(0,l.kt)("mi",{parentName:"mrow"},"O"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,l.kt)("mi",{parentName:"mrow"},"l"),(0,l.kt)("mi",{parentName:"mrow"},"o"),(0,l.kt)("mi",{parentName:"mrow"},"g"),(0,l.kt)("mi",{parentName:"mrow"},"n"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,l.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(logn)")))),(0,l.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,l.kt)("span",{parentName:"span",className:"base"},(0,l.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,l.kt)("span",{parentName:"span",className:"mopen"},"("),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,l.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Click - to see solution code"),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class LRUCache {\n    list<int> lst;\n    unordered_map<int, int> mp;\n    unordered_map<int, list<int>::iterator> itr;\n    int size;\n\n   public:\n    LRUCache(int capacity) { this->size = capacity; }\n\n    int get(int key) {\n        if (mp.find(key) == mp.end()) return -1;\n        update(key);\n        return mp[key];\n    }\n\n    void put(int key, int value) {\n        if (mp.size() == size && mp.find(key) == mp.end()) evict();\n        update(key);\n        mp[key] = value;\n    }\n\n    void update(int key) {\n        if (mp.find(key) != mp.end()) lst.erase(itr[key]);\n        lst.push_front(key);\n        itr[key] = lst.begin();\n    }\n\n    void evict() {\n        itr.erase(lst.back());\n        mp.erase(lst.back());\n        lst.pop_back();\n    }\n};\n\n"))))))}h.isMDXComponent=!0}}]);