var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// localhost:3000/verify-one-time-code-and-email?code=000000
router.post('/two-factor-bridge-verify-one-time-code-and-email', function(req, res){
    var response = res;
    const email = req.body.email;
    const code = req.body.code;
    TwoFactorAuthenticator.verifyOneTimeCodeAndEmail(email, code, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

// function ensureAuthenticated(req, res, next){
//     if(req.isAuthenticated()) {
//         return next();
//     } else {
//         //req.flash('error_msg','You are not logged in');
//         res.redirect('/login');
//     }
// }

module.exports = router;