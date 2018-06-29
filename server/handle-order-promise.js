const handleConfirmedOrder = require('../server/handle-confirmed-order');
const getBlockHeight = require('../server/get-block-height');
const OrderPromise = require('../models/order-promise');

var AsyncLock = require('async-lock');
var lock = new AsyncLock();
var reportErrorOnlyOnce = false;

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

module.exports = function handleOrderPromise(orderPromise, output) {
    const blockHeight = output.blockHeight;
    const value = output.value;
    const address = output.address;
    if (orderPromise !== null && typeof(orderPromise) !== 'undefined') {
        const status = orderPromise.status;
        const key = orderPromise.transactionid;
        lock.acquire(key, function(done) {
            if (status === "Unpaid" || status === "Paid") {
                if (orderPromise.grandtotal * 100000000 <= value) { // This checks to ensure that the user sent enough BTC
                    OrderPromise.setTransactionOutputByDepositAddress(address, output.id, function (err, res) {
                        // We can consider the order to be paid here since the value of the unspent is less than the total.
                        getBlockHeight(function (err, res) {
                            const blockHeightDifference = res.body.height - blockHeight;
                            // TODO: Revise this block height difference stuff.
                            // if (blockHeightDifference >= 6 && blockHeight !== 99999999) {
                            if (blockHeight !== 99999999) {
                                OrderPromise.setOrderStatusByDepositAddress(address, "Confirmed", function (err, res) {
                                    // Here we pass the transaction off to dealing with a confirmed output.
                                    if (err) {
                                        console.log(err); // Reports an error in case any have occurred.
                                    }
                                    handleConfirmedOrder(orderPromise, output, done);
                                });
                            } else {
                                OrderPromise.setOrderStatusByDepositAddress(address, "Paid", function (err, res) {
                                    // Here we mark the transaction as paid so that calls from the UI can move the user past the payment screen.
                                    if (err) {
                                        console.log(err); // Reports an error in case any have occurred.
                                    }
                                    done();
                                });
                            }
                        });
                    });
                } else {
                    done();
                }
            } else {
                done();
            }
        }); // Note that a callback can be added to this lock along with additional options.
        // TODO: Add a branch for all of the rejected states
    } else {
        // In this case the unspent transaction doesn't correspond to an orderpromise in the table
        // TODO: Find a way to handle unspent outputs that don't correspond to any orders (ie. outgoing change outputs)
        if (!reportErrorOnlyOnce){
            console.warn("An unspent was found for an address that doesn't have any order promises in the table.");
            reportErrorOnlyOnce = true;
        }

    }
}