(this["webpackJsonpopen-react-template"]=this["webpackJsonpopen-react-template"]||[]).push([[0],{13:function(e,t,a){e.exports=a(24)},19:function(e,t,a){},24:function(e,t,a){"use strict";a.r(t);var i=a(2),n=a.n(i),o=a(11),l=a.n(o),r=a(8),c=a.n(r),g=a(12),m=a(4),s=a(26),p=(a(19),function(){var e=Object(i.useState)((new Date).toLocaleDateString()),t=Object(m.a)(e,2),a=t[0],o=t[1],l=Object(i.useState)(!1),r=Object(m.a)(l,2),p=r[0],u=r[1],d=Object(i.useState)(null),j=Object(m.a)(d,2),b=j[0],f=j[1],k=function(){var e=localStorage.getItem("webhookURL");return e||(e=prompt("Please enter your Discord webhook URL:"),localStorage.setItem("webhookURL",e)),e}(),h=function(){var e=Object(g.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=k,e.prev=1,e.next=4,s.a.post(t,{content:"".concat(b.title)});case 4:o((new Date).toLocaleDateString()),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),console.error(e.t0);case 10:console.log(b.title),u(!1);case 12:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(){return e.apply(this,arguments)}}();return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",null,n.a.createElement("div",{className:"grid"},[{id:1,title:"Almond Butter",image:"almond-butter.jpg"},{id:2,title:"Blueberries",image:"blueberries.jpg"},{id:3,title:"Broccoli",image:"/images/broccoli.jpg"},{id:4,title:"Bananas",image:"./images/bananas.jpg"},{id:5,title:"Eggs",image:"./images/eggs.jpg"},{id:6,title:"Apples",image:"./images/apples.jpg"},{id:7,title:"Avocado",image:"./images/avocado.jpg"},{id:8,title:"Bread",image:"./images/bread.jpg"},{id:9,title:"Carrots",image:"./images/carrots.jpg"},{id:10,title:"Tofu",image:"./images/tofu.jpg"},{id:11,title:"Potato",image:"./images/potato.jpg"},{id:12,title:"Coffee",image:"./images/coffee.jpg"},{id:13,title:"Zucchini",image:"./images/zucchini.jpg"},{id:14,title:"Oatly",image:"./images/oatly.jpg"},{id:15,title:"Dark Chocolate",image:"./images/dark-chocolate.jpg"},{id:16,title:"Butter",image:"./images/butter.jpg"},{id:17,title:"Granola",image:"./images/granola.jpg"},{id:18,title:"Grapes",image:"./images/grapes.jpg"},{id:19,title:"Green Beans",image:"./images/green-beans.jpg"},{id:20,title:"Honey",image:"./images/honey.jpg"},{id:21,title:"Ice Cream",image:"./images/ice-cream.jpg"},{id:22,title:"Lemon",image:"./images/lemon.jpg"},{id:23,title:"Lettuce",image:"./images/lettuce.jpg"},{id:24,title:"Milk",image:"./images/milk.jpg"}].map((function(e){return n.a.createElement("div",{key:e.id,className:"card",onClick:function(){return function(e){f(e),u(!0)}(e)}},n.a.createElement("img",{src:"/src/assets/images/".concat(e.image),alt:e.title}),n.a.createElement("h2",null,e.title),n.a.createElement("p",null,"Last Ordered: ",a))}))),p&&n.a.createElement("div",{className:"popup"},n.a.createElement("p",null,"Are you sure you want to order ",b.title,"?"),n.a.createElement("button",{onClick:h},"Yes"),n.a.createElement("button",{onClick:function(){u(!1)}},"No")),n.a.createElement("button",{className:"clearWebhook",onClick:function(){localStorage.removeItem("webhookURL"),window.location.reload()}},"Clear Webhook URL")))});l.a.render(n.a.createElement(p,null),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.71ebb58f.chunk.js.map