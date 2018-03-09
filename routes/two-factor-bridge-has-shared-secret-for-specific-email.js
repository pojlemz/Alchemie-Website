var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// localhost:3000/two-factor-bridge-has-shared-secret
router.get('/two-factor-bridge-has-shared-secret-for-specific-email', function(req, res){
    var response = res;
    TwoFactorAuthenticator.hasSharedSecret(req.query.email, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

module.exports = router;