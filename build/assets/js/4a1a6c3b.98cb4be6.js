"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9615],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>d});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),m=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=m(e.components);return a.createElement(s.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},p=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=m(t),d=r,h=p["".concat(s,".").concat(d)]||p[d]||c[d]||l;return t?a.createElement(h,o(o({ref:n},u),{},{components:t})):a.createElement(h,o({ref:n},u))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,o=new Array(l);o[0]=p;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var m=2;m<l;m++)o[m]=t[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>u});var a=t(7462),r=t(7294),l=t(2389),o=t(5773),i=t(6010);const s="tabItem_LplD";function m(e){var n,t,l;const{lazy:m,block:u,defaultValue:c,values:p,groupId:d,className:h}=e,b=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:b.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),k=(0,o.lx)(f,((e,n)=>e.value===n.value));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===c?c:null!=(n=null!=c?c:null==(t=b.find((e=>e.props.default)))?void 0:t.props.value)?n:null==(l=b[0])?void 0:l.props.value;if(null!==v&&!f.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:N}=(0,o.UB)(),[g,w]=(0,r.useState)(v),x=[],{blockElementScrollPositionUntilNextRender:O}=(0,o.o5)();if(null!=d){const e=y[d];null!=e&&e!==g&&f.some((n=>n.value===e))&&w(e)}const T=e=>{const n=e.currentTarget,t=x.indexOf(n),a=f[t].value;a!==g&&(O(n),w(a),null!=d&&N(d,a))},j=e=>{var n;let t=null;switch(e.key){case"ArrowRight":{const n=x.indexOf(e.currentTarget)+1;t=x[n]||x[0];break}case"ArrowLeft":{const n=x.indexOf(e.currentTarget)-1;t=x[n]||x[x.length-1];break}}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":u},h)},f.map((e=>{let{value:n,label:t,attributes:l}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:g===n?0:-1,"aria-selected":g===n,key:n,ref:e=>x.push(e),onKeyDown:j,onFocus:T,onClick:T},l,{className:(0,i.Z)("tabs__item",s,null==l?void 0:l.className,{"tabs__item--active":g===n})}),null!=t?t:n)}))),m?(0,r.cloneElement)(b.filter((e=>e.props.value===g))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==g})))))}function u(e){const n=(0,l.Z)();return r.createElement(m,(0,a.Z)({key:String(n)},e))}},5472:(e,n,t)=>{t.r(n),t.d(n,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>m,toc:()=>u,default:()=>p});var a=t(7462),r=(t(7294),t(3905)),l=t(9877),o=t(8215);const i={displayed_sidebar:null,sidebar_position:179,tags:["Array","Bit Manipulation","Trie"]},s="Maximum XOR With an Element From Array",m={unversionedId:"codes/maximum-xor-with-an-element-from-array",id:"codes/maximum-xor-with-an-element-from-array",title:"Maximum XOR With an Element From Array",description:"Problem",source:"@site/docs/codes/maximum-xor-with-an-element-from-array.md",sourceDirName:"codes",slug:"/codes/maximum-xor-with-an-element-from-array",permalink:"/docs/codes/maximum-xor-with-an-element-from-array",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/maximum-xor-with-an-element-from-array.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Bit Manipulation",permalink:"/docs/tags/bit-manipulation"},{label:"Trie",permalink:"/docs/tags/trie"}],version:"current",sidebarPosition:179,frontMatter:{displayed_sidebar:null,sidebar_position:179,tags:["Array","Bit Manipulation","Trie"]}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],c={toc:u};function p(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"maximum-xor-with-an-element-from-array"},"Maximum XOR With an Element From Array"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/maximum-xor-with-an-element-from-array/"},"Problem")),(0,r.kt)("p",null,"You are given an array ",(0,r.kt)("code",null,"nums")," consisting of non-negative integers. You are also given a ",(0,r.kt)("code",null,"queries")," array, where ",(0,r.kt)("code",null,"queries[i] = [xi, mi]"),"."),(0,r.kt)("p",null,"The answer to the ",(0,r.kt)("code",null,"ith")," query is the maximum bitwise ",(0,r.kt)("code",null,"XOR")," value of ",(0,r.kt)("code",null,"xi")," and any element of ",(0,r.kt)("code",null,"nums")," that does not exceed ",(0,r.kt)("code",null,"mi"),". In other words, the answer is ",(0,r.kt)("code",null,"max(nums[j] XOR xi)")," for all ",(0,r.kt)("code",null,"j")," such that ",(0,r.kt)("code",null,"nums[j] <= mi"),". If all elements in ",(0,r.kt)("code",null,"nums")," are larger than ",(0,r.kt)("code",null,"mi"),", then the answer is ",(0,r.kt)("code",null,"-1"),"."),(0,r.kt)("p",null,"Return ",(0,r.kt)("em",null,"an integer array "),(0,r.kt)("code",null,"answer"),(0,r.kt)("em",null," where "),(0,r.kt)("code",null,"answer.length == queries.length"),(0,r.kt)("em",null," and "),(0,r.kt)("code",null,"answer[i]"),(0,r.kt)("em",null," is the answer to the "),(0,r.kt)("code",null,"ith"),(0,r.kt)("em",null," query.")),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"struct Node {\n    vector<Node*> v;\n    int val;\n    Node(int _val) {\n        v = {NULL, NULL};\n        val = _val;\n    }\n};\n\nclass Solution {\n   public:\n    Node* root;\n\n    void insert(int n) {\n        Node* temp = root;\n        int i = 0;\n        for (int i = 30; i >= 0; i--) {\n            int bit = (n & (1 << i));\n            if (temp->v[bit > 0] == NULL) {\n                Node* newNode = new Node(bit > 0);\n                temp->v[bit > 0] = newNode;\n            }\n            temp = temp->v[bit ? 1 : 0];\n        }\n    }\n\n    int query(int n) {\n        Node* temp = root;\n        int ans = 0;\n        for (int i = 30; i >= 0; i--) {\n            int bit = n & (1ll << i);\n            if (temp->v[bit == 0] != NULL) {\n                ans += (1ll << i);\n                temp = temp->v[bit == 0];\n            } else\n                temp = temp->v[bit != 0];\n        }\n        return ans;\n    }\n\n    vector<int> maximizeXor(vector<int>& nums, vector<vector<int>>& queries) {\n        for (int i = 0; i < queries.size(); i++) {\n            queries[i].push_back(i);\n            swap(queries[i][0], queries[i][1]);\n        }\n        sort(queries.begin(), queries.end());\n        sort(nums.begin(), nums.end());\n        root = new Node(0);\n        int i = 0, j = 0;\n        vector<int> ans(queries.size());\n        while (j < queries.size()) {\n            while (i < nums.size() && nums[i] <= queries[j][0]) {\n                insert(nums[i]);\n                i++;\n            }\n\n            if (i == 0) {\n                ans[queries[j][2]] = -1;\n            } else {\n                ans[queries[j][2]] = query(queries[j][1]);\n            }\n            j++;\n        }\n        return ans;\n    }\n};\n\n"))))))}p.isMDXComponent=!0}}]);