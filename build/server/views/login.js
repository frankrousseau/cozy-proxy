var jade = require('jade/runtime');
module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (polyglot, name) {
buf.push("<!DOCTYPE html><html lang=\"en\"><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"><title>" + (jade.escape((jade_interp = polyglot.t('login title')) == null ? '' : jade_interp)) + "</title><link rel=\"apple-touch-icon\" sizes=\"57x57\" href=\"/apple-touch-icon-57x57.png\"><link rel=\"apple-touch-icon\" sizes=\"60x60\" href=\"/apple-touch-icon-60x60.png\"><link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\"/apple-touch-icon-72x72.png\"><link rel=\"apple-touch-icon\" sizes=\"76x76\" href=\"/apple-touch-icon-76x76.png\"><link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\"/apple-touch-icon-114x114.png\"><link rel=\"apple-touch-icon\" sizes=\"120x120\" href=\"/apple-touch-icon-120x120.png\"><link rel=\"apple-touch-icon\" sizes=\"144x144\" href=\"/apple-touch-icon-144x144.png\"><link rel=\"apple-touch-icon\" sizes=\"152x152\" href=\"/apple-touch-icon-152x152.png\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon-180x180.png\"><link rel=\"icon\" type=\"image/png\" href=\"/favicon-32x32.png\" sizes=\"32x32\"><link rel=\"icon\" type=\"image/png\" href=\"/favicon-194x194.png\" sizes=\"194x194\"><link rel=\"icon\" type=\"image/png\" href=\"/favicon-96x96.png\" sizes=\"96x96\"><link rel=\"icon\" type=\"image/png\" href=\"/android-chrome-192x192.png\" sizes=\"192x192\"><link rel=\"icon\" type=\"image/png\" href=\"/favicon-16x16.png\" sizes=\"16x16\"><link rel=\"manifest\" href=\"/manifest.json\"><meta name=\"msapplication-TileColor\" content=\"#15a7c7\"><meta name=\"msapplication-TileImage\" content=\"/mstile-144x144.png\"><meta name=\"theme-color\" content=\"#15a7c7\"><link rel=\"stylesheet\" href=\"/fonts/fonts.css\"><link rel=\"stylesheet\" href=\"/styles/app.css\"><link rel=\"icon\" type=\"image/x-icon\" href=\"/favicon.png\"></head><body><div id=\"content\"><div id=\"header\"><a id=\"logo\" href=\"http://cozy.io\"><img src=\"/images/happycloud.png\"><span>beta</span></a></div><div class=\"proxy-form\"><h1>" + (jade.escape((jade_interp = polyglot.t('login headline')) == null ? '' : jade_interp)) + "&nbsp;<span id=\"username\">" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "</span>,<br>" + (jade.escape((jade_interp = polyglot.t('login connection invitation')) == null ? '' : jade_interp)) + "</h1><p class=\"input-wrapper\"><input id=\"password-input\" type=\"password\"" + (jade.attr("placeholder", "" + (polyglot.t('login password placeholder')) + "", true, true)) + "></p><div id=\"btn-wrapper\"><div class=\"btn-container right single\"><button id=\"submit-btn\">" + (jade.escape((jade_interp = polyglot.t('login button')) == null ? '' : jade_interp)) + "</button></div></div><div class=\"error-box alert alert-error\"></div><div class=\"error-box alert alert-success\"></div><p class=\"additional-line\"><a id=\"forgot-password\">" + (jade.escape((jade_interp = polyglot.t('login forget password button')) == null ? '' : jade_interp)) + "</a></p></div></div><script src=\"/scripts/app.js\"></script><script>require('client');</script><script>require('login');\nvar LOGIN_SUCCESS_MESSAGE = \"" + (jade.escape((jade_interp = polyglot.t('login success message')) == null ? '' : jade_interp)) + "\";\nvar RESET_SUCCESS_MESSAGE = \"" + (jade.escape((jade_interp = polyglot.t('login reset success message')) == null ? '' : jade_interp)) + "\";\nvar LOGIN_BUTTON_LABEL = \"" + (jade.escape((jade_interp = polyglot.t('login button')) == null ? '' : jade_interp)) + "\";\n</script></body></html>");}.call(this,"polyglot" in locals_for_with?locals_for_with.polyglot:typeof polyglot!=="undefined"?polyglot:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined));;return buf.join("");
}