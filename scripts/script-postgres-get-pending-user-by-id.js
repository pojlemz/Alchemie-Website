var mongoose = require('mongoose');
var PendingUser = require('../models/pg-pending-user');
generateRandomHash = require('../server/generate-random-hash');
mongoose.connect('mongodb://localhost/alchemy');

PendingUser.getUserById("17", function(err, data){
    console.log('Data: ', data);
    if (data) {
        console.log('Email: ', data.email);
        console.log('Password: ', data.password);
        console.log('Name: ', data.name);
    }
});