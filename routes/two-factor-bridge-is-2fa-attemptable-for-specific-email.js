var express = require('express'); // Express app
var router = express.Router(); // Express router
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid
// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// Queries to see if user is locked out of attempting to sign into 2fa.
// localhost:3000/is-2fa-attemptable-for-specific-email
router.post('/two-factor-bridge-is-2fa-attemptable-for-specific-email',parseForm, function(req, res){
    var response = res;
    const email = req.query.email;
    TwoFactorAuthenticator.isAttemptable(email, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

module.exports = router;