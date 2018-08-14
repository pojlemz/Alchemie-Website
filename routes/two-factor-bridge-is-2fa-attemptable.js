var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// Queries to see if user is locked out of attempting to sign into 2fa.
// localhost:3000/is-2fa-attemptable
router.post('/two-factor-bridge-is-2fa-attemptable',parseForm, ensureAuthenticated, function(req, res){
    var response = res;
    const email = req.user.email;
    TwoFactorAuthenticator.isAttemptable(email, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

module.exports = router;