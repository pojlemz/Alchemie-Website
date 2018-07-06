var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');
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

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;