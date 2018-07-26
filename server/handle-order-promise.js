const handleConfirmedOrder = require('../server/handle-confirmed-order'); // A function for handling order promises that have been set to confirmed.
const getBlockHeight = require('../server/get-block-height'); // The function that fetches the block height for the current blockchain
const OrderPromise = require('../models/order-promise'); // A Postgres model for the table OrderPromises

var AsyncLock = require('async-lock'); // A module for ensuring utxos only get processed one at a time
var lock = new AsyncLock(); // Create a variable from the asyncronous module
var reportErrorOnlyOnce = false; // Create a variable that tells us if a particular warning has occurred

// ‌‌console.log(orderPromise)
// ‌anonymous {
//     transactionid: 11,
//     email: 'dan@blockunity.com',
//     cointype: 'BTC',
//     depositaddress: '2N3hqBWVNSFgS9uav2Qjh97eSWrUZJU7Z3h',
//     productaddress: ' Click Here To Select An Address ',
//     expirymillisecondssinceunixepoch: '1529613106373',
//     grandtotal: 0.452672,
//     status: 'Unpaid',
//     transactionoutput: ''
// }

// ‌‌console.log(output)
// {   id: 'cfed2842ae3038031773feee6f6d41598de5cc34c15335bd3daad422d3e49c82:1',
//     address: '2N3hqBWVNSFgS9uav2Qjh97eSWrUZJU7Z3h',
//     value: 45267200,
//     valueString: '45267200',
//     blockHeight: 1326035,
//     date: '2018-06-21T20:22:55.460Z',
//     wallet: '5ab2cda32dcbafe707ff865a642ea734',
//     chain: 0,
//     index: 63,
//     redeemScript: '5221024107ee4410dc2dd14b16550fb80a3697046531cb28f55bed740ccb99d6589a0321022e6c4bed41f03b9d4cbf616d4aaec1908d63e6e88676dbbed351718b5171252f21032ba1aeeef48dd4b50d86371321aa4deedc514ac50316c84c73da1a191713fb2b53ae',
//     isSegwit: false
// }

module.exports = function handleOrderPromise(orderPromise, output) { // function that handles order promises that come in
    const blockHeight = output.blockHeight; // Set a variable to equal the block height of the unspent output
    const value = output.value; // Set a variable to equal the value of the output in satoshis
    const address = output.address; // Set a variable to equal the address that the unspent output is contained in
    if (orderPromise !== null && typeof(orderPromise) !== 'undefined') { // If the orderPromise for this address exists
        const status = orderPromise.status; // 'Unpaid', 'Paid', 'Confirmed', 'Filled', 'Ready' etc.
        const key = orderPromise.transactionid; // Set the key variable used for asynchronous locking to equal the transaction number
        lock.acquire(key, function(done) { // Lock this process so that the order promise for the unspent transaction is never processed twice simultaneously
            if (status === "Unpaid" || status === "Paid") { // If the status for the order promise hasn't been confirmed yet
                if (orderPromise.grandtotal * 100000000 <= value) { // This checks to ensure that the user sent enough BTC
                    OrderPromise.setTransactionOutputByDepositAddress(address, output.id, function (err, res) { // Sets the deposit address of the order promise to BitGo id in Postgres table
                        // We can consider the order to be paid here since the value of the unspent is less than the total.
                        getBlockHeight(function (err, res) { // Sets res to be an integer equal to the chain's block height
                            const blockHeightDifference = res.body.height - blockHeight; // Gets number of confirmations for this transaction output
                            // TODO: Revise this block height difference stuff.
                            // if (blockHeightDifference >= 6 && blockHeight !== 99999999) {
                            if (blockHeight !== 99999999) { // If BitGo tells us that its block height is 99999999 then it hasn't been confirmed yet
                                OrderPromise.setOrderStatusByDepositAddress(address, "Confirmed", function (err, res) { // Set the order status of the orderpromise to 'Confirmed'
                                    // Here we pass the transaction off to dealing with a confirmed output.
                                    if (err) { // If there was an error
                                        console.log(err); // Reports an error in case any have occurred.
                                    }
                                    handleConfirmedOrder(orderPromise, output, done); // Handle the confirmed order passing it the order promise, output and function for releasing the asynchronous lock
                                });
                            } else {
                                OrderPromise.setOrderStatusByDepositAddress(address, "Paid", function (err, res) {
                                    // Here we mark the transaction as paid so that calls from the UI can move the user past the payment screen.
                                    if (err) {
                                        console.log(err); // Reports an error in case any have occurred.
                                    }
                                    done(); //Release the asyncronous lock
                                });
                            }
                        });
                    });
                } else {
                    done(); // Release the asyncronous lock
                }
            } else {
                done(); // Release the asyncronous lock
            }
        }); // Note that a callback can be added to this lock along with additional options.
        // TODO: Add a branch for all of the rejected states
    } else {
        // In this case the unspent transaction doesn't correspond to an orderpromise in the table
        // TODO: Find a way to handle unspent outputs that don't correspond to any orders (ie. outgoing change outputs)
        if (!reportErrorOnlyOnce){ // If we haven't reported this warning yet
            console.warn("An unspent was found for an address that doesn't have any order promises in the table."); // Report warning so we know something unusual is happening with application
            reportErrorOnlyOnce = true; // Establish that the warning has been reported.
        }

    }
}