var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

// Accepts an incoming request and then acts as a bridge between client side code and 2fa server

// Queries to see if user is locked out of attempting to sign into 2fa.
// localhost:3000/is-2fa-attemptable
router.get('/two-factor-bridge-is-2fa-attemptable', ensureAuthenticated, function(req, res){
    var response = res;
    TwoFactorAuthenticator.isAttemptable(req.user.email, function(err, res){
        if (err) {
            console.log(err); // Reports an error in case any have occurred.
        }
        response.send(res);
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;