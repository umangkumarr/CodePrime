"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[8120],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),m=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=m(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=m(n),h=a,d=c["".concat(s,".").concat(h)]||c[h]||u[h]||o;return n?r.createElement(d,i(i({ref:t},p),{},{components:n})):r.createElement(d,i({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var m=2;m<o;m++)i[m]=n[m];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8215:function(e,t,n){var r=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return p}});var r=n(7462),a=n(7294),o=n(2389),i=n(9548),l=n(6010),s="tabItem_LplD";function m(e){var t,n,o,m=e.lazy,p=e.block,u=e.defaultValue,c=e.values,h=e.groupId,d=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=c?c:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),v=(0,i.lx)(b,(function(e,t){return e.value===t.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===u?u:null!=(t=null!=u?u:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(o=f[0])?void 0:o.props.value;if(null!==g&&!b.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,i.UB)(),y=k.tabGroupChoices,N=k.setTabGroupChoices,w=(0,a.useState)(g),S=w[0],P=w[1],E=[],O=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=h){var D=y[h];null!=D&&D!==S&&b.some((function(e){return e.value===D}))&&P(D)}var x=function(e){var t=e.currentTarget,n=E.indexOf(t),r=b[n].value;r!==S&&(O(t),P(r),null!=h&&N(h,r))},T=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=E.indexOf(e.currentTarget)+1;n=E[r]||E[0];break;case"ArrowLeft":var a=E.indexOf(e.currentTarget)-1;n=E[a]||E[E.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},d)},b.map((function(e){var t=e.value,n=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:function(e){return E.push(e)},onKeyDown:T,onFocus:x,onClick:x},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":S===t})}),null!=n?n:t)}))),m?(0,a.cloneElement)(f.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==S})}))))}function p(e){var t=(0,o.Z)();return a.createElement(m,(0,r.Z)({key:String(t)},e))}},9293:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return m},contentTitle:function(){return p},metadata:function(){return u},toc:function(){return c},default:function(){return d}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=n(9877),l=n(8215),s=["components"],m={sidebar_position:1,tags:["Two Pointer","String","String Matching"]},p="Implement strStr()",u={unversionedId:"Problems/StriverSDESheet/Day16/Implement strStr",id:"Problems/StriverSDESheet/Day16/Implement strStr",title:"Implement strStr()",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day16/Implement strStr.md",sourceDirName:"Problems/StriverSDESheet/Day16",slug:"/Problems/StriverSDESheet/Day16/Implement strStr",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Implement strStr",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day16/Implement strStr.md",tags:[{label:"Two Pointer",permalink:"/CodePrime/docs/tags/two-pointer"},{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"String Matching",permalink:"/CodePrime/docs/tags/string-matching"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Two Pointer","String","String Matching"]},sidebar:"api",previous:{title:"Repeated String Match",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day15/Repeated String Match"},next:{title:"Minimum Characters required to make a String Palindromic",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Minimum Characters required to make a String Palindromic"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],h={toc:c};function d(e){var t=e.components,n=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"implement-strstr"},"Implement strStr()"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/implement-strstr/"},"https://leetcode.com/problems/implement-strstr/")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mi",{parentName:"mrow"},"l"),(0,o.kt)("mi",{parentName:"mrow"},"o"),(0,o.kt)("mi",{parentName:"mrow"},"g"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("mi",{parentName:"mrow"},"n"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlog(n))")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"mclose"},"))")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"const int mod = 1e9 + 7;\nconst int p = 31;\n\nint powr(int a, int b) {\n    int ans = 1;\n    while (b) {\n        if (b & 1ll) {\n            ans *= (long long)a;\n            ans %= mod;\n        }\n        a *= (long long)a;\n        b >>= 1ll;\n        a %= mod;\n    }\n    return ans;\n}\n\nint inv(int a) { return powr(a, mod - 2); }\n\nint hashit(string s) {\n    int res = 0;\n    int m = s.length();\n    for (int i = 0; i < m; i++) {\n        res += powr(p, i) * (s[i] - 'a' + 1);\n        res %= mod;\n    }\n    return res;\n}\n\nclass Solution {\n   public:\n    int strStr(string s, string pat) {\n        int pat_hash = hashit(pat);\n        int m = pat.length();\n        int n = s.length();\n        int text_hash = hashit(s.substr(0, m));\n        if (text_hash == pat_hash) {\n            return 0;\n        }\n\n        int new_hash = text_hash;\n\n        for (int i = m; i < n; i++) {\n            new_hash -= (s[i - m] - 'a' + 1);\n            new_hash *= (long long)inv(p);\n            new_hash %= mod;\n            new_hash += (s[i] - 'a' + 1) * powr(p, m - 1);\n            new_hash %= mod;\n\n            if (new_hash == pat_hash) {\n                return i - m + 1;\n            }\n        }\n        return -1;\n    }\n};\n"))))))}d.isMDXComponent=!0}}]);