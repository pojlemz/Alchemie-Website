var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2x3857f9a2abef5e8c20f058aa68fe05d21d96fc4a1b1f9a8a969596f3450ff390"});
mlog = require('mocha-logger');

describe('List the bitcoin wallets so that we can see their ids', function() {
    it('Running a test which shows the ids of the Bitcoin wallets', function(done) {
        bitgo.coin('tbtc').wallets().list({}).then(function(wallets) {
            // print the wallets
            mlog.log(JSON.stringify(wallets));
        });
    });
});