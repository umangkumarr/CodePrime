"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4963],{3905:function(e,r,n){n.d(r,{Zo:function(){return s},kt:function(){return m}});var t=n(7294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function i(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function u(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=t.createContext({}),c=function(e){var r=t.useContext(l),n=r;return e&&(n="function"==typeof e?e(r):i(i({},r),e)),n},s=function(e){var r=c(e.components);return t.createElement(l.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),d=c(n),m=a,v=d["".concat(l,".").concat(m)]||d[m]||p[m]||o;return n?t.createElement(v,i(i({ref:r},s),{},{components:n})):t.createElement(v,i({ref:r},s))}));function m(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var u={};for(var l in r)hasOwnProperty.call(r,l)&&(u[l]=r[l]);u.originalType=e,u.mdxType="string"==typeof e?e:a,i[1]=u;for(var c=2;c<o;c++)i[c]=n[c];return t.createElement.apply(null,i)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:function(e,r,n){var t=n(7294);r.Z=function(e){var r=e.children,n=e.hidden,a=e.className;return t.createElement("div",{role:"tabpanel",hidden:n,className:a},r)}},9877:function(e,r,n){n.d(r,{Z:function(){return s}});var t=n(7462),a=n(7294),o=n(2389),i=n(9548),u=n(6010),l="tabItem_LplD";function c(e){var r,n,o,c=e.lazy,s=e.block,p=e.defaultValue,d=e.values,m=e.groupId,v=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=d?d:f.map((function(e){var r=e.props;return{value:r.value,label:r.label,attributes:r.attributes}})),h=(0,i.lx)(b,(function(e,r){return e.value===r.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===p?p:null!=(r=null!=p?p:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?r:null==(o=f[0])?void 0:o.props.value;if(null!==y&&!b.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,i.UB)(),k=g.tabGroupChoices,S=g.setTabGroupChoices,P=(0,a.useState)(y),E=P[0],D=P[1],O=[],w=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var T=k[m];null!=T&&T!==E&&b.some((function(e){return e.value===T}))&&D(T)}var j=function(e){var r=e.currentTarget,n=O.indexOf(r),t=b[n].value;t!==E&&(w(r),D(t),null!=m&&S(m,t))},x=function(e){var r,n=null;switch(e.key){case"ArrowRight":var t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break;case"ArrowLeft":var a=O.indexOf(e.currentTarget)-1;n=O[a]||O[O.length-1]}null==(r=n)||r.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,u.Z)("tabs",{"tabs--block":s},v)},b.map((function(e){var r=e.value,n=e.label,o=e.attributes;return a.createElement("li",(0,t.Z)({role:"tab",tabIndex:E===r?0:-1,"aria-selected":E===r,key:r,ref:function(e){return O.push(e)},onKeyDown:x,onFocus:j,onClick:j},o,{className:(0,u.Z)("tabs__item",l,null==o?void 0:o.className,{"tabs__item--active":E===r})}),null!=n?n:r)}))),c?(0,a.cloneElement)(f.filter((function(e){return e.props.value===E}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map((function(e,r){return(0,a.cloneElement)(e,{key:r,hidden:e.props.value!==E})}))))}function s(e){var r=(0,o.Z)();return a.createElement(c,(0,t.Z)({key:String(r)},e))}},4681:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return d},default:function(){return v}});var t=n(7462),a=n(3366),o=(n(7294),n(3905)),i=n(9877),u=n(8215),l=["components"],c={sidebar_position:6},s="Reverse Pairs",p={unversionedId:"StriverSDESheet/Day3/Reverse Pairs",id:"StriverSDESheet/Day3/Reverse Pairs",title:"Reverse Pairs",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day3/Reverse Pairs.md",sourceDirName:"StriverSDESheet/Day3",slug:"/StriverSDESheet/Day3/Reverse Pairs",permalink:"/CodePrime/docs/StriverSDESheet/Day3/Reverse Pairs",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day3/Reverse Pairs.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Unique Paths",permalink:"/CodePrime/docs/StriverSDESheet/Day3/Unique Paths"},next:{title:"Group Anagram",permalink:"/CodePrime/docs/codes/Amazon/GroupAnagram"}},d=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],m={toc:d};function v(e){var r=e.components,n=(0,a.Z)(e,l);return(0,o.kt)("wrapper",(0,t.Z)({},m,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"reverse-pairs"},"Reverse Pairs"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/reverse-pairs/"},"https://leetcode.com/problems/reverse-pairs/")),(0,o.kt)("h2",{id:"solution-code"},"Solution Code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(u.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int sort_and_count(vector<int>::iterator begin, vector<int>::iterator end) {\n        if (end - begin <= 1) return 0;\n        auto mid = begin + (end - begin) / 2;\n        int count = sort_and_count(begin, mid) + sort_and_count(mid, end);\n        for (auto i = begin, j = mid; i != mid; ++i) {\n            while (j != end and *i > 2L * *j) ++j;\n            count += j - mid;\n        }\n        inplace_merge(begin, mid, end);\n        return count;\n    }\n\n    int reversePairs(vector<int>& nums) {\n        return sort_and_count(nums.begin(), nums.end());\n    }\n};\n")))))}v.isMDXComponent=!0}}]);