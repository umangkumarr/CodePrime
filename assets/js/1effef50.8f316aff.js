"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[6536],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return d}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),m=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=m(e.components);return r.createElement(l.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=m(t),d=a,f=p["".concat(l,".").concat(d)]||p[d]||c[d]||o;return t?r.createElement(f,i(i({ref:n},u),{},{components:t})):r.createElement(f,i({ref:n},u))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=p;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var m=2;m<o;m++)i[m]=t[m];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},8215:function(e,n,t){var r=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:t,className:a},n)}},9877:function(e,n,t){t.d(n,{Z:function(){return u}});var r=t(7462),a=t(7294),o=t(2389),i=t(9548),s=t(6010),l="tabItem_LplD";function m(e){var n,t,o,m=e.lazy,u=e.block,c=e.defaultValue,p=e.values,d=e.groupId,f=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=p?p:v.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),b=(0,i.lx)(h,(function(e,n){return e.value===n.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===c?c:null!=(n=null!=c?c:null==(t=v.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(o=v[0])?void 0:o.props.value;if(null!==k&&!h.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,i.UB)(),g=y.tabGroupChoices,N=y.setTabGroupChoices,w=(0,a.useState)(k),S=w[0],O=w[1],T=[],P=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=d){var x=g[d];null!=x&&x!==S&&h.some((function(e){return e.value===x}))&&O(x)}var E=function(e){var n=e.currentTarget,t=T.indexOf(n),r=h[t].value;r!==S&&(P(n),O(r),null!=d&&N(d,r))},j=function(e){var n,t=null;switch(e.key){case"ArrowRight":var r=T.indexOf(e.currentTarget)+1;t=T[r]||T[0];break;case"ArrowLeft":var a=T.indexOf(e.currentTarget)-1;t=T[a]||T[T.length-1]}null==(n=t)||n.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},f)},h.map((function(e){var n=e.value,t=e.label,o=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:S===n?0:-1,"aria-selected":S===n,key:n,ref:function(e){return T.push(e)},onKeyDown:j,onFocus:E,onClick:E},o,{className:(0,s.Z)("tabs__item",l,null==o?void 0:o.className,{"tabs__item--active":S===n})}),null!=t?t:n)}))),m?(0,a.cloneElement)(v.filter((function(e){return e.props.value===S}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,n){return(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==S})}))))}function u(e){var n=(0,o.Z)();return a.createElement(m,(0,r.Z)({key:String(n)},e))}},3158:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return m},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),i=t(9877),s=t(8215),l=["components"],m={tags:["Array","Two Pointer","Sorting","Greedy","Amazon"]},u="3 Sum",c={unversionedId:"codes/3Sum",id:"codes/3Sum",title:"3 Sum",description:"Problem Link",source:"@site/docs/codes/3Sum.md",sourceDirName:"codes",slug:"/codes/3Sum",permalink:"/CodePrime/docs/codes/3Sum",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/codes/3Sum.md",tags:[{label:"Array",permalink:"/CodePrime/docs/tags/array"},{label:"Two Pointer",permalink:"/CodePrime/docs/tags/two-pointer"},{label:"Sorting",permalink:"/CodePrime/docs/tags/sorting"},{label:"Greedy",permalink:"/CodePrime/docs/tags/greedy"},{label:"Amazon",permalink:"/CodePrime/docs/tags/amazon"}],version:"current",frontMatter:{tags:["Array","Two Pointer","Sorting","Greedy","Amazon"]},sidebar:"tutorialSidebar",previous:{title:"Serialize and Deserialize Binary Tree",permalink:"/CodePrime/docs/StriverSDESheet/Day21/Serialize and Deserialize Binary Tree"},next:{title:"Best Time to Buy and Sell Stock",permalink:"/CodePrime/docs/codes/BuyandSellStock"}},p=[{value:"Problem Link",id:"problem-link",children:[],level:2},{value:"Solution Approach",id:"solution-approach",children:[],level:2}],d={toc:p};function f(e){var n=e.components,t=(0,a.Z)(e,l);return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"3-sum"},"3 Sum"),(0,o.kt)("h2",{id:"problem-link"},"Problem Link"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/3sum"},"https://leetcode.com/problems/3sum")),(0,o.kt)("h2",{id:"solution-approach"},"Solution Approach"),(0,o.kt)("p",null,"Follow a simple Greedy approach. Find all the possible solutions having all the three elements different, two same and one different element, and all the elements are the same. Store the key in a set of vectors to avoid repetition.\xa0"),(0,o.kt)("p",null,"Expected Time complexity: ",(0,o.kt)("span",{parentName:"p",className:"math math-inline"},(0,o.kt)("span",{parentName:"span",className:"katex"},(0,o.kt)("span",{parentName:"span",className:"katex-mathml"},(0,o.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,o.kt)("semantics",{parentName:"math"},(0,o.kt)("mrow",{parentName:"semantics"},(0,o.kt)("mi",{parentName:"mrow"},"O"),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,o.kt)("msup",{parentName:"mrow"},(0,o.kt)("mi",{parentName:"msup"},"n"),(0,o.kt)("mn",{parentName:"msup"},"2")),(0,o.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,o.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"O(n^2)")))),(0,o.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,o.kt)("span",{parentName:"span",className:"base"},(0,o.kt)("span",{parentName:"span",className:"strut",style:{height:"1.0641em",verticalAlign:"-0.25em"}}),(0,o.kt)("span",{parentName:"span",className:"mord mathnormal",style:{marginRight:"0.02778em"}},"O"),(0,o.kt)("span",{parentName:"span",className:"mopen"},"("),(0,o.kt)("span",{parentName:"span",className:"mord"},(0,o.kt)("span",{parentName:"span",className:"mord mathnormal"},"n"),(0,o.kt)("span",{parentName:"span",className:"msupsub"},(0,o.kt)("span",{parentName:"span",className:"vlist-t"},(0,o.kt)("span",{parentName:"span",className:"vlist-r"},(0,o.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.8141em"}},(0,o.kt)("span",{parentName:"span",style:{top:"-3.063em",marginRight:"0.05em"}},(0,o.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,o.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,o.kt)("span",{parentName:"span",className:"mord mtight"},"2")))))))),(0,o.kt)("span",{parentName:"span",className:"mclose"},")")))))),(0,o.kt)("details",null,(0,o.kt)("summary",null,"Click - to see solution code"),(0,o.kt)(i.Z,{mdxType:"Tabs"},(0,o.kt)(s.Z,{value:"cpp",label:"C++",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cpp"},"class Solution {\n   public:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        int n = nums.size();\n        unordered_map<int, int> mp;\n        for (int i = 0; i < n; i++) {\n            mp[nums[i]]++;\n        }\n\n        vector<int> arr;\n        for (auto i : mp) {\n            arr.push_back(i.first);\n        }\n\n        set<vector<int>> ans;\n        n = arr.size();\n        sort(arr.begin(), arr.end());\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int sm = arr[i] + arr[j];\n                if (-sm != arr[i] && -sm != arr[j] && mp[-sm] > 0) {\n                    vector<int> v = {arr[i], arr[j], -sm};\n                    sort(v.begin(), v.end());\n                    ans.insert(v);\n                }\n            }\n        }\n\n        for (int i = 0; i < n; i++) {\n            int sm = 2 * arr[i];\n            if (sm != arr[i] && mp[arr[i]] > 1 && mp[-2 * arr[i]] > 0) {\n                vector<int> v = {arr[i], arr[i], -sm};\n                sort(v.begin(), v.end());\n                ans.insert(v);\n            }\n        }\n\n        if (mp[0] > 2) {\n            ans.insert({0, 0, 0});\n        }\n        vector<vector<int>> vv;\n        for (auto i : ans) {\n            vv.push_back(i);\n        }\n        return vv;\n    }\n};\n"))))))}f.isMDXComponent=!0}}]);