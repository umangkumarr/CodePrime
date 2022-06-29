"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7583],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),p=c(r),d=o,f=p["".concat(u,".").concat(d)]||p[d]||m[d]||a;return r?n.createElement(f,l(l({ref:t},s),{},{components:r})):n.createElement(f,l({ref:t},s))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=p;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var c=2;c<a;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8215:function(e,t,r){var n=r(7294);t.Z=function(e){var t=e.children,r=e.hidden,o=e.className;return n.createElement("div",{role:"tabpanel",hidden:r,className:o},t)}},9877:function(e,t,r){r.d(t,{Z:function(){return s}});var n=r(7462),o=r(7294),a=r(2389),l=r(9548),i=r(6010),u="tabItem_LplD";function c(e){var t,r,a,c=e.lazy,s=e.block,m=e.defaultValue,p=e.values,d=e.groupId,f=e.className,v=o.Children.map(e.children,(function(e){if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=p?p:v.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,l.lx)(b,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var h=null===m?m:null!=(t=null!=m?m:null==(r=v.find((function(e){return e.props.default})))?void 0:r.props.value)?t:null==(a=v[0])?void 0:a.props.value;if(null!==h&&!b.some((function(e){return e.value===h})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var E=(0,l.UB)(),g=E.tabGroupChoices,S=E.setTabGroupChoices,k=(0,o.useState)(h),j=k[0],D=k[1],P=[],O=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var w=g[d];null!=w&&w!==j&&b.some((function(e){return e.value===w}))&&D(w)}var T=function(e){var t=e.currentTarget,r=P.indexOf(t),n=b[r].value;n!==j&&(O(t),D(n),null!=d&&S(d,n))},x=function(e){var t,r=null;switch(e.key){case"ArrowRight":var n=P.indexOf(e.currentTarget)+1;r=P[n]||P[0];break;case"ArrowLeft":var o=P.indexOf(e.currentTarget)-1;r=P[o]||P[P.length-1]}null==(t=r)||t.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":s},f)},b.map((function(e){var t=e.value,r=e.label,a=e.attributes;return o.createElement("li",(0,n.Z)({role:"tab",tabIndex:j===t?0:-1,"aria-selected":j===t,key:t,ref:function(e){return P.push(e)},onKeyDown:x,onFocus:T,onClick:T},a,{className:(0,i.Z)("tabs__item",u,null==a?void 0:a.className,{"tabs__item--active":j===t})}),null!=r?r:t)}))),c?(0,o.cloneElement)(v.filter((function(e){return e.props.value===j}))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==j})}))))}function s(e){var t=(0,a.Z)();return o.createElement(c,(0,n.Z)({key:String(t)},e))}},8508:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return m},toc:function(){return p},default:function(){return f}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),l=r(9877),i=r(8215),u=["components"],c={sidebar_position:3},s="Majority Element I",m={unversionedId:"Problems/StriverSDESheet/Day3/Majority Element",id:"Problems/StriverSDESheet/Day3/Majority Element",title:"Majority Element I",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day3/Majority Element.md",sourceDirName:"Problems/StriverSDESheet/Day3",slug:"/Problems/StriverSDESheet/Day3/Majority Element",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day3/Majority Element",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day3/Majority Element.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"api",previous:{title:"Pow(x, n)",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day3/Powxn"},next:{title:"Majority Element II",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day3/Majority Element II"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],d={toc:p};function f(e){var t=e.components,r=(0,o.Z)(e,u);return(0,a.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"majority-element-i"},"Majority Element I"),(0,a.kt)("h2",{id:"problem-link"},"Problem Link"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/majority-element/"},"https://leetcode.com/problems/majority-element/")),(0,a.kt)("h2",{id:"solution-code"},"Solution Code"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int majorityElement(vector<int>& nums) {\n        int n = nums.size();\n        sort(nums.begin(), nums.end());\n        return nums[n / 2];\n    }\n};\n")))))}f.isMDXComponent=!0}}]);