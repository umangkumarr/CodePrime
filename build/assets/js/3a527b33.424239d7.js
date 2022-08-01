"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2819],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),c=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(a),d=r,h=p["".concat(i,".").concat(d)]||p[d]||m[d]||s;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=a.length,o=new Array(s);o[0]=p;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<s;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);const r=function(e){let{children:t,hidden:a,className:r}=e;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>u});var n=a(7462),r=a(7294),s=a(2389),o=a(5773),l=a(6010);const i="tabItem_LplD";function c(e){var t,a,s;const{lazy:c,block:u,defaultValue:m,values:p,groupId:d,className:h}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=p?p:f.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),b=(0,o.lx)(k,((e,t)=>e.value===t.value));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===m?m:null!=(t=null!=m?m:null==(a=f.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(s=f[0])?void 0:s.props.value;if(null!==g&&!k.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:y}=(0,o.UB)(),[N,w]=(0,r.useState)(g),O=[],{blockElementScrollPositionUntilNextRender:x}=(0,o.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&k.some((t=>t.value===e))&&w(e)}const T=e=>{const t=e.currentTarget,a=O.indexOf(t),n=k[a].value;n!==N&&(x(t),w(n),null!=d&&y(d,n))},E=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;a=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;a=O[t]||O[O.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},h)},k.map((e=>{let{value:t,label:a,attributes:s}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>O.push(e),onKeyDown:E,onFocus:T,onClick:T},s,{className:(0,l.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),c?(0,r.cloneElement)(f.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,s.Z)();return r.createElement(c,(0,n.Z)({key:String(t)},e))}},9804:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>p});var n=a(7462),r=(a(7294),a(3905)),s=a(9877),o=a(8215);const l={displayed_sidebar:null,sidebar_position:174,tags:["Array","Dynamic Programming"]},i="Minimum Cost to Cut a Stick",c={unversionedId:"codes/minimum-cost-to-cut-a-stick",id:"codes/minimum-cost-to-cut-a-stick",title:"Minimum Cost to Cut a Stick",description:"Problem",source:"@site/docs/codes/minimum-cost-to-cut-a-stick.md",sourceDirName:"codes",slug:"/codes/minimum-cost-to-cut-a-stick",permalink:"/docs/codes/minimum-cost-to-cut-a-stick",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/minimum-cost-to-cut-a-stick.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Dynamic Programming",permalink:"/docs/tags/dynamic-programming"}],version:"current",sidebarPosition:174,frontMatter:{displayed_sidebar:null,sidebar_position:174,tags:["Array","Dynamic Programming"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:u};function p(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"minimum-cost-to-cut-a-stick"},"Minimum Cost to Cut a Stick"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/minimum-cost-to-cut-a-stick/"},"Problem")),(0,r.kt)("p",null,"Given a wooden stick of length ",(0,r.kt)("code",null,"n")," units. The stick is labelled from ",(0,r.kt)("code",null,"0")," to ",(0,r.kt)("code",null,"n"),". For example, a stick of length ",(0,r.kt)("strong",null,"6")," is labelled as follows:"),(0,r.kt)("img",{alt:"",src:"https://assets.leetcode.com/uploads/2020/07/21/statement.jpg"}),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"cuts")," where ",(0,r.kt)("code",null,"cuts[i]")," denotes a position you should perform a cut at."),(0,r.kt)("p",null,"You should perform the cuts in order, you can change the order of the cuts as you wish."),(0,r.kt)("p",null,"The cost of one cut is the length of the stick to be cut, the total cost is the sum of costs of all cuts. When you cut a stick, it will be split into two smaller sticks (i.e. the sum of their lengths is the length of the stick before the cut). Please refer to the first example for a better explanation."),(0,r.kt)("p",null,"Return ",(0,r.kt)("em",null,"the minimum total cost")," of the cuts."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow"},"\u2217"),(0,r.kt)("mn",{parentName:"mrow"},"2"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n*2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}}),(0,r.kt)("span",{parentName:"span",className:"mbin"},"\u2217"),(0,r.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2222em"}})),(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},"2"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int dp[102][102];\n\n    int solve(vector<int>& cuts, int low, int high) {\n        if (low + 1 == high)\n            return 0;\n        else if (dp[low][high] != -1)\n            return dp[low][high];\n\n        else {\n            int ans = INT_MAX;\n            for (int i = low + 1; i < high; i++) {\n                int curr = cuts[high] - cuts[low] + solve(cuts, low, i) +\n                           solve(cuts, i, high);\n                ans = min(ans, curr);\n            }\n            return dp[low][high] = ans;\n        }\n    }\n\n    int minCost(int n, vector<int>& cuts) {\n        cuts.push_back(0);\n        cuts.push_back(n);\n        memset(dp, -1, sizeof(dp));\n        sort(cuts.begin(), cuts.end());\n        return solve(cuts, 0, cuts.size() - 1);\n    }\n};\n\n\n"))))))}p.isMDXComponent=!0}}]);