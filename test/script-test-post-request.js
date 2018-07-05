var urlHas2FA = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-has-shared-secret";
$.ajax(urlHas2FA).done(function (msg) { console.log(msg); });
// "" is response when 2FA server is not running
// true is response for when 2FA server is running - Note: typeof(response) = "boolean"

$.post( "/two-factor-bridge-has-shared-secret", {}, function( data ) {
    console.log(data);
}, "json");
// no response when 2FA server is not running
// true otherwise

