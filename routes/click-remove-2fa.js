var express = require('express');
var router = express.Router();
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');

// Get Homepage
router.get('/click-remove-2fa', ensureAuthenticated, function(req, res){
    var response = res;
    TwoFactorAuthenticator.hasSharedSecret(req.user.email, function(err, res){

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