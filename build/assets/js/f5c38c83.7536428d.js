"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1113],{3905:(e,n,a)=>{a.d(n,{Zo:()=>u,kt:()=>d});var t=a(7294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function l(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function o(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?l(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function i(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},l=Object.keys(e);for(t=0;t<l.length;t++)a=l[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)a=l[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=t.createContext({}),m=function(e){var n=t.useContext(s),a=n;return e&&(a="function"==typeof e?e(n):o(o({},n),e)),a},u=function(e){var n=m(e.components);return t.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},c=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=m(a),d=r,b=c["".concat(s,".").concat(d)]||c[d]||p[d]||l;return a?t.createElement(b,o(o({ref:n},u),{},{components:a})):t.createElement(b,o({ref:n},u))}));function d(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=a.length,o=new Array(l);o[0]=c;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var m=2;m<l;m++)o[m]=a[m];return t.createElement.apply(null,o)}return t.createElement.apply(null,a)}c.displayName="MDXCreateElement"},5162:(e,n,a)=>{a.d(n,{Z:()=>o});var t=a(7294),r=a(4334);const l="tabItem_Ymn6";function o(e){let{children:n,hidden:a,className:o}=e;return t.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:a},n)}},5488:(e,n,a)=>{a.d(n,{Z:()=>d});var t=a(3117),r=a(7294),l=a(4334),o=a(2389),i=a(7392),s=a(7094),m=a(2466);const u="tabList__CuJ",p="tabItem_LNqP";function c(e){var n,a;const{lazy:o,block:c,defaultValue:d,values:b,groupId:f,className:h}=e,y=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=b?b:y.map((e=>{let{props:{value:n,label:a,attributes:t}}=e;return{value:n,label:a,attributes:t}})),v=(0,i.l)(k,((e,n)=>e.value===n.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const N=null===d?d:null!=(n=null!=d?d:null==(a=y.find((e=>e.props.default)))?void 0:a.props.value)?n:y[0].props.value;if(null!==N&&!k.some((e=>e.value===N)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+N+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:w}=(0,s.U)(),[x,T]=(0,r.useState)(N),O=[],{blockElementScrollPositionUntilNextRender:P}=(0,m.o5)();if(null!=f){const e=g[f];null!=e&&e!==x&&k.some((n=>n.value===e))&&T(e)}const E=e=>{const n=e.currentTarget,a=O.indexOf(n),t=k[a].value;t!==x&&(P(n),T(t),null!=f&&w(f,String(t)))},C=e=>{var n;let a=null;switch(e.key){case"ArrowRight":{var t;const n=O.indexOf(e.currentTarget)+1;a=null!=(t=O[n])?t:O[0];break}case"ArrowLeft":{var r;const n=O.indexOf(e.currentTarget)-1;a=null!=(r=O[n])?r:O[O.length-1];break}}null==(n=a)||n.focus()};return r.createElement("div",{className:(0,l.Z)("tabs-container",u)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":c},h)},k.map((e=>{let{value:n,label:a,attributes:o}=e;return r.createElement("li",(0,t.Z)({role:"tab",tabIndex:x===n?0:-1,"aria-selected":x===n,key:n,ref:e=>O.push(e),onKeyDown:C,onFocus:E,onClick:E},o,{className:(0,l.Z)("tabs__item",p,null==o?void 0:o.className,{"tabs__item--active":x===n})}),null!=a?a:n)}))),o?(0,r.cloneElement)(y.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},y.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==x})))))}function d(e){const n=(0,o.Z)();return r.createElement(c,(0,t.Z)({key:String(n)},e))}},5645:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>u,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>m,toc:()=>p});var t=a(3117),r=(a(7294),a(3905)),l=a(5488),o=a(5162);const i={sidebar_position:177,tags:["Array","Hash Table","Bit Manipulation","Trie"]},s="Maximum XOR of Two Numbers in an Array",m={unversionedId:"codes/maximum-xor-of-two-numbers-in-an-array",id:"codes/maximum-xor-of-two-numbers-in-an-array",title:"Maximum XOR of Two Numbers in an Array",description:"Problem",source:"@site/docs/codes/maximum-xor-of-two-numbers-in-an-array.md",sourceDirName:"codes",slug:"/codes/maximum-xor-of-two-numbers-in-an-array",permalink:"/CodePrime/docs/codes/maximum-xor-of-two-numbers-in-an-array",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/maximum-xor-of-two-numbers-in-an-array.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Hash Table",permalink:"/CodePrime/docs/tags/hash-table"},{label:"Bit Manipulation",permalink:"/CodePrime/docs/tags/bit-manipulation"},{label:"Trie",permalink:"/CodePrime/docs/tags/trie"}],version:"current",sidebarPosition:177,frontMatter:{sidebar_position:177,tags:["Array","Hash Table","Bit Manipulation","Trie"]},sidebar:"Leetcode",previous:{title:"Subsets",permalink:"/CodePrime/docs/codes/subsets"},next:{title:"Implement Trie (Prefix Tree)",permalink:"/CodePrime/docs/codes/implement-trie-prefix-tree"}},u={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],c={toc:p};function d(e){let{components:n,...a}=e;return(0,r.kt)("wrapper",(0,t.Z)({},c,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"maximum-xor-of-two-numbers-in-an-array"},"Maximum XOR of Two Numbers in an Array"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/"},"Problem")),(0,r.kt)("p",null,"Given an integer array ",(0,r.kt)("code",null,"nums"),", return ",(0,r.kt)("em",null,"the maximum result of "),(0,r.kt)("code",null,"nums[i] XOR nums[j]"),", where ",(0,r.kt)("code",null,"0 <= i <= j < n"),"."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mi",{parentName:"mrow"},"l"),(0,r.kt)("mi",{parentName:"mrow"},"o"),(0,r.kt)("mi",{parentName:"mrow"},"g"),(0,r.kt)("mi",{parentName:"mrow"},"n"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"typedef long long ll;\nll ans = 0;\nclass Node {\n   public:\n    ll data;\n    unordered_map<ll, Node*> children;\n    bool terminal;\n\n    Node(ll d) {\n        data = d;\n        terminal = false;\n    }\n};\nclass Trie {\n    Node* root;\n    ll cnt;\n\n   public:\n    Trie() {\n        root = new Node(0);\n        cnt = 0;\n    }\n\n    void insert(ll w) {\n        Node* temp = root;\n        ll a = w;\n        for (ll i = 30; i >= 0; i--) {\n            ll bit = 1LL << i;\n            bit &= w;\n            ll aa = bit >> i;\n            if (temp->children.count(aa)) {\n                temp = temp->children[aa];\n            } else {\n                Node* n = new Node(aa);\n                temp->children[aa] = n;\n                temp = n;\n            }\n        }\n        temp->terminal = true;\n    }\n\n    void find(ll w) {\n        Node* temp = root;\n        ll ans1 = 0;\n        for (ll i = 30; i >= 0; i--) {\n            ll bit = 1LL << i;\n            bit &= w;\n            ll aa = bit >> i;\n            aa ^= 1LL;\n            if (temp->children.count(aa)) {\n                ans1 += 1LL << i;\n                temp = temp->children[aa];\n            } else {\n                temp = temp->children[aa ^ 1];\n            }\n        }\n        ans = max(ans, ans1);\n        insert(w);\n    }\n};\n\nclass Solution {\n   public:\n    int findMaximumXOR(vector<int>& nums) {\n        Trie t;\n        ll n = nums.size();\n        if (n == 1) {\n            return 0;\n        }\n        ans = 0;\n        t.insert(nums[0]);\n        for (int i = 1; i < n; i++) {\n            t.find(nums[i]);\n        }\n        return (int)ans;\n    }\n};\n\n"))))))}d.isMDXComponent=!0}}]);