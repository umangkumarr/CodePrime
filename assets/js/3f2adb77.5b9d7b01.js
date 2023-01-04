"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1993],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var l=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,l,a=function(e,t){if(null==e)return{};var n,l,a={},r=Object.keys(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=l.createContext({}),u=function(e){var t=l.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return l.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},m=l.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(n),d=a,k=m["".concat(i,".").concat(d)]||m[d]||p[d]||r;return n?l.createElement(k,o(o({ref:t},c),{},{components:n})):l.createElement(k,o({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var u=2;u<r;u++)o[u]=n[u];return l.createElement.apply(null,o)}return l.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>o});var l=n(7294),a=n(4334);const r="tabItem_Ymn6";function o(e){let{children:t,hidden:n,className:o}=e;return l.createElement("div",{role:"tabpanel",className:(0,a.Z)(r,o),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var l=n(3117),a=n(7294),r=n(4334),o=n(2389),s=n(7392),i=n(7094),u=n(2466);const c="tabList__CuJ",p="tabItem_LNqP";function m(e){var t,n;const{lazy:o,block:m,defaultValue:d,values:k,groupId:b,className:g}=e,f=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=k?k:f.map((e=>{let{props:{value:t,label:n,attributes:l}}=e;return{value:t,label:n,attributes:l}})),v=(0,s.l)(h,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:f[0].props.value;if(null!==y&&!h.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+h.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,i.U)(),[O,E]=(0,a.useState)(y),x=[],{blockElementScrollPositionUntilNextRender:T}=(0,u.o5)();if(null!=b){const e=N[b];null!=e&&e!==O&&h.some((t=>t.value===e))&&E(e)}const P=e=>{const t=e.currentTarget,n=x.indexOf(t),l=h[n].value;l!==O&&(T(t),E(l),null!=b&&w(b,String(l)))},S=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var l;const t=x.indexOf(e.currentTarget)+1;n=null!=(l=x[t])?l:x[0];break}case"ArrowLeft":{var a;const t=x.indexOf(e.currentTarget)-1;n=null!=(a=x[t])?a:x[x.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:(0,r.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":m},g)},h.map((e=>{let{value:t,label:n,attributes:o}=e;return a.createElement("li",(0,l.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>x.push(e),onKeyDown:S,onFocus:P,onClick:P},o,{className:(0,r.Z)("tabs__item",p,null==o?void 0:o.className,{"tabs__item--active":O===t})}),null!=n?n:t)}))),o?(0,a.cloneElement)(f.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function d(e){const t=(0,o.Z)();return a.createElement(m,(0,l.Z)({key:String(t)},e))}},9482:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var l=n(3117),a=(n(7294),n(3905)),r=n(5488),o=n(5162);const s={sidebar_position:1,tags:["String"]},i="Valid Number",u={unversionedId:"codes/valid-number",id:"codes/valid-number",title:"Valid Number",description:"Problem",source:"@site/docs/codes/valid-number.md",sourceDirName:"codes",slug:"/codes/valid-number",permalink:"/CodePrime/docs/codes/valid-number",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/valid-number.md",tags:[{label:"String",permalink:"/CodePrime/docs/tags/string"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["String"]}},c={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],m={toc:p};function d(e){let{components:t,...s}=e;return(0,a.kt)("wrapper",(0,l.Z)({},m,s,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"valid-number"},"Valid Number"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/valid-number/"},"Problem")),(0,a.kt)("p",null,"A ",(0,a.kt)("strong",null,"valid number")," can be split up into these components (in order):"),(0,a.kt)("ol",null,(0,a.kt)("li",null,"A ",(0,a.kt)("strong",null,"decimal number")," or an ",(0,a.kt)("strong",null,"integer"),"."),(0,a.kt)("li",null,"(Optional) An ",(0,a.kt)("code",null,"'e'")," or ",(0,a.kt)("code",null,"'E'"),", followed by an ",(0,a.kt)("strong",null,"integer"),".")),(0,a.kt)("p",null,"A ",(0,a.kt)("strong",null,"decimal number")," can be split up into these components (in order):"),(0,a.kt)("ol",null,(0,a.kt)("li",null,"(Optional) A sign character (either ",(0,a.kt)("code",null,"'+'")," or ",(0,a.kt)("code",null,"'-'"),")."),(0,a.kt)("li",null,"One of the following formats:",(0,a.kt)("ol",null,(0,a.kt)("li",null,"One or more digits, followed by a dot ",(0,a.kt)("code",null,"'.'"),"."),(0,a.kt)("li",null,"One or more digits, followed by a dot ",(0,a.kt)("code",null,"'.'"),", followed by one or more digits."),(0,a.kt)("li",null,"A dot ",(0,a.kt)("code",null,"'.'"),", followed by one or more digits.")))),(0,a.kt)("p",null,"An ",(0,a.kt)("strong",null,"integer")," can be split up into these components (in order):"),(0,a.kt)("ol",null,(0,a.kt)("li",null,"(Optional) A sign character (either ",(0,a.kt)("code",null,"'+'")," or ",(0,a.kt)("code",null,"'-'"),")."),(0,a.kt)("li",null,"One or more digits.")),(0,a.kt)("p",null,"For example, all the following are valid numbers: ",(0,a.kt)("code",null,'["2", "0089", "-0.1", "+3.14", "4.", "-.9", "2e10", "-90E3", "3e+7", "+6e-1", "53.5e93", "-123.456e789"]'),", while the following are not valid numbers: ",(0,a.kt)("code",null,'["abc", "1a", "1e", "e3", "99e2.5", "--6", "-+3", "95a54e53"]'),"."),(0,a.kt)("p",null,"Given a string ",(0,a.kt)("code",null,"s"),", return ",(0,a.kt)("code",null,"true"),(0,a.kt)("em",null," if "),(0,a.kt)("code",null,"s"),(0,a.kt)("em",null," is a ",(0,a.kt)("strong",null,"valid number")),"."),(0,a.kt)("p",null,"\xa0"),(0,a.kt)("p",null,(0,a.kt)("strong",{class:"example"},"Example 1:")),(0,a.kt)("pre",null,(0,a.kt)("strong",null,"Input:"),' s = "0"',(0,a.kt)("strong",null,"Output:")," true"),(0,a.kt)("p",null,(0,a.kt)("strong",{class:"example"},"Example 2:")),(0,a.kt)("pre",null,(0,a.kt)("strong",null,"Input:"),' s = "e"',(0,a.kt)("strong",null,"Output:")," false"),(0,a.kt)("p",null,(0,a.kt)("strong",{class:"example"},"Example 3:")),(0,a.kt)("pre",null,(0,a.kt)("strong",null,"Input:"),' s = "."',(0,a.kt)("strong",null,"Output:")," false"),(0,a.kt)("p",null,"\xa0"),(0,a.kt)("p",null,(0,a.kt)("strong",null,"Constraints:")),(0,a.kt)("ul",null,(0,a.kt)("li",null,(0,a.kt)("code",null,"1 <= s.length <= 20")),(0,a.kt)("li",null,(0,a.kt)("code",null,"s")," consists of only English letters (both uppercase and lowercase), digits (",(0,a.kt)("code",null,"0-9"),"), plus ",(0,a.kt)("code",null,"'+'"),", minus ",(0,a.kt)("code",null,"'-'"),", or dot ",(0,a.kt)("code",null,"'.'"),".")),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time Complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DFA Design",src:n(7789).Z,title:"DFA Valid Number",width:"720",height:"164"})),(0,a.kt)(r.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"py",label:"Python",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-py"},'class Solution:\n    def isNumber(self, s: str) -> bool:\n        states = [{},\n                  {"blank": 1, "digit": 3, "sign": 2, ".": 4},\n                  {"digit": 3, ".": 4},\n                  {"digit": 3, "blank": 9, "e": 6, "E": 6, ".": 5},\n                  {"digit": 5},\n                  {"E": 6, "e": 6, "digit": 5, "blank": 9},\n                  {"sign": 7, "digit": 8},\n                  {"digit": 8},\n                  {"digit": 8, "blank": 9},\n                  {"blank": 9}]\n        currentState = 1\n\n        for i in s:\n            c = i\n            if i == \' \':\n                c = "blank"\n            elif i in [\'+\', \'-\']:\n                c = "sign"\n            elif i >= "0" and i <= \'9\':\n                c = "digit"\n\n            if c not in states[currentState].keys():\n                return False\n\n            currentState = states[currentState][c]\n\n        if currentState not in [3, 5, 8, 9]:\n            return False\n\n        return True\n\n'))))))}d.isMDXComponent=!0},7789:(e,t,n)=>{n.d(t,{Z:()=>l});const l=n.p+"assets/images/dfa-af9e7c490607040f66e928d31e203379.png"}}]);