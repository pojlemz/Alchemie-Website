var express = require('express'); // Express app
var router = express.Router(); // Express router

var User = require('../models/user');
var PendingUser = require('../models/pending-user');
var generateRandomHash = require('../server/generate-random-hash');
var messageSender = require('../server/emailer/message-sender');
var host = require('../server/host');
var request = require('request');

var secretKey = process.env.GOOGLE_RECAPTCHA;

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid

// Register User
router.post('/register', parseForm, function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name required').notEmpty();
	req.checkBody('email', 'Email required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	console.log(errors);

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            // TODO: report some kind of error saying that captcha was not filled out correctly
            res.redirect('login');
        } else {
            // req.connection.remoteAddress will provide IP address of connected user.
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
            // Hitting GET request to the URL, Google will respond with success or error scenario.
            request(verificationUrl, function (error, response, body) {
                body = JSON.parse(body);
                // Success will be true or false depending upon captcha validation.
                if (body.success !== undefined && !body.success) {
                    // This code block will run if the user doesn't fill in the captcha.
                    // TODO: report some kind of error saying that captcha was not filled out correctly
                    res.redirect('login');
                } else {
                    // Assertion: Captcha filled correctly.
                    // Check for duplicate emails here.
                    User.getUserByEmail(email, function (err, emailFound) {
                        // emailFound will be null if we have not found an instance of it in the database
                        console.log('emailFound', emailFound);
                        if (emailFound === null) {
                            PendingUser.deleteUserByEmail(email, function (err, data) {
                                // replace any pending user request with this email
                                var randomHash = generateRandomHash();
                                var newUser = {
                                    name: name,
                                    email: email,
                                    password: password,
                                    key: randomHash
                                };
                                PendingUser.createUser(newUser, function (err, user) {
                                    if (err) throw err;
                                    console.log(user);
                                });
                                // Send an email to the user here
                                var messageSubject = 'Welcome to the Block Unity Platform';
                                var url = host + '/complete-registration?key=' + randomHash;
                                var messageBody = 'Please click on the link found at ' + url + ' to complete the registration for your Block Unity Account.';
                                messageSender(email, messageSubject, messageBody, function (err, content) {
                                    req.flash('success_msg', 'Check your email to finalize your registration.');
                                    res.redirect('/login');
                                });
                            });
                        } else {
                            var errors = [{
                                param: 'email',
                                msg: 'User has already been registered with this email address',
                                value: ''
                            }]
                            res.render('register', {
                                errors: errors
                            });
                        }
                    });
                }
            });
        }
	}
});

module.exports = router;