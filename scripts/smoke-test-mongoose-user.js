var mongoose = require('mongoose');
var User = require('../models/user');
mlog = require('mocha-logger');

mongoose.connect('mongodb://localhost/alchemy');
var assert = require('assert');

describe('Smoke Test User', function() {
    describe('getUserByEmail', function() {
        it('Getting a@a.com', function(done) {
            mlog.log('Console log is working');
            User.getUserByEmail('a@a.com', function(err, email){
                if (err){
                    // Expected since this function does not actually search by email
                    mlog.log(err);
                } else {
                    mlog.log('Data is ', email)
                }
                done();
            });
        }).timeout(2000),

        it('Getting unspecified email', function(done) {
            mlog.log('Console log is working');
            User.getUserByEmail('aashjkadskdhkv@afjaiogsfghosdif.com', function(err, email){
                if (err){
                    // Expected since this function does not actually search by email
                    mlog.log(err);
                } else {
                    mlog.log('Data is ', email)
                }
                assert.equal(email, null);
                done();
            });
        }).timeout(2000)
    });
});