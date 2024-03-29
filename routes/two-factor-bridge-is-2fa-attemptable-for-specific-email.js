var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// Queries to see if user is locked out of attempting to sign into 2fa.
// localhost:3000/is-2fa-attemptable-for-specific-email
router.get('/two-factor-bridge-is-2fa-attemptable-for-specific-email', function(req, res){
    var response = res;
    TwoFactorAuthenticator.isAttemptable(req.query.email, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

module.exports = router;