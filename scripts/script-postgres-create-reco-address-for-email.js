var assert = require('assert');
var RecoAccount = require('../models/reco-account');
mlog = require('mocha-logger');

RecoAccount.createRecoAddressForEmail("rawbor@salmon.com", function(err, data){
    mlog.log('Data: ', JSON.stringify(data));
    var id = data.id;
    console.log(id);
    // Data:  {"id":1,"email":"rawbort@salmon.com"}
});