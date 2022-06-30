"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9016],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(r),d=o,b=m["".concat(s,".").concat(d)]||m[d]||p[d]||a;return r?n.createElement(b,l(l({ref:t},c),{},{components:r})):n.createElement(b,l({ref:t},c))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var u=2;u<a;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8215:(e,t,r)=>{r.d(t,{Z:()=>o});var n=r(7294);const o=function(e){let{children:t,hidden:r,className:o}=e;return n.createElement("div",{role:"tabpanel",hidden:r,className:o},t)}},9877:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7462),o=r(7294),a=r(2389),l=r(5773),i=r(6010);const s="tabItem_LplD";function u(e){var t,r,a;const{lazy:u,block:c,defaultValue:p,values:m,groupId:d,className:b}=e,h=o.Children.map(e.children,(e=>{if((0,o.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:h.map((e=>{let{props:{value:t,label:r,attributes:n}}=e;return{value:t,label:r,attributes:n}})),y=(0,l.lx)(v,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===p?p:null!=(t=null!=p?p:null==(r=h.find((e=>e.props.default)))?void 0:r.props.value)?t:null==(a=h[0])?void 0:a.props.value;if(null!==f&&!v.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:k}=(0,l.UB)(),[P,S]=(0,o.useState)(f),g=[],{blockElementScrollPositionUntilNextRender:E}=(0,l.o5)();if(null!=d){const e=w[d];null!=e&&e!==P&&v.some((t=>t.value===e))&&S(e)}const D=e=>{const t=e.currentTarget,r=g.indexOf(t),n=v[r].value;n!==P&&(E(t),S(n),null!=d&&k(d,n))},O=e=>{var t;let r=null;switch(e.key){case"ArrowRight":{const t=g.indexOf(e.currentTarget)+1;r=g[t]||g[0];break}case"ArrowLeft":{const t=g.indexOf(e.currentTarget)-1;r=g[t]||g[g.length-1];break}}null==(t=r)||t.focus()};return o.createElement("div",{className:"tabs-container"},o.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},b)},v.map((e=>{let{value:t,label:r,attributes:a}=e;return o.createElement("li",(0,n.Z)({role:"tab",tabIndex:P===t?0:-1,"aria-selected":P===t,key:t,ref:e=>g.push(e),onKeyDown:O,onFocus:D,onClick:D},a,{className:(0,i.Z)("tabs__item",s,null==a?void 0:a.className,{"tabs__item--active":P===t})}),null!=r?r:t)}))),u?(0,o.cloneElement)(h.filter((e=>e.props.value===P))[0],{className:"margin-vert--md"}):o.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,o.cloneElement)(e,{key:t,hidden:e.props.value!==P})))))}function c(e){const t=(0,a.Z)();return o.createElement(u,(0,n.Z)({key:String(t)},e))}},548:(e,t,r)=>{r.r(t),r.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>u,toc:()=>c,default:()=>m});var n=r(7462),o=(r(7294),r(3905)),a=r(9877),l=r(8215);const i={sidebar_position:2},s="Copy List with Random Pointer",u={unversionedId:"Problems/StriverSDESheet/Day7/Copy List with Random Pointer",id:"Problems/StriverSDESheet/Day7/Copy List with Random Pointer",title:"Copy List with Random Pointer",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day7/Copy List with Random Pointer.md",sourceDirName:"Problems/StriverSDESheet/Day7",slug:"/Problems/StriverSDESheet/Day7/Copy List with Random Pointer",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day7/Copy List with Random Pointer",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day7/Copy List with Random Pointer.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"api",previous:{title:"Rotate a LinkedList",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day7/Rotate a LinkedList"},next:{title:"3 Sum",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day7/3Sum"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Code",id:"solution-code",children:[],level:2}],p={toc:c};function m(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"copy-list-with-random-pointer"},"Copy List with Random Pointer"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/copy-list-with-random-pointer/"},"https://leetcode.com/problems/copy-list-with-random-pointer/")),(0,o.kt)("h2",{id:"solution-code"},"Solution Code"),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(a.Z,{mdxType:"Tabs"},(0,o.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    Node* copyRandomList(Node* head) {\n        Node* temp = head;\n        map<Node*, Node*> mp;\n        while (temp) {\n            Node* newNode = new Node(temp->val);\n            mp[temp] = newNode;\n            temp = temp->next;\n        }\n        temp = head;\n        while (temp) {\n            mp[temp]->next = mp[temp->next];\n            mp[temp]->random = mp[temp->random];\n            temp = temp->next;\n        }\n        return mp[head];\n    }\n};\n"))))))}m.isMDXComponent=!0}}]);