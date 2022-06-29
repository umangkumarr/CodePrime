"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6223],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=u(n),d=a,f=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return n?r.createElement(f,l(l({ref:t},c),{},{components:n})):r.createElement(f,l({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){var r=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(7462),a=n(7294),o=n(2389),l=n(9548),i=n(6010),s="tabItem_LplD";function u(e){var t,n,o,u=e.lazy,c=e.block,m=e.defaultValue,p=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=p?p:v.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,l.lx)(h,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===m?m:null!=(t=null!=m?m:null==(n=v.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=v[0])?void 0:o.props.value;if(null!==b&&!h.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,l.UB)(),g=k.tabGroupChoices,S=k.setTabGroupChoices,N=(0,a.useState)(b),w=N[0],x=N[1],D=[],E=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var T=g[d];null!=T&&T!==w&&h.some((function(e){return e.value===T}))&&x(T)}var O=function(e){var t=e.currentTarget,n=D.indexOf(t),r=h[n].value;r!==w&&(E(t),x(r),null!=d&&S(d,r))},P=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=D.indexOf(e.currentTarget)+1;n=D[r]||D[0];break;case"ArrowLeft":var a=D.indexOf(e.currentTarget)-1;n=D[a]||D[D.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},f)},h.map((function(e){var t=e.value,n=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return D.push(e)},onKeyDown:P,onFocus:O,onClick:O},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(v.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function c(e){var t=(0,o.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},9873:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return m},toc:function(){return p},default:function(){return f}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),l=n(9877),i=n(8215),s=["components"],u={sidebar_position:6,tags:["Array","Dynamic Programming"]},c="Best Time to Buy and Sell Stock",m={unversionedId:"StriverSDESheet/Day1/Best Time to Buy and Sell Stock",id:"StriverSDESheet/Day1/Best Time to Buy and Sell Stock",title:"Best Time to Buy and Sell Stock",description:"Problem",source:"@site/docs/StriverSDESheet/Day1/Best Time to Buy and Sell Stock.md",sourceDirName:"StriverSDESheet/Day1",slug:"/StriverSDESheet/Day1/Best Time to Buy and Sell Stock",permalink:"/CodePrime/docs/StriverSDESheet/Day1/Best Time to Buy and Sell Stock",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day1/Best Time to Buy and Sell Stock.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Array","Dynamic Programming"]},sidebar:"tutorialSidebar",previous:{title:"Sort Colors",permalink:"/CodePrime/docs/StriverSDESheet/Day1/Sort Colors"},next:{title:"Rotate Matrix",permalink:"/CodePrime/docs/StriverSDESheet/Day2/Rotate Matrix"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var t=e.components,n=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"best-time-to-buy-and-sell-stock"},"Best Time to Buy and Sell Stock"),(0,o.kt)("h2",{id:"problem"},(0,o.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},"Problem")),(0,o.kt)("p",null,"You are given an array ",(0,o.kt)("code",null,"prices")," where ",(0,o.kt)("code",null,"prices[i]")," is the price of a given stock on the ",(0,o.kt)("code",null,"ith")," day."),(0,o.kt)("p",null,"You want to maximize your profit by choosing a ",(0,o.kt)("strong",null,"single day")," to buy one stock and choosing a ",(0,o.kt)("strong",null,"different day in the future")," to sell that stock."),(0,o.kt)("p",null,"Return ",(0,o.kt)("em",null,"the maximum profit you can achieve from this transaction"),". If you cannot achieve any profit, return ",(0,o.kt)("code",null,"0"),"."),(0,o.kt)("p",null,"\xa0"),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int maxProfit(vector<int>& prices) {\n        int n = prices.size();\n        vector<int> dp(n);\n        dp[n - 1] = 0;\n        int mx = prices[n - 1];\n        int ans = 0;\n        for (int i = n - 2; i >= 0; i--) {\n            ans = max(ans, mx - prices[i]);\n            mx = max(mx, prices[i]);\n        }\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);