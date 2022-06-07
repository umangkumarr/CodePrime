"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7023],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=c(r),m=a,f=p["".concat(u,".").concat(m)]||p[m]||d[m]||i;return r?n.createElement(f,o(o({ref:t},s),{},{components:r})):n.createElement(f,o({ref:t},s))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=p;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},8215:function(e,t,r){var n=r(7294);t.Z=function(e){var t=e.children,r=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:function(e,t,r){r.d(t,{Z:function(){return s}});var n=r(7462),a=r(7294),i=r(2389),o=r(9548),l=r(6010),u="tabItem_LplD";function c(e){var t,r,i,c=e.lazy,s=e.block,d=e.defaultValue,p=e.values,m=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=p?p:v.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,o.lx)(b,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===d?d:null!=(t=null!=d?d:null==(r=v.find((function(e){return e.props.default})))?void 0:r.props.value)?t:null==(i=v[0])?void 0:i.props.value;if(null!==y&&!b.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var S=(0,o.UB)(),x=S.tabGroupChoices,g=S.setTabGroupChoices,D=(0,a.useState)(y),k=D[0],E=D[1],w=[],O=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var T=x[m];null!=T&&T!==k&&b.some((function(e){return e.value===T}))&&E(T)}var P=function(e){var t=e.currentTarget,r=w.indexOf(t),n=b[r].value;n!==k&&(O(t),E(n),null!=m&&g(m,n))},C=function(e){var t,r=null;switch(e.key){case"ArrowRight":var n=w.indexOf(e.currentTarget)+1;r=w[n]||w[0];break;case"ArrowLeft":var a=w.indexOf(e.currentTarget)-1;r=w[a]||w[w.length-1]}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":s},f)},b.map((function(e){var t=e.value,r=e.label,i=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:k===t?0:-1,"aria-selected":k===t,key:t,ref:function(e){return w.push(e)},onKeyDown:C,onFocus:P,onClick:P},i,{className:(0,l.Z)("tabs__item",u,null==i?void 0:i.className,{"tabs__item--active":k===t})}),null!=r?r:t)}))),c?(0,a.cloneElement)(v.filter((function(e){return e.props.value===k}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==k})}))))}function s(e){var t=(0,i.Z)();return a.createElement(c,(0,n.Z)({key:String(t)},e))}},778:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return d},toc:function(){return p},default:function(){return f}});var n=r(7462),a=r(3366),i=(r(7294),r(3905)),o=r(9877),l=r(8215),u=["components"],c={sidebar_position:1},s="Search a 2D Matrix",d={unversionedId:"StriverSDESheet/Day3/Search a 2D Matrix",id:"StriverSDESheet/Day3/Search a 2D Matrix",title:"Search a 2D Matrix",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day3/Search a 2D Matrix.md",sourceDirName:"StriverSDESheet/Day3",slug:"/StriverSDESheet/Day3/Search a 2D Matrix",permalink:"/CodePrime/docs/StriverSDESheet/Day3/Search a 2D Matrix",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day3/Search a 2D Matrix.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Count Inversions",permalink:"/CodePrime/docs/StriverSDESheet/Day2/Count Inversions"},next:{title:"Pow(x, n)",permalink:"/CodePrime/docs/StriverSDESheet/Day3/Pow(x, n)"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],m={toc:p};function f(e){var t=e.components,r=(0,a.Z)(e,u);return(0,i.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"search-a-2d-matrix"},"Search a 2D Matrix"),(0,i.kt)("h2",{id:"problem-link"},"Problem Link"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/search-a-2d-matrix/"},"https://leetcode.com/problems/search-a-2d-matrix/")),(0,i.kt)("h2",{id:"solution-code"},"Solution Code"),(0,i.kt)(o.Z,{mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        int n = matrix.size();\n        int start = 0, end = n - 1;\n        int mid, indx = 0;\n\n        while (start <= end) {\n            mid = (start + end) / 2;\n            if (matrix[mid][0] > target) {\n                end = mid - 1;\n            } else {\n                indx = mid;\n                start = mid + 1;\n            }\n        }\n\n        start = 0, end = matrix[0].size() - 1;\n        int i = 0;\n        while (start <= end) {\n            mid = (start + end) / 2;\n            if (matrix[indx][mid] > target) {\n                end = mid - 1;\n            } else {\n                i = mid;\n                start = mid + 1;\n            }\n        }\n        if (matrix[indx][i] == target) return true;\n        return false;\n    }\n};\n")))))}f.isMDXComponent=!0}}]);