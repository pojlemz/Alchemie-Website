var mongoose = require('mongoose');
var User = require('../models/user');
mlog = require('mocha-logger');

mongoose.connect('mongodb://localhost/alchemy');

console.log('Console log is working');
User.getUserByEmail('a@a.com', function(err, email){
    if (err){
        // Expected since this function does not actually search by email
        console.log(err);
    } else {
        console.log('Data is ', email)
    }
});

console.log('Console log is working');
User.getUserByEmail('aashjkadskdhkv@afjaiogsfghosdif.com', function(err, email){
    if (err){
        // Expected since this function does not actually search by email
        console.log(err);
    } else {
        console.log('Data is ', email)
    }
});