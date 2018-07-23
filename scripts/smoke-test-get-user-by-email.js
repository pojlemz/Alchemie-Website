var assert = require('assert');
var User = require('../models/pg-user');
mlog = require('mocha-logger');
generateRandomHash = require('../server/generate-random-hash');

describe('getUserByHashKey test', function() {
    it('Running a test which gets a pending user using the hash key assigned at registration', function(done) {
        User.getUserByEmail("a@a.com", function(err, data){
            mlog.log('Data: ', data);
            if (data){
                mlog.log('Email: ', data.email);
                mlog.log('Password: ', data.password);
                mlog.log('Name: ', data.name);
            }
            done();
        });
    });
});