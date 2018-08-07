var User = require('../models/pg-user');
mlog = require('mocha-logger');
generateRandomHash = require('../server/generate-random-hash');

User.getUserByEmail("a@a.com", function(err, data){
    mlog.log('Data: ', data);
    if (data){
        mlog.log('Email: ', data.email);
        mlog.log('Password: ', data.password);
        mlog.log('Name: ', data.name);
    }
});