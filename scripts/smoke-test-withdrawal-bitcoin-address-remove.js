const assert = require('assert');
const WithdrawalBitcoinAddress = require('../models/withdrawal-address');
mlog = require('mocha-logger');

describe('Remove Withdrawal Bitcoin Address', function() {
    it('Running a test which removes the Bitcoin address from the withdrawal list', function (done) {
        WithdrawalBitcoinAddress.removeBitcoinAddress("dan@blockunity.com", '35Ggzxe9v5mxgCJr5gRm9cpbY5Z3nZKAgc', function (err, data) {
            mlog.log('Data: ', JSON.stringify(data));
            done();
        });
    });
});