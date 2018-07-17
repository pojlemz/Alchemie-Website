var express = require('express');
var router = express.Router();
var host = require('../server/host');
var request = require('request');

var generateRandomHash = require('../server/generate-random-hash');
var messageSender = require('../server/emailer/message-sender');
// var secretKey = require('../keys/// var secretKey = require('../keys/recaptcha');recaptcha');
var secretKey = process.env.GOOGLE_RECAPTCHA;
var ForgottenPasswordLinks = require('../models/forgotten-password-link');
var User = require('../models/user');

const parseForm = require('../server/parse-form');

router.post('/forgotten-password-submitted',parseForm,function(req, res) {
    req.checkBody('email', 'Email required').notEmpty();
    var errors = req.validationErrors();
    console.log(errors);

    // @TODO: Anti spam functionality. Only allow 3 emails to be sent every 15 minutes.
    if(errors){
        res.render('login',{
            errors:errors
        });
    } else {
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({"responseCode" : 1,"responseDesc" : "Please select the captcha"});
        }
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl, function(error, response, body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                // This code block will run if the user doesn't fill in the captcha.
                return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification."}); // Uncomment this line to see what the old code did.
            }
            // This code block will run if the user does fill out the captcha correctly.
            // res.json({"responseCode" : 0,"responseDesc" : "Success"}); // Uncomment this line to see what the old code did.

            // We now check that the entered email actually exists.
            var email = req.body.email;
            User.getUserByEmail(email, function (req2, res2){
                if (res2 === null){
                    // req.flash('error_msg', 'This user is not registered');
                    res.render('user-does-not-exist');
                    // return res.json({"responseCode" : 1,"responseDesc" : "This user is not registered."}); // Uncomment this line to see what the old code did.
                } else {
                    // Now we send an email with a random link and we store the random link in a database.
                    administerPasswordLink(req, res)
                }
            });
        });

    }
});

function administerPasswordLink(req, res){
    var email = req.body.email;
    var currentTime = new Date().getTime();
    var expiryTime = currentTime + 1000 * 60 * 30;
    var randomHash = generateRandomHash();
    var url = host + '/reset-your-password?key=' + randomHash;
    var messageSubject = 'Resetting your password with Block Unity';
    var messageBody = "Greetings from the Block Unity team!\n\n We received a request to reset the password corresponding to this email address.\n\n If this was you then please click on the link found at " + url + " within thirty minutes to reset your password. \n\n If you didn't make this request then feel free to ignore this email. \n\n" +"Best Regards,"+"\n\n" +"The Block Unity Team";
    ForgottenPasswordLinks.createPasswordResetLink({email: email, passwordLink: url, expiryMillisecondsSinceUnixEpoch: expiryTime}, function(err2, res2) {
        messageSender(email, messageSubject, messageBody, function (err, content) {
            res.render('forgotten-password-submitted');
        });
    });
}

module.exports = router;