var assert = require('assert');
var BitgoAddress = require('../models/bitgo-address');
mlog = require('mocha-logger');

describe('Get Bitcoin address test', function() {
    it('Running a test which gets the Bitcoin address for the user', function(done) {
        BitgoAddress.getAddressByEmail("rawbort@salmon.com", 'BTC', function(err, data){
            mlog.log('Data: ', JSON.stringify(data));
            done();
        });
    });
});