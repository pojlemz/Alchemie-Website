const sendMaximumSpendableIfThresholdReached = require('../server/send-maximum-spendable-if-threshold-reached');
const MintReady = require('../models/mint-ready');
const SellReady = require('../models/sell-ready');
const OrderExecuted = require('../models/order-executed');

module.exports = function handleFilledOrder(orderPromise, utxo, confirmationNumber) {
    const transactionId = orderPromise.transactionid;
    OrderExecuted.getOrderExecutedByTransactionId(transactionId, function(err, res){
        if (err) {
            console.error("Error getting order executed from database.");
        } else if (res === null || typeof(res) === 'undefined') {
            console.error("The order was never filled/executed since there is no record.");
        } else {
            const confirmationNumber = res.confirmationnumber;
            // TODO: Nest callbacks so that utxo is cleared last - ie. we change utxos to cleared in the last case.
            // Trigger a 'Bitcoin Sell' order on the exchange to hedge against volatility. ()
            // TODO: Get transaction # from order executed here.
            var newSellReady = {};
            newSellReady.transactionId = transactionId;
            newSellReady.coinType = orderPromise.cointype;
            newSellReady.grandTotal = orderPromise.grandtotal;
            SellReady.createSellReady(newSellReady, function (err, res) {
                // TODO: Trigger the sell order here.
                // Mint Shyft tokens on the Blockchain. (Put record in table)
                const depositAddress = orderPromise.depositaddress;
                OrderPromise.getOrderPromiseAndProductsByDepositAddress(depositAddress, function (err, res) {
                    // Assertion: res only has one object (as array)
                    var newMintReady = {};
                    newMintReady.transactionId = transactionId;
                    newMintReady.product = res[0].product;
                    newMintReady.productAddress = orderPromise.productaddress;
                    newMintReady.qty = 1;
                    newMintReady.transactionOutput = utxo.id;
                    newMintReady.confirmationNumber = confirmationNumber;
                    MintReady.createMintReady(newMintReady, function (err, res) {
                        // TODO: Mint all mint ready transactions here.
                        // Make Bitcoin transaction and send most Bitcoin from BitGo wallet to exchange.
                        // TODO: combine all change transactions with new transaction output.
                        const depositAddress = orderPromise.depositaddress;
                        OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Ready", function (err, res) {
                            // Send ready utxos here along with change utxos.
                        });
                    })
                });
            });
        }
    });
}