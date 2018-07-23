var assert = require('assert');
var mlog = require('mocha-logger');
var bcrypt = require('bcryptjs');

describe('Testing bcrypt hash', function() {
    describe('Testing the bcrypt hash to see if it gives us repeatable results', function() {
        it('Hashing aaa', function(done) {
            bcrypt.hash('aaa', '$2a$10$AKylNQQ49oam0G73SrvObu', function(err, hash) {
                if (err){
                    throw err
                }
                mlog.log(hash);
                done();
            });
        });

        it('Comparing hash of a with self', function(done) {
            bcrypt.hash('aaa', '$2a$10$AKylNQQ49oam0G73SrvObu', function(err, hash) {
                if (err){
                    throw err;
                }
                bcrypt.compare('aaa', hash, function(err, isMatch) {
                    if(err) throw err;
                    mlog.log('isMatch: ', isMatch); // should output true.
                    done();
                });
                mlog.log(hash);
            });
        });
    });
});