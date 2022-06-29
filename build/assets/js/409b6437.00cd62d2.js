"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5351],{3905:function(e,t,r){r.d(t,{Zo:function(){return m},kt:function(){return d}});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),u=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},m=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),c=u(r),d=n,f=c["".concat(s,".").concat(d)]||c[d]||p[d]||o;return r?a.createElement(f,i(i({ref:t},m),{},{components:r})):a.createElement(f,i({ref:t},m))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var u=2;u<o;u++)i[u]=r[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}c.displayName="MDXCreateElement"},8215:function(e,t,r){var a=r(7294);t.Z=function(e){var t=e.children,r=e.hidden,n=e.className;return a.createElement("div",{role:"tabpanel",hidden:r,className:n},t)}},9877:function(e,t,r){r.d(t,{Z:function(){return m}});var a=r(7462),n=r(7294),o=r(2389),i=r(9548),l=r(6010),s="tabItem_LplD";function u(e){var t,r,o,u=e.lazy,m=e.block,p=e.defaultValue,c=e.values,d=e.groupId,f=e.className,h=n.Children.map(e.children,(function(e){if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=c?c:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,i.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===p?p:null!=(t=null!=p?p:null==(r=h.find((function(e){return e.props.default})))?void 0:r.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==k&&!v.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,i.UB)(),y=g.tabGroupChoices,N=g.setTabGroupChoices,w=(0,n.useState)(k),S=w[0],D=w[1],E=[],O=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var P=y[d];null!=P&&P!==S&&v.some((function(e){return e.value===P}))&&D(P)}var T=function(e){var t=e.currentTarget,r=E.indexOf(t),a=v[r].value;a!==S&&(O(t),D(a),null!=d&&N(d,a))},x=function(e){var t,r=null;switch(e.key){case"ArrowRight":var a=E.indexOf(e.currentTarget)+1;r=E[a]||E[0];break;case"ArrowLeft":var n=E.indexOf(e.currentTarget)-1;r=E[n]||E[E.length-1]}null==(t=r)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":m},f)},v.map((function(e){var t=e.value,r=e.label,o=e.attributes;return n.createElement("li",(0,a.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:function(e){return E.push(e)},onKeyDown:x,onFocus:T,onClick:T},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":S===t})}),null!=r?r:t)}))),u?(0,n.cloneElement)(h.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==S})}))))}function m(e){var t=(0,o.Z)();return n.createElement(u,(0,a.Z)({key:String(t)},e))}},5102:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return u},contentTitle:function(){return m},metadata:function(){return p},toc:function(){return c},default:function(){return f}});var a=r(7462),n=r(3366),o=(r(7294),r(3905)),i=r(9877),l=r(8215),s=["components"],u={sidebar_position:6,tags:["Hash Table","String","Dynamic Programming","Trie","Memoization"]},m="Word Break",p={unversionedId:"StriverSDESheet/Day26/Word Break",id:"StriverSDESheet/Day26/Word Break",title:"Word Break",description:"Problem",source:"@site/docs/StriverSDESheet/Day26/Word Break.md",sourceDirName:"StriverSDESheet/Day26",slug:"/StriverSDESheet/Day26/Word Break",permalink:"/CodePrime/docs/StriverSDESheet/Day26/Word Break",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day26/Word Break.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Trie",permalink:"/CodePrime/docs/tags/trie"},{label:"Memoization",permalink:"/CodePrime/docs/tags/memoization"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["Hash Table","String","Dynamic Programming","Trie","Memoization"]},sidebar:"tutorialSidebar",previous:{title:"Super Egg Drop",permalink:"/CodePrime/docs/StriverSDESheet/Day26/Super Egg Drop"},next:{title:"Palindrome Partitioning",permalink:"/CodePrime/docs/StriverSDESheet/Day26/Palindrome Partitioning"}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:c};function f(e){var t=e.components,r=(0,n.Z)(e,s);return(0,o.kt)("wrapper",(0,a.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"word-break"},"Word Break"),(0,o.kt)("h2",{id:"problem"},(0,o.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/word-break/"},"Problem")),(0,o.kt)("p",null,"Given a string ",(0,o.kt)("code",null,"s")," and a dictionary of strings ",(0,o.kt)("code",null,"wordDict"),", return ",(0,o.kt)("code",null,"true")," if ",(0,o.kt)("code",null,"s")," can be segmented into a space-separated sequence of one or more dictionary words."),(0,o.kt)("p",null,(0,o.kt)("strong",null,"Note")," that the same word in the dictionary may be reused multiple times in the segmentation."),(0,o.kt)("p",null,"\xa0"),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("msup",{parentName:"mrow"},(0,o.kt)("mi",{parentName:"msup"},"n"),(0,o.kt)("mn",{parentName:"msup"},"3")),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^3)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord"},(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"msupsub"},(0,o.kt)("span",{parentName:"span",className:"vlist-t"},(0,o.kt)("span",{parentName:"span",className:"vlist-r"},(0,o.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,o.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,o.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,o.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,o.kt)("span",{parentName:"span",className:"mord mtight"},"3")))))))),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        unordered_map<string, int> mp;\n        for (auto i : wordDict) mp[i] = 1;\n\n        vector<bool> dp(s.size() + 1);\n        dp[0] = true;\n        for (int i = 1; i <= s.size(); i++) {\n            for (int j = i - 1; j >= 0; j--) {\n                string w = s.substr(j, i - j);\n                if (mp.find(w) != mp.end() && dp[j]) dp[i] = true;\n            }\n        }\n\n        return dp[s.size()];\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);