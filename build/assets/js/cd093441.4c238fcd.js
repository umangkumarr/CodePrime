"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7235],{3905:(e,a,t)=>{t.d(a,{Zo:()=>o,kt:()=>N});var n=t(7294);function s(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function r(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function m(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?r(Object(t),!0).forEach((function(a){s(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function p(e,a){if(null==e)return{};var t,n,s=function(e,a){if(null==e)return{};var t,n,s={},r=Object.keys(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||(s[t]=e[t]);return s}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)t=r[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var l=n.createContext({}),i=function(e){var a=n.useContext(l),t=a;return e&&(t="function"==typeof e?e(a):m(m({},a),e)),t},o=function(e){var a=i(e.components);return n.createElement(l.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},u=n.forwardRef((function(e,a){var t=e.components,s=e.mdxType,r=e.originalType,l=e.parentName,o=p(e,["components","mdxType","originalType","parentName"]),u=i(t),N=s,k=u["".concat(l,".").concat(N)]||u[N]||c[N]||r;return t?n.createElement(k,m(m({ref:a},o),{},{components:t})):n.createElement(k,m({ref:a},o))}));function N(e,a){var t=arguments,s=a&&a.mdxType;if("string"==typeof e||s){var r=t.length,m=new Array(r);m[0]=u;var p={};for(var l in a)hasOwnProperty.call(a,l)&&(p[l]=a[l]);p.originalType=e,p.mdxType="string"==typeof e?e:s,m[1]=p;for(var i=2;i<r;i++)m[i]=t[i];return n.createElement.apply(null,m)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},5162:(e,a,t)=>{t.d(a,{Z:()=>m});var n=t(7294),s=t(4334);const r="tabItem_Ymn6";function m(e){let{children:a,hidden:t,className:m}=e;return n.createElement("div",{role:"tabpanel",className:(0,s.Z)(r,m),hidden:t},a)}},5488:(e,a,t)=>{t.d(a,{Z:()=>N});var n=t(3117),s=t(7294),r=t(4334),m=t(2389),p=t(7392),l=t(7094),i=t(2466);const o="tabList__CuJ",c="tabItem_LNqP";function u(e){var a,t;const{lazy:m,block:u,defaultValue:N,values:k,groupId:h,className:d}=e,g=s.Children.map(e.children,(e=>{if((0,s.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=k?k:g.map((e=>{let{props:{value:a,label:t,attributes:n}}=e;return{value:a,label:t,attributes:n}})),y=(0,p.l)(b,((e,a)=>e.value===a.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const v=null===N?N:null!=(a=null!=N?N:null==(t=g.find((e=>e.props.default)))?void 0:t.props.value)?a:g[0].props.value;if(null!==v&&!b.some((e=>e.value===v)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+b.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:f,setTabGroupChoices:w}=(0,l.U)(),[x,P]=(0,s.useState)(v),E=[],{blockElementScrollPositionUntilNextRender:O}=(0,i.o5)();if(null!=h){const e=f[h];null!=e&&e!==x&&b.some((a=>a.value===e))&&P(e)}const M=e=>{const a=e.currentTarget,t=E.indexOf(a),n=b[t].value;n!==x&&(O(a),P(n),null!=h&&w(h,String(n)))},T=e=>{var a;let t=null;switch(e.key){case"ArrowRight":{var n;const a=E.indexOf(e.currentTarget)+1;t=null!=(n=E[a])?n:E[0];break}case"ArrowLeft":{var s;const a=E.indexOf(e.currentTarget)-1;t=null!=(s=E[a])?s:E[E.length-1];break}}null==(a=t)||a.focus()};return s.createElement("div",{className:(0,r.Z)("tabs-container",o)},s.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":u},d)},b.map((e=>{let{value:a,label:t,attributes:m}=e;return s.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===a?0:-1,"aria-selected":x===a,key:a,ref:e=>E.push(e),onKeyDown:T,onFocus:M,onClick:M},m,{className:(0,r.Z)("tabs__item",c,null==m?void 0:m.className,{"tabs__item--active":x===a})}),null!=t?t:a)}))),m?(0,s.cloneElement)(g.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):s.createElement("div",{className:"margin-top--md"},g.map(((e,a)=>(0,s.cloneElement)(e,{key:a,hidden:e.props.value!==x})))))}function N(e){const a=(0,m.Z)();return s.createElement(u,(0,n.Z)({key:String(a)},e))}},8955:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>o,contentTitle:()=>l,default:()=>N,frontMatter:()=>p,metadata:()=>i,toc:()=>c});var n=t(3117),s=(t(7294),t(3905)),r=t(5488),m=t(5162);const p={sidebar_position:3},l="Inclusive Exclusive Principle",i={unversionedId:"Problems/DSA/Bit Magic/NotSoEasyMath",id:"Problems/DSA/Bit Magic/NotSoEasyMath",title:"Inclusive Exclusive Principle",description:"Problem statement",source:"@site/docs/Problems/DSA/Bit Magic/NotSoEasyMath.md",sourceDirName:"Problems/DSA/Bit Magic",slug:"/Problems/DSA/Bit Magic/NotSoEasyMath",permalink:"/CodePrime/docs/Problems/DSA/Bit Magic/NotSoEasyMath",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/DSA/Bit Magic/NotSoEasyMath.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"DSA",previous:{title:"Longest Consecutive 1s in Binary Representation",permalink:"/CodePrime/docs/Problems/DSA/Bit Magic/Longest_ones_in_binary_representation"},next:{title:"Sets bits from 1 to N",permalink:"/CodePrime/docs/Problems/DSA/Bit Magic/PlayingWithBits"}},o={},c=[{value:"Problem statement",id:"problem-statement",level:2},{value:"Constraints",id:"constraints",level:2},{value:"Solution",id:"solution",level:2}],u={toc:c};function N(e){let{components:a,...t}=e;return(0,s.kt)("wrapper",(0,n.Z)({},u,t,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"inclusive-exclusive-principle"},"Inclusive Exclusive Principle"),(0,s.kt)("h2",{id:"problem-statement"},"Problem statement"),(0,s.kt)("p",null,"After the release of Avengers, Ironman and Thor got into a fight and Ironman challenged Thor to find out the number of numbers between 1 and n which are divisible by any of the prime numbers less than 20. Ironman being great at maths quickly answered the question but then Thor asked him to write a program for it. Ironman however found it quite difficult as he did not wanted to write so many lines of code. He knows that you are smart and can code this up easily. Can you do it?"),(0,s.kt)("h2",{id:"constraints"},"Constraints"),(0,s.kt)("p",null,(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mn",{parentName:"mrow"},"1"),(0,s.kt)("mo",{parentName:"mrow"},"<"),(0,s.kt)("mo",{parentName:"mrow"},"="),(0,s.kt)("mi",{parentName:"mrow"},"t"),(0,s.kt)("mo",{parentName:"mrow"},"<"),(0,s.kt)("mo",{parentName:"mrow"},"="),(0,s.kt)("mn",{parentName:"mrow"},"10")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"1 <= t <= 10")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6835em",verticalAlign:"-0.0391em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"1"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},"<="),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6542em",verticalAlign:"-0.0391em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"t"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},"<="),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6444em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"10")))))),(0,s.kt)("p",null,(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mn",{parentName:"mrow"},"1"),(0,s.kt)("mo",{parentName:"mrow"},"<"),(0,s.kt)("mo",{parentName:"mrow"},"="),(0,s.kt)("mi",{parentName:"mrow"},"n"),(0,s.kt)("mo",{parentName:"mrow"},"<"),(0,s.kt)("mo",{parentName:"mrow"},"="),(0,s.kt)("mn",{parentName:"mrow"},"1"),(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mn",{parentName:"msup"},"0"),(0,s.kt)("mn",{parentName:"msup"},"1"))),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"1 <= n <= 10^1")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6835em",verticalAlign:"-0.0391em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"1"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},"<="),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.5782em",verticalAlign:"-0.0391em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},"<="),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.8141em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"1"),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord"},"0"),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mtight"},"1")))))))))))),(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mrow",{parentName:"msup"}),(0,s.kt)("mn",{parentName:"msup"},"8"))),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"^8")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.8141em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span"}),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mtight"},"8"))))))))))))),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution"),(0,s.kt)("h2",{id:"solution"},"Solution"),(0,s.kt)("p",null,"Use Inclusive and Exclusive Principle to solve the problem."),(0,s.kt)("p",null,(0,s.kt)("em",{parentName:"p"},"Links")," - ",(0,s.kt)("a",{parentName:"p",href:"https://cp-algorithms.com/combinatorics/inclusion-exclusion.html"},"https://cp-algorithms.com/combinatorics/inclusion-exclusion.html")),(0,s.kt)("p",null,"Time complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"O"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("msup",{parentName:"mrow"},(0,s.kt)("mn",{parentName:"msup"},"2"),(0,s.kt)("mn",{parentName:"msup"},"8")),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(2^8)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord"},(0,s.kt)("span",{parentName:"span",className:"mord"},"2"),(0,s.kt)("span",{parentName:"span",className:"msupsub"},(0,s.kt)("span",{parentName:"span",className:"vlist-t"},(0,s.kt)("span",{parentName:"span",className:"vlist-r"},(0,s.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,s.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,s.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,s.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,s.kt)("span",{parentName:"span",className:"mord mtight"},"8")))))))),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)(r.Z,{mdxType:"Tabs"},(0,s.kt)(m.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"#include <iostream>\nusing namespace std;\n#define lli long long int\n\nlli prime[8] = {2, 3, 5, 7, 11, 13, 17, 19};\n\nint main() {\n    int t;\n    cin >> t;\n    while (t--) {\n        lli n;\n        cin >> n;\n        lli ans = 0;\n        for (int i = 1; i < (1 << 8); i++) {\n            int setbit = __builtin_popcount(i);\n            int deno = 1;\n            for (int j = 0; j < 8; j++) {\n                int mask = 1 << j;\n                if (mask & i) {\n                    deno *= prime[j];\n                }\n            }\n            if (setbit & 1) {\n                ans += n / deno;\n            } else {\n                ans -= n / deno;\n            }\n        }\n        cout << ans << '\\n';\n    }\n}\n"))),(0,s.kt)(m.Z,{value:"py",label:"Python",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-py"},"prime = [2, 3, 5, 7, 11, 13, 17, 19]\n\nfor t in range(int(input())):\n    n = int(input())\n    i = 1; ans = 0\n    while i < (1 << 8):\n        setbit = bin(i).count('1')\n        deno = 1\n        for j in range(0, 8):\n            mask = ((1 << j) & i)\n            if mask:\n                deno = deno * prime[j]\n\n        if (setbit & 1):\n            ans += n//deno\n        else:\n            ans -= n//deno\n        i += 1\n\n    print(ans)\n\n"))))))}N.isMDXComponent=!0}}]);