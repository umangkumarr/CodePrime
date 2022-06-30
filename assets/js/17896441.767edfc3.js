"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[7918],{6237:(e,t,a)=>{a.r(t),a.d(t,{default:()=>F});var n=a(7294),l=a(6010),s=a(7462),i=a(5999),o=a(1750);const r=function(e){const{previous:t,next:a}=e;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,i.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},n.createElement("div",{className:"pagination-nav__item"},t&&n.createElement(o.Z,(0,s.Z)({},t,{subLabel:n.createElement(i.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")}))),n.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},a&&n.createElement(o.Z,(0,s.Z)({},a,{subLabel:n.createElement(i.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next")}))))};var c=a(2263),d=a(9960),m=a(5551),u=a(5773);const v={unreleased:function(e){let{siteTitle:t,versionMetadata:a}=e;return n.createElement(i.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){let{siteTitle:t,versionMetadata:a}=e;return n.createElement(i.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:n.createElement("b",null,a.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function h(e){const t=v[e.versionMetadata.banner];return n.createElement(t,e)}function g(e){let{versionLabel:t,to:a,onClick:l}=e;return n.createElement(i.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:n.createElement("b",null,n.createElement(d.Z,{to:a,onClick:l},n.createElement(i.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function p(e){let{className:t,versionMetadata:a}=e;const{siteConfig:{title:s}}=(0,c.Z)(),{pluginId:i}=(0,m.useActivePlugin)({failfast:!0}),{savePreferredVersionName:o}=(0,u.J)(i),{latestDocSuggestion:r,latestVersionSuggestion:d}=(0,m.useDocVersionSuggestions)(i),v=null!=r?r:(p=d).docs.find((e=>e.id===p.mainDocId));var p;return n.createElement("div",{className:(0,l.Z)(t,u.kM.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},n.createElement("div",null,n.createElement(h,{siteTitle:s,versionMetadata:a})),n.createElement("div",{className:"margin-top--md"},n.createElement(g,{versionLabel:d.label,to:v.path,onClick:()=>o(d.name)})))}function E(e){let{className:t}=e;const a=(0,u.E6)();return a.banner?n.createElement(p,{className:t,versionMetadata:a}):null}function b(e){let{className:t}=e;const a=(0,u.E6)();return a.badge?n.createElement("span",{className:(0,l.Z)(t,u.kM.docs.docVersionBadge,"badge badge--secondary")},"Version: ",a.label):null}var f=a(1217);function N(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:a}=e;return n.createElement(i.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:n.createElement("b",null,n.createElement("time",{dateTime:new Date(1e3*t).toISOString()},a))}}," on {date}")}function Z(e){let{lastUpdatedBy:t}=e;return n.createElement(i.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:n.createElement("b",null,t)}}," by {user}")}function k(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:a,lastUpdatedBy:l}=e;return n.createElement("span",{className:u.kM.common.lastUpdated},n.createElement(i.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&a?n.createElement(N,{lastUpdatedAt:t,formattedLastUpdatedAt:a}):"",byUser:l?n.createElement(Z,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}var _=a(6753),L=a(62);const U="lastUpdated_foO9";function T(e){return n.createElement("div",{className:(0,l.Z)(u.kM.docs.docFooterTagsRow,"row margin-bottom--sm")},n.createElement("div",{className:"col"},n.createElement(L.Z,e)))}function C(e){let{editUrl:t,lastUpdatedAt:a,lastUpdatedBy:s,formattedLastUpdatedAt:i}=e;return n.createElement("div",{className:(0,l.Z)(u.kM.docs.docFooterEditMetaRow,"row")},n.createElement("div",{className:"col"},t&&n.createElement(_.Z,{editUrl:t})),n.createElement("div",{className:(0,l.Z)("col",U)},(a||s)&&n.createElement(k,{lastUpdatedAt:a,formattedLastUpdatedAt:i,lastUpdatedBy:s})))}function y(e){const{content:t}=e,{metadata:a}=t,{editUrl:s,lastUpdatedAt:i,formattedLastUpdatedAt:o,lastUpdatedBy:r,tags:c}=a,d=c.length>0,m=!!(s||i||r);return d||m?n.createElement("footer",{className:(0,l.Z)(u.kM.docs.docFooter,"docusaurus-mt-lg")},d&&n.createElement(T,{tags:c}),m&&n.createElement(C,{editUrl:s,lastUpdatedAt:i,lastUpdatedBy:r,formattedLastUpdatedAt:o})):null}var M=a(1575);const w="tocCollapsible_jdIR",A="tocCollapsibleButton_Fzxq",x="tocCollapsibleContent_MpvI",H="tocCollapsibleExpanded_laf4";var D=a(5002);function V(e){let{toc:t,className:a,minHeadingLevel:s,maxHeadingLevel:o}=e;const{collapsed:r,toggleCollapsed:c}=(0,u.uR)({initialState:!0});return n.createElement("div",{className:(0,l.Z)(w,{[H]:!r},a)},n.createElement("button",{type:"button",className:(0,l.Z)("clean-btn",A),onClick:c},n.createElement(i.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page")),n.createElement(u.zF,{lazy:!0,className:x,collapsed:r},n.createElement(D.Z,{toc:t,minHeadingLevel:s,maxHeadingLevel:o})))}var B=a(9649);const S="docItemContainer_vinB",I="docItemCol_DM6M",O="tocMobile_TmEX";function F(e){const{content:t}=e,{metadata:a,frontMatter:s}=t,{image:i,keywords:o,hide_title:c,hide_table_of_contents:d,toc_min_heading_level:m,toc_max_heading_level:v}=s,{description:h,title:g}=a,p=!c&&void 0===t.contentTitle,N=(0,u.iP)(),Z=!d&&t.toc&&t.toc.length>0,k=Z&&("desktop"===N||"ssr"===N);return n.createElement(n.Fragment,null,n.createElement(f.Z,{title:g,description:h,keywords:o,image:i}),n.createElement("div",{className:"row"},n.createElement("div",{className:(0,l.Z)("col",{[I]:!d})},n.createElement(E,null),n.createElement("div",{className:S},n.createElement("article",null,n.createElement(b,null),Z&&n.createElement(V,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:v,className:(0,l.Z)(u.kM.docs.docTocMobile,O)}),n.createElement("div",{className:(0,l.Z)(u.kM.docs.docMarkdown,"markdown")},p&&n.createElement("header",null,n.createElement(B.Z,{as:"h1"},g)),n.createElement(t,null)),n.createElement(y,e)),n.createElement(r,{previous:a.previous,next:a.next}))),k&&n.createElement("div",{className:"col col--3"},n.createElement(M.Z,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:v,className:u.kM.docs.docTocDesktop}))))}},6753:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(7294),l=a(5999),s=a(7462),i=a(6010);const o="iconEdit_dcUD";const r=function(e){let{className:t,...a}=e;return n.createElement("svg",(0,s.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,i.Z)(o,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))};var c=a(5773);function d(e){let{editUrl:t}=e;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:c.kM.common.editThisPage},n.createElement(r,null),n.createElement(l.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},9649:(e,t,a)=>{a.d(t,{Z:()=>m});var n=a(7462),l=a(7294),s=a(6010),i=a(5999),o=a(5773);const r="anchorWithStickyNavbar_mojV",c="anchorWithHideOnScrollNavbar_R0VQ";function d(e){let{as:t,id:a,...d}=e;const{navbar:{hideOnScroll:m}}=(0,o.LU)();return a?l.createElement(t,(0,n.Z)({},d,{className:(0,s.Z)("anchor",{[c]:m,[r]:!m}),id:a}),d.children,l.createElement("a",{className:"hash-link",href:"#"+a,title:(0,i.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):l.createElement(t,d)}function m(e){let{as:t,...a}=e;return"h1"===t?l.createElement("h1",(0,n.Z)({},a,{id:void 0}),a.children):l.createElement(d,(0,n.Z)({as:t},a))}},1750:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7294),l=a(9960);const s=function(e){const{permalink:t,title:a,subLabel:s}=e;return n.createElement(l.Z,{className:"pagination-nav__link",to:t},s&&n.createElement("div",{className:"pagination-nav__sublabel"},s),n.createElement("div",{className:"pagination-nav__label"},a))}},1575:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7462),l=a(7294),s=a(6010),i=a(5002);const o="tableOfContents_cNA8";const r=function(e){let{className:t,...a}=e;return l.createElement("div",{className:(0,s.Z)(o,"thin-scrollbar",t)},l.createElement(i.Z,(0,n.Z)({},a,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},5002:(e,t,a)=>{a.d(t,{Z:()=>o});var n=a(7462),l=a(7294),s=a(5773);function i(e){let{toc:t,className:a,linkClassName:n,isChild:s}=e;return t.length?l.createElement("ul",{className:s?void 0:a},t.map((e=>l.createElement("li",{key:e.id},l.createElement("a",{href:"#"+e.id,className:null!=n?n:void 0,dangerouslySetInnerHTML:{__html:e.value}}),l.createElement(i,{isChild:!0,toc:e.children,className:a,linkClassName:n}))))):null}function o(e){let{toc:t,className:a="table-of-contents table-of-contents__left-border",linkClassName:o="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:c,maxHeadingLevel:d,...m}=e;const u=(0,s.LU)(),v=null!=c?c:u.tableOfContents.minHeadingLevel,h=null!=d?d:u.tableOfContents.maxHeadingLevel,g=(0,s.DA)({toc:t,minHeadingLevel:v,maxHeadingLevel:h}),p=(0,l.useMemo)((()=>{if(o&&r)return{linkClassName:o,linkActiveClassName:r,minHeadingLevel:v,maxHeadingLevel:h}}),[o,r,v,h]);return(0,s.Si)(p),l.createElement(i,(0,n.Z)({toc:g,className:a,linkClassName:o},m))}},7774:(e,t,a)=>{a.d(t,{Z:()=>c});var n=a(7294),l=a(6010),s=a(9960);const i="tag_hD8n",o="tagRegular_D6E_",r="tagWithCount_i0QQ";const c=function(e){const{permalink:t,name:a,count:c}=e;return n.createElement(s.Z,{href:t,className:(0,l.Z)(i,{[o]:!c,[r]:c})},a,c&&n.createElement("span",null,c))}},62:(e,t,a)=>{a.d(t,{Z:()=>c});var n=a(7294),l=a(6010),s=a(5999),i=a(7774);const o="tags_XVD_",r="tag_JSN8";function c(e){let{tags:t}=e;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(s.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,l.Z)(o,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:a}=e;return n.createElement("li",{key:a,className:r},n.createElement(i.Z,{name:t,permalink:a}))}))))}}}]);