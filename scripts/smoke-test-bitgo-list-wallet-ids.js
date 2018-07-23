require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
mlog = require('mocha-logger');

describe('List the bitcoin wallets so that we can see their ids', function() {
    it('Running a test which shows the ids of the Bitcoin wallets', function(done) {
        bitgo.coin('tbtc').wallets().list({}).then(function(wallets) {
            // print the wallets
            mlog.log(JSON.stringify(wallets));
            done();
        });
    });
});