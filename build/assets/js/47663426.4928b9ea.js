"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[683],{3905:function(e,a,n){n.d(a,{Zo:function(){return p},kt:function(){return d}});var t=n(7294);function r(e,a,n){return a in e?Object.defineProperty(e,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[a]=n,e}function o(e,a){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);a&&(t=t.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),n.push.apply(n,t)}return n}function i(e){for(var a=1;a<arguments.length;a++){var n=null!=arguments[a]?arguments[a]:{};a%2?o(Object(n),!0).forEach((function(a){r(e,a,n[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(n,a))}))}return e}function m(e,a){if(null==e)return{};var n,t,r=function(e,a){if(null==e)return{};var n,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||(r[n]=e[n]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=t.createContext({}),s=function(e){var a=t.useContext(l),n=a;return e&&(n="function"==typeof e?e(a):i(i({},a),e)),n},p=function(e){var a=s(e.components);return t.createElement(l.Provider,{value:a},e.children)},u={inlineCode:"code",wrapper:function(e){var a=e.children;return t.createElement(t.Fragment,{},a)}},c=t.forwardRef((function(e,a){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=m(e,["components","mdxType","originalType","parentName"]),c=s(n),d=r,h=c["".concat(l,".").concat(d)]||c[d]||u[d]||o;return n?t.createElement(h,i(i({ref:a},p),{},{components:n})):t.createElement(h,i({ref:a},p))}));function d(e,a){var n=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=c;var m={};for(var l in a)hasOwnProperty.call(a,l)&&(m[l]=a[l]);m.originalType=e,m.mdxType="string"==typeof e?e:r,i[1]=m;for(var s=2;s<o;s++)i[s]=n[s];return t.createElement.apply(null,i)}return t.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8215:function(e,a,n){var t=n(7294);a.Z=function(e){var a=e.children,n=e.hidden,r=e.className;return t.createElement("div",{role:"tabpanel",hidden:n,className:r},a)}},9877:function(e,a,n){n.d(a,{Z:function(){return p}});var t=n(7462),r=n(7294),o=n(2389),i=n(9548),m=n(6010),l="tabItem_LplD";function s(e){var a,n,o,s=e.lazy,p=e.block,u=e.defaultValue,c=e.values,d=e.groupId,h=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=c?c:f.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),N=(0,i.lx)(k,(function(e,a){return e.value===a.value}));if(N.length>0)throw new Error('Docusaurus error: Duplicate values "'+N.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===u?u:null!=(a=null!=u?u:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?a:null==(o=f[0])?void 0:o.props.value;if(null!==g&&!k.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+k.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var v=(0,i.UB)(),b=v.tabGroupChoices,w=v.setTabGroupChoices,y=(0,r.useState)(g),x=y[0],O=y[1],T=[],P=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=b[d];null!=E&&E!==x&&k.some((function(e){return e.value===E}))&&O(E)}var S=function(e){var a=e.currentTarget,n=T.indexOf(a),t=k[n].value;t!==x&&(P(a),O(t),null!=d&&w(d,t))},C=function(e){var a,n=null;switch(e.key){case"ArrowRight":var t=T.indexOf(e.currentTarget)+1;n=T[t]||T[0];break;case"ArrowLeft":var r=T.indexOf(e.currentTarget)-1;n=T[r]||T[T.length-1]}null==(a=n)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,m.Z)("tabs",{"tabs--block":p},h)},k.map((function(e){var a=e.value,n=e.label,o=e.attributes;return r.createElement("li",(0,t.Z)({role:"tab",tabIndex:x===a?0:-1,"aria-selected":x===a,key:a,ref:function(e){return T.push(e)},onKeyDown:C,onFocus:S,onClick:S},o,{className:(0,m.Z)("tabs__item",l,null==o?void 0:o.className,{"tabs__item--active":x===a})}),null!=n?n:a)}))),s?(0,r.cloneElement)(f.filter((function(e){return e.props.value===x}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==x})}))))}function p(e){var a=(0,o.Z)();return r.createElement(s,(0,t.Z)({key:String(a)},e))}},5462:function(e,a,n){n.r(a),n.d(a,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return u},toc:function(){return c},default:function(){return h}});var t=n(7462),r=n(3366),o=(n(7294),n(3905)),i=n(9877),m=n(8215),l=["components"],s={tags:["Array","Heap","Sliding Window","Queue","Amazon"]},p="Sliding Window Maximum",u={unversionedId:"codes/SlidingWindowMaximum",id:"codes/SlidingWindowMaximum",title:"Sliding Window Maximum",description:"Problem Link",source:"@site/docs/codes/SlidingWindowMaximum.md",sourceDirName:"codes",slug:"/codes/SlidingWindowMaximum",permalink:"/CodePrime/docs/codes/SlidingWindowMaximum",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/SlidingWindowMaximum.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Heap",permalink:"/CodePrime/docs/tags/heap"},{label:"Sliding Window",permalink:"/CodePrime/docs/tags/sliding-window"},{label:"Queue",permalink:"/CodePrime/docs/tags/queue"},{label:"Amazon",permalink:"/CodePrime/docs/tags/amazon"}],version:"current",frontMatter:{tags:["Array","Heap","Sliding Window","Queue","Amazon"]},sidebar:"tutorialSidebar",previous:{title:"Pow(x, n)",permalink:"/CodePrime/docs/codes/Powxn"},next:{title:"Top K Frequent Words",permalink:"/CodePrime/docs/codes/TopKFrequentWords"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:c};function h(e){var a=e.components,n=(0,r.Z)(e,l);return(0,o.kt)("wrapper",(0,t.Z)({},d,n,{components:a,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"sliding-window-maximum"},"Sliding Window Maximum"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/sliding-window-maximum"},"https://leetcode.com/problems/sliding-window-maximum")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Store all the elements of the window in an ordered map. Then using the iterator, find the last element present in the map ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(logn)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")"))))),"."),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(m.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        map<int, int> mp;\n        for (int i = 0; i < k; i++) mp[nums[i]]++;\n        int n = nums.size();\n        vector<int> ans;\n        auto itr = mp.end();\n        itr--;\n        ans.push_back((*itr).first);\n        for (int i = k; i < n; i++) {\n            mp[nums[i]]++;\n            mp[nums[i - k]]--;\n            if (mp[nums[i - k]] == 0) {\n                mp.erase(nums[i - k]);\n            }\n            itr = mp.end();\n            itr--;\n            ans.push_back((*itr).first);\n        }\n\n        return ans;\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);