const BitgoAddress = require('../models/bitgo-address'); // Set variable to equal Postgres table storing users' BitGo Addresses

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

// var email = 'dan@blockunity.com';
// var coinType = process.env.BITCOIN_NETWORK;

module.exports = function getBitgoBalanceByEmail(email, coinType, callback) {
    BitgoAddress.getAddressByEmail(email, coinType, function (err, res) { // Using the Postgres BitgoAddress module
        var address = res.address;
        // Now get the Address information
        bitgo.blockchain().getAddress({address: address}, function (err, response) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, response.balance);
            }
        });
    });
};