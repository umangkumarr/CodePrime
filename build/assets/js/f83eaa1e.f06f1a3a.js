"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[217],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=a.createContext({}),u=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=u(e.components);return a.createElement(l.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=u(t),d=r,f=c["".concat(l,".").concat(d)]||c[d]||m[d]||s;return t?a.createElement(f,o(o({ref:n},p),{},{components:t})):a.createElement(f,o({ref:n},p))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,o=new Array(s);o[0]=c;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var u=2;u<s;u++)o[u]=t[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},8215:function(e,n,t){var a=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},9877:function(e,n,t){t.d(n,{Z:function(){return p}});var a=t(7462),r=t(7294),s=t(2389),o=t(9548),i=t(6010),l="tabItem_LplD";function u(e){var n,t,s,u=e.lazy,p=e.block,m=e.defaultValue,c=e.values,d=e.groupId,f=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=c?c:h.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),g=(0,o.lx)(v,(function(e,n){return e.value===n.value}));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===m?m:null!=(n=null!=m?m:null==(t=h.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(s=h[0])?void 0:s.props.value;if(null!==k&&!v.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,o.UB)(),N=b.tabGroupChoices,y=b.setTabGroupChoices,w=(0,r.useState)(k),x=w[0],O=w[1],T=[],_=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var E=N[d];null!=E&&E!==x&&v.some((function(e){return e.value===E}))&&O(E)}var C=function(e){var n=e.currentTarget,t=T.indexOf(n),a=v[t].value;a!==x&&(_(n),O(a),null!=d&&y(d,a))},D=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a=T.indexOf(e.currentTarget)+1;t=T[a]||T[0];break;case"ArrowLeft":var r=T.indexOf(e.currentTarget)-1;t=T[r]||T[T.length-1]}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":p},f)},v.map((function(e){var n=e.value,t=e.label,s=e.attributes;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:x===n?0:-1,"aria-selected":x===n,key:n,ref:function(e){return T.push(e)},onKeyDown:D,onFocus:C,onClick:C},s,{className:(0,i.Z)("tabs__item",l,null==s?void 0:s.className,{"tabs__item--active":x===n})}),null!=t?t:n)}))),u?(0,r.cloneElement)(h.filter((function(e){return e.props.value===x}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==x})}))))}function p(e){var n=(0,s.Z)();return r.createElement(u,(0,a.Z)({key:String(n)},e))}},5214:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return p},metadata:function(){return m},toc:function(){return c},default:function(){return f}});var a=t(7462),r=t(3366),s=(t(7294),t(3905)),o=t(9877),i=t(8215),l=["components"],u={sidebar_position:2},p="Length of the Longest Consecutive 1s in Binary Representation",m={unversionedId:"DSA/Bit Magic/Longest_ones_in_binary_representation",id:"DSA/Bit Magic/Longest_ones_in_binary_representation",title:"Length of the Longest Consecutive 1s in Binary Representation",description:"Given a number n, find length of the longest consecutive 1s in its binary representation.",source:"@site/docs/DSA/Bit Magic/Longest_ones_in_binary_representation.md",sourceDirName:"DSA/Bit Magic",slug:"/DSA/Bit Magic/Longest_ones_in_binary_representation",permalink:"/CodePrime/docs/DSA/Bit Magic/Longest_ones_in_binary_representation",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/DSA/Bit Magic/Longest_ones_in_binary_representation.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Prerequisites",permalink:"/CodePrime/docs/DSA/Bit Magic/Prerequisite"},next:{title:"Inclusive Exclusive Principle",permalink:"/CodePrime/docs/DSA/Bit Magic/NotSoEasyMath"}},c=[{value:"Examples :",id:"examples-",children:[],level:2},{value:"Solution:",id:"solution",children:[],level:2},{value:"Output",id:"output",children:[],level:2}],d={toc:c};function f(e){var n=e.components,t=(0,r.Z)(e,l);return(0,s.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("h1",{id:"length-of-the-longest-consecutive-1s-in-binary-representation"},"Length of the Longest Consecutive 1s in Binary Representation"),(0,s.kt)("p",null,"Given a number ",(0,s.kt)("inlineCode",{parentName:"p"},"n"),", find length of the longest consecutive 1s in its binary representation."),(0,s.kt)("h2",{id:"examples-"},"Examples :"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},"Input : n = 14\nOutput : 3\nThe binary representation of 14 is 1110.\n\nInput : n = 222\nOutput : 4\nThe binary representation of 222 is 11011110.\n")),(0,s.kt)("details",null,(0,s.kt)("summary",null,"Click - to see solution"),(0,s.kt)("h2",{id:"solution"},"Solution:"),(0,s.kt)("p",null,"The operation x &= x << 1 reduces length of every sequence of 1s by one in binary representation of x. If we keep doing this operation in a loop, we end up with ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"x"),(0,s.kt)("mo",{parentName:"mrow"},"="),(0,s.kt)("mn",{parentName:"mrow"},"0")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"x = 0")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.4306em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}}),(0,s.kt)("span",{parentName:"span",className:"mrel"},"="),(0,s.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.2778em"}})),(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"0.6444em"}}),(0,s.kt)("span",{parentName:"span",className:"mord"},"0"))))),". The number of iterations required to reach 0 is actually length of the longest consecutive sequence of 1s."),(0,s.kt)("p",null,"Time Complexity: ",(0,s.kt)("span",{parentName:"p",className:"math math-inline"},(0,s.kt)("span",{parentName:"span",className:"katex"},(0,s.kt)("span",{parentName:"span",className:"katex-mathml"},(0,s.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,s.kt)("semantics",{parentName:"math"},(0,s.kt)("mrow",{parentName:"semantics"},(0,s.kt)("mi",{parentName:"mrow"},"l"),(0,s.kt)("mi",{parentName:"mrow"},"o"),(0,s.kt)("mi",{parentName:"mrow"},"g"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,s.kt)("mi",{parentName:"mrow"},"n"),(0,s.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,s.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"log(n)")))),(0,s.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,s.kt)("span",{parentName:"span",className:"base"},(0,s.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,s.kt)("span",{parentName:"span",className:"mopen"},"("),(0,s.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,s.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,s.kt)(o.Z,{mdxType:"Tabs"},(0,s.kt)(i.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-cpp"},"#include <iostream>\nusing namespace std;\n\nint maxConsecutivesOne(int n) {\n    int count = 0;\n    while (n) {\n        n &= (n >> 1);\n        count++;\n    }\n    return count;\n}\n\nint main() {\n    cout << maxConsecutivesOne(221);\n    return 0;\n}\n"))),(0,s.kt)(i.Z,{value:"py",label:"Python",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-py"},"def maxConsecutiveOnes(n):\n    count = 0\n    while n > 0:            # 1101110\n        n &= n << 1         # &11011100\n        count += 1          # -> 10010100 repeat\n    return count\n\nprint(maxConsecutiveOnes(221))\n")))),(0,s.kt)("h2",{id:"output"},"Output"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-txt"},"3\n"))))}f.isMDXComponent=!0}}]);