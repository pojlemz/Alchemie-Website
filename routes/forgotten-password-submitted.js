var express = require('express'); // Express app
var router = express.Router(); // Express router
var host = require('../server/host'); // Set variable to the web address of the host (server) - used for making calls from the front end
var request = require('request'); // Set variable to the node module used for making requests

var generateRandomHash = require('../server/generate-random-hash'); // Set variable to a function that generates random hashes
var messageSender = require('../server/emailer/message-sender'); // Set variable to a function responsible for sending emails using Google's API
// var secretKey = require('../keys/// var secretKey = require('../keys/recaptcha');recaptcha');
var secretKey = process.env.GOOGLE_RECAPTCHA; // Set secret key variable to key used for Google's captcha
var ForgottenPasswordLinks = require('../models/forgotten-password-link'); // Set variable to match the forgottenpasswordlink table in postgres
var User = require('../models/user'); // Set variable to work with postgres 'User' table

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid

router.post('/forgotten-password-submitted',parseForm,function(req, res) { // Route called when the user reports that they have forgotten their password
    req.checkBody('email', 'Email required').notEmpty(); // Ensures that the email body parameter is provided in the POST request
    var errors = req.validationErrors(); // Set variable to be all the validation errors that could come with the request
    console.log(errors); // Print the errors - was used for debugging at some point

    // @TODO: Anti spam functionality. Only allow 3 emails to be sent every 15 minutes.
    if(errors){ // If there are validation errors
        res.render('login',{ // Show the login page also reporting the validation errors that were found
            errors:errors // Include the errors as a parameter
        });
    } else { // If there are no validation errors
        // If the request body contains the captcha response
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({"responseCode" : 1,"responseDesc" : "Please select the captcha"}); // Send back a response telling the user to select the captcha
        }
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl, function(error, response, body) { // Send a request to the verification url
            body = JSON.parse(body); // Set body to a version of body parsed with JSON
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) { // If body has a success parameter
                // This code block will run if the user doesn't fill in the captcha.
                return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification."}); // Uncomment this line to see what the old code did.
            }
            // This code block will run if the user does fill out the captcha correctly.
            // res.json({"responseCode" : 0,"responseDesc" : "Success"}); // Uncomment this line to see what the old code did.

            // We now check that the entered email actually exists.
            var email = req.body.email; // Set variable to email parameter of original client request
            User.getUserByEmail(email, function (req2, res2){ // Get postgres user information using user email
                if (res2 === null){ // If the response is null
                    // req.flash('error_msg', 'This user is not registered');
                    res.render('user-does-not-exist'); // Render the page letting the user know that the user doesn't exist (for easy debugging)
                    // return res.json({"responseCode" : 1,"responseDesc" : "This user is not registered."}); // Uncomment this line to see what the old code did.
                } else { // If the response is not null
                    // Now we send an email with a random link and we store the random link in a database.
                    administerPasswordLink(req, res) // Call a function that sends a link to the user's email instructing them to reset their password.
                }
            });
        });
    }
});

function administerPasswordLink(req, res){ // Function called that sends link to the client's email address with instructions to reset their password
    var email = req.body.email; // Set email variable to be email entered in form on webpage
    var currentTime = new Date().getTime(); // Set current time variable to equal the milliseconds since unix epoch for the current time
    var expiryTime = currentTime + 1000 * 60 * 30; // Set the expiry time to equal the current time plus 30 minutes
    var randomHash = generateRandomHash(); // Set variable to equal a random hash that has been generated by a function
    var url = host + '/reset-your-password?key=' + randomHash; // Set url for resetting password to go to the reset-your-password route at host with the random hash generated
    var messageSubject = 'Resetting your password with Block Unity'; // Set the message subject for the email message.
    // Set the message body for the email in the next line which includes the 'url' variable
    var messageBody = "Greetings from the Block Unity team!\n\n We received a request to reset the password corresponding to this email address.\n\n If this was you then please click on the link found at " + url + " within thirty minutes to reset your password. \n\n If you didn't make this request then feel free to ignore this email. \n\n" +"Best Regards,"+"\n\n" +"The Block Unity Team";
    ForgottenPasswordLinks.createPasswordResetLink({email: email, passwordLink: url, expiryMillisecondsSinceUnixEpoch: expiryTime}, function(err2, res2) { // Create a passowrd reset link in the Postgres table corresponding to the random hash.
        messageSender(email, messageSubject, messageBody, function (err, content) { // Use the message sender function to send an email to the client's email with provided message subject and message body.
            res.render('forgotten-password-submitted'); // Render the page that informs the user their forgotten password has been submitted
        });
    });
}

module.exports = router;