var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

const parseForm = require('../server/parse-form');
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// localhost:3000/verify-one-time-code-and-email-against-shared-secret?code=000000&sharedSecret=xe26kektvv
router.post('/two-factor-bridge-verify-one-time-code-and-email-against-specific-shared-secret',parseForm, ensureAuthenticated, function(req, res){
    var response = res;
    const email = req.user.email;
    const code = req.body.code;
    const sharedSecret = req.body.sharedSecret;
    TwoFactorAuthenticator.verifyOneTimeCodeAndEmailAgainstSharedSecret(email, code, sharedSecret, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

module.exports = router;