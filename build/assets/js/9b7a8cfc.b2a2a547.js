"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5045],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),c=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(n),d=r,b=m["".concat(i,".").concat(d)]||m[d]||p[d]||l;return n?a.createElement(b,o(o({ref:t},u),{},{components:n})):a.createElement(b,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<l;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),r=n(4334);const l="tabItem_Ymn6";function o(e){let{children:t,hidden:n,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(3117),r=n(7294),l=n(4334),o=n(2389),s=n(7392),i=n(7094),c=n(2466);const u="tabList__CuJ",p="tabItem_LNqP";function m(e){var t,n;const{lazy:o,block:m,defaultValue:d,values:b,groupId:h,className:g}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=b?b:f.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,s.l)(k,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:f[0].props.value;if(null!==y&&!k.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,i.U)(),[O,x]=(0,r.useState)(y),P=[],{blockElementScrollPositionUntilNextRender:E}=(0,c.o5)();if(null!=h){const e=N[h];null!=e&&e!==O&&k.some((t=>t.value===e))&&x(e)}const T=e=>{const t=e.currentTarget,n=P.indexOf(t),a=k[n].value;a!==O&&(E(t),x(a),null!=h&&w(h,String(a)))},S=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=P.indexOf(e.currentTarget)+1;n=null!=(a=P[t])?a:P[0];break}case"ArrowLeft":{var r;const t=P.indexOf(e.currentTarget)-1;n=null!=(r=P[t])?r:P[P.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",u)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":m},g)},k.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>P.push(e),onKeyDown:S,onFocus:T,onClick:T},o,{className:(0,l.Z)("tabs__item",p,null==o?void 0:o.className,{"tabs__item--active":O===t})}),null!=n?n:t)}))),o?(0,r.cloneElement)(f.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,o.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},2784:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var a=n(3117),r=(n(7294),n(3905)),l=n(5488),o=n(5162);const s={sidebar_position:91,tags:["String","String Matching"]},i="Repeated String Match",c={unversionedId:"codes/repeated-string-match",id:"codes/repeated-string-match",title:"Repeated String Match",description:"Problem",source:"@site/docs/codes/repeated-string-match.md",sourceDirName:"codes",slug:"/codes/repeated-string-match",permalink:"/CodePrime/docs/codes/repeated-string-match",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/repeated-string-match.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"String Matching",permalink:"/CodePrime/docs/tags/string-matching"}],version:"current",sidebarPosition:91,frontMatter:{sidebar_position:91,tags:["String","String Matching"]},sidebar:"Leetcode",previous:{title:"Reverse Words in a String",permalink:"/CodePrime/docs/codes/reverse-words-in-a-string"},next:{title:"String to Integer (atoi)",permalink:"/CodePrime/docs/codes/string-to-integer-atoi"}},u={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:p};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"repeated-string-match"},"Repeated String Match"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/repeated-string-match/"},"Problem")),(0,r.kt)("p",null,"Given two strings ",(0,r.kt)("code",null,"a")," and ",(0,r.kt)("code",null,"b"),", return ",(0,r.kt)("em",null,"the minimum number of times you should repeat string "),(0,r.kt)("code",null,"a"),(0,r.kt)("em",null," so that string")," ",(0,r.kt)("code",null,"b")," ",(0,r.kt)("em",null,"is a substring of it"),". If it is impossible for ",(0,r.kt)("code",null,"b"),"\u200b\u200b\u200b\u200b\u200b\u200b to be a substring of ",(0,r.kt)("code",null,"a")," after repeating it, return ",(0,r.kt)("code",null,"-1"),"."),(0,r.kt)("p",null,(0,r.kt)("strong",null,"Notice:")," string ",(0,r.kt)("code",null,'"abc"')," repeated 0 times is ",(0,r.kt)("code",null,'""'),", repeated 1 time is ",(0,r.kt)("code",null,'"abc"')," and repeated 2 times is ",(0,r.kt)("code",null,'"abcabc"'),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int repeatedStringMatch(string a, string b) {\n        string s = a;\n        int count = 1;\n        int maxPossibleRepetions = b.length() / a.length() + 2;\n        for (int i = 1; i <= maxPossibleRepetions; i++) {\n            int f = s.find(b);\n            if (f != -1) return count;\n            s = s + a;\n            count++;\n        }\n        return -1;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);