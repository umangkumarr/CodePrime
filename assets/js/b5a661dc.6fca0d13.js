"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7859],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(n),d=a,f=u["".concat(s,".").concat(d)]||u[d]||m[d]||l;return n?r.createElement(f,o(o({ref:t},c),{},{components:n})):r.createElement(f,o({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var p=2;p<l;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8215:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);const a=function(e){let{children:t,hidden:n,className:a}=e;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>c});var r=n(7462),a=n(7294),l=n(2389),o=n(5773),i=n(6010);const s="tabItem_LplD";function p(e){var t,n,l;const{lazy:p,block:c,defaultValue:m,values:u,groupId:d,className:f}=e,h=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=u?u:h.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),k=(0,o.lx)(b,((e,t)=>e.value===t.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===m?m:null!=(t=null!=m?m:null==(n=h.find((e=>e.props.default)))?void 0:n.props.value)?t:null==(l=h[0])?void 0:l.props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:w}=(0,o.UB)(),[y,N]=(0,a.useState)(v),T=[],{blockElementScrollPositionUntilNextRender:x}=(0,o.o5)();if(null!=d){const e=g[d];null!=e&&e!==y&&b.some((t=>t.value===e))&&N(e)}const O=e=>{const t=e.currentTarget,n=T.indexOf(t),r=b[n].value;r!==y&&(x(t),N(r),null!=d&&w(d,r))},E=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{const t=T.indexOf(e.currentTarget)+1;n=T[t]||T[0];break}case"ArrowLeft":{const t=T.indexOf(e.currentTarget)-1;n=T[t]||T[T.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},f)},b.map((e=>{let{value:t,label:n,attributes:l}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:y===t?0:-1,"aria-selected":y===t,key:t,ref:e=>T.push(e),onKeyDown:E,onFocus:O,onClick:O},l,{className:(0,i.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":y===t})}),null!=n?n:t)}))),p?(0,a.cloneElement)(h.filter((e=>e.props.value===y))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==y})))))}function c(e){const t=(0,l.Z)();return a.createElement(p,(0,r.Z)({key:String(t)},e))}},1583:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>p,toc:()=>c,default:()=>u});var r=n(7462),a=(n(7294),n(3905)),l=n(9877),o=n(8215);const i={displayed_sidebar:null,sidebar_position:178,tags:["Hash Table","String","Design","Trie"]},s="Implement Trie (Prefix Tree)",p={unversionedId:"codes/implement-trie-prefix-tree",id:"codes/implement-trie-prefix-tree",title:"Implement Trie (Prefix Tree)",description:"Problem",source:"@site/docs/codes/implement-trie-prefix-tree.md",sourceDirName:"codes",slug:"/codes/implement-trie-prefix-tree",permalink:"/docs/codes/implement-trie-prefix-tree",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/implement-trie-prefix-tree.md",tags:[{label:"Hash Table",permalink:"/docs/tags/hash-table"},{label:"String",permalink:"/docs/tags/string"},{label:"Design",permalink:"/docs/tags/design"},{label:"Trie",permalink:"/docs/tags/trie"}],version:"current",sidebarPosition:178,frontMatter:{displayed_sidebar:null,sidebar_position:178,tags:["Hash Table","String","Design","Trie"]}},c=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:c};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"implement-trie-prefix-tree"},"Implement Trie (Prefix Tree)"),(0,a.kt)("h2",{id:"problem"},(0,a.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/implement-trie-prefix-tree/"},"Problem")),(0,a.kt)("p",null,"A ",(0,a.kt)("a",{href:"https://en.wikipedia.org/wiki/Trie",target:"_blank"},(0,a.kt)("strong",null,"trie")),' (pronounced as "try") or ',(0,a.kt)("strong",null,"prefix tree")," is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker."),(0,a.kt)("p",null,"Implement the Trie class:"),(0,a.kt)("ul",null,(0,a.kt)("li",null,(0,a.kt)("code",null,"Trie()")," Initializes the trie object."),(0,a.kt)("li",null,(0,a.kt)("code",null,"void insert(String word)")," Inserts the string ",(0,a.kt)("code",null,"word")," into the trie."),(0,a.kt)("li",null,(0,a.kt)("code",null,"boolean search(String word)")," Returns ",(0,a.kt)("code",null,"true")," if the string ",(0,a.kt)("code",null,"word")," is in the trie (i.e., was inserted before), and ",(0,a.kt)("code",null,"false")," otherwise."),(0,a.kt)("li",null,(0,a.kt)("code",null,"boolean startsWith(String prefix)")," Returns ",(0,a.kt)("code",null,"true")," if there is a previously inserted string ",(0,a.kt)("code",null,"word")," that has the prefix ",(0,a.kt)("code",null,"prefix"),", and ",(0,a.kt)("code",null,"false")," otherwise.")),(0,a.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,a.kt)("p",null,"Expected Time complexity: ",(0,a.kt)("span",{parentName:"p",className:"math math-inline"},(0,a.kt)("span",{parentName:"span",className:"katex"},(0,a.kt)("span",{parentName:"span",className:"katex-mathml"},(0,a.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,a.kt)("semantics",{parentName:"math"},(0,a.kt)("mrow",{parentName:"semantics"},(0,a.kt)("mi",{parentName:"mrow"},"O"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,a.kt)("mi",{parentName:"mrow"},"n"),(0,a.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,a.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n)")))),(0,a.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,a.kt)("span",{parentName:"span",className:"base"},(0,a.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,a.kt)("span",{parentName:"span",className:"mopen"},"("),(0,a.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,a.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,a.kt)("details",null,(0,a.kt)("summary",null,"Click - to see solution code"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-cpp"},"struct Node {\n    unordered_map<char, Node*> mp;\n    char c;\n    bool terminal;\n    Node(char val) {\n        c = val;\n        terminal = false;\n    }\n};\n\nclass Trie {\n   public:\n    Node* root;\n\n    Trie() { root = new Node('*'); }\n\n    void insert(string word) {\n        int n = word.size();\n        Node* temp = root;\n        for (int i = 0; i < n; i++) {\n            if (temp->mp.find(word[i]) == temp->mp.end()) {\n                Node* newNode = new Node(word[i]);\n                temp->mp[word[i]] = newNode;\n                temp = newNode;\n            } else\n                temp = temp->mp[word[i]];\n        }\n        temp->terminal = true;\n    }\n\n    bool search(string word) {\n        Node* temp = root;\n        int n = word.size();\n        for (int i = 0; i < n; i++) {\n            if (temp->mp.find(word[i]) == temp->mp.end()) return false;\n            temp = temp->mp[word[i]];\n        }\n        return temp->terminal;\n    }\n\n    bool startsWith(string word) {\n        Node* temp = root;\n        int n = word.size();\n        for (int i = 0; i < n; i++) {\n            if (temp->mp.find(word[i]) == temp->mp.end()) return false;\n            temp = temp->mp[word[i]];\n        }\n        return true;\n    }\n};\n\n/**\n * Your Trie object will be instantiated and called as such:\n * Trie* obj = new Trie();\n * obj->insert(word);\n * bool param_2 = obj->search(word);\n * bool param_3 = obj->startsWith(prefix);\n */\n\n"))))))}u.isMDXComponent=!0}}]);