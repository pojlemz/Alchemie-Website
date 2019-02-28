const BitgoAddress = require('../models/bitgo-address'); // Set variable to equal Postgres table storing users' BitGo Addresses
const BitGoJS = require('bitgo'); // Set variable to be Bitgo node module

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN}); // Set variable to equal BitGo client used for making API requests
const walletId = process.env.WALLET_ID; // Set variable to equal wallet id
// const coinType = process.env.BITCOIN_NETWORK; // Set variable to equal Bitcoin network ie. 'tbtc'

module.exports = function getAddressByEmailAndCreateIfNotExists(email, coinType, callback) {
    // module.exports.getAddressByEmail = function(email, coinType, callback){
    // }
    BitgoAddress.getAddressByEmail(email, coinType, function(err, res) { // Using the Postgres BitgoAddress module
        if (err) {
            callback(err, null);
        } else {
            if (typeof(res) === 'undefined' || res === null) { // If a Bitcoin address has not been assigned for this user
                bitgo.coin(coinType).wallets().get({id: walletId}).then(function (wallet) { // Get the BitGo wallet and use it as a parameter in the callback
                    wallet.createAddress({label: email}).then(function (address) { // Create a new bitcoin address.
                        const coinAddress = address.address; // Set variable to equal Bitcoin address that was just created
                        BitgoAddress.setAddress(email, coinType, coinAddress, function (err, res) { // Set BitGo address for logged in user
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, coinAddress);
                            }
                        });
                    });
                });
            } else { // If a Bitcoin address has been assigned for this user
                const address = res.address;
                bitgo.blockchain().getAddress({address: address}, function (err, res) { // Bitgo client makes call to get info about bitcoin address
                    if (err) { // If there is some kind of error reported by the API call
                        callback(err, null);
                    } else {
                        callback(null, address);
                    }
                });
            }
        }
    });
}