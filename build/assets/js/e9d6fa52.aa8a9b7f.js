"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[2551],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),m=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=m(n),d=r,b=u["".concat(s,".").concat(d)]||u[d]||p[d]||o;return n?a.createElement(b,i(i({ref:t},c),{},{components:n})):a.createElement(b,i({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var m=2;m<o;m++)i[m]=n[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(7462),r=n(7294),o=n(2389),i=n(5773),l=n(6010);const s="tabItem_LplD";function m(e){var t,n,o;const{lazy:m,block:c,defaultValue:p,values:u,groupId:d,className:b}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=u?u:h.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,i.lx)(f,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===p?p:null!=(t=null!=p?p:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==g&&!f.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:y}=(0,i.UB)(),[N,w]=(0,r.useState)(g),x=[],{blockElementScrollPositionUntilNextRender:T}=(0,i.o5)();if(null!=d){const e=k[d];null!=e&&e!==N&&f.some((t=>t.value===e))&&w(e)}const O=e=>{const t=e.currentTarget,n=x.indexOf(t),a=f[n].value;a!==N&&(T(t),w(a),null!=d&&y(d,a))},P=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=x.indexOf(e.currentTarget)+1;n=x[t]||x[0];break}case"ArrowLeft":{const t=x.indexOf(e.currentTarget)-1;n=x[t]||x[x.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":c},b)},f.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>x.push(e),onKeyDown:P,onFocus:O,onClick:O},o,{className:(0,l.Z)("tabs__item",s,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function c(e){const t=(0,o.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},9474:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>s,metadata:()=>m,toc:()=>c,default:()=>u});var a=n(7462),r=(n(7294),n(3905)),o=n(9877),i=n(8215);const l={sidebar_position:170,tags:["Array","Binary Search","Dynamic Programming","Sorting"]},s="Maximum Profit in Job Scheduling",m={unversionedId:"codes/maximum-profit-in-job-scheduling",id:"codes/maximum-profit-in-job-scheduling",title:"Maximum Profit in Job Scheduling",description:"Problem",source:"@site/docs/codes/maximum-profit-in-job-scheduling.md",sourceDirName:"codes",slug:"/codes/maximum-profit-in-job-scheduling",permalink:"/CodePrime/docs/codes/maximum-profit-in-job-scheduling",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/maximum-profit-in-job-scheduling.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Binary Search",permalink:"/CodePrime/docs/tags/binary-search"},{label:"Dynamic Programming",permalink:"/CodePrime/docs/tags/dynamic-programming"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"}],version:"current",sidebarPosition:170,frontMatter:{sidebar_position:170,tags:["Array","Binary Search","Dynamic Programming","Sorting"]},sidebar:"main",previous:{title:"Partition Equal Subset Sum",permalink:"/CodePrime/docs/codes/partition-equal-subset-sum"},next:{title:"Minimum Path Sum",permalink:"/CodePrime/docs/codes/minimum-path-sum"}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"maximum-profit-in-job-scheduling"},"Maximum Profit in Job Scheduling"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/maximum-profit-in-job-scheduling/"},"Problem")),(0,r.kt)("p",null,"We have ",(0,r.kt)("code",null,"n")," jobs, where every job is scheduled to be done from ",(0,r.kt)("code",null,"startTime[i]")," to ",(0,r.kt)("code",null,"endTime[i]"),", obtaining a profit of ",(0,r.kt)("code",null,"profit[i]"),"."),(0,r.kt)("p",null,"You're given the ",(0,r.kt)("code",null,"startTime"),", ",(0,r.kt)("code",null,"endTime")," and ",(0,r.kt)("code",null,"profit")," arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range."),(0,r.kt)("p",null,"If you choose a job that ends at time ",(0,r.kt)("code",null,"X")," you will be able to start another job that starts at time ",(0,r.kt)("code",null,"X"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int jobScheduling(vector<int>& startTime, vector<int>& endTime,\n                      vector<int>& profit) {\n        vector<vector<int>> v;\n        int n = startTime.size();\n        v.push_back({INT_MIN, INT_MIN, INT_MIN});\n        for (int i = 0; i < n; i++) {\n            v.push_back({endTime[i], startTime[i], profit[i]});\n        }\n        sort(v.begin(), v.end());\n        sort(endTime.begin(), endTime.end());\n\n        vector<vector<int>> dp(n + 1, vector<int>(2));\n        for (int i = 1; i <= n; i++) {\n            dp[i][0] = max(dp[i - 1][0], dp[i - 1][1]);\n            dp[i][1] = v[i][2];\n            int indx = upper_bound(endTime.begin(), endTime.end(), v[i][1]) -\n                       endTime.begin();\n            dp[i][1] += max(dp[indx][0], dp[indx][1]);\n        }\n        return max(dp[n][0], dp[n][1]);\n    }\n};\n\n"))))))}u.isMDXComponent=!0}}]);