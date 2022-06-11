"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4213],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),m=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=m(e.components);return r.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=m(n),d=a,f=p["".concat(s,".").concat(d)]||p[d]||c[d]||i;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var m=2;m<i;m++)o[m]=n[m];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8215:function(e,t,n){var r=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return u}});var r=n(7462),a=n(7294),i=n(2389),o=n(9548),l=n(6010),s="tabItem_LplD";function m(e){var t,n,i,m=e.lazy,u=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,h=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=p?p:h.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),g=(0,o.lx)(v,(function(e,t){return e.value===t.value}));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var b=null===c?c:null!=(t=null!=c?c:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=h[0])?void 0:i.props.value;if(null!==b&&!v.some((function(e){return e.value===b})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+b+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var k=(0,o.UB)(),y=k.tabGroupChoices,N=k.setTabGroupChoices,S=(0,a.useState)(b),w=S[0],x=S[1],O=[],E=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var M=y[d];null!=M&&M!==w&&v.some((function(e){return e.value===M}))&&x(M)}var D=function(e){var t=e.currentTarget,n=O.indexOf(t),r=v[n].value;r!==w&&(E(t),x(r),null!=d&&N(d,r))},P=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=O.indexOf(e.currentTarget)+1;n=O[r]||O[0];break;case"ArrowLeft":var a=O.indexOf(e.currentTarget)-1;n=O[a]||O[O.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":u},f)},v.map((function(e){var t=e.value,n=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return O.push(e)},onKeyDown:P,onFocus:D,onClick:D},i,{className:(0,l.Z)("tabs__item",s,null==i?void 0:i.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),m?(0,a.cloneElement)(h.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function u(e){var t=(0,i.Z)();return a.createElement(m,(0,r.Z)({key:String(t)},e))}},4871:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return m},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=n(9877),l=n(8215),s=["components"],m={sidebar_position:1,tags:["Greedy","Sorting"]},u="Maximum Meetings",c={unversionedId:"StriverSDESheet/Day8/Maximum Meetings",id:"StriverSDESheet/Day8/Maximum Meetings",title:"Maximum Meetings",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day8/Maximum Meetings.md",sourceDirName:"StriverSDESheet/Day8",slug:"/StriverSDESheet/Day8/Maximum Meetings",permalink:"/CodePrime/docs/StriverSDESheet/Day8/Maximum Meetings",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day8/Maximum Meetings.md",tags:[{label:"Greedy",permalink:"/CodePrime/docs/tags/greedy"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"}],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,tags:["Greedy","Sorting"]},sidebar:"tutorialSidebar",previous:{title:"Max Consecutive Ones",permalink:"/CodePrime/docs/StriverSDESheet/Day7/Max Consecutive Ones"},next:{title:"Minimum Platforms",permalink:"/CodePrime/docs/StriverSDESheet/Day8/Minimum Platforms"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var t=e.components,n=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"maximum-meetings"},"Maximum Meetings"),(0,i.kt)("h2",{id:"problem-link"},"Problem Link"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1"},"https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1")),(0,i.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Sort all pairs(Meetings) in increasing order of second number(Finish time) of each pair."),(0,i.kt)("li",{parentName:"ol"},"Select first meeting of sorted pair as the first Meeting in the room and push it into result vector and set a variable time_limit(say) with the second value(Finishing time) of the first selected meeting."),(0,i.kt)("li",{parentName:"ol"},"Iterate from the second pair to last pair of the array and if the value of the first element(Starting time of meeting) of the current pair is greater then previously selected pair finish time (time_limit) then select the current pair and update the result vector (push selected meeting number into vector) and variable time_limit."),(0,i.kt)("li",{parentName:"ol"},"Print the Order of meeting from vector.")),(0,i.kt)("p",null,"Expected Time complexity: ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mi",{parentName:"mrow"},"O"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("mi",{parentName:"mrow"},"n"),(0,i.kt)("mi",{parentName:"mrow"},"l"),(0,i.kt)("mi",{parentName:"mrow"},"o"),(0,i.kt)("mi",{parentName:"mrow"},"g"),(0,i.kt)("mi",{parentName:"mrow"},"n"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(nlogn)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.01968em"}},"l"),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"o"),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.03588em"}},"g"),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Click - to see solution code"),(0,i.kt)(o.Z,{mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    int maxMeetings(int start[], int end[], int n) {\n        vector<pair<int, int>> v(n);\n        for (int i = 0; i < n; i++) {\n            v[i] = {end[i], start[i]};\n        }\n        sort(v.begin(), v.end());\n        int ans = 1;\n        int j = 0;\n        for (int i = 1; i < n; i++) {\n            if (v[i].second > v[j].first) {\n                ans++;\n                j = i;\n            }\n        }\n        return ans;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);