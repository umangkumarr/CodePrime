"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9895],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(a),d=n,h=u["".concat(i,".").concat(d)]||u[d]||m[d]||l;return a?r.createElement(h,o(o({ref:t},p),{},{components:a})):r.createElement(h,o({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,o=new Array(l);o[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<l;c++)o[c]=a[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>n});var r=a(7294);const n=function(e){let{children:t,hidden:a,className:n}=e;return r.createElement("div",{role:"tabpanel",hidden:a,className:n},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>p});var r=a(7462),n=a(7294),l=a(2389),o=a(5773),s=a(6010);const i="tabItem_LplD";function c(e){var t,a,l;const{lazy:c,block:p,defaultValue:m,values:u,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=u?u:b.map((e=>{let{props:{value:t,label:a,attributes:r}}=e;return{value:t,label:a,attributes:r}})),g=(0,o.lx)(f,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===m?m:null!=(t=null!=m?m:null==(a=b.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(l=b[0])?void 0:l.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:k}=(0,o.UB)(),[S,N]=(0,n.useState)(v),w=[],{blockElementScrollPositionUntilNextRender:P}=(0,o.o5)();if(null!=d){const e=y[d];null!=e&&e!==S&&f.some((t=>t.value===e))&&N(e)}const E=e=>{const t=e.currentTarget,a=w.indexOf(t),r=f[a].value;r!==S&&(P(t),N(r),null!=d&&k(d,r))},O=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;a=w[t]||w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;a=w[t]||w[w.length-1];break}}null==(t=a)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},h)},f.map((e=>{let{value:t,label:a,attributes:l}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:e=>w.push(e),onKeyDown:O,onFocus:E,onClick:E},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":S===t})}),null!=a?a:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===S))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==S})))))}function p(e){const t=(0,l.Z)();return n.createElement(c,(0,r.Z)({key:String(t)},e))}},1283:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>u});var r=a(7462),n=(a(7294),a(3905)),l=a(9877),o=a(8215);const s={sidebar_position:6,tags:["String","String Matching"]},i="Repeated String Match",c={unversionedId:"Problems/StriverSDESheet/Day15/Repeated String Match",id:"Problems/StriverSDESheet/Day15/Repeated String Match",title:"Repeated String Match",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day15/Repeated String Match.md",sourceDirName:"Problems/StriverSDESheet/Day15",slug:"/Problems/StriverSDESheet/Day15/Repeated String Match",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day15/Repeated String Match",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day15/Repeated String Match.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"},{label:"String Matching",permalink:"/CodePrime/docs/tags/string-matching"}],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6,tags:["String","String Matching"]},sidebar:"api",previous:{title:"Longest Common Prefix",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day15/ Longest Common Prefix"},next:{title:"Implement strStr()",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day16/Implement strStr"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:p};function u(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"repeated-string-match"},"Repeated String Match"),(0,n.kt)("h2",{id:"problem-link"},"Problem Link"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/repeated-string-match/"},"https://leetcode.com/problems/repeated-string-match/")),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int repeatedStringMatch(string a, string b) {\n        string s = a;\n        int count = 1;\n        int maxPossibleRepetions = b.length() / a.length() + 2;\n        for (int i = 1; i <= maxPossibleRepetions; i++) {\n            int f = s.find(b);\n            if (f != -1) return count;\n            s = s + a;\n            count++;\n        }\n        return -1;\n    }\n};\n"))))))}u.isMDXComponent=!0}}]);