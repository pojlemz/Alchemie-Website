var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

const parseForm = require('../server/parse-form');
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// localhost:3000/two-factor-bridge-delete-shared-secret?code=000000
router.post('/two-factor-bridge-delete-shared-secret',parseForm, ensureAuthenticated, function(req, res) {
    var response = res; // Creates a variable that is in scope for the callback to send the response.
    const code = req.body.code; // This is the six digit code provided in the request.
    const email = req.user.email; // This is the email address provided by req.user when ensureAuthentication is run.
    TwoFactorAuthenticator.deleteSharedSecret(email, code, function(err, res) {
        if (err) { // If there is an error
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res); // Sends the json response back to the client endpoint
    });
});

module.exports = router;