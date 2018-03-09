var express = require('express');
var router = express.Router();

var User = require('../models/user');
var PendingUser = require('../models/pending-user');

router.get('/complete-registration', function(req, res){
    var randomHash = req.query.key;
    console.log('Success entering complete-registration route');
    PendingUser.getUserByHashKey(randomHash, function(err, data){
        if (err){
            req.flash('error_msg', 'Error while reading user key.');
            res.redirect('/login');
        } else {
            if (data === null) {
                req.flash('error_msg', 'This key does not correspond to any pending user.');
                res.redirect('/login');
            } else {
                console.log('Success finding a key.');
                PendingUser.deleteUserByHashKey(randomHash, function (err) {
                    if (err) {
                        req.flash('error_msg', 'Error while removing user pending registration.');
                        res.redirect('/login');
                    } else {
                        // Add user to users table
                        // @TODO handle error here.
                        var newUser = {
                            name: data.name,
                            email: data.email,
                            password: data.password
                        };
                        User.createUser(newUser, function (err, user) {
                            if (err) throw err;
                            console.log(user);
                        });
                        req.flash('success_msg', 'You are registered and can now login.');
                        res.redirect('/login');
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