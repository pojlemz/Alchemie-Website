const OrderPromise = require('../models/order-promise');
const OrderExecuted = require('../models/order-executed');
const handleFilledOrder = require('../server/handle-filled-order');

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const gmailAddress = process.env.GMAIL_ADDRESS;

// These are the fields returned by the getOrderPromiseAndProductsByDepositAddress method.
// transactionid
// email
// cointype
// depositaddress
// productaddress
// expirymillisecondssinceunixepoch
// grandtotal
// status
// transactionoutput
// transactionid
// product
// qty
// priceid

module.exports = function handleConfirmedOrder(orderPromise, utxo, done) {
    // This is where we try to fill the order with Dillon Gage.
    // If the order is filled then we move it's status to filled and it is labelled rejected otherwise.
    const depositAddress = orderPromise.depositaddress;
    OrderPromise.getOrderPromiseAndProductsByDepositAddress(depositAddress, function(err, res){
        // res should contain exactly one item
        var items = [];
        const transactionId = orderPromise.transactionid;
        for (var i = 0; i < res.length; i++){
            // Take the code from lock prices and order script and use it here
            items.push({"code":res[i].product,"transactionType":"buy","qty":res[i].qty.toFixed(0)});
        }
        var url = host + '/FizServices/LockPrices/'+privateToken;
        request.post(url,
            {json:
                {
                    "transactionId": transactionId.toFixed(0),
                    "includeRetailPrices": "no",
                    "items": items
                }
            }
            , function(error, response, body) {
                if (typeof(body) === 'undefined') {
                    console.error("Error when locking prices with Dillon Gage");
                    console.log(error);
                    OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Rejected", function(err, res) {
                        if (err) {
                            console.log(err); // Reports an error in case any have occurred.
                        }
                        console.log("This order has been set to 'Rejected'");
                        done();
                    });
                } else if (body.error || error || response.statusCode === 500) {
                    console.error("Error when locking prices with Dillon Gage");
                    console.log(error);
                    OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Rejected", function(err, res) {
                        if (err) {
                            console.log(err); // Reports an error in case any have occurred.
                        }
                        console.log("This order has been set to 'Rejected'");
                        done();
                    });
                } else {
                    console.log(body);
                    const lockToken = body.lockToken;
                    var url2 = host + '/FizServices/ExecuteTrade/' + privateToken;
                    // https://stage-connect.fiztrade.com/FizServices/ExecuteTrade/token/1349-00bdbf2b582db69fb28b72a446cb6d18
                    /* "inventoryLocation":"DGI", */
                    request.post(url2, {json:
                        {
                            "transactionId":transactionId.toFixed(0),
                            "referenceNumber":transactionId.toFixed(0),
                            "shippingOption":"hold",
                            "lockToken":lockToken,
                            "traderId":gmailAddress
                        }
                    }, function(error, response, body) {
                        // Attempt to place the Dillon Gage order.
                        console.log("Printing response from order.");
                        if (typeof(body) === 'undefined') {
                            console.error("Error when getting body.");
                            console.log(error);
                            if (err) {
                                console.log(err); // Reports an error in case any have occurred.
                            }
                            OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Rejected", function(err, res) {
                                console.log("This order has been set to 'Rejected'");
                                done();
                            });
                        } else {
                            console.log(body);
                            // TODO: Add all the order prices to the orderpromiselockedprices (without a callback counter preferably) for analytics purposes.
                            // Add the order to the table to record that an order that has been placed.
                            newOrderExecuted = {};
                            newOrderExecuted.transactionId = body.transactionId;
                            newOrderExecuted.inventoryLocation = body.inventoryLocation;
                            newOrderExecuted.referenceNumber = body.referenceNumber;
                            newOrderExecuted.status = body.status;
                            newOrderExecuted.confirmationNumber = body.confirmationNumber;
                            // Log the executed order into the table.
                            // TODO: Check if the order has been executed and if it has been then just carry on.
                            OrderExecuted.createOrderExecuted(newOrderExecuted, function(err, res) {
                                // Change the order to 'Filled'
                                // TODO: handle error here.
                                OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Filled", function (err, res) {
                                    // TODO: handle error here.
                                    // handle the filled order
                                    handleFilledOrder(orderPromise, utxo, done);
                                });
                            });
                        }
                    });
                }
            }
        );
    });
}