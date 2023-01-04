"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[397],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),c=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),d=r,b=p["".concat(i,".").concat(d)]||p[d]||m[d]||l;return n?a.createElement(b,o(o({ref:t},u),{},{components:n})):a.createElement(b,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),r=n(4334);const l="tabItem_Ymn6";function o(e){let{children:t,hidden:n,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(3117),r=n(7294),l=n(4334),o=n(2389),s=n(7392),i=n(7094),c=n(2466);const u="tabList__CuJ",m="tabItem_LNqP";function p(e){var t,n;const{lazy:o,block:p,defaultValue:d,values:b,groupId:k,className:h}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=b?b:f.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,s.l)(g,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:f[0].props.value;if(null!==y&&!g.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:N}=(0,i.U)(),[I,O]=(0,r.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:x}=(0,c.o5)();if(null!=k){const e=w[k];null!=e&&e!==I&&g.some((t=>t.value===e))&&O(e)}const P=e=>{const t=e.currentTarget,n=T.indexOf(t),a=g[n].value;a!==I&&(x(t),O(a),null!=k&&N(k,String(a)))},C=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=T.indexOf(e.currentTarget)+1;n=null!=(a=T[t])?a:T[0];break}case"ArrowLeft":{var r;const t=T.indexOf(e.currentTarget)-1;n=null!=(r=T[t])?r:T[T.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",u)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},h)},g.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:I===t?0:-1,"aria-selected":I===t,key:t,ref:e=>T.push(e),onKeyDown:C,onFocus:P,onClick:P},o,{className:(0,l.Z)("tabs__item",m,null==o?void 0:o.className,{"tabs__item--active":I===t})}),null!=n?n:t)}))),o?(0,r.cloneElement)(f.filter((e=>e.props.value===I))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==I})))))}function d(e){const t=(0,o.Z)();return r.createElement(p,(0,a.Z)({key:String(t)},e))}},5915:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>c,toc:()=>m});var a=n(3117),r=(n(7294),n(3905)),l=n(5488),o=n(5162);const s={sidebar_position:93,tags:["Hash Table","Math","String"]},i="Roman to Integer",c={unversionedId:"codes/roman-to-integer",id:"codes/roman-to-integer",title:"Roman to Integer",description:"Problem",source:"@site/docs/codes/roman-to-integer.md",sourceDirName:"codes",slug:"/codes/roman-to-integer",permalink:"/CodePrime/docs/codes/roman-to-integer",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/roman-to-integer.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Math",permalink:"/CodePrime/docs/tags/math"},{label:"String",permalink:"/CodePrime/docs/tags/string"}],version:"current",sidebarPosition:93,frontMatter:{sidebar_position:93,tags:["Hash Table","Math","String"]},sidebar:"Leetcode",previous:{title:"String to Integer (atoi)",permalink:"/CodePrime/docs/codes/string-to-integer-atoi"},next:{title:"Longest Palindromic Substring",permalink:"/CodePrime/docs/codes/longest-palindromic-substring"}},u={},m=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],p={toc:m};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"roman-to-integer"},"Roman to Integer"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/roman-to-integer/"},"Problem")),(0,r.kt)("p",null,"Roman numerals are represented by seven different symbols:\xa0",(0,r.kt)("code",null,"I"),", ",(0,r.kt)("code",null,"V"),", ",(0,r.kt)("code",null,"X"),", ",(0,r.kt)("code",null,"L"),", ",(0,r.kt)("code",null,"C"),", ",(0,r.kt)("code",null,"D")," and ",(0,r.kt)("code",null,"M"),"."),(0,r.kt)("pre",null,(0,r.kt)("strong",null,"Symbol"),"       ",(0,r.kt)("strong",null,"Value"),"I             1 V             5 X             10 L             50 C             100 D             500 M             1000"),(0,r.kt)("p",null,"For example,\xa0",(0,r.kt)("code",null,"2")," is written as ",(0,r.kt)("code",null,"II"),"\xa0in Roman numeral, just two ones added together. ",(0,r.kt)("code",null,"12")," is written as\xa0",(0,r.kt)("code",null,"XII"),", which is simply ",(0,r.kt)("code",null,"X + II"),". The number ",(0,r.kt)("code",null,"27")," is written as ",(0,r.kt)("code",null,"XXVII"),", which is ",(0,r.kt)("code",null,"XX + V + II"),"."),(0,r.kt)("p",null,"Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not ",(0,r.kt)("code",null,"IIII"),". Instead, the number four is written as ",(0,r.kt)("code",null,"IV"),". Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as ",(0,r.kt)("code",null,"IX"),". There are six instances where subtraction is used:"),(0,r.kt)("ul",null,(0,r.kt)("li",null,(0,r.kt)("code",null,"I")," can be placed before ",(0,r.kt)("code",null,"V")," (5) and ",(0,r.kt)("code",null,"X")," (10) to make 4 and 9.\xa0"),(0,r.kt)("li",null,(0,r.kt)("code",null,"X")," can be placed before ",(0,r.kt)("code",null,"L")," (50) and ",(0,r.kt)("code",null,"C")," (100) to make 40 and 90.\xa0"),(0,r.kt)("li",null,(0,r.kt)("code",null,"C")," can be placed before ",(0,r.kt)("code",null,"D")," (500) and ",(0,r.kt)("code",null,"M")," (1000) to make 400 and 900.")),(0,r.kt)("p",null,"Given a roman numeral, convert it to an integer."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution:\n    def romanToInt(self, s):\n        roman = {'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1}\n        z = 0\n        for i in range(0, len(s) - 1):\n            if roman[s[i]] < roman[s[i+1]]:\n                z -= roman[s[i]]\n            else:\n                z += roman[s[i]]\n        return z + roman[s[-1]]\n\n"))))))}d.isMDXComponent=!0}}]);