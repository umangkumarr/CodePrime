"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6351],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>d});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=a.createContext({}),c=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=c(e.components);return a.createElement(i.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(t),d=r,k=m["".concat(i,".").concat(d)]||m[d]||p[d]||s;return t?a.createElement(k,o(o({ref:n},u),{},{components:t})):a.createElement(k,o({ref:n},u))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,o=new Array(s);o[0]=m;var l={};for(var i in n)hasOwnProperty.call(n,i)&&(l[i]=n[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<s;c++)o[c]=t[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294);const r=function(e){let{children:n,hidden:t,className:r}=e;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:(e,n,t)=>{t.d(n,{Z:()=>u});var a=t(7462),r=t(7294),s=t(2389),o=t(5773),l=t(6010);const i="tabItem_LplD";function c(e){var n,t,s;const{lazy:c,block:u,defaultValue:p,values:m,groupId:d,className:k}=e,h=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=m?m:h.map((e=>{let{props:{value:n,label:t,attributes:a}}=e;return{value:n,label:t,attributes:a}})),f=(0,o.lx)(b,((e,n)=>e.value===n.value));if(f.length>0)throw new Error('Docusaurus error: Duplicate values "'+f.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===p?p:null!=(n=null!=p?p:null==(t=h.find((e=>e.props.default)))?void 0:t.props.value)?n:null==(s=h[0])?void 0:s.props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:g,setTabGroupChoices:y}=(0,o.UB)(),[N,j]=(0,r.useState)(v),w=[],{blockElementScrollPositionUntilNextRender:q}=(0,o.o5)();if(null!=d){const e=g[d];null!=e&&e!==N&&b.some((n=>n.value===e))&&j(e)}const O=e=>{const n=e.currentTarget,t=w.indexOf(n),a=b[t].value;a!==N&&(q(n),j(a),null!=d&&y(d,a))},x=e=>{var n;let t=null;switch(e.key){case"ArrowRight":{const n=w.indexOf(e.currentTarget)+1;t=w[n]||w[0];break}case"ArrowLeft":{const n=w.indexOf(e.currentTarget)-1;t=w[n]||w[w.length-1];break}}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},k)},b.map((e=>{let{value:n,label:t,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:N===n?0:-1,"aria-selected":N===n,key:n,ref:e=>w.push(e),onKeyDown:x,onFocus:O,onClick:O},s,{className:(0,l.Z)("tabs__item",i,null==s?void 0:s.className,{"tabs__item--active":N===n})}),null!=t?t:n)}))),c?(0,r.cloneElement)(h.filter((e=>e.props.value===N))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==N})))))}function u(e){const n=(0,s.Z)();return r.createElement(c,(0,a.Z)({key:String(n)},e))}},7074:(e,n,t)=>{t.r(n),t.d(n,{frontMatter:()=>l,contentTitle:()=>i,metadata:()=>c,toc:()=>u,default:()=>m});var a=t(7462),r=(t(7294),t(3905)),s=t(9877),o=t(8215);const l={sidebar_position:58,tags:["Array","Backtracking"]},i="N-Queens",c={unversionedId:"codes/n-queens",id:"codes/n-queens",title:"N-Queens",description:"Problem",source:"@site/docs/codes/n-queens.md",sourceDirName:"codes",slug:"/codes/n-queens",permalink:"/CodePrime/docs/codes/n-queens",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/n-queens.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"}],version:"current",sidebarPosition:58,frontMatter:{sidebar_position:58,tags:["Array","Backtracking"]},sidebar:"main",previous:{title:"Rat in a Maze Problem I",permalink:"/CodePrime/docs/codes/rat-in-a-maze-problemI"},next:{title:"M-Coloring Problem",permalink:"/CodePrime/docs/codes/m-coloring-problem"}},u=[{value:"Problem",id:"problem",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],p={toc:u};function m(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"n-queens"},"N-Queens"),(0,r.kt)("h2",{id:"problem"},(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/n-queens/"},"Problem")),(0,r.kt)("p",null,"The ",(0,r.kt)("strong",null,"n-queens")," puzzle is the problem of placing ",(0,r.kt)("code",null,"n")," queens on an ",(0,r.kt)("code",null,"n x n")," chessboard such that no two queens attack each other."),(0,r.kt)("p",null,"Given an integer ",(0,r.kt)("code",null,"n"),", return ",(0,r.kt)("em",null,"all distinct solutions to the ",(0,r.kt)("strong",null,"n-queens puzzle")),". You may return the answer in ",(0,r.kt)("strong",null,"any order"),"."),(0,r.kt)("p",null,"Each solution contains a distinct board configuration of the n-queens' placement, where ",(0,r.kt)("code",null,"'Q'")," and ",(0,r.kt)("code",null,"'.'")," both indicate a queen and an empty space, respectively."),(0,r.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,r.kt)("p",null,"Use Backtracking and find all the possible states of queens on the board and pick the valid one accordingly."),(0,r.kt)("p",null,"Expected Time complexity: ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"O"),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,r.kt)("msup",{parentName:"mrow"},(0,r.kt)("mi",{parentName:"msup"},"n"),(0,r.kt)("mi",{parentName:"msup"},"n")),(0,r.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^n)")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,r.kt)("span",{parentName:"span",className:"mopen"},"("),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,r.kt)("span",{parentName:"span",className:"msupsub"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,r.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,r.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,r.kt)("details",null,(0,r.kt)("summary",null,"Click - to see solution code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<vector<string>> ans;\n    vector<string> occup;\n    vector<string> states;\n    int n;\n\n   public:\n    void compute(int queens) {\n        if (queens == n) {\n            ans.push_back(states);\n            return;\n        }\n\n        for (int i = 0; i < n; i++) {\n            if (occup[queens][i] == '0') {\n                for (int j = 0; j < n; j++) {\n                    if (j != i) occup[queens][j] += 1;\n                }\n                for (int j = 0; j < n; j++) {\n                    if (j != queens) occup[j][i] += 1;\n                }\n                int j = i - 1, k = queens - 1;\n                while (j >= 0 && k >= 0) occup[k--][j--] += 1;\n                j = i + 1, k = queens - 1;\n                while (j < n && k >= 0) occup[k--][j++] += 1;\n                j = i - 1, k = queens + 1;\n                while (j >= 0 && k < n) occup[k++][j--] += 1;\n                j = i + 1, k = queens + 1;\n                while (j < n && k < n) occup[k++][j++] += 1;\n                occup[queens][i] += 1;\n                states[queens][i] = 'Q';\n                compute(queens + 1);\n                occup[queens][i] -= 1;\n                states[queens][i] = '.';\n                for (int j = 0; j < n; j++) {\n                    if (j != i) occup[queens][j] -= 1;\n                }\n                for (int j = 0; j < n; j++) {\n                    if (j != queens) occup[j][i] -= 1;\n                }\n                j = i - 1, k = queens - 1;\n                while (j >= 0 && k >= 0) occup[k--][j--] -= 1;\n                j = i + 1, k = queens - 1;\n                while (j < n && k >= 0) occup[k--][j++] -= 1;\n                j = i - 1, k = queens + 1;\n                while (j >= 0 && k < n) occup[k++][j--] -= 1;\n                j = i + 1, k = queens + 1;\n                while (j < n && k < n) occup[k++][j++] -= 1;\n            }\n        }\n    }\n\n    vector<vector<string>> solveNQueens(int n) {\n        this->n = n;\n        states.assign(n, string(n, '.'));\n        occup.assign(n, string(n, '0'));\n        compute(0);\n        return ans;\n    }\n};\n\n"))))))}m.isMDXComponent=!0}}]);