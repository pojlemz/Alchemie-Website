require('dotenv').config({path: '../.env'});
const getUnspentsForAddress = require('./get-unspents-for-address-with-wallet');
const BitgoAddress = require("../models/bitgo-address");

// Get Homepage
module.exports = function getUnspentsForEmail(email, callback){
    BitgoAddress.getAddressByEmail(email, 'BTC', function(err, res){
        const address = res.address; // Create a bitcoin address
        // address example - "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr"
        getUnspentsForAddressWithWallet(address, callback);
    });
};

