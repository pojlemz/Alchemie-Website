var assert = require('assert');
mlog = require('mocha-logger');

const client = require("../../models/has-been-kyced");

describe('Just a simple test to set the kyc status of a user.', function() {
    it('Running a test which sets the kyc status of a user.', function(done) {
        // INSERT INTO testtable VALUES(15, :'content');
        data = {email: "y@j.com", hasBeenKyced: 'TRUE'};
        client.setHasBeenKycedByEmail(data.email, data.hasBeenKyced, function(err, res) {
            mlog.log(err ? err.stack : res.email); // Hello World!
            done();
        });
    });
});