"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7714],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),m=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=m(n),d=r,b=p["".concat(i,".").concat(d)]||p[d]||u[d]||s;return n?a.createElement(b,o(o({ref:t},c),{},{components:n})):a.createElement(b,o({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=p;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var m=2;m<s;m++)o[m]=n[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),r=n(4334);const s="tabItem_Ymn6";function o(e){let{children:t,hidden:n,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(s,o),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(3117),r=n(7294),s=n(4334),o=n(2389),l=n(7392),i=n(7094),m=n(2466);const c="tabList__CuJ",u="tabItem_LNqP";function p(e){var t,n;const{lazy:o,block:p,defaultValue:d,values:b,groupId:h,className:k}=e,f=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=b?b:f.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),v=(0,l.l)(g,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(n=f.find((e=>e.props.default)))?void 0:n.props.value)?t:f[0].props.value;if(null!==y&&!g.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,i.U)(),[x,O]=(0,r.useState)(y),T=[],{blockElementScrollPositionUntilNextRender:E}=(0,m.o5)();if(null!=h){const e=N[h];null!=e&&e!==x&&g.some((t=>t.value===e))&&O(e)}const P=e=>{const t=e.currentTarget,n=T.indexOf(t),a=g[n].value;a!==x&&(E(t),O(a),null!=h&&w(h,String(a)))},C=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=T.indexOf(e.currentTarget)+1;n=null!=(a=T[t])?a:T[0];break}case"ArrowLeft":{var r;const t=T.indexOf(e.currentTarget)-1;n=null!=(r=T[t])?r:T[T.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,s.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":p},k)},g.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:x===t?0:-1,"aria-selected":x===t,key:t,ref:e=>T.push(e),onKeyDown:C,onFocus:P,onClick:P},o,{className:(0,s.Z)("tabs__item",u,null==o?void 0:o.className,{"tabs__item--active":x===t})}),null!=n?n:t)}))),o?(0,r.cloneElement)(f.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},f.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==x})))))}function d(e){const t=(0,o.Z)();return r.createElement(p,(0,a.Z)({key:String(t)},e))}},8285:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>m,toc:()=>u});var a=n(3117),r=(n(7294),n(3905)),s=n(5488),o=n(5162);const l={sidebar_position:50,tags:["Array","Backtracking"]},i="Combination Sum",m={unversionedId:"codes/combination-sum",id:"codes/combination-sum",title:"Combination Sum",description:"Problem",source:"@site/docs/codes/combination-sum.md",sourceDirName:"codes",slug:"/codes/combination-sum",permalink:"/CodePrime/docs/codes/combination-sum",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/combination-sum.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"}],version:"current",sidebarPosition:50,frontMatter:{sidebar_position:50,tags:["Array","Backtracking"]},sidebar:"Leetcode",previous:{title:"Permutation Sequence",permalink:"/CodePrime/docs/codes/permutation-sequence"},next:{title:"Subsets II",permalink:"/CodePrime/docs/codes/subsets-ii"}},c={},u=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],p={toc:u};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"combination-sum"},"Combination Sum"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/combination-sum/"},"Problem")),(0,r.kt)("p",null,"Given an array of ",(0,r.kt)("strong",null,"distinct")," integers ",(0,r.kt)("code",null,"candidates")," and a target integer ",(0,r.kt)("code",null,"target"),", return ",(0,r.kt)("em",null,"a list of all ",(0,r.kt)("strong",null,"unique combinations")," of "),(0,r.kt)("code",null,"candidates"),(0,r.kt)("em",null," where the chosen numbers sum to "),(0,r.kt)("code",null,"target"),(0,r.kt)("em",null,".")," You may return the combinations in ",(0,r.kt)("strong",null,"any order"),"."),(0,r.kt)("p",null,"The ",(0,r.kt)("strong",null,"same")," number may be chosen from ",(0,r.kt)("code",null,"candidates")," an ",(0,r.kt)("strong",null,"unlimited number of times"),". Two combinations are unique if the frequency of at least one of the chosen numbers is different."),(0,r.kt)("p",null,"It is ",(0,r.kt)("strong",null,"guaranteed")," that the number of unique combinations that sum up to ",(0,r.kt)("code",null,"target")," is less than ",(0,r.kt)("code",null,"150")," combinations for the given input."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Refer Code for Algorithm."),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mn",{parentName:"msup"},"2")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    int target;\n    vector<int> comb;\n    vector<int> arr;\n    vector<vector<int>> ans;\n    int sm, n;\n\n   public:\n    void find(int indx) {\n        if (sm == target) {\n            ans.push_back(arr);\n            return;\n        }\n        if (sm > target || indx >= n) return;\n        find(indx + 1);\n\n        for (int i = 1; i <= target / comb[indx]; i++) {\n            arr.push_back(comb[indx]);\n            sm += comb[indx];\n            find(indx + 1);\n        }\n\n        for (int i = 1; i <= target / comb[indx]; i++) {\n            arr.pop_back();\n            sm -= comb[indx];\n        }\n    }\n\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        this->comb = candidates;\n        this->target = target;\n        this->n = candidates.size();\n        this->sm = 0;\n        find(0);\n        return ans;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);