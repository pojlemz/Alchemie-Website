const express = require('express'); // Express app
const router = express.Router(); // Express router
const HasBeenKyced = require("../models/has-been-kyced");

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
const getAddressByEmailAndCreateIfNotExists = require('../server/get-address-by-email-and-create-if-not-exists');

const getBitgoBalanceByEmail = require('../server/get-bitgo-balance-by-email');

// Get Homepage
router.get('/web-wallet', ensureAuthenticated, function(req, res){
    var response = res;
    var email = req.user.email;
    var coinType = process.env.BITCOIN_NETWORK;
    var btcApiPrefix = "";
    if (coinType === 'tbtc'){
        btcApiPrefix = 'https://testnet.blockchain.info/balance?active=';
    } else {
        btcApiPrefix = 'https://blockchain.info/balance?active=';
    }
    getAddressByEmailAndCreateIfNotExists(email, coinType, function(err, res) {
        if (err) {
            console.error(err);
        }
        var address = res;
        HasBeenKyced.getHasBeenKycedByEmail(email, function (err, res) {
            if (res !== null && res.kyced) {
                getBitgoBalanceByEmail(email, coinType, function(err,res) {
                    // var recoBalance = '340';
                    var recoBalance = 'Loading...';
                    var recoBalanceUSD = 'Loading...';
                    // var recoBalanceUSD = '(3400 USD)';
                    // var btcBalance = (res/100000000).toFixed(8);
                    var btcBalance = 'Loading...';
                    var btcPrice = '3500.00';
                    response.render('web-wallet', {
                        "btc-api-prefix": btcApiPrefix,
                        "btc-balance": btcBalance,
                        "reco-balance-in-reco": recoBalance,
                        "reco-balance-in-usd": recoBalanceUSD,
                        "btc-price": btcPrice,
                        "btc-address": address
                    }); // in case where kyc is completed but user finds this link anyways
                });
            } else {
                response.redirect('/tell-us-who-you-are');
            }
        });
    });
});

module.exports = router;