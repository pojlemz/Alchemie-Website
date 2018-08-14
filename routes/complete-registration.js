var express = require('express'); // Express app
var router = express.Router(); // Express router

var User = require('../models/user'); // User postgres table
var PendingUser = require('../models/pending-user'); // Pending user postgres table

router.get('/complete-registration', function(req, res){ // complete registration route - runs when a user clicks on a link sent to their email
    var randomHash = req.query.key; // Sets variable to the code associated with the registration created earlier
    console.log('Success entering complete-registration route'); // Log message to enable easier debugging
    PendingUser.getUserByHashKey(randomHash, function(err, data){ // Get user corresponding to random hash in url
        if (err){ // If the postgres request gives us some kind of error
            req.flash('error_msg', 'Error while reading user key.'); // Set up flash message to show an error to the user.
            res.redirect('/login'); // Redirect to the login route
        } else { // If there is no error
            if (data === null) { // If the hash does not correspond to any user
                req.flash('error_msg', 'This key does not correspond to any pending user.'); // Show the user a message saying the hash doesn't correspond to any user
                res.redirect('/login'); // Redirect to the login route
            } else { // If the hash does correspond to a user
                console.log('Success finding a key.'); // Display a message proclaiming success that a key has been found
                PendingUser.deleteUserByHashKey(randomHash, function (err) { // Remove the corresponding user from the pending user table
                    if (err) { // If there is an error in this Postgres request
                        req.flash('error_msg', 'Error while removing user pending registration.'); // Tell the user that there was some kind of error when removing the Postgres user
                        res.redirect('/login'); // Redirect to the login route
                    } else { // If there is no error
                        // Add user to users table
                        // @TODO handle error here.
                        var newUser = { // Create an object called new user
                            name: data.name, // Set name to the pending user's name
                            email: data.email, // Set email to the pending user's email
                            password: data.password // Set password to the pending user's password
                        };
                        User.createUser(newUser, function (err, user) { // Using the Postgres model User, create a new user with the newUser object
                            if (err) throw err; // If there is an error then throw an exception
                            console.log(user); // If there is no error then print the user object
                        });
                        req.flash('success_msg', 'You are registered and can now login.'); // Display a message to the user saying that they can now log in
                        res.redirect('/login'); // Redirect user to the login page
                    }
                });
            }
        }
        // Remove user from pending user table
    })
    // Identify the pending user
    // Move the pending user over to the
});

module.exports = router;