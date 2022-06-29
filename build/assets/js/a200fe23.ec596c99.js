"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4660],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=a.createContext({}),s=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=s(e.components);return a.createElement(u.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,u=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),p=s(n),d=r,f=p["".concat(u,".").concat(d)]||p[d]||c[d]||l;return n?a.createElement(f,o(o({ref:t},m),{},{components:n})):a.createElement(f,o({ref:t},m))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=p;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return m}});var a=n(7462),r=n(7294),l=n(2389),o=n(9548),i=n(6010),u="tabItem_LplD";function s(e){var t,n,l,s=e.lazy,m=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,o.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===c?c:null!=(t=null!=c?c:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(l=h[0])?void 0:l.props.value;if(null!==y&&!v.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,o.UB)(),N=k.tabGroupChoices,g=k.setTabGroupChoices,w=(0,r.useState)(y),S=w[0],E=w[1],O=[],x=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var D=N[d];null!=D&&D!==S&&v.some((function(e){return e.value===D}))&&E(D)}var P=function(e){var t=e.currentTarget,n=O.indexOf(t),a=v[n].value;a!==S&&(x(t),E(a),null!=d&&g(d,a))},L=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=O.indexOf(e.currentTarget)+1;n=O[a]||O[0];break;case"ArrowLeft":var r=O.indexOf(e.currentTarget)-1;n=O[r]||O[O.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":m},f)},v.map((function(e){var t=e.value,n=e.label,l=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:S===t?0:-1,"aria-selected":S===t,key:t,ref:function(e){return O.push(e)},onKeyDown:L,onFocus:P,onClick:P},l,{className:(0,i.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":S===t})}),null!=n?n:t)}))),s?(0,r.cloneElement)(h.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==S})}))))}function m(e){var t=(0,l.Z)();return r.createElement(s,(0,a.Z)({key:String(t)},e))}},818:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return m},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),o=n(9877),i=n(8215),u=["components"],s={sidebar_position:2,tags:["Queue","Array"]},m="Implement a Queue using array",c={unversionedId:"Problems/StriverSDESheet/Day13/Implement a Queue",id:"Problems/StriverSDESheet/Day13/Implement a Queue",title:"Implement a Queue using array",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day13/Implement a Queue.md",sourceDirName:"Problems/StriverSDESheet/Day13",slug:"/Problems/StriverSDESheet/Day13/Implement a Queue",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day13/Implement a Queue",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day13/Implement a Queue.md",tags:[{label:"Queue",permalink:"/CodePrime/docs/tags/queue"},{label:"Array",permalink:"/CodePrime/docs/tags/array"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Queue","Array"]},sidebar:"api",previous:{title:"Implement Stack Using Arrays",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day13/Implement Stack Using Arrays"},next:{title:"Implement Stack using Queues",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day13/Implement Stack using Queues"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var t=e.components,n=(0,r.Z)(e,u);return(0,l.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"implement-a-queue-using-array"},"Implement a Queue using array"),(0,l.kt)("h2",{id:"problem-link"},"Problem Link"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://bit.ly/3HsAmy9"},"https://bit.ly/3HsAmy9")),(0,l.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,l.kt)("p",null,"Expected Time complexity: ",(0,l.kt)("span",{parentName:"p",className:"math math-inline"},(0,l.kt)("span",{parentName:"span",className:"katex"},(0,l.kt)("span",{parentName:"span",className:"katex-mathml"},(0,l.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,l.kt)("semantics",{parentName:"math"},(0,l.kt)("mrow",{parentName:"semantics"},(0,l.kt)("mi",{parentName:"mrow"},"O"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,l.kt)("mi",{parentName:"mrow"},"n"),(0,l.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,l.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,l.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,l.kt)("span",{parentName:"span",className:"base"},(0,l.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,l.kt)("span",{parentName:"span",className:"mopen"},"("),(0,l.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,l.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,l.kt)("details",null,(0,l.kt)("summary",null,"Click - to see solution code"),(0,l.kt)(o.Z,{mdxType:"Tabs"},(0,l.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-cpp"},"class Node {\n   public:\n    int data;\n    Node *next;\n    Node(int data) {\n        this->data = data;\n        this->next = NULL;\n    }\n};\nclass Queue {\n   public:\n    Node *head, *tail;\n    Queue() {\n        head = NULL;\n        tail = NULL;\n    }\n\n    bool isEmpty() { return (head == NULL && tail == NULL); }\n\n    void enqueue(int data) {\n        Node *newNode = new Node(data);\n        if (head == NULL) {\n            head = newNode;\n            tail = newNode;\n        } else {\n            tail->next = newNode;\n            tail = newNode;\n        }\n    }\n\n    int dequeue() {\n        if (head == NULL) return -1;\n        Node *temp = head;\n        head = head->next;\n        if (head == NULL) tail = NULL;\n        int x = temp->data;\n        delete (temp);\n        return x;\n    }\n\n    int front() {\n        if (head == NULL) return -1;\n        return (head->data);\n    }\n};  \n"))))))}f.isMDXComponent=!0}}]);