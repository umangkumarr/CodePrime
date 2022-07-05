"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1270],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=m(n),d=r,v=c["".concat(i,".").concat(d)]||c[d]||u[d]||s;return n?a.createElement(v,l(l({ref:t},p),{},{components:n})):a.createElement(v,l({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,l=new Array(s);l[0]=c;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var m=2;m<s;m++)l[m]=n[m];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);const r=function(e){let{children:t,hidden:n,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(7462),r=n(7294),s=n(2389),l=n(5773),o=n(6010);const i="tabItem_LplD";function m(e){var t,n,s;const{lazy:m,block:p,defaultValue:u,values:c,groupId:d,className:v}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=c?c:h.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),b=(0,l.lx)(f,((e,t)=>e.value===t.value));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===u?u:null!=(t=null!=u?u:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(s=h[0])?void 0:s.props.value;if(null!==k&&!f.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:N}=(0,l.UB)(),[g,w]=(0,r.useState)(k),O=[],{blockElementScrollPositionUntilNextRender:j}=(0,l.o5)();if(null!=d){const e=y[d];null!=e&&e!==g&&f.some((t=>t.value===e))&&w(e)}const T=e=>{const t=e.currentTarget,n=O.indexOf(t),a=f[n].value;a!==g&&(j(t),w(a),null!=d&&N(d,a))},x=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=O.indexOf(e.currentTarget)+1;n=O[t]||O[0];break}case"ArrowLeft":{const t=O.indexOf(e.currentTarget)-1;n=O[t]||O[O.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},v)},f.map((e=>{let{value:t,label:n,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:g===t?0:-1,"aria-selected":g===t,key:t,ref:e=>O.push(e),onKeyDown:x,onFocus:T,onClick:T},s,{className:(0,o.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":g===t})}),null!=n?n:t)}))),m?(0,r.cloneElement)(h.filter((e=>e.props.value===g))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==g})))))}function p(e){const t=(0,s.Z)();return r.createElement(m,(0,a.Z)({key:String(t)},e))}},9272:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>o,contentTitle:()=>i,metadata:()=>m,toc:()=>p,default:()=>c});var a=n(7462),r=(n(7294),n(3905)),s=n(9877),l=n(8215);const o={displayed_sidebar:null,sidebar_position:40,tags:["Array","Two Pointers","Sorting"]},i="3Sum",m={unversionedId:"anew/3sum",id:"anew/3sum",title:"3Sum",description:"Problem",source:"@site/docs/anew/3sum.md",sourceDirName:"anew",slug:"/anew/3sum",permalink:"/CodePrime/docs/anew/3sum",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/anew/3sum.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Two Pointers",permalink:"/CodePrime/docs/tags/two-pointers"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"}],version:"current",sidebarPosition:40,frontMatter:{displayed_sidebar:null,sidebar_position:40,tags:["Array","Two Pointers","Sorting"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],u={toc:p};function c(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"3sum"},"3Sum"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/3sum/"},"Problem")),(0,r.kt)("p",null,"Given an integer array nums, return all the triplets ",(0,r.kt)("code",null,"[nums[i], nums[j], nums[k]]")," such that ",(0,r.kt)("code",null,"i != j"),", ",(0,r.kt)("code",null,"i != k"),", and ",(0,r.kt)("code",null,"j != k"),", and ",(0,r.kt)("code",null,"nums[i] + nums[j] + nums[k] == 0"),"."),(0,r.kt)("p",null,"Notice that the solution set must not contain duplicate triplets."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Follow a simple Greedy approach. Find all the possible solutions having all the three elements different, two same and one different element, and all the elements are the same. Store the key in a set of vectors to avoid repetition.\xa0"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        int n = nums.size();\n        unordered_map<int, int> mp;\n        for (int i = 0; i < n; i++) {\n            mp[nums[i]]++;\n        }\n\n        vector<int> arr;\n        for (auto i : mp) {\n            arr.push_back(i.first);\n        }\n\n        set<vector<int>> ans;\n        n = arr.size();\n        sort(arr.begin(), arr.end());\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int sm = arr[i] + arr[j];\n                if (-sm != arr[i] && -sm != arr[j] && mp[-sm] > 0) {\n                    vector<int> v = {arr[i], arr[j], -sm};\n                    sort(v.begin(), v.end());\n                    ans.insert(v);\n                }\n            }\n        }\n\n        for (int i = 0; i < n; i++) {\n            int sm = 2 * arr[i];\n            if (sm != arr[i] && mp[arr[i]] > 1 && mp[-2 * arr[i]] > 0) {\n                vector<int> v = {arr[i], arr[i], -sm};\n                sort(v.begin(), v.end());\n                ans.insert(v);\n            }\n        }\n\n        if (mp[0] > 2) {\n            ans.insert({0, 0, 0});\n        }\n        vector<vector<int>> vv;\n        for (auto i : ans) {\n            vv.push_back(i);\n        }\n        return vv;\n    }\n};\n\n"))))))}c.isMDXComponent=!0}}]);