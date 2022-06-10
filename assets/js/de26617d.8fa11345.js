"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[4664],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),c=u(n),d=a,v=c["".concat(l,".").concat(d)]||c[d]||p[d]||i;return n?r.createElement(v,o(o({ref:t},m),{},{components:n})):r.createElement(v,o({ref:t},m))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=c;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8215:function(e,t,n){var r=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return m}});var r=n(7462),a=n(7294),i=n(2389),o=n(9548),s=n(6010),l="tabItem_LplD";function u(e){var t,n,i,u=e.lazy,m=e.block,p=e.defaultValue,c=e.values,d=e.groupId,v=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=c?c:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),b=(0,o.lx)(h,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===p?p:null!=(t=null!=p?p:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=f[0])?void 0:i.props.value;if(null!==k&&!h.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,o.UB)(),N=y.tabGroupChoices,g=y.setTabGroupChoices,S=(0,a.useState)(k),w=S[0],E=S[1],O=[],D=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var T=N[d];null!=T&&T!==w&&h.some((function(e){return e.value===T}))&&E(T)}var x=function(e){var t=e.currentTarget,n=O.indexOf(t),r=h[n].value;r!==w&&(D(t),E(r),null!=d&&g(d,r))},j=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=O.indexOf(e.currentTarget)+1;n=O[r]||O[0];break;case"ArrowLeft":var a=O.indexOf(e.currentTarget)-1;n=O[a]||O[O.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":m},v)},h.map((function(e){var t=e.value,n=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,key:t,ref:function(e){return O.push(e)},onKeyDown:j,onFocus:x,onClick:x},i,{className:(0,s.Z)("tabs__item",l,null==i?void 0:i.className,{"tabs__item--active":w===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(f.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function m(e){var t=(0,i.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},7961:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return m},metadata:function(){return p},toc:function(){return c},default:function(){return v}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=n(9877),s=n(8215),l=["components"],u={sidebar_position:3},m="3 Sum",p={unversionedId:"StriverSDESheet/Day7/3Sum",id:"StriverSDESheet/Day7/3Sum",title:"3 Sum",description:"Problem Link",source:"@site/docs/StriverSDESheet/Day7/3Sum.md",sourceDirName:"StriverSDESheet/Day7",slug:"/StriverSDESheet/Day7/3Sum",permalink:"/CodePrime/docs/StriverSDESheet/Day7/3Sum",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/StriverSDESheet/Day7/3Sum.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Copy List with Random Pointer",permalink:"/CodePrime/docs/StriverSDESheet/Day7/Copy List with Random Pointer"},next:{title:"Trapping Rain Water",permalink:"/CodePrime/docs/StriverSDESheet/Day7/Trapping Rain Water"}},c=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:c};function v(e){var t=e.components,n=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"3-sum"},"3 Sum"),(0,i.kt)("h2",{id:"problem-link"},"Problem Link"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/3sum/"},"https://leetcode.com/problems/3sum/")),(0,i.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,i.kt)("p",null,"Follow a simple Greedy approach. Find all the possible solutions having all the three elements different, two same and one different element, and all the elements are the same. Store the key in a set of vectors to avoid repetition.\xa0"),(0,i.kt)("p",null,"Expected Time complexity: ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mi",{parentName:"mrow"},"O"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msup",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msup"},"n"),(0,i.kt)("mn",{parentName:"msup"},"2")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,i.kt)("details",null,(0,i.kt)("summary",null,"Click - to see solution code"),(0,i.kt)(o.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        int n = nums.size();\n        unordered_map<int, int> mp;\n        for (int i = 0; i < n; i++) {\n            mp[nums[i]]++;\n        }\n\n        vector<int> arr;\n        for (auto i : mp) {\n            arr.push_back(i.first);\n        }\n\n        set<vector<int>> ans;\n        n = arr.size();\n        sort(arr.begin(), arr.end());\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int sm = arr[i] + arr[j];\n                if (-sm != arr[i] && -sm != arr[j] && mp[-sm] > 0) {\n                    vector<int> v = {arr[i], arr[j], -sm};\n                    sort(v.begin(), v.end());\n                    ans.insert(v);\n                }\n            }\n        }\n\n        for (int i = 0; i < n; i++) {\n            int sm = 2 * arr[i];\n            if (sm != arr[i] && mp[arr[i]] > 1 && mp[-2 * arr[i]] > 0) {\n                vector<int> v = {arr[i], arr[i], -sm};\n                sort(v.begin(), v.end());\n                ans.insert(v);\n            }\n        }\n\n        if (mp[0] > 2) {\n            ans.insert({0, 0, 0});\n        }\n        vector<vector<int>> vv;\n        for (auto i : ans) {\n            vv.push_back(i);\n        }\n        return vv;\n    }\n};\n"))))))}v.isMDXComponent=!0}}]);