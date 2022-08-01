"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6050],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>d});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var o=a.createContext({}),p=function(e){var n=a.useContext(o),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},c=function(e){var n=p(e.components);return a.createElement(o.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,o=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=p(t),d=r,h=m["".concat(o,".").concat(d)]||m[d]||u[d]||s;return t?a.createElement(h,l(l({ref:n},c),{},{components:t})):a.createElement(h,l({ref:n},c))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,l=new Array(s);l[0]=m;var i={};for(var o in n)hasOwnProperty.call(n,o)&&(i[o]=n[o]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var p=2;p<s;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>c});var a=t(7462),r=t(7294),s=t(2389),l=t(5773),i=t(6010);const o="tabItem_LplD";function p(e){var n,t,s;const{lazy:p,block:c,defaultValue:u,values:m,groupId:d,className:h}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=m?m:b.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),y=(0,l.lx)(g,((e,n)=>e.value===n.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===u?u:null!=(n=null!=u?u:null==(t=b.find((e=>e.props.default)))?void 0:t.props.value)?n:null==(s=b[0])?void 0:s.props.value;if(null!==k&&!g.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:f,setTabGroupChoices:v}=(0,l.UB)(),[N,w]=(0,r.useState)(k),O=[],{blockElementScrollPositionUntilNextRender:j}=(0,l.o5)();if(null!=d){const e=f[d];null!=e&&e!==N&&g.some((n=>n.value===e))&&w(e)}const x=e=>{const n=e.currentTarget,t=O.indexOf(n),a=g[t].value;a!==N&&(j(n),w(a),null!=d&&v(d,a))},E=e=>{var n;let t=null;switch(e.key){case"ArrowRight":{const n=O.indexOf(e.currentTarget)+1;t=O[n]||O[0];break}case"ArrowLeft":{const n=O.indexOf(e.currentTarget)-1;t=O[n]||O[O.length-1];break}}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},h)},g.map((e=>{let{value:n,label:t,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===n?0:-1,"aria-selected":N===n,key:n,ref:e=>O.push(e),onKeyDown:E,onFocus:x,onClick:x},s,{className:(0,i.Z)("tabs__item",o,null==s?void 0:s.className,{"tabs__item--active":N===n})}),null!=t?t:n)}))),p?(0,r.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==N})))))}function c(e){const n=(0,s.Z)();return r.createElement(p,(0,a.Z)({key:String(n)},e))}},1686:(e,n,t)=>{t.r(n),t.d(n,{frontMatter:()=>i,contentTitle:()=>o,metadata:()=>p,toc:()=>c,default:()=>m});var a=t(7462),r=(t(7294),t(3905)),s=t(9877),l=t(8215);const i={sidebar_position:1,tags:["Math","String","Simulation"],displayed_sidebar:null},o="Multiply Strings",p={unversionedId:"codes/multiply-strings",id:"codes/multiply-strings",title:"Multiply Strings",description:"Problem",source:"@site/docs/codes/multiply-strings.md",sourceDirName:"codes",slug:"/codes/multiply-strings",permalink:"/docs/codes/multiply-strings",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/multiply-strings.md",tags:[{label:"Math",permalink:"/docs/tags/math"},{label:"String",permalink:"/docs/tags/string"},{label:"Simulation",permalink:"/docs/tags/simulation"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Math","String","Simulation"],displayed_sidebar:null}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:c};function m(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"multiply-strings"},"Multiply Strings"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/multiply-strings/"},"Problem")),(0,r.kt)("p",null,"Given two non-negative integers ",(0,r.kt)("code",null,"num1")," and ",(0,r.kt)("code",null,"num2")," represented as strings, return the product of ",(0,r.kt)("code",null,"num1")," and ",(0,r.kt)("code",null,"num2"),", also represented as a string."),(0,r.kt)("p",null,(0,r.kt)("strong",null,"Note:"),"\xa0You must not use any built-in BigInteger library or convert the inputs to integer directly."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    string add(string s1, string s2) {\n        int n = s1.length();\n        int m = s2.length();\n        string s = \"\";\n        int i = n - 1, j = m - 1, carry = 0;\n        while (i >= 0 && j >= 0) {\n            int a = (s1[i] - '0') + (s2[j] - '0') + carry;\n            carry = a / 10;\n            a = a % 10;\n            s.push_back(a + '0');\n            i--;\n            j--;\n        }\n        while (i >= 0) {\n            int a = s1[i] - '0' + carry;\n            carry = a / 10;\n            a = a % 10;\n            s.push_back(a + '0');\n            i--;\n        }\n\n        while (j >= 0) {\n            int a = s2[j] - '0' + carry;\n            carry = a / 10;\n            a = a % 10;\n            s.push_back(a + '0');\n            j--;\n        }\n\n        if (carry) {\n            s.push_back('0' + carry);\n        }\n\n        reverse(s.begin(), s.end());\n        return s;\n    }\n\n    string multiply(string s1, string s2) {\n        int n = s1.length();\n        int m = s2.length();\n        if (n > m) {\n            swap(s1, s2);\n            swap(n, m);\n        }\n        reverse(s1.begin(), s1.end());\n        reverse(s2.begin(), s2.end());\n\n        int carry = 0;\n        string s = \"\", ans = \"\";\n        for (int i = 0; i < n; i++) {\n            s = \"\";\n            carry = 0;\n            for (int k = 0; k < i; k++) s.push_back('0');\n            for (int j = 0; j < m; j++) {\n                int a = (s1[i] - '0') * (s2[j] - '0') + carry;\n                carry = a / 10;\n                a = a % 10;\n                s.push_back(a + '0');\n            }\n            if (carry) {\n                s.push_back(carry + '0');\n            }\n            reverse(s.begin(), s.end());\n            ans = add(ans, s);\n        }\n        reverse(ans.begin(), ans.end());\n        n = ans.length();\n        int i = n - 1;\n        while (i > 0 && ans[i] == '0') {\n            ans.pop_back();\n            i--;\n        }\n        reverse(ans.begin(), ans.end());\n        return ans;\n    }\n};\n"))))))}m.isMDXComponent=!0}}]);