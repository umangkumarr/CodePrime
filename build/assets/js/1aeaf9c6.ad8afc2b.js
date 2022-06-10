"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[8949],{3905:function(e,r,t){t.d(r,{Zo:function(){return s},kt:function(){return d}});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var u=n.createContext({}),c=function(e){var r=n.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},s=function(e){var r=c(e.components);return n.createElement(u.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=c(t),d=o,f=m["".concat(u,".").concat(d)]||m[d]||p[d]||a;return t?n.createElement(f,i(i({ref:r},s),{},{components:t})):n.createElement(f,i({ref:r},s))}));function d(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=m;var l={};for(var u in r)hasOwnProperty.call(r,u)&&(l[u]=r[u]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:function(e,r,t){var n=t(7294);r.Z=function(e){var r=e.children,t=e.hidden,o=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:o},r)}},9877:function(e,r,t){t.d(r,{Z:function(){return s}});var n=t(7462),o=t(7294),a=t(2389),i=t(9548),l=t(6010),u="tabItem_LplD";function c(e){var r,t,a,c=e.lazy,s=e.block,p=e.defaultValue,m=e.values,d=e.groupId,f=e.className,v=o.Children.map(e.children,(function(e){if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=m?m:v.map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes}})),y=(0,i.lx)(b,(function(e,r){return e.value===r.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var h=null===p?p:null!=(r=null!=p?p:null==(t=v.find((function(e){return e.props.default})))?void 0:t.props.value)?r:null==(a=v[0])?void 0:a.props.value;if(null!==h&&!b.some((function(e){return e.value===h})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var S=(0,i.UB)(),D=S.tabGroupChoices,g=S.setTabGroupChoices,k=(0,o.useState)(h),E=k[0],O=k[1],w=[],T=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var P=D[d];null!=P&&P!==E&&b.some((function(e){return e.value===P}))&&O(P)}var x=function(e){var r=e.currentTarget,t=w.indexOf(r),n=b[t].value;n!==E&&(T(r),O(n),null!=d&&g(d,n))},C=function(e){var r,t=null;switch(e.key){case"ArrowRight":var n=w.indexOf(e.currentTarget)+1;t=w[n]||w[0];break;case"ArrowLeft":var o=w.indexOf(e.currentTarget)-1;t=w[o]||w[w.length-1]}null==(r=t)||r.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":s},f)},b.map((function(e){var r=e.value,t=e.label,a=e.attributes;return o.createElement("li",(0,n.Z)({role:"tab",tabIndex:E===r?0:-1,"aria-selected":E===r,key:r,ref:function(e){return w.push(e)},onKeyDown:C,onFocus:x,onClick:x},a,{className:(0,l.Z)("tabs__item",u,null==a?void 0:a.className,{"tabs__item--active":E===r})}),null!=t?t:r)}))),c?(0,o.cloneElement)(v.filter((function(e){return e.props.value===E}))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},v.map((function(e,r){return(0,o.cloneElement)(e,{key:r,hidden:e.props.value!==E})}))))}function s(e){var r=(0,a.Z)();return o.createElement(c,(0,n.Z)({key:String(r)},e))}},444:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return m},default:function(){return f}});var n=t(7462),o=t(3366),a=(t(7294),t(3905)),i=t(9877),l=t(8215),u=["components"],c={sidebar_position:5},s="Remove Duplicates from Sorted Array",p={unversionedId:"StriverSDESheet/Day7/Remove Duplicates from Sorted Array",id:"StriverSDESheet/Day7/Remove Duplicates from Sorted Array",title:"Remove Duplicates from Sorted Array",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day7/Remove Duplicates from Sorted Array.md",sourceDirName:"StriverSDESheet/Day7",slug:"/StriverSDESheet/Day7/Remove Duplicates from Sorted Array",permalink:"/CodePrime/docs/StriverSDESheet/Day7/Remove Duplicates from Sorted Array",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day7/Remove Duplicates from Sorted Array.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Trapping Rain Water",permalink:"/CodePrime/docs/StriverSDESheet/Day7/Trapping Rain Water"},next:{title:"Max Consecutive Ones",permalink:"/CodePrime/docs/StriverSDESheet/Day7/Max Consecutive Ones"}},m=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],d={toc:m};function f(e){var r=e.components,t=(0,o.Z)(e,u);return(0,a.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"remove-duplicates-from-sorted-array"},"Remove Duplicates from Sorted Array"),(0,a.kt)("h2",{id:"problem-link"},"Problem Link"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/"},"https://leetcode.com/problems/remove-duplicates-from-sorted-array/")),(0,a.kt)("h2",{id:"solution-code"},"Solution Code"),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(i.Z,{mdxType:"Tabs"},(0,a.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int removeDuplicates(vector<int>& A) {\n        int count = 0;\n        int n = A.size();\n        for (int i = 1; i < n; i++) {\n            if (A[i] == A[i - 1])\n                count++;\n            else\n                A[i - count] = A[i];\n        }\n        return n - count;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);