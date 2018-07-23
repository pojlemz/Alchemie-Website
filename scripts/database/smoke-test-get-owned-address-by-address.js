var assert = require('assert');
mlog = require('mocha-logger');

const client = require("../../models/owned-address");

describe('Just a simple test with a sample select statement', function() {
    it('Running a test which prints the results from a simple select statement', function(done) {
        // INSERT INTO testtable VALUES(15, :'content');
        address = "0x00000000000000000000000000000000000";
        client.getOwnedAddressByAddress(address, function(err, res) {
            mlog.log(err ? err.stack : res.email); // Hello World!
            done();
        });
    });
});