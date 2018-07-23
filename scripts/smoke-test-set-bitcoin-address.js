var assert = require('assert');
var BitgoAddress = require('../models/bitgo-address');
mlog = require('mocha-logger');

describe('Set Bitcoin address test', function() {
    it('Running a test which sets the Bitcoin address for the user', function(done) {
        BitgoAddress.setAddress("rawbort@salmon.com", 'BTC', '35Ggzxe9v5mxgCJr5gRm9cpbY5Z3nZKAgc', function(err, data){
            mlog.log('Data: ', JSON.stringify(data));
            done();
        });
    });
});