"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4089],{3905:function(e,a,t){t.d(a,{Zo:function(){return u},kt:function(){return d}});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function o(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?o(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function i(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=n.createContext({}),c=function(e){var a=n.useContext(s),t=a;return e&&(t="function"==typeof e?e(a):l(l({},a),e)),t},u=function(e){var a=c(e.components);return n.createElement(s.Provider,{value:a},e.children)},m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},p=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(t),d=r,f=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return t?n.createElement(f,l(l({ref:a},u),{},{components:t})):n.createElement(f,l({ref:a},u))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=t.length,l=new Array(o);l[0]=p;var i={};for(var s in a)hasOwnProperty.call(a,s)&&(i[s]=a[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var c=2;c<o;c++)l[c]=t[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,a,t){var n=t(7294);a.Z=function(e){var a=e.children,t=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:function(e,a,t){t.d(a,{Z:function(){return u}});var n=t(7462),r=t(7294),o=t(2389),l=t(9548),i=t(6010),s="tabItem_LplD";function c(e){var a,t,o,c=e.lazy,u=e.block,m=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=p?p:h.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),v=(0,l.lx)(b,(function(e,a){return e.value===a.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===m?m:null!=(a=null!=m?m:null==(t=h.find((function(e){return e.props.default})))?void 0:t.props.value)?a:null==(o=h[0])?void 0:o.props.value;if(null!==k&&!b.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,l.UB)(),y=g.tabGroupChoices,N=g.setTabGroupChoices,w=(0,r.useState)(k),S=w[0],P=w[1],D=[],E=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var O=y[d];null!=O&&O!==S&&b.some((function(e){return e.value===O}))&&P(O)}var x=function(e){var a=e.currentTarget,t=D.indexOf(a),n=b[t].value;n!==S&&(E(a),P(n),null!=d&&N(d,n))},T=function(e){var a,t=null;switch(e.key){case"ArrowRight":var n=D.indexOf(e.currentTarget)+1;t=D[n]||D[0];break;case"ArrowLeft":var r=D.indexOf(e.currentTarget)-1;t=D[r]||D[D.length-1]}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},f)},b.map((function(e){var a=e.value,t=e.label,o=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:S===a?0:-1,"aria-selected":S===a,key:a,ref:function(e){return D.push(e)},onKeyDown:T,onFocus:x,onClick:x},o,{className:(0,i.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":S===a})}),null!=t?t:a)}))),c?(0,r.cloneElement)(h.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==S})}))))}function u(e){var a=(0,o.Z)();return r.createElement(c,(0,n.Z)({key:String(a)},e))}},8154:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return m},toc:function(){return p},default:function(){return f}});var n=t(7462),r=t(3366),o=(t(7294),t(3905)),l=t(9877),i=t(8215),s=["components"],c={sidebar_position:4,tags:["Dynamic Programming","Sorting"]},u="Fractional Knapsack",m={unversionedId:"Problems/StriverSDESheet/Day8/Fractional Knapsack",id:"Problems/StriverSDESheet/Day8/Fractional Knapsack",title:"Fractional Knapsack",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day8/Fractional Knapsack.md",sourceDirName:"Problems/StriverSDESheet/Day8",slug:"/Problems/StriverSDESheet/Day8/Fractional Knapsack",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day8/Fractional Knapsack",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day8/Fractional Knapsack.md",tags:[{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"}],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4,tags:["Dynamic Programming","Sorting"]},sidebar:"api",previous:{title:"Job Sequencing Problem",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day8/Job Sequencing Problem"},next:{title:"Number of Coins",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day8/Number of Coins"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var a=e.components,t=(0,r.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,t,{components:a,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"fractional-knapsack"},"Fractional Knapsack"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1"},"https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"An efficient solution is to use the Greedy approach. The basic idea of the greedy approach is to calculate the ratio value/weight for each item and sort the item on basis of this ratio. Then take the item with the highest ratio and add them until we can\u2019t add the next item as a whole and at the end add the next item as much as we can."),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(l.Z,{mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    double fractionalKnapsack(int W, Item arr[], int n) {\n        sort(arr, arr + n, [&](auto &a, auto &b) {\n            return (double(a.value) / double(a.weight)) >\n                   (double(b.value) / double(b.weight));\n        });\n        double ans = 0;\n        for (int i = 0; i < n; i++) {\n            if (W >= arr[i].weight) {\n                W -= arr[i].weight;\n                ans += arr[i].value;\n            } else {\n                double per_gm = double(arr[i].value) / double(arr[i].weight);\n                double money = per_gm * double(W);\n                ans += money;\n                break;\n            }\n        }\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);