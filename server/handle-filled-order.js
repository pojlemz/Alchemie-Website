const processMintReadyTransactions = require('../server/process-mint-ready-transactions');
const sendMaximumSpendableIfThresholdReached = require('../server/send-maximum-spendable-if-threshold-reached'); //
const MintReady = require('../models/mint-ready'); // Database table for tokens to be minted
const SellReady = require('../models/sell-ready'); // Database table for sell orders ready to be placed
const OrderExecuted = require('../models/order-executed'); // Database table for Dillon Gage orders that have been executed
const OrderPromise = require('../models/order-promise'); // Database table for all order promises

module.exports = function handleFilledOrder(orderPromise, utxo, done) { // This function is called just after a Dillon Gage order is placed and an order is marked 'Filled'
    console.log("Handling filled order");
    const transactionId = orderPromise.transactionid; // ie. 17
    OrderExecuted.getOrderExecutedByTransactionId(transactionId, function(err, res){ // Get the executed order by transaction id
        if (err) { // If there was an error when getting the executed order
            console.error("Error getting order executed from database."); // Print that there was an error
            done(); // Release the locking mechanism for filled orders
        } else if (res === null || typeof(res) === 'undefined') { // If the response from postgres is that there is no corresponding order
            console.error("The order was never filled/executed since there is no record."); // Print error to console
            done(); // Release the locking mechanism for filled orders
        } else { // If an executed order was successfully fetched
            console.log("Preparing sell order for the exchange.");
            const confirmationNumber = res.confirmationnumber; // Get the confirmation number from the executed order
            // TODO: Nest callbacks so that utxo is cleared last - ie. we change utxos to cleared in the last case.
            // Trigger a 'Bitcoin Sell' order on the exchange to hedge against volatility. ()
            // TODO: Get transaction # from order executed here.
            var newSellReady = {}; // Create new object for storing a 'Sell' order
            newSellReady.transactionId = transactionId; // Set the transaction id of the sell order
            newSellReady.coinType = orderPromise.cointype; // ie. BTC
            newSellReady.grandTotal = orderPromise.grandtotal; // ie. 0.04 // The total BTC due for the order
            SellReady.createSellReady(newSellReady, function (err, res) { // This is an idempotent request.
                // TODO: Trigger the sell order here.
                // Mint Shyft tokens on the Blockchain. (Put record in table)
                const depositAddress = orderPromise.depositaddress; // The deposit address of the order
                OrderPromise.getOrderPromiseAndProductsByDepositAddress(depositAddress, function (err, res) { // Get the order promise along with its products
                    // Assertion: res only has one object (as array)
                    var newMintReady = {}; // Create new object for putting into the mint ready table
                    newMintReady.transactionId = transactionId; // Set transaction id of mint ready object
                    newMintReady.product = res[0].product; // Set product of mint ready object
                    newMintReady.productAddress = orderPromise.productaddress; // Set product address of mint ready product
                    newMintReady.qty = 1; // Set quantity to 1 unit for mint ready order
                    newMintReady.transactionOutput = utxo.id; // BitGo id for the transaction ie. 3e098e457dad758db7876d3b71bbac36a4422dd62bd494ee74fd28c110b99766:0
                    newMintReady.confirmationNumber = confirmationNumber; // Dillon Gage confirmation number
                    MintReady.createMintReady(newMintReady, function (err, res) { // This is an idempotent request.
                        processMintReadyTransactions();
                        // Make Bitcoin transaction and send most Bitcoin from BitGo wallet to exchange.
                        // TODO: Combine all change transactions with new transaction output.
                        OrderPromise.setOrderStatusByDepositAddress(depositAddress, "Ready", function (err, res) { // Change the order status of the Order Promise to 'Readu'
                            // Send ready utxos here along with change utxos.
                            done(); // Release the locking mechanism for filled orders
                        });
                    })
                });
            });
        }
    });
}