var assert = require('assert');
var BitcoinAddress = require('../models/bitcoin-address');
mlog = require('mocha-logger');

describe('Get Bitcoin address test', function() {
    it('Running a test which gets the Bitcoin address for the user', function(done) {
        BitcoinAddress.getBitcoinAddressByEmail("rawbort@salmon.com", function(err, data){
            mlog.log('Data: ', JSON.stringify(data));
            done();
        });
    });
});