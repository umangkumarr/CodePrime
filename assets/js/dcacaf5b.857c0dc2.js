"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7986],{3905:function(e,a,t){t.d(a,{Zo:function(){return u},kt:function(){return d}});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function s(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?s(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function o(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=n.createContext({}),c=function(e){var a=n.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):l(l({},a),e)),t},u=function(e){var a=c(e.components);return n.createElement(i.Provider,{value:a},e.children)},m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},p=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),p=c(t),d=r,f=p["".concat(i,".").concat(d)]||p[d]||m[d]||s;return t?n.createElement(f,l(l({ref:a},u),{},{components:t})):n.createElement(f,l({ref:a},u))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var s=t.length,l=new Array(s);l[0]=p;var o={};for(var i in a)hasOwnProperty.call(a,i)&&(o[i]=a[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var c=2;c<s;c++)l[c]=t[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,a,t){var n=t(7294);a.Z=function(e){var a=e.children,t=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:function(e,a,t){t.d(a,{Z:function(){return u}});var n=t(7462),r=t(7294),s=t(2389),l=t(9548),o=t(6010),i="tabItem_LplD";function c(e){var a,t,s,c=e.lazy,u=e.block,m=e.defaultValue,p=e.values,d=e.groupId,f=e.className,b=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=p?p:b.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),v=(0,l.lx)(h,(function(e,a){return e.value===a.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===m?m:null!=(a=null!=m?m:null==(t=b.find((function(e){return e.props.default})))?void 0:t.props.value)?a:null==(s=b[0])?void 0:s.props.value;if(null!==k&&!h.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,l.UB)(),y=g.tabGroupChoices,N=g.setTabGroupChoices,P=(0,r.useState)(k),w=P[0],S=P[1],D=[],T=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=y[d];null!=E&&E!==w&&h.some((function(e){return e.value===E}))&&S(E)}var O=function(e){var a=e.currentTarget,t=D.indexOf(a),n=h[t].value;n!==w&&(T(a),S(n),null!=d&&N(d,n))},x=function(e){var a,t=null;switch(e.key){case"ArrowRight":var n=D.indexOf(e.currentTarget)+1;t=D[n]||D[0];break;case"ArrowLeft":var r=D.indexOf(e.currentTarget)-1;t=D[r]||D[D.length-1]}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":u},f)},h.map((function(e){var a=e.value,t=e.label,s=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:w===a?0:-1,"aria-selected":w===a,key:a,ref:function(e){return D.push(e)},onKeyDown:x,onFocus:O,onClick:O},s,{className:(0,o.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":w===a})}),null!=t?t:a)}))),c?(0,r.cloneElement)(b.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==w})}))))}function u(e){var a=(0,s.Z)();return r.createElement(c,(0,n.Z)({key:String(a)},e))}},8620:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return m},toc:function(){return p},default:function(){return f}});var n=t(7462),r=t(3366),s=(t(7294),t(3905)),l=t(9877),o=t(8215),i=["components"],c={sidebar_position:2,tags:["Array","Dynamic Programming"]},u="Pascal's Triangle",m={unversionedId:"Problems/StriverSDESheet/Day1/Pascals Triangle",id:"Problems/StriverSDESheet/Day1/Pascals Triangle",title:"Pascal's Triangle",description:"Problem",source:"@site/docs/Problems/StriverSDESheet/Day1/Pascals Triangle.md",sourceDirName:"Problems/StriverSDESheet/Day1",slug:"/Problems/StriverSDESheet/Day1/Pascals Triangle",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day1/Pascals Triangle",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day1/Pascals Triangle.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Array","Dynamic Programming"]},sidebar:"api",previous:{title:"Set Matrix Zeroes",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day1/Set Matrix Zeroes"},next:{title:"Next Permutation",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day1/Next Permutation"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var a=e.components,t=(0,r.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},d,t,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"pascals-triangle"},"Pascal's Triangle"),(0,s.kt)("h2",{id:"problem"},(0,s.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/pascals-triangle/"},"Problem")),(0,s.kt)("p",null,"Given an integer ",(0,s.kt)("code",null,"numRows"),", return the first numRows of ",(0,s.kt)("strong",null,"Pascal's triangle"),"."),(0,s.kt)("p",null,"In ",(0,s.kt)("strong",null,"Pascal's triangle"),", each number is the sum of the two numbers directly above it as shown:"),(0,s.kt)("img",{alt:"",src:"https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif"}),(0,s.kt)("p",null,"\xa0"),(0,s.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,s.kt)("p",null,"Expected Time complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"O"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mi",{parentName:"msup"},"n"),(0,s.kt)("mn",{parentName:"msup"},"2")),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution code"),(0,s.kt)(l.Z,{mdxType:"Tabs"},(0,s.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<vector<int>> generate(int n) {\n        vector<vector<int>> ans;\n        vector<int> a, b;\n        a = {1};\n        ans.push_back(a);\n        if (n == 1) return ans;\n        for (int i = 2; i <= n; i++) {\n            b.push_back(1);\n            for (int k = 0; k < a.size() - 1; k++) {\n                b.push_back(a[k] + a[k + 1]);\n            }\n            b.push_back(1);\n            ans.push_back(b);\n            a = b;\n            b.clear();\n        }\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);