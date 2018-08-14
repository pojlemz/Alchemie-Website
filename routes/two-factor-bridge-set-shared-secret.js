var express = require('express'); // Express app
var router = express.Router(); // Express router
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// localhost:3000/two-factor-bridge-set-shared-secret?code=000000&sharedSecret=xe26kektvv
router.post('/two-factor-bridge-set-shared-secret',parseForm, ensureAuthenticated, function(req, res){
    var response = res;
    const email = req.user.email;
    const sharedSecret = req.body.sharedSecret;
    const code = req.body.code;
    TwoFactorAuthenticator.setSharedSecret(email, sharedSecret, code, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

module.exports = router;