var express = require('express');
var router = express.Router();
var ForgottenPasswordLink = require('../models/forgotten-password-link');
var host = require('../server/host');

router.get('/reset-your-password',function(req, res) {
    // start session variable containing the link (needed for next call)
    var key = req.query.key; // ie. dbe57232f67d5b365c7505ef5374716b81b528f1
    var passwordLink = host + '/reset-your-password?key='+key;
    ForgottenPasswordLink.getForgottenPasswordLinkByPasswordLink(passwordLink, function(err2, res2) {
        if (res2 !== null) {
            var email = res2.email;
            // render page with client side code that will prompt user to enter their password twice
            res.render('reset-your-password', {
                'temporary-data-reset-password-link': key,
                'temporary-data-email': email
            });
            // An overlay will pop up asking the user for a two factor code if 2FA is enabled
        } else {
            res.send("Invalid password link");
        }
    });


});

module.exports = router;