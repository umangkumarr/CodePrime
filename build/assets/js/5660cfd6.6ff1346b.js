"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1035],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),c=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,b=m["".concat(i,".").concat(d)]||m[d]||u[d]||s;return n?r.createElement(b,o(o({ref:t},p),{},{components:n})):r.createElement(b,o({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=m;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<s;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);const a=function(e){let{children:t,hidden:n,className:a}=e;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>p});var r=n(7462),a=n(7294),s=n(2389),o=n(5773),l=n(6010);const i="tabItem_LplD";function c(e){var t,n,s;const{lazy:c,block:p,defaultValue:u,values:m,groupId:d,className:b}=e,h=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:h.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),f=(0,o.lx)(v,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===u?u:null!=(t=null!=u?u:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(s=h[0])?void 0:s.props.value;if(null!==g&&!v.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:w}=(0,o.UB)(),[y,N]=(0,a.useState)(g),O=[],{blockElementScrollPositionUntilNextRender:T}=(0,o.o5)();if(null!=d){const e=k[d];null!=e&&e!==y&&v.some((t=>t.value===e))&&N(e)}const x=e=>{const t=e.currentTarget,n=O.indexOf(t),r=v[n].value;r!==y&&(T(t),N(r),null!=d&&w(d,r))},P=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;n=O[t]||O[O.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},b)},v.map((e=>{let{value:t,label:n,attributes:s}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:y===t?0:-1,"aria-selected":y===t,key:t,ref:e=>O.push(e),onKeyDown:P,onFocus:x,onClick:x},s,{className:(0,l.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":y===t})}),null!=n?n:t)}))),c?(0,a.cloneElement)(h.filter((e=>e.props.value===y))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==y})))))}function p(e){const t=(0,s.Z)();return a.createElement(c,(0,r.Z)({key:String(t)},e))}},8883:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>m});var r=n(7462),a=(n(7294),n(3905)),s=n(9877),o=n(8215);const l={sidebar_position:90,tags:["Two Pointers","String"]},i="Reverse Words in a String",c={unversionedId:"codes/reverse-words-in-a-string",id:"codes/reverse-words-in-a-string",title:"Reverse Words in a String",description:"Problem",source:"@site/docs/codes/reverse-words-in-a-string.md",sourceDirName:"codes",slug:"/codes/reverse-words-in-a-string",permalink:"/CodePrime/docs/codes/reverse-words-in-a-string",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/reverse-words-in-a-string.md",tags:[{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"},{label:"String",permalink:"/CodePrime/docs/tags/string"}],version:"current",sidebarPosition:90,frontMatter:{sidebar_position:90,tags:["Two Pointers","String"]},sidebar:"main",previous:{title:"String",permalink:"/CodePrime/docs/category/string"},next:{title:"Repeated String Match",permalink:"/CodePrime/docs/codes/repeated-string-match"}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:p};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"reverse-words-in-a-string"},"Reverse Words in a String"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/reverse-words-in-a-string/"},"Problem")),(0,a.kt)("p",null,"Given an input string ",(0,a.kt)("code",null,"s"),", reverse the order of the ",(0,a.kt)("strong",null,"words"),"."),(0,a.kt)("p",null,"A ",(0,a.kt)("strong",null,"word")," is defined as a sequence of non-space characters. The ",(0,a.kt)("strong",null,"words")," in ",(0,a.kt)("code",null,"s")," will be separated by at least one space."),(0,a.kt)("p",null,"Return ",(0,a.kt)("em",null,"a string of the words in reverse order concatenated by a single space.")),(0,a.kt)("p",null,(0,a.kt)("b",null,"Note")," that ",(0,a.kt)("code",null,"s")," may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces."),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(s.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},'class Solution {\n   public:\n    string reverseWords(string s) {\n        vector<string> words;\n        int cnt = 0, n = s.length();\n        for (int i = 0; i < n; i++) {\n            if (s[i] != \' \')\n                cnt++;\n            else {\n                if (cnt == 0) continue;\n                words.push_back(s.substr(i - cnt, cnt));\n                cnt = 0;\n            }\n        }\n        if (cnt) {\n            words.push_back(s.substr(n - cnt, cnt));\n            cnt = 0;\n        }\n        string w = "";\n        reverse(words.begin(), words.end());\n        w = words[0];\n        for (int i = 1; i < words.size(); i++) {\n            w += " " + words[i];\n        }\n        return w;\n    }\n};\n\n'))))))}m.isMDXComponent=!0}}]);