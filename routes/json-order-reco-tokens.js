const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
const getUSDToBTCConversionRate = require('../server/get-usd-to-btc-conversion-rate');

const getAddressByEmailAndCreateIfNotExists = require('../server/get-address-by-email-and-create-if-not-exists');
const getBitgoBalanceByEmail = require('../server/get-bitgo-balance-by-email');

const BitcoinSpent = require('../models/bitcoin-spent');
const RecoBalance = require('../models/reco-balance');
const HasBeenKyced = require("../models/has-been-kyced");

var express = require('express'); // Express app
var router = express.Router(); // Express router

// try http://localhost:3000/echo-address?address=a@a.com
router.get('/order-reco-tokens', ensureAuthenticated, function(req, res){
    var price = parseFloat(parseFloat(req.query.price).toFixed(8));
    var quantity = parseInt(req.query.quantity);

    var response2 = res; // Using the variable name 'response' causes problems.
    // response.send({msg: "The buying price requested is too low"});

    // getUSDToBTCConversionRate(function(rate) {
    //     response2.send({msg: "The buying price requested is too low"});
    // });
    getUSDToBTCConversionRate(function(rate) {
        var usdToToken = 10; // TODO: eliminate this duplicate
        var oneRecoInBtc = parseFloat((1 / rate) * usdToToken);
        if (oneRecoInBtc > price) { // If the user requested a price that was too low.
            response2.send({msg: "The buying price requested is too low"});
        } else {
            var totalCostInBTC = price * quantity;
            BitcoinSpent.getBitcoinSpentByEmail(req.user.email, function(err, res){
                var amountSpent = res.amount;
                var email = req.user.email;
                var coinType = process.env.BITCOIN_NETWORK;
                getAddressByEmailAndCreateIfNotExists(email, coinType, function(err, res) {
                    if (err) {
                        console.error(err);
                    }
                    var address = res;
                    HasBeenKyced.getHasBeenKycedByEmail(email, function (err, res) {
                        if (res !== null && res.kyced) {
                            getBitgoBalanceByEmail(email, coinType, function(err, res) {
                                var balance = parseFloat(res / 100000000);
                                if (balance - amountSpent < totalCostInBTC) { // If the amount of funds to spend don't cover the cost of the tokens
                                    console.log("Not enough funds.");
                                    response2.send({msg: "There are not enough funds in the account to cover the requested purchase"});
                                } else {
                                    BitcoinSpent.addToAmountSpent(email, totalCostInBTC, function(err, res){
                                        RecoBalance.addToRecoBalance(email, quantity, function(err, res){
                                            response2.send({msg: "Transaction complete"});
                                        });
                                    });
                                }
                            });
                        }
                    })
                })
            });
        }
    });
});

module.exports = router;