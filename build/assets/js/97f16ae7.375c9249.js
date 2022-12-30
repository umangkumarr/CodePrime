"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[5931],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>d});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},m=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),u=c(a),d=n,h=u["".concat(i,".").concat(d)]||u[d]||p[d]||o;return a?r.createElement(h,s(s({ref:t},m),{},{components:a})):r.createElement(h,s({ref:t},m))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,s=new Array(o);s[0]=u;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:n,s[1]=l;for(var c=2;c<o;c++)s[c]=a[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>s});var r=a(7294),n=a(4334);const o="tabItem_Ymn6";function s(e){let{children:t,hidden:a,className:s}=e;return r.createElement("div",{role:"tabpanel",className:(0,n.Z)(o,s),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>d});var r=a(3117),n=a(7294),o=a(4334),s=a(2389),l=a(7392),i=a(7094),c=a(2466);const m="tabList__CuJ",p="tabItem_LNqP";function u(e){var t,a;const{lazy:s,block:u,defaultValue:d,values:h,groupId:b,className:f}=e,k=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=h?h:k.map((e=>{let{props:{value:t,label:a,attributes:r}}=e;return{value:t,label:a,attributes:r}})),g=(0,l.l)(v,((e,t)=>e.value===t.value));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const y=null===d?d:null!=(t=null!=d?d:null==(a=k.find((e=>e.props.default)))?void 0:a.props.value)?t:k[0].props.value;if(null!==y&&!v.some((e=>e.value===y)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:w}=(0,i.U)(),[x,O]=(0,n.useState)(y),j=[],{blockElementScrollPositionUntilNextRender:T}=(0,c.o5)();if(null!=b){const e=N[b];null!=e&&e!==x&&v.some((t=>t.value===e))&&O(e)}const E=e=>{const t=e.currentTarget,a=j.indexOf(t),r=v[a].value;r!==x&&(T(t),O(r),null!=b&&w(b,String(r)))},P=e=>{var t;let a=null;switch(e.key){case"ArrowRight":{var r;const t=j.indexOf(e.currentTarget)+1;a=null!=(r=j[t])?r:j[0];break}case"ArrowLeft":{var n;const t=j.indexOf(e.currentTarget)-1;a=null!=(n=j[t])?n:j[j.length-1];break}}null==(t=a)||t.focus()};return n.createElement("div",{className:(0,o.Z)("tabs-container",m)},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":u},f)},v.map((e=>{let{value:t,label:a,attributes:s}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:x===t?0:-1,"aria-selected":x===t,key:t,ref:e=>j.push(e),onKeyDown:P,onFocus:E,onClick:E},s,{className:(0,o.Z)("tabs__item",p,null==s?void 0:s.className,{"tabs__item--active":x===t})}),null!=a?a:t)}))),s?(0,n.cloneElement)(k.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):n.createElement("div",{className:"margin-top--md"},k.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==x})))))}function d(e){const t=(0,s.Z)();return n.createElement(u,(0,r.Z)({key:String(t)},e))}},7852:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>c,toc:()=>p});var r=a(3117),n=(a(7294),a(3905)),o=a(5488),s=a(5162);const l={sidebar_position:12,tags:["Array","Backtracking","Matrix"]},i="Word Search",c={unversionedId:"codes/word-search",id:"codes/word-search",title:"Word Search",description:"Problem",source:"@site/docs/codes/word-search.md",sourceDirName:"codes",slug:"/codes/word-search",permalink:"/CodePrime/docs/codes/word-search",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/word-search.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"},{label:"Matrix",permalink:"/CodePrime/docs/tags/matrix"}],version:"current",sidebarPosition:12,frontMatter:{sidebar_position:12,tags:["Array","Backtracking","Matrix"]}},m={},p=[{value:"Problem",id:"problem",level:2},{value:"Solution Approach",id:"solution-approach",level:2}],u={toc:p};function d(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"word-search"},"Word Search"),(0,n.kt)("h2",{id:"problem"},(0,n.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/word-search/"},"Problem")),(0,n.kt)("p",null,"Given an ",(0,n.kt)("code",null,"m x n")," grid of characters ",(0,n.kt)("code",null,"board")," and a string ",(0,n.kt)("code",null,"word"),", return ",(0,n.kt)("code",null,"true")," ",(0,n.kt)("em",null,"if")," ",(0,n.kt)("code",null,"word")," ",(0,n.kt)("em",null,"exists in the grid"),"."),(0,n.kt)("p",null,"The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once."),(0,n.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,n.kt)("p",null,"Think of BFS, Backtracking and Dynamic Programming."),(0,n.kt)("p",null,"Expected Time complexity: ",(0,n.kt)("span",{parentName:"p",className:"math math-inline"},(0,n.kt)("span",{parentName:"span",className:"katex"},(0,n.kt)("span",{parentName:"span",className:"katex-mathml"},(0,n.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,n.kt)("semantics",{parentName:"math"},(0,n.kt)("mrow",{parentName:"semantics"},(0,n.kt)("mi",{parentName:"mrow"},"O"),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,n.kt)("msup",{parentName:"mrow"},(0,n.kt)("mn",{parentName:"msup"},"2"),(0,n.kt)("mi",{parentName:"msup"},"n")),(0,n.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,n.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(2^n)")))),(0,n.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,n.kt)("span",{parentName:"span",className:"base"},(0,n.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,n.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,n.kt)("span",{parentName:"span",className:"mopen"},"("),(0,n.kt)("span",{parentName:"span",className:"mord"},(0,n.kt)("span",{parentName:"span",className:"mord"},"2"),(0,n.kt)("span",{parentName:"span",className:"msupsub"},(0,n.kt)("span",{parentName:"span",className:"vlist-t"},(0,n.kt)("span",{parentName:"span",className:"vlist-r"},(0,n.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,n.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,n.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,n.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,n.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,n.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Click - to see solution code"),(0,n.kt)(o.Z,{mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<vector<char>> board;\n\n   public:\n    bool search(string word, int ix, int i, int j) {\n        if (i >= board.size() || j >= board[0].size()) return false;\n\n        if (ix >= word.length()) return true;\n        if (word[ix] != this->board[i][j]) return false;\n        if (ix == word.length() - 1) return true;\n\n        char ch = board[i][j];\n        board[i][j] = '*';\n\n        int dx[] = {0, 0, 1, -1};\n        int dy[] = {1, -1, 0, 0};\n        for (int k = 0; k < 4; k++)\n            if (search(word, ix + 1, i + dx[k], j + dy[k])) return true;\n\n        board[i][j] = ch;\n\n        return false;\n    }\n\n    bool exist(vector<vector<char>>& board, string word) {\n        int n = board.size();\n        int m = board[0].size();\n        this->board = board;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < m; j++) {\n                if (search(word, 0, i, j)) return true;\n            }\n        }\n        return false;\n    }\n};\n"))))))}d.isMDXComponent=!0}}]);