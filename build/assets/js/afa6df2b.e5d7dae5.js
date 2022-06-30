"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[3494],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),m=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},c=function(e){var t=m(e.components);return r.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=m(a),d=n,b=u["".concat(i,".").concat(d)]||u[d]||p[d]||l;return a?r.createElement(b,o(o({ref:t},c),{},{components:a})):r.createElement(b,o({ref:t},c))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,o=new Array(l);o[0]=u;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var m=2;m<l;m++)o[m]=a[m];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>n});var r=a(7294);const n=function(e){let{children:t,hidden:a,className:n}=e;return r.createElement("div",{role:"tabpanel",hidden:a,className:n},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>c});var r=a(7462),n=a(7294),l=a(2389),o=a(5773),s=a(6010);const i="tabItem_LplD";function m(e){var t,a,l;const{lazy:m,block:c,defaultValue:p,values:u,groupId:d,className:b}=e,h=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=u?u:h.map((e=>{let{props:{value:t,label:a,attributes:r}}=e;return{value:t,label:a,attributes:r}})),f=(0,o.lx)(v,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const k=null===p?p:null!=(t=null!=p?p:null==(a=h.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(l=h[0])?void 0:l.props.value;if(null!==k&&!v.some((e=>e.value===k)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:N}=(0,o.UB)(),[S,g]=(0,n.useState)(k),w=[],{blockElementScrollPositionUntilNextRender:E}=(0,o.o5)();if(null!=d){const e=y[d];null!=e&&e!==S&&v.some((t=>t.value===e))&&g(e)}const O=e=>{const t=e.currentTarget,a=w.indexOf(t),r=v[a].value;r!==S&&(E(t),g(r),null!=d&&N(d,r))},D=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;a=w[t]||w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;a=w[t]||w[w.length-1];break}}null==(t=a)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":c},b)},v.map((e=>{let{value:t,label:a,attributes:l}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:e=>w.push(e),onKeyDown:D,onFocus:O,onClick:O},l,{className:(0,s.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":S===t})}),null!=a?a:t)}))),m?(0,n.cloneElement)(h.filter((e=>e.props.value===S))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==S})))))}function c(e){const t=(0,l.Z)();return n.createElement(m,(0,r.Z)({key:String(t)},e))}},5452:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>s,contentTitle:()=>i,metadata:()=>m,toc:()=>c,default:()=>u});var r=a(7462),n=(a(7294),a(3905)),l=a(9877),o=a(8215);const s={sidebar_position:1,tags:["Stack","Array"]},i="Nearest Smaller Element",m={unversionedId:"Problems/StriverSDESheet/Day14/Nearest Smaller Element",id:"Problems/StriverSDESheet/Day14/Nearest Smaller Element",title:"Nearest Smaller Element",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day14/Nearest Smaller Element.md",sourceDirName:"Problems/StriverSDESheet/Day14",slug:"/Problems/StriverSDESheet/Day14/Nearest Smaller Element",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day14/Nearest Smaller Element",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day14/Nearest Smaller Element.md",tags:[{label:"Stack",permalink:"/CodePrime/docs/tags/stack"},{label:"Array",permalink:"/CodePrime/docs/tags/array"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Stack","Array"]},sidebar:"api",previous:{title:"Sort a Stack",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day13/Sort a Stack"},next:{title:"LRU Cache",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day14/LRU Cache"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:c};function u(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"nearest-smaller-element"},"Nearest Smaller Element"),(0,n.kt)("h2",{id:"problem-link"},"Problem Link"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://www.interviewbit.com/problems/nearest-smaller-element/"},"https://www.interviewbit.com/problems/nearest-smaller-element/")),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Use stack to find the previous smaller element."),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("mi",{parentName:"mrow"},"n"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"vector<int> Solution::prevSmaller(vector<int> &A) {\n    int n = A.size();\n    stack<int> st;\n    st.push(-1);\n    vector<int> ans(n);\n    for (int i = 0; i < n; i++) {\n        while (st.top() >= A[i]) st.pop();\n        ans[i] = st.top();\n        st.push(A[i]);\n    }\n    return ans;\n}\n"))))))}u.isMDXComponent=!0}}]);