(this["webpackJsonptest-app"]=this["webpackJsonptest-app"]||[]).push([[0],{51:function(e,t,a){},58:function(e,t,a){},62:function(e,t,a){},63:function(e,t,a){},64:function(e,t,a){},65:function(e,t,a){},66:function(e,t,a){},67:function(e,t,a){},68:function(e,t,a){},69:function(e,t,a){},70:function(e,t,a){},71:function(e,t,a){},72:function(e,t,a){},73:function(e,t,a){},74:function(e,t,a){},75:function(e,t,a){},76:function(e,t,a){},78:function(e,t,a){},79:function(e,t,a){"use strict";a.r(t);var s=a(2),n=a(21),c=a.n(n),i=a(7),r=a(9),o=a(14),l=a(82),d=a(83),h=a(16),u=a(4),j=a.n(u),b=a(19),m=a.n(b),p=a(24),f=a(8),g=a(84),O=a(36),v=(a(51),a(1)),x=function(e){var t=e.drodpownOptions,a=0,n=Object(g.a)(0),c=Object(f.a)(n,1)[0];Object(s.useEffect)((function(){(function(){var e=Object(p.a)(m.a.mark((function e(){var t;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===c||void 0===c?void 0:c.session){e.next=5;break}document.getElementById("log-btn").classList=["loginBtn"],e.next=13;break;case 5:return e.next=7,fetch("/api/users/@me").then((function(e){return e.json()})).then((function(e){return e.data})).catch((function(e){}));case 7:if((t=e.sent)&&(null===t||void 0===t?void 0:t.id)){e.next=10;break}return e.abrupt("return");case 10:document.getElementById("profile").classList=["profile"],document.getElementById("profile-avatar").src=t.avatar?"https://cdn.discordapp.com/avatars/".concat(t.id,"/").concat(t.avatar,".png"):"/assets/images/default.png",document.getElementById("profile-username").textContent=t.username.lenth<15?t.username.slice(0,15):t.username;case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[]);return Object(v.jsxs)(s.Fragment,{children:[Object(v.jsxs)("div",{className:"profile-part",children:[Object(v.jsxs)("div",{id:"profile",className:"profile disabled",onClick:function(){j()(".dropdown").hasClass("disabled")?(j()(".dropdown-icon").addClass("profile-dropdown-icon-collapsed"),j()(".dropdown").removeClass("disabled")):(j()(".dropdown-icon").removeClass("profile-dropdown-icon-collapsed"),j()(".dropdown").addClass("disabled"))},children:[Object(v.jsx)("img",{id:"profile-avatar",src:"/assets/images/default.png",alt:"Profile"}),Object(v.jsx)("p",{id:"profile-username",children:"User"}),Object(v.jsx)(O.a,{className:"dropdown-icon"})]}),Object(v.jsx)("a",{id:"log-btn",className:"loginBtn disabled",href:"/oauth/login",children:"Login"})]}),Object(v.jsx)("div",{className:"dropdown disabled",children:Object(v.jsxs)("ul",{children:[null===t||void 0===t?void 0:t.map((function(e){return e.reload?Object(v.jsx)("a",{href:e.url,children:Object(v.jsx)("li",{children:e.content})},a++):Object(v.jsx)(i.b,{to:e.url,children:Object(v.jsx)("li",{children:e.content})},a++)})),Object(v.jsx)("a",{href:"/oauth/logout",children:Object(v.jsx)("li",{children:"Logout"})})]})})]})},y=(a(58),function(e){var t=e.activeElement;return Object(v.jsx)(s.Fragment,{children:Object(v.jsx)("div",{className:"athena-navbar",children:Object(v.jsxs)(l.a,{bg:"transparent",expand:"lg",collapseOnSelect:!0,variant:"dark",children:[Object(v.jsx)(i.b,{className:"navbar-brand",to:"/",children:Object(v.jsx)("img",{src:"/assets/images/logo.png",width:"64",height:"64",className:"d-inline-block align-top",alt:"Athena"})}),Object(v.jsx)(h.b,{className:"athena-navbar-toggler",onClick:function(){j()("#basic-navbar-nav").hasClass("collapse")?(j()("#basic-navbar-nav").removeClass("collapse"),j()("#basic-navbar-nav").addClass("collapsed"),j()("#basic-navbar-nav").addClass("fadeIn"),setTimeout((function(){j()("#basic-navbar-nav").removeClass("fadeIn")}),400)):(j()("#basic-navbar-nav").removeClass("collapsed"),j()("#basic-navbar-nav").addClass("collapse"))}}),Object(v.jsxs)(l.a.Collapse,{id:"basic-navbar-nav",children:[Object(v.jsxs)(d.a,{className:"mr-auto",children:[Object(v.jsx)(i.b,{className:"home"===t?"active nav-link":"nav-link",to:"/",children:"Home"}),Object(v.jsx)(i.b,{className:"dashboard"===t?"active nav-link":"nav-link",to:"/dashboard",children:"Dashboard"}),Object(v.jsx)(i.b,{className:"commands"===t?"active nav-link":"nav-link",to:"/commands",children:"Commands"}),Object(v.jsx)("a",{className:"support"===t?"active nav-link":"nav-link",href:"/support",children:"Support"})]}),Object(v.jsx)(x,{})]})]})})})}),w=(a(62),function(){return Object(v.jsx)("div",{className:"athena-footer",children:Object(v.jsxs)("div",{className:"athena-footer-content",children:[Object(v.jsxs)("div",{className:"athena-footer-brand",children:[Object(v.jsx)("img",{src:"/assets/images/logo.png",alt:"Athena"}),Object(v.jsx)("p",{children:"Athena is a multi-purpose discord bot that aims to serve every function of a discord bot that can perform."})]}),Object(v.jsxs)("div",{className:"athena-footer-link-part",children:[Object(v.jsxs)("ul",{className:"athena-footer-links",children:[Object(v.jsx)("h3",{children:"General"}),Object(v.jsx)("li",{children:Object(v.jsx)(i.b,{to:"/",children:"Home"})}),Object(v.jsx)("li",{children:Object(v.jsx)(i.b,{to:"/commands",children:"Commands"})}),Object(v.jsx)("li",{children:Object(v.jsx)("a",{href:"/source",children:"Source Code"})})]}),Object(v.jsxs)("ul",{className:"athena-footer-links",children:[Object(v.jsx)("h3",{children:"Legal"}),Object(v.jsx)("li",{children:Object(v.jsx)(i.b,{to:"/privacy",children:"Privacy Policy"})}),Object(v.jsx)("li",{children:Object(v.jsx)(i.b,{to:"/tos",children:"Terms of Service"})}),Object(v.jsx)("li",{children:Object(v.jsx)(i.b,{to:"/contact",children:"Contact Us"})})]})]})]})})}),N=(a(63),function(){return Object(v.jsxs)("div",{className:"athena-main",children:[Object(v.jsx)(o.a,{children:Object(v.jsx)("title",{children:"Athena - The Discord Bot"})}),Object(v.jsx)(y,{activeElement:"home"}),Object(v.jsx)("header",{children:Object(v.jsxs)("div",{className:"headMsg",children:[Object(v.jsxs)("h1",{children:["A Discord Bot that can fulfill your server needs for ",Object(v.jsx)("span",{style:{color:"var(--primary-theme)"},children:"FREE"})]}),Object(v.jsx)("p",{children:"Athena is a multi-functional discord bot that offers many services for free such as playing any song you desire with night core effect."})]})}),Object(v.jsx)("main",{children:Object(v.jsxs)("div",{className:"features",children:[Object(v.jsx)("div",{className:"feature",children:Object(v.jsxs)("div",{id:"feature_music",className:"featureContent",children:[Object(v.jsx)("img",{src:"/assets/images/feature_music.svg",alt:"Music"}),Object(v.jsxs)("div",{className:"feature_desc",children:[Object(v.jsx)("h1",{children:"Music"}),Object(v.jsx)("p",{children:"Athena has a powerful music module which you can listen to music from youtube you can even add some filters (bass boost, 8d, etc.)."})]})]})}),Object(v.jsx)("div",{className:"feature",children:Object(v.jsxs)("div",{id:"feature_moderation",className:"featureContent",children:[Object(v.jsx)("img",{src:"/assets/images/feature_moderation.svg",alt:"Music"}),Object(v.jsxs)("div",{className:"feature_desc",children:[Object(v.jsx)("h1",{children:"Moderation"}),Object(v.jsx)("p",{children:"With Athena's big range of moderation commands you can moderate your server easily and quickly!"})]})]})}),Object(v.jsx)("div",{className:"feature",children:Object(v.jsxs)("div",{id:"feature_fun",className:"featureContent",children:[Object(v.jsx)("img",{src:"/assets/images/feature_fun.svg",alt:"Music"}),Object(v.jsxs)("div",{className:"feature_desc",children:[Object(v.jsx)("h1",{children:"Fun"}),Object(v.jsx)("p",{children:"Do you like fun commands such as magik ? Because we do and we put some fun commands to Athena that you may love such as mimic command!"})]})]})}),Object(v.jsx)("div",{className:"feature",children:Object(v.jsxs)("div",{id:"feature_misc",className:"featureContent",children:[Object(v.jsx)("img",{src:"/assets/images/feature_misc.svg",alt:"Music"}),Object(v.jsxs)("div",{className:"feature_desc",children:[Object(v.jsx)("h1",{children:"Misc"}),Object(v.jsx)("p",{children:"Other commands that we couldn't put in a section such as fortnite stats or weather forecast."})]})]})})]})}),Object(v.jsx)("footer",{children:Object(v.jsxs)("div",{className:"question",children:[Object(v.jsx)("h1",{children:"Ready to try Athena?"}),Object(v.jsx)("a",{href:"/invite",className:"btn-main",children:"Invite Athena!"})]})}),Object(v.jsx)(w,{})]})}),C=(a(64),function(e){var t=e.active,a=e.coverAllPage;return Object(s.useEffect)((function(){t?document.getElementById("loader").classList.remove("disabled"):document.getElementById("loader").classList.add("disabled"),a?document.getElementById("loader").classList.add("cover"):document.getElementById("loader").classList.remove("cover")})),Object(v.jsx)("div",{id:"loader",children:Object(v.jsxs)("div",{className:"spinner",children:[Object(v.jsx)("div",{className:"bounce1"}),Object(v.jsx)("div",{className:"bounce2"}),Object(v.jsx)("div",{className:"bounce3"}),Object(v.jsx)("div",{className:"bounce4"})]})})}),k=(a(65),function(e){var t=e.name,a=e.usage,s=e.description,n=e.reqPerms,c=e.reqBotPerms;return Object(v.jsxs)("div",{className:"command",onClick:function(e){e.currentTarget.lastChild.classList.value.toString().split(" ").includes("disabled")?e.currentTarget.lastChild.classList=["command-expand"]:e.currentTarget.lastChild.classList+=" disabled"},children:[Object(v.jsxs)("h5",{children:["at! ",Object(v.jsx)("span",{id:"command-name",children:t})," ",Object(v.jsx)("code",{children:a})]}),Object(v.jsxs)("div",{className:"command-expand disabled",children:[Object(v.jsxs)("p",{children:["Description: ",Object(v.jsx)("span",{id:"command-desc",children:s})]}),Object(v.jsxs)("p",{children:["Required Perms: ",Object(v.jsx)("code",{id:"command-req-perms",children:n.join(", ")})]}),Object(v.jsxs)("p",{children:["Required Bot Perms: ",Object(v.jsx)("code",{id:"command-req-bot-perms",children:c.join(", ")})]})]})]})}),A=(a(66),function(){var e=0,t=0,a=Object(s.useState)([]),n=Object(f.a)(a,2),c=n[0],i=n[1],r=Object(s.useState)([]),l=Object(f.a)(r,2),d=l[0],h=l[1],u=Object(s.useState)(!0),j=Object(f.a)(u,2),b=j[0],m=j[1];Object(s.useEffect)((function(){fetch("/api/commands").then((function(e){return e.json()})).then((function(e){h(e.data),i(e.data),m(!1)}))}),[]);var p=function(e){var t,a=e.currentTarget.dataset.category;if("All"===a)t=c;else{var s=[];s.push(c),t=s.filter((function(e){return e.category!==a}));for(var n=0;n<t.length;n++)t[n].commands=[];t.push(c.find((function(e){return e.category===a})))}for(var i=document.getElementsByClassName("category"),r=0;r<i.length;r++)i[r].classList=["category"];h(t),e.currentTarget.classList.add("activeCategory")};return Object(v.jsxs)(s.Fragment,{children:[Object(v.jsx)(o.a,{children:Object(v.jsx)("title",{children:"Commands - Athena"})}),Object(v.jsx)(y,{activeElement:"commands"}),Object(v.jsxs)("div",{className:"command-page-header",children:[Object(v.jsx)("h1",{style:{color:"var(--primary-theme)"},children:"Commands"}),Object(v.jsx)("p",{children:"List of all commands that is currently running on Athena."})]}),Object(v.jsx)("main",{children:Object(v.jsxs)("div",{className:"commands-container",children:[Object(v.jsxs)("div",{className:"categories",children:[Object(v.jsx)("h5",{onClick:p,className:"category activeCategory","data-category":"All",children:"All"}),c.map((function(e){return t++,Object(v.jsx)("h5",{onClick:p,className:"category","data-category":e.category,children:e.category},t)}))]}),Object(v.jsxs)("div",{className:"commands",children:[Object(v.jsx)(C,{active:b,coverAllPage:!1}),d.map((function(t){return t.commands.map((function(t){return e++,Object(v.jsx)(k,{name:t.name,usage:t.usage,description:t.description,reqPerms:t.required_perms,reqBotPerms:t.required_bot_perms},e)}))}))]})]})}),Object(v.jsx)(w,{})]})}),S=(a(67),function(e){var t=e.icon,a=e.name,s=e.id,n=e.available;return Object(v.jsxs)("div",{className:"server",children:[Object(v.jsx)("img",{src:t||"/assets/images/default.png",alt:a||"Server"}),Object(v.jsx)("h4",{children:a.length>10?a.slice(0,10)+"..":a}),n?Object(v.jsx)(i.b,{className:"server-btn",to:"/dashboard/"+s+"/general",children:"Go to Dashboard"}):Object(v.jsx)("a",{className:"server-btn",href:"/invite",style:{backgroundColor:"gray"},children:"Invite Athena"})]})}),I=(a(68),function(){var e=Object(s.useState)([]),t=Object(f.a)(e,2),a=t[0],n=t[1],c=Object(s.useState)(!0),i=Object(f.a)(c,2),r=i[0],l=i[1],d=Object(g.a)(0),h=Object(f.a)(d,1)[0];return Object(s.useEffect)((function(){if(!(null===h||void 0===h?void 0:h.session))return window.location.replace("/oauth/login");fetch("/api/users/@me/guilds?selectManageable=true").then((function(e){return e.json()})).then((function(e){e.data||window.location.replace("/oauth/login"),n(e.data),l(!1)})).catch((function(e){}))}),[]),Object(v.jsxs)(s.Fragment,{children:[Object(v.jsx)(o.a,{children:Object(v.jsx)("title",{children:"Servers - Athena"})}),Object(v.jsx)(y,{activeElement:"dashboard"}),Object(v.jsxs)("div",{className:"dash-server-container",children:[Object(v.jsxs)("div",{className:"dash-servers-head",children:[Object(v.jsx)("h1",{style:{color:"var(--primary-theme)"},children:"Servers"}),Object(v.jsx)("p",{children:"Please choose a server to continue."})]}),Object(v.jsxs)("div",{className:"dash-servers-main",children:[Object(v.jsx)(C,{active:r,coverAllPage:!1}),a.map((function(e){return Object(v.jsx)(S,{id:e.id,name:e.name,icon:e.icon||"/assets/images/default.png",available:e.available})}))]})]}),Object(v.jsx)(w,{})]})}),P=a(25),E=a(41),T=(a(69),a(70),function(e){var t=e.onChange,a=e.options,n=e.id,c=0;return Object(s.useEffect)((function(){j()(".athena-input-selection-main").on("click",(function(){var e=j()(this).siblings();e.hasClass("disabled")?e.removeClass("disabled"):e.addClass("disabled")})),j()(".athena-input-selection-slide-option").on("click",(function(){var e=j()(this).text();j()(this).parent().siblings().text(e),j()(this).parent().addClass("disabled"),t()}))}),[]),Object(v.jsxs)("div",{className:"athena-input-selection",children:[Object(v.jsx)("div",{id:n,className:"athena-input-selection-main",children:a.map((function(e){if(e.active)return e.content}))}),Object(v.jsx)("ul",{className:"athena-input-selection-slide disabled",children:a.map((function(e){return Object(v.jsx)("li",{"data-id":e.id,className:"athena-input-selection-slide-option",children:e.content},c++)}))})]})}),L=(a(71),!1),B=function(e){var t=e.pushAlert,a=(e.guild,e.guildData),n=e.setElements,c=Object(s.useState)([{active:!0,content:"English",id:"en-US"},{active:!1,content:"T\xfcrk\xe7e",id:"tr-TR"}]),i=Object(f.a)(c,2),r=i[0],o=i[1],l=Object(s.useState)("at!"),d=Object(f.a)(l,2),h=d[0],u=d[1];return Object(s.useEffect)((function(){var e;if((null===a||void 0===a||null===(e=a.preferences)||void 0===e?void 0:e.prefix)&&!L){for(var t,s=r,c=0;c<s.length;c++){var i,l;if(void 0===(null===a||void 0===a||null===(i=a.preferences)||void 0===i?void 0:i.language))break;s[c].id===(null===a||void 0===a||null===(l=a.preferences)||void 0===l?void 0:l.language)?s[c].active=!0:s[c].active=!1}o(s),u(null===a||void 0===a||null===(t=a.preferences)||void 0===t?void 0:t.prefix),n([{name:"prefix",element:"#prefix-input",value:null,setFunc:u},{name:"language",element:"#language-input",value:null,setFunc:null}]),L=!0}})),Object(v.jsxs)("div",{className:"dash-contnet-general",children:[Object(v.jsxs)("div",{className:"dash-general-container",children:[Object(v.jsx)("h2",{children:"Server Prefix"}),Object(v.jsx)("p",{children:"Change Athena's current prefix on your server."}),Object(v.jsx)("hr",{}),Object(v.jsx)("p",{className:"dash-input-head",children:"Set prefix"}),Object(v.jsx)("input",{className:"athena-input-text",id:"prefix-input",value:h,placeholder:"Write your custom prefix.",onChange:function(e){u(e.currentTarget.value),t()}})]}),Object(v.jsxs)("div",{className:"dash-general-container",children:[Object(v.jsx)("h2",{children:"Server Language"}),Object(v.jsx)("p",{children:"Change Athena's language on your server. Currently 2 languages are availabe."}),Object(v.jsx)("hr",{}),Object(v.jsx)("p",{className:"dash-input-head",children:"Set Language"}),Object(v.jsx)(T,{onChange:t,id:"language-input",options:r})]})]})},D=a(40),W=function(e){return Object(D.a)(e),Object(v.jsx)("div",{children:Object(v.jsx)("h1",{style:{padding:"10px",margin:"15px",fontWeight:"bold",color:"var(--primary-theme)"},children:"Coming Soon"})})},q=function(e){var t=e.activePage,a=e.pushAlert,n=e.removeAlert,c=e.guild,i=e.guildData,r=e.setElements;switch(t.toLowerCase()){case"general":return Object(v.jsx)(s.Fragment,{children:Object(v.jsx)(B,{setElements:r,pushAlert:a,removeAlert:n,guild:c,guildData:i})});default:return Object(v.jsx)(s.Fragment,{children:Object(v.jsx)(W,{setElements:r,pushAlert:a,removeAlert:n,guild:c,guildData:i})})}},_=a(81),F=(a(72),function(e){var t=e.active,a=e.elementsToSave,n=e.guildID,c=(e.guild,e.guildData),i=e.updateAlert,r=e.updateGuildData,o=!1,l={guild:n};Object(s.useEffect)((function(){t?j()(".change-alert").removeClass("disabled"):j()(".change-alert").addClass("disabled")}));var d=function(){j()(".change-alert").addClass("change-alert-closing-anim"),setTimeout((function(){j()(".change-alert").removeClass("change-alert-closing-anim"),i(!1)}),700)},h=function(){var e=Object(p.a)(m.a.mark((function e(){var t,s;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!o){e.next=2;break}return e.abrupt("return");case 2:for(o=!0,j()("#change-alert-reset").addClass("disabled"),j()(".change-alert-btn-sign").addClass("disabled"),j()(".change-alert-btn-loader").removeClass("disabled"),t=0;t<a.length;t++)0===(s=j()(a[t].element).text()).length&&(s=j()(a[t].element).val()),l[a[t].name]=s;fetch("/api/guilds/"+n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}).then((function(e){return e.json()})).then(function(){var e=Object(p.a)(m.a.mark((function e(t){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(200!==t.status){e.next=9;break}return e.next=3,r();case 3:j()("#change-alert-reset").removeClass("disabled"),j()(".change-alert-btn-sign").removeClass("disabled"),j()(".change-alert-btn-loader").addClass("disabled"),d(),e.next=12;break;case 9:j()("#change-alert-save").addClass("change-alert-error-background"),j()(".change-alert").addClass("change-alert-error-border"),setTimeout((function(){b(),setTimeout((function(){j()("#change-alert-reset").removeClass("disabled"),j()(".change-alert-btn-sign").removeClass("disabled"),j()(".change-alert-btn-loader").addClass("disabled"),j()("#change-alert-save").removeClass("change-alert-error-background"),j()(".change-alert").removeClass("change-alert-error-border")}),700)}),1100);case 12:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){}));case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),u=[{active:!0,content:"English",id:"en-US"},{active:!1,content:"T\xfcrk\xe7e",id:"tr-TR"}],b=function(){a.forEach((function(e){if("language"==e.name){var t=u.find((function(e){return e.id==c.easyAccess.language}));j()(e.element).text(t.content),j()(e.element).val(t.content)}else e.setFunc?e.setFunc(c.easyAccess[e.name]):(j()(e.element).text(c.easyAccess[e.name]),j()(e.element).val(c.easyAccess[e.name]))})),d()};return Object(v.jsxs)("div",{className:"change-alert",children:[Object(v.jsx)("p",{children:"Be careful! You have unsaved changes."}),Object(v.jsxs)("div",{className:"change-alert-buttons",children:[Object(v.jsx)(_.a,{id:"change-alert-reset",className:"change-alert-btn btn-transparent",children:Object(v.jsx)("p",{className:"change-alert-btn-sign",onClick:b,children:"Reset Changes"})}),Object(v.jsxs)(_.a,{id:"change-alert-save",className:"change-alert-btn",children:[Object(v.jsx)("p",{className:"change-alert-btn-sign",onClick:h,children:"Save Changes"}),Object(v.jsxs)("div",{className:"change-alert-btn-loader disabled",children:[Object(v.jsx)("div",{className:"change-alert-bubble bubble-1"}),Object(v.jsx)("div",{className:"change-alert-bubble bubble-2"}),Object(v.jsx)("div",{className:"change-alert-bubble bubble-3"}),Object(v.jsx)("div",{className:"change-alert-bubble bubble-4"})]})]})]})]})}),M=(a(73),function(){var e=Object(s.useState)(!0),t=Object(f.a)(e,2),a=t[0],n=t[1],c=Object(s.useState)([]),l=Object(f.a)(c,2),d=l[0],u=l[1],b=Object(s.useState)({}),m=Object(f.a)(b,2),p=m[0],g=m[1],O=Object(s.useState)("General"),y=Object(f.a)(O,2),w=y[0],N=y[1],k=Object(s.useState)(!1),A=Object(f.a)(k,2),S=A[0],I=A[1],T=Object(s.useState)([]),L=Object(f.a)(T,2),B=L[0],D=L[1],W=["general","autorole","linkprotection","player"],_=Object(r.f)(),M=_.id,U=_.category;return Object(s.useEffect)((function(){W.includes(U)?N(U):window.location.replace("/dashboard/".concat(M,"/general"));var e=function(){j()(".dash-control").hasClass("dash-control-collapsed")?j()(".dash-control").removeClass("dash-control-collapsed"):j()(".dash-control").addClass("dash-control-collapsed")};j()(".dash-category-title").on("click",(function(){j()(this).siblings().hasClass("disabled")?(j()(this).siblings().removeClass("disabled"),j()(this).children().removeClass("dash-category-collapsed")):(j()(this).siblings().addClass("disabled"),j()(this).children().addClass("dash-category-collapsed"))})),j()("#dash-control-toggle").on("click",(function(){e()})),j()(".dash-category-option").on("click",(function(){var t=j()(this).attr("data-id");N(t),j()(".dash-category-option").removeClass("dash-category-active"),j()(this).addClass("dash-category-active"),e()})),M&&!isNaN(M)&&18===M.length||window.location.replace("/dashboard"),fetch("/api/users/@me/guilds?selectManageable=true").then((function(e){return e.json()})).then((function(e){var t=e.data.filter((function(e){return!0===e.available})),a=!1;t.forEach((function(e){e.id===M&&(a=!0)})),a||window.location.replace("/dashboard");var s=e.data.find((function(e){return e.id===M}));s.name.length>15?s.display_name=s.name.slice(0,15)+"..":s.display_name=s.name,u(s)})).catch((function(e){})),fetch("/api/guilds/"+M).then((function(e){return e.json()})).then((function(e){e.data&&(g(Object(P.a)(Object(P.a)({},e.data),{},{easyAccess:{prefix:e.data.preferences.prefix,language:e.data.preferences.language}})),setTimeout((function(){n(!1)}),1500))})).catch((function(e){}))}),[]),Object(v.jsxs)("div",{className:"dash-container",children:[Object(v.jsx)(o.a,{children:Object(v.jsx)("title",{children:"Dashboard - Athena"})}),Object(v.jsx)(C,{active:a,coverAllPage:!0}),Object(v.jsx)("div",{className:"dash-control dash-control-collapsed",children:Object(v.jsxs)("div",{className:"dash-server",children:[Object(v.jsx)("img",{src:d.icon||"/assets/images/default.png",alt:"Server"}),Object(v.jsx)("h2",{children:d.display_name||"Server Name"}),Object(v.jsxs)("div",{className:"dash-server-stats",children:[Object(v.jsxs)("p",{children:[Object(v.jsx)("span",{className:"dash-num",children:d.memberCount||"Unknown"}),"\xa0Members"]}),Object(v.jsxs)("p",{children:[Object(v.jsx)("span",{className:"dash-num",children:d.channelCount||"Unknown"}),"\xa0Channels"]})]}),Object(v.jsxs)("div",{className:"dash-categories",children:[Object(v.jsxs)("ul",{className:"dash-category",children:[Object(v.jsxs)("p",{className:"dash-category-title",children:["Configuration ",Object(v.jsx)(h.a,{className:"dash-category-toggle-ico"})]}),Object(v.jsx)(i.b,{to:"general",children:Object(v.jsxs)("li",{className:"dash-category-option dash-category-active","data-id":"general",children:[Object(v.jsx)(h.c,{className:"dash-ico"})," General"]})})]}),Object(v.jsxs)("ul",{className:"dash-category",children:[Object(v.jsxs)("p",{className:"dash-category-title",children:["Moderation ",Object(v.jsx)(h.a,{className:"dash-category-toggle-ico"})]}),Object(v.jsx)(i.b,{className:"athena-dash-category-disabled",children:Object(v.jsxs)("li",{className:"dash-category-option","data-id":"autorole",children:[Object(v.jsx)(h.c,{className:"dash-ico"})," Auto Role \xa0",Object(v.jsx)("span",{className:"athena-dash-badge",children:"SOON"})]})}),Object(v.jsx)(i.b,{className:"athena-dash-category-disabled",children:Object(v.jsxs)("li",{className:"dash-category-option","data-id":"linkprotection",children:[Object(v.jsx)(h.c,{className:"dash-ico"})," Link Protection \xa0",Object(v.jsx)("span",{className:"athena-dash-badge",children:"SOON"})]})})]}),Object(v.jsxs)("ul",{className:"dash-category",children:[Object(v.jsxs)("p",{className:"dash-category-title",children:["Music ",Object(v.jsx)(h.a,{className:"dash-category-toggle-ico"})]}),Object(v.jsx)(i.b,{className:"athena-dash-category-disabled",children:Object(v.jsxs)("li",{className:"dash-category-option","data-id":"Player",children:[Object(v.jsx)(h.c,{className:"dash-ico"})," Player \xa0",Object(v.jsx)("span",{className:"athena-dash-badge",children:"SOON"})]})})]}),Object(v.jsx)("br",{})]})]})}),Object(v.jsxs)("div",{className:"dash-main",children:[Object(v.jsxs)("div",{className:"dash-top-bar",children:[Object(v.jsx)(E.a,{id:"dash-control-toggle"}),Object(v.jsx)("div",{className:"dash-brand",children:Object(v.jsx)("img",{src:"/assets/images/logo.png",alt:"Athena"})}),Object(v.jsx)(x,{drodpownOptions:[{url:"/dashboard",content:"Servers",reload:!1}]})]}),Object(v.jsx)("div",{className:"dash-content",children:Object(v.jsx)(q,{setElements:function(e){D(e)},guild:d,guildData:p,activePage:w,pushAlert:function(){I(!0)},removeAlert:function(){I(!1)}})}),Object(v.jsx)(F,{updateAlert:I,guildID:M,guild:d,guildData:p,elementsToSave:B,active:S,updateGuildData:function(){return new Promise((function(e,t){fetch("/api/guilds/"+M).then((function(e){return e.json()})).then((function(t){t.data&&(g(Object(P.a)(Object(P.a)({},t.data),{},{easyAccess:{prefix:t.data.preferences.prefix,language:t.data.preferences.language}})),e())})).catch((function(e){}))}))}})]})]})}),U=(a(74),function(){return Object(v.jsxs)("div",{className:"athena-pg-not-found-container",children:[Object(v.jsx)("h1",{children:"404"}),Object(v.jsx)("p",{children:"Ooops! It looks like the page you are trying to access not found!"}),Object(v.jsx)(i.b,{className:"athena-pg-not-found-btn",to:"/",children:"Go back to home"})]})}),Y=function(){return Object(v.jsxs)(s.Fragment,{children:[Object(v.jsx)("h2",{children:"Introduction"}),Object(v.jsxs)("p",{children:["Your privacy is important to us. It is Athena's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you, including across our website, ",Object(v.jsx)("a",{href:"https://      athenabot.site",children:"https://athenabot.site"}),", and other sites we own and operate. "]}),Object(v.jsx)("p",{children:"This policy is effective as of 11 May 2021 and was last updated on 11 May 2021. "}),Object(v.jsx)("h3",{children:"Information We Collect"}),Object(v.jsx)("p",{children:"Information we collect includes both information you knowingly and actively provide us when using or participating in any of our services and promotions, and any information automatically sent by your devices in the course of accessing our       products and services. "}),Object(v.jsx)("h4",{children:"Log Data"}),Object(v.jsx)("p",{children:"When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your device\u2019s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of       your visit, the time spent on each page, other details about your visit, and technical details that occur in conjunction with any errors you may encounter. "}),Object(v.jsx)("p",{children:"Please be aware that while this information may not be personally identifying by itself, it may be possible to combine it with other data to personally identify individual persons. "}),Object(v.jsx)("h4",{children:"Collection and Use of Information"}),Object(v.jsx)("p",{children:"We may collect personal information from you when you do any of the following on our website: "}),Object(v.jsxs)("ul",{children:[Object(v.jsx)("li",{children:"Use a mobile device or web browser to access our content"}),Object(v.jsx)("li",{children:"Contact us via email, social media, or on any similar technologies"}),Object(v.jsx)("li",{children:"When you mention us on social media"})]}),Object(v.jsx)("p",{children:"We may collect, hold, use, and disclose information for the following purposes, and personal information will not be further processed in a manner that is incompatible with these purposes: "}),Object(v.jsx)("p",{children:"Please be aware that we may combine information we collect about you with general information or research data we receive from other trusted sources. "}),Object(v.jsx)("h4",{children:"Security of Your Personal Information"}),Object(v.jsx)("p",{children:"When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.      "}),Object(v.jsx)("p",{children:"Although we will do our best to protect the personal information you provide to us, we advise that no method of electronic transmission or storage is 100% secure, and no one can guarantee absolute data security. We will comply with laws      applicable  to us in respect of any data breach. "}),Object(v.jsx)("p",{children:"You are responsible for selecting any password and its overall security strength, ensuring the security of your own information within the bounds of our services. "}),Object(v.jsx)("h4",{children:"How Long We Keep Your Personal Information"}),Object(v.jsx)("p",{children:"We keep your personal information only for as long as we need to. This time period may depend on what we are using your information for, in accordance with this privacy policy. If your personal information is no longer required, we will delete      it  or make it anonymous by removing all details that identify you. "}),Object(v.jsx)("p",{children:"However, if necessary, we may retain your personal information for our compliance with a legal, accounting, or reporting obligation or for archiving purposes in the public interest, scientific, or historical research purposes or statistical       purposes. "}),Object(v.jsx)("h3",{children:"Children\u2019s Privacy"}),Object(v.jsx)("p",{children:"We do not aim any of our products or services directly at children under the age of 13, and we do not knowingly collect personal information about children under 13. "}),Object(v.jsx)("h3",{children:"International Transfers of Personal Information"}),Object(v.jsx)("p",{children:"The personal information we collect is stored and/or processed where we or our partners, affiliates, and third-party providers maintain facilities. Please be aware that the locations to which we store, process, or transfer your personal       information may not have the same data protection laws as the country in which you initially provided the information. If we transfer your personal information to third parties in other countries: (i) we will perform those transfers in accordance       with the requirements of applicable law; and (ii) we will protect the transferred personal information in accordance with this privacy policy. "}),Object(v.jsx)("h3",{children:"Your Rights and Controlling Your Personal Information"}),Object(v.jsx)("p",{children:"You always retain the right to withhold personal information from us, with the understanding that your experience of our website may be affected. We will not discriminate against you for exercising any of your rights over your personal       information. If you do provide us with personal information you understand that we will collect, hold, use and disclose it in accordance with this privacy policy. You retain the right to request details of any personal information we hold about      you.  "}),Object(v.jsx)("p",{children:"If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such       person\u2019s consent to provide the personal information to us. "}),Object(v.jsx)("p",{children:"If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time. We will provide you with the ability to unsubscribe from our email-database or opt out of communications.       Please be aware we may need to request specific information from you to help us confirm your identity. "}),Object(v.jsx)("p",{children:"If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us using the details provided in this privacy policy. We will take reasonable steps to correct any      information  found to be inaccurate, incomplete, misleading, or out of date. "}),Object(v.jsx)("p",{children:"If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and       respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint. "}),Object(v.jsx)("h3",{children:"Use of Cookies"}),Object(v.jsx)("p",{children:"We use \u201ccookies\u201d to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our       site. This helps us serve you content based on preferences you have specified. "}),Object(v.jsx)("h3",{children:"Limits of Our Policy"}),Object(v.jsx)("p",{children:"Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices. "}),Object(v.jsx)("h3",{children:"Changes to This Policy"}),Object(v.jsx)("p",{children:"At our discretion, we may change our privacy policy to reflect updates to our business processes, current acceptable practices, or legislative or regulatory changes. If we decide to change this privacy policy, we will post the changes here at      the  same link by which you are accessing this privacy policy. "}),Object(v.jsx)("p",{children:"If required by law, we will get your permission or give you the opportunity to opt in to or opt out of, as applicable, any new uses of your personal information. "}),Object(v.jsx)("h3",{children:"Contact Us"}),Object(v.jsx)("p",{children:"For any questions or concerns regarding your privacy, you may contact us using the following details: "}),Object(v.jsxs)("p",{children:["Tuna",Object(v.jsx)("br",{}),"support@athenabot.site "]})]})};a(75);var R=function(e){var t=e.page,a=Object(s.useState)("Loading.."),n=Object(f.a)(a,2),c=n[0],i=n[1],r=Object(s.useState)("Loading.."),l=Object(f.a)(r,2),d=l[0],h=l[1];return Object(s.useEffect)((function(){switch(t){case"privacy":return h("Privacy Policy"),void i(Y);case"terms":return h("Terms Of Service"),void i("We are preparing our terms of service..")}})),Object(v.jsxs)(s.Fragment,{children:[Object(v.jsx)(y,{}),Object(v.jsx)(o.a,{children:Object(v.jsx)("title",{children:"Legal - Athena"})}),Object(v.jsxs)("div",{className:"athena-legal-container",children:[Object(v.jsx)("div",{className:"athena-legal-head",children:Object(v.jsx)("h1",{style:{color:"var(--primary-theme)"},children:d})}),Object(v.jsx)("div",{className:"athena-legal-content",children:c})]}),Object(v.jsx)(w,{})]})},G=(a(76),function(){return Object(v.jsxs)("div",{className:"athena-error-container",children:[Object(v.jsx)(o.a,{children:Object(v.jsx)("title",{children:"Ooops! - Athena"})}),Object(v.jsx)("h1",{children:"Ooops!"}),Object(v.jsx)("p",{children:"It looks like an un expected error occured on our site. Please give us some time to solve the issue!"}),Object(v.jsx)(i.b,{className:"athena-error-btn",to:"/",children:"Go back to home"})]})}),H=(a(77),a(78),function(){return Object(v.jsx)(i.a,{children:Object(v.jsxs)(r.c,{children:[Object(v.jsx)(r.a,{exact:!0,path:"/",children:Object(v.jsx)(N,{})}),Object(v.jsx)(r.a,{exact:!0,path:"/dashboard",children:Object(v.jsx)(I,{})}),Object(v.jsx)(r.a,{path:"/dashboard/:id/:category?",children:Object(v.jsx)(M,{})}),Object(v.jsx)(r.a,{exact:!0,path:"/commands",children:Object(v.jsx)(A,{})}),Object(v.jsx)(r.a,{exact:!0,path:"/privacy",children:Object(v.jsx)(R,{page:"privacy"})}),Object(v.jsx)(r.a,{exact:!0,path:"/tos",children:Object(v.jsx)(R,{page:"terms"})}),Object(v.jsx)(r.a,{exact:!0,path:"/error",children:Object(v.jsx)(G,{})}),Object(v.jsx)(r.a,{exact:!0,children:Object(v.jsx)(U,{})})]})})});c.a.render(Object(v.jsx)(H,{}),document.getElementById("root"))}},[[79,1,2]]]);
//# sourceMappingURL=main.882416d6.chunk.js.map