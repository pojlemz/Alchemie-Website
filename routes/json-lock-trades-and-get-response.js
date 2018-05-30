var express = require('express');
var router = express.Router();

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const OrderInfo = require('../models/order-info');
const OrderLockToken = require('../models/order-lock-token');
const OrderProduct = require('../models/order-product');
const getUsdToBtc = require('../server/get-usd-to-btc');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/lock-trades-and-get-response
router.post('/lock-trades-and-get-response', ensureAuthenticated, function(req, res){
    const htmlResponse = res;
    const email = req.user.email;
    const coinType = 'BTC';
    const items = JSON.parse(req.body.items); /*[
        {"code":"1KILOG","transactionType":"buy","qty":"10"},
        {"code":"1GP","transactionType":"buy","qty":"50"}
    ] */
    OrderInfo.addNewTransaction(email, coinType, function(err, res){
        if (err || res === null){
            console.error("Error when adding new order.");
            htmlResponse.send({response: "error"});
        } else {
            const transactionId = res.id;
            var url = host + '/FizServices/LockPrices/'+privateToken;
            var jsonToSend = {
                "transactionId": transactionId.toFixed(0),
                "includeRetailPrices": "yes",          // optional
                "items": items
            };
            request.post(url,
                {json: jsonToSend }, function(error, response, body) {
                    if (error || typeof(body) === 'undefined' || body.error) {
                        console.error("Error when getting body.");
                        htmlResponse.send({response: "error"});
                    } else {
                        const lockTokenInformation = body;
                        OrderLockToken.SetLockToken(transactionId, lockTokenInformation.lockToken, function(err, res){
                            var callbackCount = 0;
                            var isError = false;
                            if (err || res === null){
                                htmlResponse.send({response: "error"});
                            } else {
                                var informationToSendBack = [];
                                for (var i = 0; i < lockTokenInformation['prices'].length; i++) {
                                    //TODO: Parse quantity
                                    const values = lockTokenInformation['prices'][i];
                                    values['formula'] = parseFloat(values['formula']);
                                    values['code'] = values['product'];
                                    values['unitPriceBtc'] = getUsdToBtc(values['retailPrice']);
                                    values['totalPriceBtc'] = getUsdToBtc(values['retailAmount']);
                                    informationToSendBack.push(values);
                                    OrderProduct.AddProduct(transactionId, values, function (err, res) {
                                        callbackCount++;
                                        if (err) {
                                            isError = true;
                                        }
                                        if (callbackCount === lockTokenInformation['prices'].length) {
                                            if (isError) {
                                                // If an error was thrown when trying to add one of the products.
                                                htmlResponse.send({response: "error"});
                                            } else {
                                                // If no errors were thrown when trying to add one of the products. (ie. all products were added successfully)
                                                // response.send({response: "success", values: values});
                                                htmlResponse.send({response: "success", values: informationToSendBack});
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            );
        }
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.send('You are not logged in.');
    }
}

module.exports = router;