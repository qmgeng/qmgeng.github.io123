!function(e){"function"==typeof define&&define.amd?define("jquery-alert",["jquery-widget"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){"use strict";function t(t,n){var i=n.css,o=t.find(".wd-ft"),d=e('<button class="wd-ok">'+n.okText+"</button>");d.addClass(i.ok).on("click",function(){n.ok.call(t)}),o.append(d)}function n(t,n){var i=n.css,o=t.find(".wd-ctn"),d=e('<div class="wd-ipt"><input placeholder="'+n.remind+'" value="'+n.defaultValue+'"></input></div>'),c=t.find(".wd-ok");d.addClass(i.input).find("input").on("keypress",function(e){13===e.which&&c.click()}),o.append(d)}function i(e,t,n){var i=e[t];e[t]=function(){this.hide(),n&&"ok"===t?i.call(this,this.find(".wd-ipt input").val()):i.call(this),this.destroy()}}var o={content:"",modal:!1,fixed:!1,css:{panel:"wd-ui-pn",content:"wd-ui-ctn",footer:"wd-ui-ft",close:"wd-ui-close"},close:function(){},closeText:"close",width:"auto",height:"auto",open:function(){}},d={okText:"ok",css:{ok:"wd-ui-ok"},ok:function(){}},c={defaultValue:"",remind:"",css:{input:"wd-ui-ipt"}};e.alert=function(t){return t=e.extend(!0,{},o,t,{closeable:!0,autoOpen:!0,footer:"",title:!1,dragable:!1,align:{fixed:t.fixed}}),i(t,"close"),e.widget(t)},e.confirm=function(n){n=e.extend(!0,{},o,d,n,{closeable:!0,autoOpen:!0,footer:"",title:!1,dragable:!1,align:{fixed:n.fixed}}),i(n,"close"),i(n,"ok");var c=e.widget(n);return t(c,n),c},e.prompt=function(u){u=e.extend(!0,{},o,d,c,u,{closeable:!0,autoOpen:!0,footer:"",title:!1,dragable:!1,align:{fixed:u.fixed}}),i(u,"close"),i(u,"ok",!0);var l=e.widget(u);return t(l,u),n(l,u),l}});