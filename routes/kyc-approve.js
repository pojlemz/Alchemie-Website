// This route isn't being used anymore.

// Set pending to no
// Set has been kyced to yes

var express = require('express');
var router = express.Router();
var ForgottenPasswordLink = require('../models/forgotten-password-link');
var TwoFactorAuthenticator = require('../server/two-factor-authenticator');
var host = require('../server/host');
var User = require('../models/user');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require("../models/document-in-review");

router.get('/kyc-approve',function(req, res) {
    // body parameters: key, password, code2fa
    var ipAddress = req.connection.remoteAddress;
    var desiredHostAddress = process.env.KYC_HOST;
    var email = req.query.email;

    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    var errors = req.validationErrors();

    if(errors){
        console.log(errors);
    } else {
        // Check that the IP address matches the IP contained in .env
        // Disable pending status for the address
        // Enable has-been-kyced for the address
        if (ipAddress === desiredHostAddress) {
            DocumentInReview.setIsDocumentInReviewByEmail(email, false, function (err, res) {
                if (err) {
                    console.log(err);
                }
                HasBeenKyced.setHasBeenKycedByEmail(email, true, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    }
});

module.exports = router;