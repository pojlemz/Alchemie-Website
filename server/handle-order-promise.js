const handleConfirmedOrder = require('../server/handle-confirmed-order');
const getBlockHeight = require('../server/get-block-height');
const OrderPromise = require('../models/order-promise');

module.exports = function handleOrderPromise(orderPromise, output, blockHeight, value) {
    const address = output.address;
    if (orderPromise === null || typeof(orderPromise) === 'undefined') {
        const status = orderPromise.status;
        if (status === "Unpaid" || status === "Paid") {
            if (orderPromise.grandtotal <= value) {
                OrderPromise.setTransactionOutputByDepositAddress(address, output.id, function(err, res) {
                    // We can consider the order to be paid here since the value of the unspent is less than the total.
                    getBlockHeight(function (err, res) {
                        const blockHeightDifference = res.height - blockHeight;
                        if (blockHeightDifference >= 6) {
                            OrderPromise.setOrderStatusByDepositAddress(address, "Confirmed", function(err, res){
                                // Here we pass the transaction off to dealing with a confirmed output.
                                if (err) {
                                    console.log(err); // Reports an error in case any have occurred.
                                }
                                handleConfirmedOrder(orderPromise, output);
                            });
                        } else {
                            OrderPromise.setOrderStatusByDepositAddress(address, "Paid", function(err, res){
                                // Here we mark the transaction as paid so that calls from the UI can move the user past the payment screen.
                                if (err) {
                                    console.log(err); // Reports an error in case any have occurred.
                                }
                            });
                        }
                    });
                });
            }
        }
        // TODO: Add a branch for all of the rejected states
    } else {
        // In this case the unspent transaction doesn't correspond to an orderpromise in the table
        // TODO: Find a way to handle unspent outputs that don't correspond to any orders (ie. outgoing change outputs)
    }
}