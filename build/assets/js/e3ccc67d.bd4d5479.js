"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9488],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),c=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),p=c(n),d=r,h=p["".concat(i,".").concat(d)]||p[d]||u[d]||o;return n?a.createElement(h,l(l({ref:t},m),{},{components:n})):a.createElement(h,l({ref:t},m))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,l[1]=s;for(var c=2;c<o;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(7462),r=n(7294),o=n(2389),l=n(5773),s=n(6010);const i="tabItem_LplD";function c(e){var t,n,o;const{lazy:c,block:m,defaultValue:u,values:p,groupId:d,className:h}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:b.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),g=(0,l.lx)(f,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===u?u:null!=(t=null!=u?u:null==(n=b.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(o=b[0])?void 0:o.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,l.UB)(),[w,N]=(0,r.useState)(v),O=[],{blockElementScrollPositionUntilNextRender:x}=(0,l.o5)();if(null!=d){const e=k[d];null!=e&&e!==w&&f.some((t=>t.value===e))&&N(e)}const T=e=>{const t=e.currentTarget,n=O.indexOf(t),a=f[n].value;a!==w&&(x(t),N(a),null!=d&&y(d,a))},C=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;n=O[t]||O[O.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":m},h)},f.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:e=>O.push(e),onKeyDown:C,onFocus:T,onClick:T},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),c?(0,r.cloneElement)(b.filter((e=>e.props.value===w))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})))))}function m(e){const t=(0,o.Z)();return r.createElement(c,(0,a.Z)({key:String(t)},e))}},8448:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>m,default:()=>p});var a=n(7462),r=(n(7294),n(3905)),o=n(9877),l=n(8215);const s={sidebar_position:1,tags:["Hash Table","String","Counting"],displayed_sidebar:null},i="Most Common Word",c={unversionedId:"codes/most-common-word",id:"codes/most-common-word",title:"Most Common Word",description:"Problem",source:"@site/docs/codes/most-common-word.md",sourceDirName:"codes",slug:"/codes/most-common-word",permalink:"/CodePrime/docs/codes/most-common-word",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/most-common-word.md",tags:[{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"Counting",permalink:"/CodePrime/docs/tags/counting"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Hash Table","String","Counting"],displayed_sidebar:null}},m=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:m};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"most-common-word"},"Most Common Word"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/most-common-word/"},"Problem")),(0,r.kt)("p",null,"Given a string ",(0,r.kt)("code",null,"paragraph")," and a string array of the banned words ",(0,r.kt)("code",null,"banned"),", return ",(0,r.kt)("em",null,"the most frequent word that is not banned"),". It is ",(0,r.kt)("strong",null,"guaranteed")," there is ",(0,r.kt)("strong",null,"at least one word")," that is not banned, and that the answer is ",(0,r.kt)("strong",null,"unique"),"."),(0,r.kt)("p",null,"The words in ",(0,r.kt)("code",null,"paragraph")," are ",(0,r.kt)("strong",null,"case-insensitive")," and the answer should be returned in ",(0,r.kt)("strong",null,"lowercase"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},'class Solution {\npublic:\n    string mostCommonWord(string paragraph, vector<string>& banned) {\n        unordered_map<string, int>m;\n        for(int i = 0; i < paragraph.size();){\n            string s = "";\n            while(i < paragraph.size() && isalpha(paragraph[i])) s.push_back(tolower(paragraph[i++]));\n            while(i < paragraph.size() && !isalpha(paragraph[i])) i++;\n            m[s]++;\n        }\n        for(auto x: banned) m[x] = 0;\n        string res = "";\n        int count = 0;\n        for(auto x: m)\n            if(x.second > count) res = x.first, count = x.second;\n        return res;  \n    }\n};\n'))))))}p.isMDXComponent=!0}}]);