"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[1977],{3905:(e,n,a)=>{a.d(n,{Zo:()=>p,kt:()=>d});var t=a(7294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function s(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function l(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?s(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function o(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},s=Object.keys(e);for(t=0;t<s.length;t++)a=s[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(t=0;t<s.length;t++)a=s[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var m=t.createContext({}),i=function(e){var n=t.useContext(m),a=n;return e&&(a="function"==typeof e?e(n):l(l({},n),e)),a},p=function(e){var n=i(e.components);return t.createElement(m.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},u=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,s=e.originalType,m=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=i(a),d=r,h=u["".concat(m,".").concat(d)]||u[d]||c[d]||s;return a?t.createElement(h,l(l({ref:n},p),{},{components:a})):t.createElement(h,l({ref:n},p))}));function d(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=a.length,l=new Array(s);l[0]=u;var o={};for(var m in n)hasOwnProperty.call(n,m)&&(o[m]=n[m]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var i=2;i<s;i++)l[i]=a[i];return t.createElement.apply(null,l)}return t.createElement.apply(null,a)}u.displayName="MDXCreateElement"},5162:(e,n,a)=>{a.d(n,{Z:()=>l});var t=a(7294),r=a(4334);const s="tabItem_Ymn6";function l(e){let{children:n,hidden:a,className:l}=e;return t.createElement("div",{role:"tabpanel",className:(0,r.Z)(s,l),hidden:a},n)}},5488:(e,n,a)=>{a.d(n,{Z:()=>d});var t=a(3117),r=a(7294),s=a(4334),l=a(2389),o=a(7392),m=a(7094),i=a(2466);const p="tabList__CuJ",c="tabItem_LNqP";function u(e){var n,a;const{lazy:l,block:u,defaultValue:d,values:h,groupId:b,className:f}=e,k=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),N=null!=h?h:k.map((e=>{let{props:{value:n,label:a,attributes:t}}=e;return{value:n,label:a,attributes:t}})),v=(0,o.l)(N,((e,n)=>e.value===n.value));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const g=null===d?d:null!=(n=null!=d?d:null==(a=k.find((e=>e.props.default)))?void 0:a.props.value)?n:k[0].props.value;if(null!==g&&!N.some((e=>e.value===g)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+N.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:w,setTabGroupChoices:y}=(0,m.U)(),[x,P]=(0,r.useState)(g),E=[],{blockElementScrollPositionUntilNextRender:j}=(0,i.o5)();if(null!=b){const e=w[b];null!=e&&e!==x&&N.some((n=>n.value===e))&&P(e)}const O=e=>{const n=e.currentTarget,a=E.indexOf(n),t=N[a].value;t!==x&&(j(n),P(t),null!=b&&y(b,String(t)))},T=e=>{var n;let a=null;switch(e.key){case"ArrowRight":{var t;const n=E.indexOf(e.currentTarget)+1;a=null!=(t=E[n])?t:E[0];break}case"ArrowLeft":{var r;const n=E.indexOf(e.currentTarget)-1;a=null!=(r=E[n])?r:E[E.length-1];break}}null==(n=a)||n.focus()};return r.createElement("div",{className:(0,s.Z)("tabs-container",p)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},f)},N.map((e=>{let{value:n,label:a,attributes:l}=e;return r.createElement("li",(0,t.Z)({role:"tab",tabIndex:x===n?0:-1,"aria-selected":x===n,key:n,ref:e=>E.push(e),onKeyDown:T,onFocus:O,onClick:O},l,{className:(0,s.Z)("tabs__item",c,null==l?void 0:l.className,{"tabs__item--active":x===n})}),null!=a?a:n)}))),l?(0,r.cloneElement)(k.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},k.map(((e,n)=>(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==x})))))}function d(e){const n=(0,l.Z)();return r.createElement(u,(0,t.Z)({key:String(n)},e))}},6404:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>p,contentTitle:()=>m,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var t=a(3117),r=(a(7294),a(3905)),s=a(5488),l=a(5162);const o={displayed_sidebar:null,title:""},m=void 0,i={unversionedId:"Problems/ProjectEuler/239",id:"Problems/ProjectEuler/239",title:"",description:"Twenty-two Foolish Primes",source:"@site/docs/Problems/ProjectEuler/239.md",sourceDirName:"Problems/ProjectEuler",slug:"/Problems/ProjectEuler/239",permalink:"/CodePrime/docs/Problems/ProjectEuler/239",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Problems/ProjectEuler/239.md",tags:[],version:"current",frontMatter:{displayed_sidebar:null,title:""}},p={},c=[{value:"Code",id:"code",level:3}],u={toc:c};function d(e){let{components:n,...a}=e;return(0,r.kt)("wrapper",(0,t.Z)({},u,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("div",{style:{lineHeight:"0px"}}," ",(0,r.kt)("h1",null,"Twenty-two Foolish Primes"),(0,r.kt)("sub",null,"This problem is a programming version of ",(0,r.kt)("a",{href:"https://projecteuler.net/problem=239"},"Problem 239")," from ",(0,r.kt)("a",{href:"https://projecteuler.net/"},"projecteuler.net"))),(0,r.kt)("br",null),(0,r.kt)("br",null),(0,r.kt)("p",null,"This is clearly a ",(0,r.kt)("a",{parentName:"p",href:"https://mathworld.wolfram.com/PartialDerangement.html"},"partial dearrangement")," problem. If ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"a")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"a")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.4306em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"a")))))," is the number of permutation with exactly ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"k")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"k")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6944em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03148em"}},"k")))))," prime number found away from their natural position and ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"b")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"b")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6944em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"b")))))," is the total number of permutation. Then the answer is ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mi",{parentName:"mrow"},"a"),(0,r.kt)("mi",{parentName:"mrow",mathvariant:"normal"},"/"),(0,r.kt)("mi",{parentName:"mrow"},"b")),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"a/b")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"a"),(0,r.kt)("span",{parentName:"span",className:"mord"},"/"),(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"b"))))),". "),(0,r.kt)("h3",{id:"code"},"Code"),(0,r.kt)(s.Z,{mdxType:"Tabs"},(0,r.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-cpp"},'#include <bits/stdc++.h>\n\nusing namespace std;\n\n#define ll long long\nconst ll mod = 1e9 + 123;\n\nvector<ll> primes;\nvector<ll> facts(10000001);\n\n// ------------------ Modular Multiplicative inverse -------------------------\n\nll modularExponent(ll num, ll pow) {\n    num %= mod;\n    ll res = 1ll;\n    while (pow) {\n        ll lb = pow & 1ll;\n        if (lb) {\n            res = (res * num) % mod;\n        }\n        pow >>= 1ll;\n        num *= num;\n        num %= mod;\n    }\n    return res;\n}\n\nll inv(ll v) { return modularExponent(v, mod - 2ll); }\n\n\n// -------- Precomputation of all primes less than the upperbound -------------\n\nvoid preComputation() {\n    bitset<10000000> bt;\n    for (int i = 2; i <= 10000000; i++) {\n        if (!bt[i]) {\n            primes.push_back(i);\n            for (int j = 2 * i; j <= 10000000; j += i) {\n                bt[j] = 1;\n            }\n        }\n    }\n    facts[0] = facts[1] = 1;\n    for (ll i = 2; i <= 10000000; i++) {\n        facts[i] = facts[i - 1] * i;\n        facts[i] %= mod;\n    }\n}\n\nll fact(ll a) { return facts[a]; }\n\n\n// ---------------- Partial Dearrangements ----------\n// this is not optimised\n\nmap<int, int> mp[664581];\n// small improvement in performance by avoiding recalculation of calculated shit\n\nll dearrangements(ll moves, ll dontCare) {\n    if(mp[moves][dontCare] > 0) return mp[moves][dontCare];\n    \n    if (moves <= 0) return fact(dontCare);\n\n    ll ans = (dontCare * dearrangements(moves - 1, dontCare)) % mod;\n    if (moves - 2 >= 0) {\n        ans += ((moves - 1) * dearrangements(moves - 2, dontCare + 1)) % mod;\n    }\n    ans %= mod;\n    return mp[moves][dontCare] = ans;\n}\n\n\n//------------ Combination ---------------\n\nll nCr(ll n, ll r) {\n    ll ans = (fact(n) * inv(fact(n - r))) % mod;\n    ans *= inv(fact(r));\n    ans %= mod;\n    return ans;\n}\n\n\n// --------------- Something important* -----------\n\nvoid solve() {\n    ll n, k;\n    cin >> n >> k;\n    ll tot_primes = upper_bound(primes.begin(), primes.end(), n) - primes.begin();\n\n    ll ans = dearrangements(k, n - tot_primes);\n\n    ans *= nCr(tot_primes, k);\n    ans %= mod;\n    ans *= inv(fact(n));\n    ans %= mod;\n    cout << ans << "\\n";\n}\n\n\n// --------------- main, still not main -----------------\n\nint main() {\n    preComputation();\n\n    ll tc = 1;\n\n    while (tc--) {\n        solve();\n    }\n}\n\n//------ The end, now get your a$$ out of here --------------\n\n// Well, if you can fully optimise this code help other folks like me by contributing to this problem.\n')))))}d.isMDXComponent=!0}}]);