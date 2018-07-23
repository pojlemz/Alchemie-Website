var assert = require('assert');
mlog = require('mocha-logger');

require('dotenv').config();
const client = require("../../models/has-been-kyced");

describe('Just a simple test to get the kyc status of a user.', function() {
    it('Running a test which gets the kyc status of a user.', function(done) {
        // INSERT INTO testtable VALUES(15, :'content');
        data = {email: "dan@blockunity.com"};
        client.getHasBeenKycedByEmail(data.email, function(err, res) {
            mlog.log(err ? err.stack : res.email); // Hello World!
            if (!err){
                mlog.log("email: ", res.email);
                mlog.log("kyced: ", res.kyced);
            }
            done();
        });
    });
});