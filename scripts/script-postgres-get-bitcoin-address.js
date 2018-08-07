var assert = require('assert');
var BitgoAddress = require('../models/bitgo-address');
mlog = require('mocha-logger');

BitgoAddress.getAddressByEmail("rawbort@salmon.com", 'BTC', function(err, data){
    mlog.log('Data: ', JSON.stringify(data));
});