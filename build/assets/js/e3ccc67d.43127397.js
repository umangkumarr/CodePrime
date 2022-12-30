"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9488],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),c=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},m=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=c(a),d=r,h=p["".concat(i,".").concat(d)]||p[d]||u[d]||o;return a?n.createElement(h,s(s({ref:t},m),{},{components:a})):n.createElement(h,s({ref:t},m))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,s=new Array(o);s[0]=p;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,s[1]=l;for(var c=2;c<o;c++)s[c]=a[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7294),r=a(4334);const o="tabItem_Ymn6";function s(e){let{children:t,hidden:a,className:s}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,s),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(3117),r=a(7294),o=a(4334),s=a(2389),l=a(7392),i=a(7094),c=a(2466);const m="tabList__CuJ",u="tabItem_LNqP";function p(e){var t,a;const{lazy:s,block:p,defaultValue:d,values:h,groupId:b,className:f}=e,g=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=h?h:g.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),k=(0,l.l)(v,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(a=g.find((e=>e.props.default)))?void 0:a.props.value)?t:g[0].props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:N}=(0,i.U)(),[O,x]=(0,r.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:C}=(0,c.o5)();if(null!=b){const e=w[b];null!=e&&e!==O&&v.some((t=>t.value===e))&&x(e)}const E=e=>{const t=e.currentTarget,a=T.indexOf(t),n=v[a].value;n!==O&&(C(t),x(n),null!=b&&N(b,String(n)))},P=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=T.indexOf(e.currentTarget)+1;a=null!=(n=T[t])?n:T[0];break}case"ArrowLeft":{var r;const t=T.indexOf(e.currentTarget)-1;a=null!=(r=T[t])?r:T[T.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",m)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},f)},v.map((e=>{let{value:t,label:a,attributes:s}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>T.push(e),onKeyDown:P,onFocus:E,onClick:E},s,{className:(0,o.Z)("tabs__item",u,null==s?void 0:s.className,{"tabs__item--active":O===t})}),null!=a?a:t)}))),s?(0,r.cloneElement)(g.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},g.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,s.Z)();return r.createElement(p,(0,n.Z)({key:String(t)},e))}},8448:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var n=a(3117),r=(a(7294),a(3905)),o=a(5488),s=a(5162);const l={sidebar_position:1,tags:["Hash Table","String","Counting"]},i="Most Common Word",c={unversionedId:"codes/most-common-word",id:"codes/most-common-word",title:"Most Common Word",description:"Problem",source:"@site/docs/codes/most-common-word.md",sourceDirName:"codes",slug:"/codes/most-common-word",permalink:"/CodePrime/docs/codes/most-common-word",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/most-common-word.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Counting",permalink:"/CodePrime/docs/tags/counting"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Hash Table","String","Counting"]}},m={},u=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],p={toc:u};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"most-common-word"},"Most Common Word"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/most-common-word/"},"Problem")),(0,r.kt)("p",null,"Given a string ",(0,r.kt)("code",null,"paragraph")," and a string array of the banned words ",(0,r.kt)("code",null,"banned"),", return ",(0,r.kt)("em",null,"the most frequent word that is not banned"),". It is ",(0,r.kt)("strong",null,"guaranteed")," there is ",(0,r.kt)("strong",null,"at least one word")," that is not banned, and that the answer is ",(0,r.kt)("strong",null,"unique"),"."),(0,r.kt)("p",null,"The words in ",(0,r.kt)("code",null,"paragraph")," are ",(0,r.kt)("strong",null,"case-insensitive")," and the answer should be returned in ",(0,r.kt)("strong",null,"lowercase"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},'class Solution {\npublic:\n    string mostCommonWord(string paragraph, vector<string>& banned) {\n        unordered_map<string, int>m;\n        for(int i = 0; i < paragraph.size();){\n            string s = "";\n            while(i < paragraph.size() && isalpha(paragraph[i])) s.push_back(tolower(paragraph[i++]));\n            while(i < paragraph.size() && !isalpha(paragraph[i])) i++;\n            m[s]++;\n        }\n        for(auto x: banned) m[x] = 0;\n        string res = "";\n        int count = 0;\n        for(auto x: m)\n            if(x.second > count) res = x.first, count = x.second;\n        return res;  \n    }\n};\n'))))))}d.isMDXComponent=!0}}]);