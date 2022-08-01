"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6215],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=m(n),d=r,b=p["".concat(i,".").concat(d)]||p[d]||c[d]||o;return n?a.createElement(b,l(l({ref:t},u),{},{components:n})):a.createElement(b,l({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,l[1]=s;for(var m=2;m<o;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(7462),r=n(7294),o=n(2389),l=n(5773),s=n(6010);const i="tabItem_LplD";function m(e){var t,n,o;const{lazy:m,block:u,defaultValue:c,values:p,groupId:d,className:b}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:h.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),k=(0,l.lx)(f,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===c?c:null!=(t=null!=c?c:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(o=h[0])?void 0:o.props.value;if(null!==g&&!f.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:v,setTabGroupChoices:y}=(0,l.UB)(),[N,w]=(0,r.useState)(g),j=[],{blockElementScrollPositionUntilNextRender:O}=(0,l.o5)();if(null!=d){const e=v[d];null!=e&&e!==N&&f.some((t=>t.value===e))&&w(e)}const x=e=>{const t=e.currentTarget,n=j.indexOf(t),a=f[n].value;a!==N&&(O(t),w(a),null!=d&&y(d,a))},P=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=j.indexOf(e.currentTarget)+1;n=j[t]||j[0];break}case"ArrowLeft":{const t=j.indexOf(e.currentTarget)-1;n=j[t]||j[j.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},b)},f.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>j.push(e),onKeyDown:P,onFocus:x,onClick:x},o,{className:(0,s.Z)("tabs__item",i,null==o?void 0:o.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function u(e){const t=(0,o.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},2676:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>m,toc:()=>u,default:()=>p});var a=n(7462),r=(n(7294),n(3905)),o=n(9877),l=n(8215);const s={displayed_sidebar:null,sidebar_position:3,tags:["Array","Dynamic Programming","Sorting"]},i="Job Sequencing Problem",m={unversionedId:"codes/job-sequencing-problem",id:"codes/job-sequencing-problem",title:"Job Sequencing Problem",description:"Problem",source:"@site/docs/codes/job-sequencing-problem.md",sourceDirName:"codes",slug:"/codes/job-sequencing-problem",permalink:"/docs/codes/job-sequencing-problem",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/job-sequencing-problem.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Dynamic Programming",permalink:"/docs/tags/dynamic-programming"},{label:"Sorting",permalink:"/docs/tags/sorting"}],version:"current",sidebarPosition:3,frontMatter:{displayed_sidebar:null,sidebar_position:3,tags:["Array","Dynamic Programming","Sorting"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:u};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"job-sequencing-problem"},"Job Sequencing Problem"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1#"},"Problem")),(0,r.kt)("p",null),(0,r.kt)("p",null,(0,r.kt)("span",null,"Given a set of ",(0,r.kt)("strong",null,"N")," jobs where each ",(0,r.kt)("strong",null,"job",(0,r.kt)("sub",null,"i")),"\xa0has a deadline and profit associated with it. ")),(0,r.kt)("p",null,(0,r.kt)("span",null,"Each job takes ",(0,r.kt)("strong",null,(0,r.kt)("em",null,"1"))," unit of time to complete and only one job can be scheduled at a time. We earn the profit associated with job if and only if the job is completed by its deadline. ")),(0,r.kt)("p",null,(0,r.kt)("span",null,"Find the number of jobs done and the\xa0",(0,r.kt)("strong",null,"maximum profit"),".")),(0,r.kt)("p",null,(0,r.kt)("strong",null,(0,r.kt)("span",null,"Note: ")),(0,r.kt)("span",null,"J"),(0,r.kt)("span",null,"obs will be given in the form (Job",(0,r.kt)("sub",null,"id"),", Deadline,\xa0Profit) associated with that Job.")),(0,r.kt)("p",null,(0,r.kt)("span",null,(0,r.kt)("strong",null,"Your Task")," :",(0,r.kt)("br",null),"You don't need to read input or print anything. Your task is to complete the function ",(0,r.kt)("strong",null,"JobScheduling()")," which takes an integer ",(0,r.kt)("strong",null,"N")," and an array of Jobs(Job id, Deadline,\xa0Profit) as input and returns the count of jobs and maximum profit.")),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Sort all jobs in decreasing order of profit. "),(0,r.kt)("li",{parentName:"ol"},"Iterate on jobs in decreasing order of profit.For each job , do the following :",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Find a time slot i, such that slot is empty and i < deadline and i is greatest.Put the job in\nthis slot and mark this slot filled. "),(0,r.kt)("li",{parentName:"ul"},"If no such i exists, then ignore the job. ")))),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<int> JobScheduling(Job arr[], int n) {\n        sort(arr, arr + n,\n             [](auto& a, auto& b) { return (a.profit > b.profit); });\n        int slot = 0;\n        for (int i = 0; i < n; i++) {\n            slot = max(arr[i].dead, slot);\n        }\n        int res = 0;\n        int count = 0;\n        vector<int> v(slot + 1, 0);\n        for (int i = 0; i < n; i++) {\n            int j = arr[i].dead;\n            while (j >= 1 && v[j] != 0) {\n                j--;\n            }\n            if (j >= 1 && v[j] == 0) {\n                res += arr[i].profit;\n                count++;\n                v[j] = 1;\n            }\n        }\n        return {count, res};\n    }\n};\n"))))))}p.isMDXComponent=!0}}]);