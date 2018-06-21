const express = require('express');
const router = express.Router();

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const OrderPromise = require('../models/order-promise');
const OrderPromiseProduct = require('../models/order-promise-product');
const Price = require('../models/price');
const coinType = process.env.BITCOIN_NETWORK;
const HasBeenKyced = require("../models/has-been-kyced");

// TODO: Ensure that the user has been kyced here.
// TODO: Scan order to make sure that it only includes one item.

// TODO: Handle all postgres sql error cases.
// TODO: Check that chosen product address is valid.
router.post('/begin-order-and-get-response', ensureAuthenticated, function(req, res) {
    // TODO: What type of response are we going to get from this call?
    // TODO: Send back a response with the expiry time of the prices
    const response = res;
    const quantities = JSON.parse(req.body.quantities); // We get the quantities of products being ordered which should be exactly one of each.
    var keys = Object.keys(quantities); // keys will be a list of one product code. ie. ['1KILOG']
    var totalQuantity = 0;
    for (var i = 0; i < keys.length; i++) {
        var code = keys[i];
        totalQuantity += quantities[code];
    }
    if (totalQuantity === 1) { // We have to make sure that exactly one product is being ordered for shipping purposes.
        HasBeenKyced.getHasBeenKycedByEmail(req.user.email, function (err, res) {
            if (res !== null && res.kyced) { // User has been successfully kyced so take them to the modal where they can send BTC.
                const productAddress = req.body.productAddress;
                const prices = JSON.parse(req.body.prices);
                bitgo.coin(coinType).wallets().get({id: walletId}).then(function (wallet) {
                    // print the wallets
                    wallet.createAddress({chain: 0}).then(function (address) {
                        // TODO: Go through quantities and prices and then add up what the order total would be
                        var dictOfOrders = {}; // This variable is where we will build all of the detail for the order.
                        // We check that all the prices are at least under a minute old.
                        // We also rebuild the orders from price table using price ids since user data cannot be trusted.
                        var keys = Object.keys(quantities);
                        var priceIdArray = [];
                        for (var i = 0; i < keys.length; i++) {
                            var code = keys[i];
                            priceIdArray.push(prices[code]['id']);
                        }
                        Price.getPricesByIdArray(priceIdArray, function (err, res) {
                            // Build a dictionary so that we can reference a price by 'id'
                            var priceDict = {};
                            for (var i = 0; i < res.length; i++) {
                                priceDict[res[i]['id']] = res[i];
                            }

                            var grandTotal = 0;
                            var priceExpiredFlag = false;
                            var currentTime = new Date().getTime();
                            var keys = Object.keys(quantities);
                            for (var i = 0; i < keys.length; i++) {
                                var code = keys[i];
                                var priceId = prices[code]['id'];
                                var orderData = priceDict[priceId];
                                if (currentTime > orderData.millisecondssinceunixepoch + (1000 * 60)) {
                                    priceExpiredFlag = true;
                                }
                                orderData['qty'] = quantities[code];
                                grandTotal += parseFloat(Number(quantities[code] * prices[code]['price']).toFixed(8));
                                dictOfOrders[code] = orderData;
                            }
                            if (priceExpiredFlag) {
                                response.send({
                                    response: "failure",
                                    error: "The prices you are attempting an order with seem to be outdated."
                                });
                            } else {
                                const depositAddress = address.address;
                                var newOrderPromise = {};
                                newOrderPromise.email = req.user.email;
                                newOrderPromise.coinType = 'BTC';
                                newOrderPromise.depositAddress = depositAddress;
                                newOrderPromise.productAddress = productAddress;
                                newOrderPromise.expiryMillisecondsSinceUnixEpoch = new Date().getTime() + (1000 * 600);
                                newOrderPromise.grandTotal = grandTotal;
                                newOrderPromise.status = "Unpaid";
                                newOrderPromise.transactionOutput = "";
                                OrderPromise.createOrderPromise(newOrderPromise, function (err, res) {
                                    OrderPromise.getOrderPromiseByDepositAddress(depositAddress, function (err, res) {
                                        // We can assume that our prices are good at this point so now we prepare to store order data in a table.
                                        // TODO: Handle error here in case the order promise wasn't created properly
                                        const transactionId = res.transactionid;
                                        var keys = Object.keys(dictOfOrders);
                                        var callbackCount = 0;
                                        var isError = false;
                                        for (var i = 0; i < keys.length; i++) {
                                            newOrderPromiseProduct = {};
                                            newOrderPromiseProduct.transactionId = transactionId;
                                            newOrderPromiseProduct.product = keys[i];
                                            newOrderPromiseProduct.qty = dictOfOrders[keys[i]]['qty'];
                                            newOrderPromiseProduct.priceId = dictOfOrders[keys[i]]['id'];
                                            OrderPromiseProduct.createOrderPromiseProduct(newOrderPromiseProduct, function (err, res) {
                                                callbackCount++;
                                                if (err) {
                                                    isError = true;
                                                }
                                                if (callbackCount === keys.length) {
                                                    if (isError) {
                                                        // If an error was thrown when trying to add one of the products.
                                                        response.send({
                                                            response: "error",
                                                            error: "There was an error when trying to add one of the products to the order promised."
                                                        });
                                                    } else {
                                                        // If no errors were thrown when trying to add one of the products. (ie. all products were added successfully)
                                                        // response.send({response: "success", values: values});
                                                        response.send({
                                                            response: "success",
                                                            productAddress: productAddress,
                                                            prices: prices,
                                                            quantities: quantities,
                                                            depositAddress: depositAddress
                                                        });
                                                    }
                                                }
                                            })
                                        }

                                    });
                                });
                            }
                        });
                    });
                });
            } else {
                console.error("This line of code shouldn't normally be executed.")
            }
        });
    } else {
        console.error("This order should include exactly one product, but for some reason it doesn't.")
    }
});

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;

// ‌‌JSON.stringify(req.body)
// {
//      "productAddress":"0x2b5634c42055806a59e9107ed44d43c426e58258",
//      "prices":"{
//          \"100G\":{\"id\":4963,\"instrument\":\"100G\",\"time_created\":\"2018-06-07T16:15:03.071Z\",\"price\":0.4592929,\"millisecondssinceunixepoch\":\"1528388103068\",\"latest_time\":\"2018-06-07T16:15:03.071Z\"},
//          \"1KILOG\":{\"id\":4964,\"instrument\":\"1KILOG\",\"time_created\":\"2018-06-07T16:15:03.134Z\",\"price\":4.6001703,\"millisecondssinceunixepoch\":\"1528388103134\",\"latest_time\":\"2018-06-07T16:15:03.134Z\"}
//      }",
// "quantities":"
//      {\"1KILOG\":2}"}
