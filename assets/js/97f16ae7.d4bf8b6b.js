"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5931],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=c(a),d=n,h=u["".concat(i,".").concat(d)]||u[d]||m[d]||l;return a?r.createElement(h,s(s({ref:t},p),{},{components:a})):r.createElement(h,s({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,s=new Array(l);s[0]=u;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:n,s[1]=o;for(var c=2;c<l;c++)s[c]=a[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},8215:(e,t,a)=>{a.d(t,{Z:()=>n});var r=a(7294);const n=function(e){let{children:t,hidden:a,className:n}=e;return r.createElement("div",{role:"tabpanel",hidden:a,className:n},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>p});var r=a(7462),n=a(7294),l=a(2389),s=a(5773),o=a(6010);const i="tabItem_LplD";function c(e){var t,a,l;const{lazy:c,block:p,defaultValue:m,values:u,groupId:d,className:h}=e,b=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),k=null!=u?u:b.map((e=>{let{props:{value:t,label:a,attributes:r}}=e;return{value:t,label:a,attributes:r}})),f=(0,s.lx)(k,((e,t)=>e.value===t.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===m?m:null!=(t=null!=m?m:null==(a=b.find((e=>e.props.default)))?void 0:a.props.value)?t:null==(l=b[0])?void 0:l.props.value;if(null!==v&&!k.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+k.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:y,setTabGroupChoices:g}=(0,s.UB)(),[N,w]=(0,n.useState)(v),x=[],{blockElementScrollPositionUntilNextRender:O}=(0,s.o5)();if(null!=d){const e=y[d];null!=e&&e!==N&&k.some((t=>t.value===e))&&w(e)}const j=e=>{const t=e.currentTarget,a=x.indexOf(t),r=k[a].value;r!==N&&(O(t),w(r),null!=d&&g(d,r))},T=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{const t=x.indexOf(e.currentTarget)+1;a=x[t]||x[0];break}case"ArrowLeft":{const t=x.indexOf(e.currentTarget)-1;a=x[t]||x[x.length-1];break}}null==(t=a)||t.focus()};return n.createElement("div",{className:"tabs-container"},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":p},h)},k.map((e=>{let{value:t,label:a,attributes:l}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:e=>x.push(e),onKeyDown:T,onFocus:j,onClick:j},l,{className:(0,o.Z)("tabs__item",i,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=a?a:t)}))),c?(0,n.cloneElement)(b.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):n.createElement("div",{className:"margin-vert--md"},b.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==N})))))}function p(e){const t=(0,l.Z)();return n.createElement(c,(0,r.Z)({key:String(t)},e))}},7852:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>o,contentTitle:()=>i,metadata:()=>c,toc:()=>p,default:()=>u});var r=a(7462),n=(a(7294),a(3905)),l=a(9877),s=a(8215);const o={displayed_sidebar:null,sidebar_position:12,tags:["Array","Backtracking","Matrix"]},i="Word Search",c={unversionedId:"codes/word-search",id:"codes/word-search",title:"Word Search",description:"Problem",source:"@site/docs/codes/word-search.md",sourceDirName:"codes",slug:"/codes/word-search",permalink:"/docs/codes/word-search",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/word-search.md",tags:[{label:"Array",permalink:"/docs/tags/array"},{label:"Backtracking",permalink:"/docs/tags/backtracking"},{label:"Matrix",permalink:"/docs/tags/matrix"}],version:"current",sidebarPosition:12,frontMatter:{displayed_sidebar:null,sidebar_position:12,tags:["Array","Backtracking","Matrix"]}},p=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],m={toc:p};function u(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"word-search"},"Word Search"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/word-search/"},"Problem")),(0,n.kt)("p",null,"Given an ",(0,n.kt)("code",null,"m x n")," grid of characters ",(0,n.kt)("code",null,"board")," and a string ",(0,n.kt)("code",null,"word"),", return ",(0,n.kt)("code",null,"true")," ",(0,n.kt)("em",null,"if")," ",(0,n.kt)("code",null,"word")," ",(0,n.kt)("em",null,"exists in the grid"),"."),(0,n.kt)("p",null,"The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Think of BFS, Backtracking and Dynamic Programming."),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("msup",{parentName:"mrow"},(0,n.kt)("mn",{parentName:"msup"},"2"),(0,n.kt)("mi",{parentName:"msup"},"n")),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(2^n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord"},(0,n.kt)("span",{parentName:"span",className:"mord"},"2"),(0,n.kt)("span",{parentName:"span",className:"msupsub"},(0,n.kt)("span",{parentName:"span",className:"vlist-t"},(0,n.kt)("span",{parentName:"span",className:"vlist-r"},(0,n.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,n.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,n.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,n.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,n.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<vector<char>> board;\n\n   public:\n    bool search(string word, int ix, int i, int j) {\n        if (i >= board.size() || j >= board[0].size()) return false;\n\n        if (ix >= word.length()) return true;\n        if (word[ix] != this->board[i][j]) return false;\n        if (ix == word.length() - 1) return true;\n\n        char ch = board[i][j];\n        board[i][j] = '*';\n\n        int dx[] = {0, 0, 1, -1};\n        int dy[] = {1, -1, 0, 0};\n        for (int k = 0; k < 4; k++)\n            if (search(word, ix + 1, i + dx[k], j + dy[k])) return true;\n\n        board[i][j] = ch;\n\n        return false;\n    }\n\n    bool exist(vector<vector<char>>& board, string word) {\n        int n = board.size();\n        int m = board[0].size();\n        this->board = board;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (search(word, 0, i, j)) return true;\n            }\n        }\n        return false;\n    }\n};\n"))))))}u.isMDXComponent=!0}}]);