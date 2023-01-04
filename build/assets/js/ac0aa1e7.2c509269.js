"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7761],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>p});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),m=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},u=function(e){var t=m(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=m(a),p=r,f=d["".concat(s,".").concat(p)]||d[p]||c[p]||o;return a?n.createElement(f,l(l({ref:t},u),{},{components:a})):n.createElement(f,l({ref:t},u))}));function p(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,l=new Array(o);l[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var m=2;m<o;m++)l[m]=a[m];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(7294),r=a(4334);const o="tabItem_Ymn6";function l(e){let{children:t,hidden:a,className:l}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,l),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>p});var n=a(3117),r=a(7294),o=a(4334),l=a(2389),i=a(7392),s=a(7094),m=a(2466);const u="tabList__CuJ",c="tabItem_LNqP";function d(e){var t,a;const{lazy:l,block:d,defaultValue:p,values:f,groupId:h,className:y}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=f?f:b.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),v=(0,i.l)(k,((e,t)=>e.value===t.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===p?p:null!=(t=null!=p?p:null==(a=b.find((e=>e.props.default)))?void 0:a.props.value)?t:b[0].props.value;if(null!==g&&!k.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,s.U)(),[O,x]=(0,r.useState)(g),E=[],{blockElementScrollPositionUntilNextRender:T}=(0,m.o5)();if(null!=h){const e=N[h];null!=e&&e!==O&&k.some((t=>t.value===e))&&x(e)}const P=e=>{const t=e.currentTarget,a=E.indexOf(t),n=k[a].value;n!==O&&(T(t),x(n),null!=h&&w(h,String(n)))},S=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=E.indexOf(e.currentTarget)+1;a=null!=(n=E[t])?n:E[0];break}case"ArrowLeft":{var r;const t=E.indexOf(e.currentTarget)-1;a=null!=(r=E[t])?r:E[E.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",u)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":d},y)},k.map((e=>{let{value:t,label:a,attributes:l}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:O===t?0:-1,"aria-selected":O===t,key:t,ref:e=>E.push(e),onKeyDown:S,onFocus:P,onClick:P},l,{className:(0,o.Z)("tabs__item",c,null==l?void 0:l.className,{"tabs__item--active":O===t})}),null!=a?a:t)}))),l?(0,r.cloneElement)(b.filter((e=>e.props.value===O))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},b.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==O})))))}function p(e){const t=(0,l.Z)();return r.createElement(d,(0,n.Z)({key:String(t)},e))}},27:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>p,frontMatter:()=>i,metadata:()=>m,toc:()=>c});var n=a(3117),r=(a(7294),a(3905)),o=a(5488),l=a(5162);const i={sidebar_position:4,tags:["Array","Binary Search"]},s="Find Minimum in Rotated Sorted Array II",m={unversionedId:"codes/find-minimum-in-rotated-sorted-array-ii",id:"codes/find-minimum-in-rotated-sorted-array-ii",title:"Find Minimum in Rotated Sorted Array II",description:"Problem",source:"@site/docs/codes/find-minimum-in-rotated-sorted-array-ii.md",sourceDirName:"codes",slug:"/codes/find-minimum-in-rotated-sorted-array-ii",permalink:"/CodePrime/docs/codes/find-minimum-in-rotated-sorted-array-ii",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/find-minimum-in-rotated-sorted-array-ii.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Binary Search",permalink:"/CodePrime/docs/tags/binary-search"}],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4,tags:["Array","Binary Search"]},sidebar:"Leetcode",previous:{title:"Find Minimum in Rotated Sorted Array",permalink:"/CodePrime/docs/codes/find-minimum-in-rotated-sorted-array"},next:{title:"Search in Rotated Sorted Array",permalink:"/CodePrime/docs/codes/search-in-rotated-sorted-array"}},u={},c=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],d={toc:c};function p(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"find-minimum-in-rotated-sorted-array-ii"},"Find Minimum in Rotated Sorted Array II"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/"},"Problem")),(0,r.kt)("p",null,"Suppose an array of length ",(0,r.kt)("code",null,"n")," sorted in ascending order is ",(0,r.kt)("strong",null,"rotated")," between ",(0,r.kt)("code",null,"1")," and ",(0,r.kt)("code",null,"n")," times. For example, the array ",(0,r.kt)("code",null,"nums = [0,1,4,4,5,6,7]")," might become:"),(0,r.kt)("ul",null,(0,r.kt)("li",null,(0,r.kt)("code",null,"[4,5,6,7,0,1,4]")," if it was rotated ",(0,r.kt)("code",null,"4")," times."),(0,r.kt)("li",null,(0,r.kt)("code",null,"[0,1,4,4,5,6,7]")," if it was rotated ",(0,r.kt)("code",null,"7")," times.")),(0,r.kt)("p",null,"Notice that ",(0,r.kt)("strong",null,"rotating")," an array ",(0,r.kt)("code",null,"[a[0], a[1], a[2], ..., a[n-1]]")," 1 time results in the array ",(0,r.kt)("code",null,"[a[n-1], a[0], a[1], a[2], ..., a[n-2]]"),"."),(0,r.kt)("p",null,"Given the sorted rotated array ",(0,r.kt)("code",null,"nums")," that may contain ",(0,r.kt)("strong",null,"duplicates"),", return ",(0,r.kt)("em",null,"the minimum element of this array"),"."),(0,r.kt)("p",null,"You must decrease the overall operation steps as much as possible."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time Complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(o.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int start = 0, end = nums.size()-1;\n        while(start < end){\n            int mid = (start + end)/2;\n            if(nums[mid] >= nums[start] && nums[end] < nums[mid]){\n                start = mid + 1;\n            }else if(nums[mid] >= nums[start] && nums[end] == nums[mid]){\n                end -= 1;\n            }else{\n                end = mid;\n            }\n        }\n        return nums[start];\n    }\n};\n"))))))}p.isMDXComponent=!0}}]);