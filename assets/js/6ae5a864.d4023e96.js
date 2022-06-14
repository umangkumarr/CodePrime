"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4134],{3905:function(a,e,t){t.d(e,{Zo:function(){return o},kt:function(){return N}});var n=t(7294);function r(a,e,t){return e in a?Object.defineProperty(a,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[e]=t,a}function s(a,e){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(a);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),t.push.apply(t,n)}return t}function m(a){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?s(Object(t),!0).forEach((function(e){r(a,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(e){Object.defineProperty(a,e,Object.getOwnPropertyDescriptor(t,e))}))}return a}function p(a,e){if(null==a)return{};var t,n,r=function(a,e){if(null==a)return{};var t,n,r={},s=Object.keys(a);for(n=0;n<s.length;n++)t=s[n],e.indexOf(t)>=0||(r[t]=a[t]);return r}(a,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(a);for(n=0;n<s.length;n++)t=s[n],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(a,t)&&(r[t]=a[t])}return r}var l=n.createContext({}),i=function(a){var e=n.useContext(l),t=e;return a&&(t="function"==typeof a?a(e):m(m({},e),a)),t},o=function(a){var e=i(a.components);return n.createElement(l.Provider,{value:e},a.children)},c={inlineCode:"code",wrapper:function(a){var e=a.children;return n.createElement(n.Fragment,{},e)}},u=n.forwardRef((function(a,e){var t=a.components,r=a.mdxType,s=a.originalType,l=a.parentName,o=p(a,["components","mdxType","originalType","parentName"]),u=i(t),N=r,k=u["".concat(l,".").concat(N)]||u[N]||c[N]||s;return t?n.createElement(k,m(m({ref:e},o),{},{components:t})):n.createElement(k,m({ref:e},o))}));function N(a,e){var t=arguments,r=e&&e.mdxType;if("string"==typeof a||r){var s=t.length,m=new Array(s);m[0]=u;var p={};for(var l in e)hasOwnProperty.call(e,l)&&(p[l]=e[l]);p.originalType=a,p.mdxType="string"==typeof a?a:r,m[1]=p;for(var i=2;i<s;i++)m[i]=t[i];return n.createElement.apply(null,m)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},8215:function(a,e,t){var n=t(7294);e.Z=function(a){var e=a.children,t=a.hidden,r=a.className;return n.createElement("div",{role:"tabpanel",hidden:t,className:r},e)}},9877:function(a,e,t){t.d(e,{Z:function(){return o}});var n=t(7462),r=t(7294),s=t(2389),m=t(9548),p=t(6010),l="tabItem_LplD";function i(a){var e,t,s,i=a.lazy,o=a.block,c=a.defaultValue,u=a.values,N=a.groupId,k=a.className,h=r.Children.map(a.children,(function(a){if((0,r.isValidElement)(a)&&void 0!==a.props.value)return a;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof a.type?a.type:a.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),d=null!=u?u:h.map((function(a){var e=a.props;return{value:e.value,label:e.label,attributes:e.attributes}})),f=(0,m.lx)(d,(function(a,e){return a.value===e.value}));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((function(a){return a.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===c?c:null!=(e=null!=c?c:null==(t=h.find((function(a){return a.props.default})))?void 0:t.props.value)?e:null==(s=h[0])?void 0:s.props.value;if(null!==g&&!d.some((function(a){return a.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+d.map((function(a){return a.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,m.UB)(),v=b.tabGroupChoices,y=b.setTabGroupChoices,w=(0,r.useState)(g),x=w[0],S=w[1],D=[],E=(0,m.o5)().blockElementScrollPositionUntilNextRender;if(null!=N){var O=v[N];null!=O&&O!==x&&d.some((function(a){return a.value===O}))&&S(O)}var P=function(a){var e=a.currentTarget,t=D.indexOf(e),n=d[t].value;n!==x&&(E(e),S(n),null!=N&&y(N,n))},M=function(a){var e,t=null;switch(a.key){case"ArrowRight":var n=D.indexOf(a.currentTarget)+1;t=D[n]||D[0];break;case"ArrowLeft":var r=D.indexOf(a.currentTarget)-1;t=D[r]||D[D.length-1]}null==(e=t)||e.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,p.Z)("tabs",{"tabs--block":o},k)},d.map((function(a){var e=a.value,t=a.label,s=a.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===e?0:-1,"aria-selected":x===e,key:e,ref:function(a){return D.push(a)},onKeyDown:M,onFocus:P,onClick:P},s,{className:(0,p.Z)("tabs__item",l,null==s?void 0:s.className,{"tabs__item--active":x===e})}),null!=t?t:e)}))),i?(0,r.cloneElement)(h.filter((function(a){return a.props.value===x}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(a,e){return(0,r.cloneElement)(a,{key:e,hidden:a.props.value!==x})}))))}function o(a){var e=(0,s.Z)();return r.createElement(i,(0,n.Z)({key:String(e)},a))}},714:function(a,e,t){t.r(e),t.d(e,{frontMatter:function(){return i},contentTitle:function(){return o},metadata:function(){return c},toc:function(){return u},default:function(){return k}});var n=t(7462),r=t(3366),s=(t(7294),t(3905)),m=t(9877),p=t(8215),l=["components"],i={sidebar_position:6,tags:["Array","Dynamic Programming","Hash Table","String"]},o="Word Break",c={unversionedId:"StriverSDESheet/Day10/Word Break",id:"StriverSDESheet/Day10/Word Break",title:"Word Break",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day10/Word Break.md",sourceDirName:"StriverSDESheet/Day10",slug:"/StriverSDESheet/Day10/Word Break",permalink:"/CodePrime/docs/StriverSDESheet/Day10/Word Break",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day10/Word Break.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"String",permalink:"/CodePrime/docs/tags/string"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Array","Dynamic Programming","Hash Table","String"]},sidebar:"tutorialSidebar",previous:{title:"Rat in a Maze Problem I",permalink:"/CodePrime/docs/StriverSDESheet/Day10/Rat in a Maze ProblemI"},next:{title:"3 Sum",permalink:"/CodePrime/docs/codes/3Sum"}},u=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],N={toc:u};function k(a){var e=a.components,t=(0,r.Z)(a,l);return(0,s.kt)("wrapper",(0,n.Z)({},N,t,{components:e,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"word-break"},"Word Break"),(0,s.kt)("h2",{id:"problem-link"},"Problem Link"),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/word-break/"},"https://leetcode.com/problems/word-break/")),(0,s.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,s.kt)("p",null,"Use dyanmic programming.\nFor the string ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"s")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"s")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.4306em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"s"))))),", take all possible suffix and for each suffix(say length ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"L")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"L")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6833em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"L"))))),") check whether the suffix string is present in the given word dictionary and also check if the string ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"s"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("mn",{parentName:"mrow"},"0"),(0,s.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,s.kt)("mi",{parentName:"mrow"},"l"),(0,s.kt)("mi",{parentName:"mrow"},"e"),(0,s.kt)("mi",{parentName:"mrow"},"n"),(0,s.kt)("mo",{parentName:"mrow"},"\u2212"),(0,s.kt)("mi",{parentName:"mrow"},"L"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"s(0, len - L)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"s"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord"},"0"),(0,s.kt)("span",{parentName:"span",className:"mpunct"},","),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.1667em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"e"),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.kt)("span",{parentName:"span",className:"mbin"},"\u2212"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"L"),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))," can be formed from the dictionary or not. If it possible then break the string ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"s")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"s")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.4306em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"s")))))," from the index ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"l"),(0,s.kt)("mi",{parentName:"mrow"},"e"),(0,s.kt)("mi",{parentName:"mrow"},"n"),(0,s.kt)("mo",{parentName:"mrow"},"\u2212"),(0,s.kt)("mi",{parentName:"mrow"},"L")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"len-L")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.7778em",verticalAlign:"-0.0833em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"e"),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,s.kt)("span",{parentName:"span",className:"mbin"},"\u2212"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6833em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"L")))))," (",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"L")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"L")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6833em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"L")))))," from backward)."),(0,s.kt)("p",null,"Expected Time complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"O"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mi",{parentName:"msup"},"n"),(0,s.kt)("mn",{parentName:"msup"},"2")),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution code"),(0,s.kt)(m.Z,{mdxType:"Tabs"},(0,s.kt)(p.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        unordered_map<string, int> mp;\n        for (auto i : wordDict) mp[i] = 1;\n\n        vector<bool> dp(s.size() + 1);\n        dp[0] = true;\n        for (int i = 1; i <= s.size(); i++) {\n            for (int j = i - 1; j >= 0; j--) {\n                string w = s.substr(j, i - j);\n                if (mp.find(w) != mp.end() && dp[j]) dp[i] = true;\n            }\n        }\n        return dp[s.size()];\n    }\n};\n"))))))}k.isMDXComponent=!0}}]);