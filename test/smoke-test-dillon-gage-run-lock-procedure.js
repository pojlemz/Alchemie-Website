require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const OrderInfo = require('../models/order-info');
const OrderLockToken = require('../models/order-lock-token');
const OrderProduct = require('../models/order-product');

const email = 'dan@blockunity.com';
const coinType = 'BTC';
const items = [
    {"code":"1KILOG","transactionType":"buy","qty":"10"},
    {"code":"1GP","transactionType":"buy","qty":"50"}
];
OrderInfo.addNewTransaction(email, coinType, function(err, res){
    const transactionId = res.id;
    var url = host + '/FizServices/LockPrices/'+privateToken;
    request.post(url,
        {json:
            {
                "transactionId": transactionId,
                "includeRetailPrices": "yes",          // optional
                "items": items
            }
        }, function(error, response, body) {
            if (typeof(body) === 'undefined') {
                console.error("Error when getting body.");
                htmlResponse.send({response: "error"});
            } else {
                const lockTokenInformation = body;
                OrderLockToken.SetLockToken(transactionId, lockTokenInformation.lockToken, function(err, res){
                    var callbackCount = 0;
                    var isError = false;
                    if (err){
                        htmlResponse.send({response: "error"});
                    }
                    for (var i = 0; i < lockTokenInformation['prices'].length; i++){
                        const values = lockTokenInformation['prices'][0];
                        values['formula'] = parseFloat(values['formula']);
                        OrderProduct.AddProduct(transactionId, values, function(err, res) {
                            callbackCount++;
                            if (err) {
                                isError = true;
                            }
                            if (callbackCount === lockTokenInformation['prices'].length){
                                if (isError){
                                    // If an error was thrown when trying to add one of the products.
                                    htmlResponse.send({response: "error"});
                                } else {
                                    // If no errors were thrown when trying to add one of the products. (ie. all products were added successfully)
                                    // response.send({response: "success", values: values});
                                    htmlResponse.send({response: "success", values: values});
                                }
                            }
                        });
                    }
                });
            }
        }
    );
});