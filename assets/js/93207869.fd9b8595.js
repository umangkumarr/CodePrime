"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[9519],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return d}});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=a.createContext({}),u=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=u(t),d=r,f=m["".concat(l,".").concat(d)]||m[d]||p[d]||s;return t?a.createElement(f,o(o({ref:n},c),{},{components:t})):a.createElement(f,o({ref:n},c))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,o=new Array(s);o[0]=m;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var u=2;u<s;u++)o[u]=t[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8215:function(e,n,t){var a=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:function(e,n,t){t.d(n,{Z:function(){return c}});var a=t(7462),r=t(7294),s=t(2389),o=t(9548),i=t(6010),l="tabItem_LplD";function u(e){var n,t,s,u=e.lazy,c=e.block,p=e.defaultValue,m=e.values,d=e.groupId,f=e.className,k=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=m?m:k.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),h=(0,o.lx)(v,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===p?p:null!=(n=null!=p?p:null==(t=k.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(s=k[0])?void 0:s.props.value;if(null!==b&&!v.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,o.UB)(),N=y.tabGroupChoices,g=y.setTabGroupChoices,j=(0,r.useState)(b),w=j[0],S=j[1],E=[],P=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var O=N[d];null!=O&&O!==w&&v.some((function(e){return e.value===O}))&&S(O)}var D=function(e){var n=e.currentTarget,t=E.indexOf(n),a=v[t].value;a!==w&&(P(n),S(a),null!=d&&g(d,a))},q=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a=E.indexOf(e.currentTarget)+1;t=E[a]||E[0];break;case"ArrowLeft":var r=E.indexOf(e.currentTarget)-1;t=E[r]||E[E.length-1]}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},f)},v.map((function(e){var n=e.value,t=e.label,s=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:w===n?0:-1,"aria-selected":w===n,key:n,ref:function(e){return E.push(e)},onKeyDown:q,onFocus:D,onClick:D},s,{className:(0,i.Z)("tabs__item",l,null==s?void 0:s.className,{"tabs__item--active":w===n})}),null!=t?t:n)}))),u?(0,r.cloneElement)(k.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},k.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==w})}))))}function c(e){var n=(0,s.Z)();return r.createElement(u,(0,a.Z)({key:String(n)},e))}},6927:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return m},default:function(){return f}});var a=t(7462),r=t(3366),s=(t(7294),t(3905)),o=t(9877),i=t(8215),l=["components"],u={sidebar_position:2,tags:["Array","Backtracking"]},c="N-Queens",p={unversionedId:"Problems/StriverSDESheet/Day10/NQueens",id:"Problems/StriverSDESheet/Day10/NQueens",title:"N-Queens",description:"Problem Link",source:"@site/docs/Problems/StriverSDESheet/Day10/NQueens.md",sourceDirName:"Problems/StriverSDESheet/Day10",slug:"/Problems/StriverSDESheet/Day10/NQueens",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day10/NQueens",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/StriverSDESheet/Day10/NQueens.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Backtracking",permalink:"/CodePrime/docs/tags/backtracking"}],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,tags:["Array","Backtracking"]},sidebar:"api",previous:{title:"Permutations",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day10/Permutations"},next:{title:"Sudoku Solver",permalink:"/CodePrime/docs/Problems/StriverSDESheet/Day10/Sudoku Solver"}},m=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:m};function f(e){var n=e.components,t=(0,r.Z)(e,l);return(0,s.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"n-queens"},"N-Queens"),(0,s.kt)("h2",{id:"problem-link"},"Problem Link"),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/n-queens/"},"https://leetcode.com/problems/n-queens/")),(0,s.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,s.kt)("p",null,"Use Backtracking and find all the possible states of queens on the board and pick the valid one accordingly."),(0,s.kt)("p",null,"Expected Time complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"O"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mi",{parentName:"msup"},"n"),(0,s.kt)("mi",{parentName:"msup"},"n")),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^n)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.6644em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))))))),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution code"),(0,s.kt)(o.Z,{mdxType:"Tabs"},(0,s.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n    vector<vector<string>> ans;\n    vector<string> occup;\n    vector<string> states;\n    int n;\n\n   public:\n    void compute(int queens) {\n        if (queens == n) {\n            ans.push_back(states);\n            return;\n        }\n\n        for (int i = 0; i < n; i++) {\n            if (occup[queens][i] == '0') {\n                for (int j = 0; j < n; j++) {\n                    if (j != i) occup[queens][j] += 1;\n                }\n                for (int j = 0; j < n; j++) {\n                    if (j != queens) occup[j][i] += 1;\n                }\n                int j = i - 1, k = queens - 1;\n                while (j >= 0 && k >= 0) occup[k--][j--] += 1;\n                j = i + 1, k = queens - 1;\n                while (j < n && k >= 0) occup[k--][j++] += 1;\n                j = i - 1, k = queens + 1;\n                while (j >= 0 && k < n) occup[k++][j--] += 1;\n                j = i + 1, k = queens + 1;\n                while (j < n && k < n) occup[k++][j++] += 1;\n                occup[queens][i] += 1;\n                states[queens][i] = 'Q';\n                compute(queens + 1);\n                occup[queens][i] -= 1;\n                states[queens][i] = '.';\n                for (int j = 0; j < n; j++) {\n                    if (j != i) occup[queens][j] -= 1;\n                }\n                for (int j = 0; j < n; j++) {\n                    if (j != queens) occup[j][i] -= 1;\n                }\n                j = i - 1, k = queens - 1;\n                while (j >= 0 && k >= 0) occup[k--][j--] -= 1;\n                j = i + 1, k = queens - 1;\n                while (j < n && k >= 0) occup[k--][j++] -= 1;\n                j = i - 1, k = queens + 1;\n                while (j >= 0 && k < n) occup[k++][j--] -= 1;\n                j = i + 1, k = queens + 1;\n                while (j < n && k < n) occup[k++][j++] -= 1;\n            }\n        }\n    }\n\n    vector<vector<string>> solveNQueens(int n) {\n        this->n = n;\n        states.assign(n, string(n, '.'));\n        occup.assign(n, string(n, '0'));\n        compute(0);\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);