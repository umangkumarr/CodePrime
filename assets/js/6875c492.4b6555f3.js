"use strict";(self.webpackChunkcodeprime=self.webpackChunkcodeprime||[]).push([[8610],{8665:function(e,t,a){a.d(t,{Z:function(){return v}});var r=a(3366),l=a(7294),n=a(6010),s=a(2434),i=a(9960),m="sidebar_a9qW",o="sidebarItemTitle_uKok",c="sidebarItemList_Kvuv",u="sidebarItem_CF0Q",g="sidebarItemLink_miNk",d="sidebarItemLinkActive_RRTD",p=a(5999);function h(e){var t=e.sidebar;return 0===t.items.length?null:l.createElement("nav",{className:(0,n.Z)(m,"thin-scrollbar"),"aria-label":(0,p.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,n.Z)(o,"margin-bottom--md")},t.title),l.createElement("ul",{className:c},t.items.map((function(e){return l.createElement("li",{key:e.permalink,className:u},l.createElement(i.Z,{isNavLink:!0,to:e.permalink,className:g,activeClassName:d},e.title))}))))}var E=["sidebar","toc","children"];var v=function(e){var t=e.sidebar,a=e.toc,i=e.children,m=(0,r.Z)(e,E),o=t&&t.items.length>0;return l.createElement(s.Z,m,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},o&&l.createElement("aside",{className:"col col--3"},l.createElement(h,{sidebar:t})),l.createElement("main",{className:(0,n.Z)("col",{"col--7":o,"col--9 col--offset-1":!o}),itemScope:!0,itemType:"http://schema.org/Blog"},i),a&&l.createElement("div",{className:"col col--2"},a))))}},8561:function(e,t,a){a.d(t,{Z:function(){return P}});var r=a(7294),l=a(6010),n=a(3905),s=a(5999),i=a(9960),m=a(4996),o=a(9548),c=a(8780),u=a(4689),g=a(6753),d="blogPostTitle_rzP5",p="blogPostData_Zg1s",h="blogPostDetailsFull_h6_j",E=a(62),v="image_o0gy";var b=function(e){var t=e.author,a=t.name,l=t.title,n=t.url,s=t.imageURL;return r.createElement("div",{className:"avatar margin-bottom--sm"},s&&r.createElement(i.Z,{className:"avatar__photo-link avatar__photo",href:n},r.createElement("img",{className:v,src:s,alt:a})),a&&r.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},r.createElement("div",{className:"avatar__name"},r.createElement(i.Z,{href:n,itemProp:"url"},r.createElement("span",{itemProp:"name"},a))),l&&r.createElement("small",{className:"avatar__subtitle",itemProp:"description"},l)))},f="authorCol_FlmR",N="imageOnlyAuthorRow_trpF",Z="imageOnlyAuthorCol_S2np";function _(e){var t=e.authors,a=e.assets;if(0===t.length)return null;var n=t.every((function(e){return!e.name}));return r.createElement("div",{className:(0,l.Z)("margin-top--md margin-bottom--sm",n?N:"row")},t.map((function(e,t){var s;return r.createElement("div",{className:(0,l.Z)(!n&&"col col--6",n?Z:f),key:t},r.createElement(b,{author:Object.assign({},e,{imageURL:null!=(s=a.authorsImageUrls[t])?s:e.imageURL})}))})))}var P=function(e){var t,a,v,b=(v=(0,o.c2)().selectMessage,function(e){var t=Math.ceil(e);return v(t,(0,s.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:t}))}),f=(0,m.C)().withBaseUrl,N=e.children,Z=e.frontMatter,P=e.assets,k=e.metadata,T=e.truncated,w=e.isBlogPostPage,y=void 0!==w&&w,C=k.date,I=k.formattedDate,L=k.permalink,M=k.tags,R=k.readingTime,U=k.title,D=k.editUrl,x=k.authors,A=null!=(t=P.image)?t:Z.image,B=!y&&T,F=M.length>0,z=y?"h1":"h2";return r.createElement("article",{className:y?void 0:"margin-bottom--xl",itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},r.createElement("header",null,r.createElement(z,{className:d,itemProp:"headline"},y?U:r.createElement(i.Z,{itemProp:"url",to:L},U)),r.createElement("div",{className:(0,l.Z)(p,"margin-vert--md")},r.createElement("time",{dateTime:C,itemProp:"datePublished"},I),void 0!==R&&r.createElement(r.Fragment,null," \xb7 ",b(R))),r.createElement(_,{authors:x,assets:P})),A&&r.createElement("meta",{itemProp:"image",content:f(A,{absolute:!0})}),r.createElement("div",{id:y?c.blogPostContainerID:void 0,className:"markdown",itemProp:"articleBody"},r.createElement(n.Zo,{components:u.Z},N)),(F||T)&&r.createElement("footer",{className:(0,l.Z)("row docusaurus-mt-lg",(a={},a[h]=y,a))},F&&r.createElement("div",{className:(0,l.Z)("col",{"col--9":B})},r.createElement(E.Z,{tags:M})),y&&D&&r.createElement("div",{className:"col margin-top--sm"},r.createElement(g.Z,{editUrl:D})),B&&r.createElement("div",{className:(0,l.Z)("col text--right",{"col--3":F})},r.createElement(i.Z,{to:k.permalink,"aria-label":"Read more about "+U},r.createElement("b",null,r.createElement(s.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))))))}},9404:function(e,t,a){a.r(t),a.d(t,{default:function(){return o}});var r=a(7294),l=a(9960),n=a(8665),s=a(8561),i=a(5999),m=a(9548);function o(e){var t,a=e.metadata,o=e.items,c=e.sidebar,u=a.allTagsPath,g=a.name,d=a.count,p=(t=(0,m.c2)().selectMessage,function(e){return t(e,(0,i.I)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:e}))}),h=(0,i.I)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:p(d),tagName:g});return r.createElement(n.Z,{title:h,wrapperClassName:m.kM.wrapper.blogPages,pageClassName:m.kM.page.blogTagPostListPage,searchMetadata:{tag:"blog_tags_posts"},sidebar:c},r.createElement("header",{className:"margin-bottom--xl"},r.createElement("h1",null,h),r.createElement(l.Z,{href:u},r.createElement(i.Z,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page"},"View All Tags"))),o.map((function(e){var t=e.content;return r.createElement(s.Z,{key:t.metadata.permalink,frontMatter:t.frontMatter,assets:t.assets,metadata:t.metadata,truncated:!0},r.createElement(t,null))})))}},6753:function(e,t,a){a.d(t,{Z:function(){return g}});var r=a(7294),l=a(5999),n=a(7462),s=a(3366),i=a(6010),m="iconEdit_dcUD",o=["className"];var c=function(e){var t=e.className,a=(0,s.Z)(e,o);return r.createElement("svg",(0,n.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,i.Z)(m,t),"aria-hidden":"true"},a),r.createElement("g",null,r.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))},u=a(9548);function g(e){var t=e.editUrl;return r.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:u.kM.common.editThisPage},r.createElement(c,null),r.createElement(l.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},7774:function(e,t,a){a.d(t,{Z:function(){return o}});var r=a(7294),l=a(6010),n=a(9960),s="tag_hD8n",i="tagRegular_D6E_",m="tagWithCount_i0QQ";var o=function(e){var t,a=e.permalink,o=e.name,c=e.count;return r.createElement(n.Z,{href:a,className:(0,l.Z)(s,(t={},t[i]=!c,t[m]=c,t))},o,c&&r.createElement("span",null,c))}},62:function(e,t,a){a.d(t,{Z:function(){return o}});var r=a(7294),l=a(6010),n=a(5999),s=a(7774),i="tags_XVD_",m="tag_JSN8";function o(e){var t=e.tags;return r.createElement(r.Fragment,null,r.createElement("b",null,r.createElement(n.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),r.createElement("ul",{className:(0,l.Z)(i,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return r.createElement("li",{key:a,className:m},r.createElement(s.Z,{name:t,permalink:a}))}))))}}}]);