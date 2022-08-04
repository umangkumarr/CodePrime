"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7597],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>d});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var i=n.createContext({}),u=function(e){var t=n.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},c=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=u(a),d=r,h=p["".concat(i,".").concat(d)]||p[d]||m[d]||l;return a?n.createElement(h,o(o({ref:t},c),{},{components:a})):n.createElement(h,o({ref:t},c))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=p;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var u=2;u<l;u++)o[u]=a[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(7294),r=a(4334);const l="tabItem_Ymn6";function o(e){let{children:t,hidden:a,className:o}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(3117),r=a(7294),l=a(4334),o=a(2389),s=a(7392),i=a(7094),u=a(2466);const c="tabList__CuJ",m="tabItem_LNqP";function p(e){var t,a;const{lazy:o,block:p,defaultValue:d,values:h,groupId:b,className:f}=e,y=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=h?h:y.map((e=>{let{props:{value:t,label:a,attributes:n}}=e;return{value:t,label:a,attributes:n}})),N=(0,s.l)(v,((e,t)=>e.value===t.value));if(N.length>0)throw new Error('Docusaurus error: Duplicate values "'+N.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===d?d:null!=(t=null!=d?d:null==(a=y.find((e=>e.props.default)))?void 0:a.props.value)?t:y[0].props.value;if(null!==g&&!v.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:w}=(0,i.U)(),[x,O]=(0,r.useState)(g),E=[],{blockElementScrollPositionUntilNextRender:L}=(0,u.o5)();if(null!=b){const e=k[b];null!=e&&e!==x&&v.some((t=>t.value===e))&&O(e)}const T=e=>{const t=e.currentTarget,a=E.indexOf(t),n=v[a].value;n!==x&&(L(t),O(n),null!=b&&w(b,String(n)))},P=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var n;const t=E.indexOf(e.currentTarget)+1;a=null!=(n=E[t])?n:E[0];break}case"ArrowLeft":{var r;const t=E.indexOf(e.currentTarget)-1;a=null!=(r=E[t])?r:E[E.length-1];break}}null==(t=a)||t.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",c)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},f)},v.map((e=>{let{value:t,label:a,attributes:o}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===t?0:-1,"aria-selected":x===t,key:t,ref:e=>E.push(e),onKeyDown:P,onFocus:T,onClick:T},o,{className:(0,l.Z)("tabs__item",m,null==o?void 0:o.className,{"tabs__item--active":x===t})}),null!=a?a:t)}))),o?(0,r.cloneElement)(y.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},y.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==x})))))}function d(e){const t=(0,o.Z)();return r.createElement(p,(0,n.Z)({key:String(t)},e))}},815:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>u,toc:()=>m});var n=a(3117),r=(a(7294),a(3905)),l=a(5488),o=a(5162);const s={sidebar_position:2,tags:["Queue","Array"]},i="Implement a Queue using array",u={unversionedId:"codes/implement-a-queue-using-array",id:"codes/implement-a-queue-using-array",title:"Implement a Queue using array",description:"Problem",source:"@site/docs/codes/implement-a-queue-using-array.md",sourceDirName:"codes",slug:"/codes/implement-a-queue-using-array",permalink:"/CodePrime/docs/codes/implement-a-queue-using-array",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/implement-a-queue-using-array.md",tags:[{label:"Queue",permalink:"/CodePrime/docs/tags/queue"},{label:"Array",permalink:"/CodePrime/docs/tags/array"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Queue","Array"]},sidebar:"Leetcode",previous:{title:"Stack and Queue",permalink:"/CodePrime/docs/category/stack-and-queue"},next:{title:"Next Greater Element I",permalink:"/CodePrime/docs/codes/next-greater-element-i"}},c={},m=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],p={toc:m};function d(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"implement-a-queue-using-array"},"Implement a Queue using array"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://bit.ly/3HsAmy9"},"Problem")),(0,r.kt)("p",null,"Implement a Queue using array"),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Node {\n   public:\n    int data;\n    Node *next;\n    Node(int data) {\n        this->data = data;\n        this->next = NULL;\n    }\n};\nclass Queue {\n   public:\n    Node *head, *tail;\n    Queue() {\n        head = NULL;\n        tail = NULL;\n    }\n\n    bool isEmpty() { return (head == NULL && tail == NULL); }\n\n    void enqueue(int data) {\n        Node *newNode = new Node(data);\n        if (head == NULL) {\n            head = newNode;\n            tail = newNode;\n        } else {\n            tail->next = newNode;\n            tail = newNode;\n        }\n    }\n\n    int dequeue() {\n        if (head == NULL) return -1;\n        Node *temp = head;\n        head = head->next;\n        if (head == NULL) tail = NULL;\n        int x = temp->data;\n        delete (temp);\n        return x;\n    }\n\n    int front() {\n        if (head == NULL) return -1;\n        return (head->data);\n    }\n};  \n"))))))}d.isMDXComponent=!0}}]);