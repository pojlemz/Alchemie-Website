const assert = require('assert');
const WithdrawalBitcoinAddress = require('../models/withdrawal-address');
mlog = require('mocha-logger');

describe('Get Withdrawal Bitcoin Address', function() {
    it('Running a test which adds the Bitcoin addresses from the withdrawal list', function (done) {
        WithdrawalBitcoinAddress.getBitcoinAddresses("dan@blockunity.com", function (err, data) {
            mlog.log('Data: ', JSON.stringify(data));
            done();
        });
    });
});