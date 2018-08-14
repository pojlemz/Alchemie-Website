var express = require('express');
var router = express.Router();
var ForgottenPasswordLink = require('../models/forgotten-password-link');
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');
var host = require('../server/host');
var User = require('../models/user');

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid

router.post('/submit-reset-password',parseForm, function(req, res) {
    // body parameters: key, password, code2fa
    var response = res;
    var request = req;
    var key = req.body.key;
    var password = req.body.password;
    var code2fa = req.body.code2fa;
    var passwordLink = host + "/reset-your-password?key=" + key;

    // Validation
    req.checkBody('key', 'Key required').notEmpty();
    req.checkBody('password', 'Password required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        console.error("Errors found");
        for (var i = 0; i < errors.length; i++){
            console.log(errors[i]);
        }
        request.flash('error_msg', "There was an error with the data you provided.");
        response.redirect('/login');
    } else {
        if (typeof(code2fa) === 'undefined' || code2fa === null) {
            code2fa = "000000"; // I don't know how the 2fa server would handle an undefined input.
        }
        ForgottenPasswordLink.getForgottenPasswordLinkByPasswordLink(passwordLink, function (req, res) {
            // get email or report invalid key
            if (res === null) {
                request.flash('error_msg', "The link provided doesn't belong to any email address in our system.");
                response.redirect('/login');
            } else {
                // @TODO: check for link expiry
                var currentTime = new Date().getTime();
                if (res.expirymillisecondssinceunixepoch > currentTime) {
                    var email = res.email;
                    // The following function always passes true into res if a shared secret is not set
                    TwoFactorAuthenticator.verifyOneTimeCodeAndEmail(email, code2fa, function (err, res) {
                        if (err) {
                            console.log(err); // Reports an error in case any have occurred.
                        }
                        if (res) { // If code is successfully verified by this account
                            // TODO: Invalidate change password link
                            User.changeAndHashPassword(email, password, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                request.flash('success_msg', "Your password has been changed.");
                                response.redirect('/login');
                            })
                        } else {
                            request.flash('error_msg', "The code that you entered is incorrect.");
                            response.redirect('/login');
                        }
                    });
                    // check if 2fa code is valid
                } else {
                    request.flash('error_msg', "The link provided has expired.");
                    response.redirect('/login');
                }
            }
        });
    }
});

module.exports = router;