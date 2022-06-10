"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6782],{3905:function(e,a,t){t.d(a,{Zo:function(){return p},kt:function(){return d}});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function s(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?s(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function l(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var m=n.createContext({}),o=function(e){var a=n.useContext(m),t=a;return e&&(t="function"==typeof e?e(a):i(i({},a),e)),t},p=function(e){var a=o(e.components);return n.createElement(m.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},u=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,s=e.originalType,m=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=o(t),d=r,h=u["".concat(m,".").concat(d)]||u[d]||c[d]||s;return t?n.createElement(h,i(i({ref:a},p),{},{components:t})):n.createElement(h,i({ref:a},p))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var s=t.length,i=new Array(s);i[0]=u;var l={};for(var m in a)hasOwnProperty.call(a,m)&&(l[m]=a[m]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var o=2;o<s;o++)i[o]=t[o];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:function(e,a,t){var n=t(7294);a.Z=function(e){var a=e.children,t=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},a)}},9877:function(e,a,t){t.d(a,{Z:function(){return p}});var n=t(7462),r=t(7294),s=t(2389),i=t(9548),l=t(6010),m="tabItem_LplD";function o(e){var a,t,s,o=e.lazy,p=e.block,c=e.defaultValue,u=e.values,d=e.groupId,h=e.className,g=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=u?u:g.map((function(e){var a=e.props;return{value:a.value,label:a.label,attributes:a.attributes}})),N=(0,i.lx)(k,(function(e,a){return e.value===a.value}));if(N.length>0)throw new Error('Docusaurus error: Duplicate values "'+N.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var f=null===c?c:null!=(a=null!=c?c:null==(t=g.find((function(e){return e.props.default})))?void 0:t.props.value)?a:null==(s=g[0])?void 0:s.props.value;if(null!==f&&!k.some((function(e){return e.value===f})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+k.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,i.UB)(),v=b.tabGroupChoices,y=b.setTabGroupChoices,w=(0,r.useState)(f),x=w[0],P=w[1],O=[],j=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var T=v[d];null!=T&&T!==x&&k.some((function(e){return e.value===T}))&&P(T)}var E=function(e){var a=e.currentTarget,t=O.indexOf(a),n=k[t].value;n!==x&&(j(a),P(n),null!=d&&y(d,n))},S=function(e){var a,t=null;switch(e.key){case"ArrowRight":var n=O.indexOf(e.currentTarget)+1;t=O[n]||O[0];break;case"ArrowLeft":var r=O.indexOf(e.currentTarget)-1;t=O[r]||O[O.length-1]}null==(a=t)||a.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},h)},k.map((function(e){var a=e.value,t=e.label,s=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===a?0:-1,"aria-selected":x===a,key:a,ref:function(e){return O.push(e)},onKeyDown:S,onFocus:E,onClick:E},s,{className:(0,l.Z)("tabs__item",m,null==s?void 0:s.className,{"tabs__item--active":x===a})}),null!=t?t:a)}))),o?(0,r.cloneElement)(g.filter((function(e){return e.props.value===x}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},g.map((function(e,a){return(0,r.cloneElement)(e,{key:a,hidden:e.props.value!==x})}))))}function p(e){var a=(0,s.Z)();return r.createElement(o,(0,n.Z)({key:String(a)},e))}},9340:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return o},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return u},default:function(){return h}});var n=t(7462),r=t(3366),s=(t(7294),t(3905)),i=t(9877),l=t(8215),m=["components"],o={tags:["Two Pointer","String Matching","Dynamic Programming"]},p="Longest Palindromic Substring",c={unversionedId:"codes/Amazon/longestPalindromicSubstring",id:"codes/Amazon/longestPalindromicSubstring",title:"Longest Palindromic Substring",description:"Problem Link",source:"@site/docs/codes/Amazon/longestPalindromicSubstring.md",sourceDirName:"codes/Amazon",slug:"/codes/Amazon/longestPalindromicSubstring",permalink:"/CodePrime/docs/codes/Amazon/longestPalindromicSubstring",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/Amazon/longestPalindromicSubstring.md",tags:[{label:"Two Pointer",permalink:"/CodePrime/docs/tags/two-pointer"},{label:"String Matching",permalink:"/CodePrime/docs/tags/string-matching"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"}],version:"current",frontMatter:{tags:["Two Pointer","String Matching","Dynamic Programming"]},sidebar:"tutorialSidebar",previous:{title:"Binary Tree Zigzag Traversal",permalink:"/CodePrime/docs/codes/Amazon/ZigZag"},next:{title:"Two sum",permalink:"/CodePrime/docs/codes/Amazon/twosum"}},u=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:u};function h(e){var a=e.components,t=(0,r.Z)(e,m);return(0,s.kt)("wrapper",(0,n.Z)({},d,t,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"longest-palindromic-substring"},"Longest Palindromic Substring"),(0,s.kt)("h2",{id:"problem-link"},"Problem Link"),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/longest-palindromic-substring"},"https://leetcode.com/problems/longest-palindromic-substring")),(0,s.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,s.kt)("p",null,"Use two pointer to find the palindromic substring starting at index ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"i")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"i")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6595em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"i")))))," and store the ending index(say ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"j")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"j")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.854em",verticalAlign:"-0.1944em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.05724em"}},"j"))))),") of the current palindromic substring because the next palindromic substring of bigger length will end at any index greater than ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"j")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"j")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.854em",verticalAlign:"-0.1944em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.05724em"}},"j"))))),"."),(0,s.kt)("p",null,"Expected Time complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"O"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mi",{parentName:"msup"},"n"),(0,s.kt)("mn",{parentName:"msup"},"2")),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution code"),(0,s.kt)(i.Z,{mdxType:"Tabs"},(0,s.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\npublic:\n    string longestPalindrome(string s) {\n        int n = s.length();\n        if (n <= 1) {\n            return s;\n        }\n        int mx = 0; // store max length of any palindromic substring\n        int indx, last = 0;\n        for (int i = 0; i < n; i++) {\n            last = max(last, i);\n            for (int j = n - 1; j >= last; j--) {\n                int itr = j, itr1 = i;\n                int len = 0;\n\n                // check if i to j is a palindrome \n                while (itr1 <= itr && s[itr1] == s[itr]) {\n                    if (itr1 != itr) len += 2;\n                    else len++;\n                    itr1++;\n                    itr--;\n                }\n\n                // if substring i to j is a palindrome update ans\n                if (itr1 >= itr && mx < len) {\n                    mx = len;\n                    indx = i;\n                    last = max(last, j);\n                }\n            }\n        }\n        string ans = string(s.begin() + indx, s.begin() + indx + mx);\n        return ans;\n    }\n};\n"))))))}h.isMDXComponent=!0}}]);