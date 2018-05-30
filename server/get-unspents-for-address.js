var BitGoJS = require('bitgo');

const getOutputsForAddress = require('../server/get-outputs-for-address');

module.exports = function getUnspentsForAddress(address, wallet, callback) {
    // const address = "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr";
    getOutputsForAddress(address, wallet, function (err, res) {
        wallet.unspents().then(function (unspents) {
            callback(err, res)
        });
    });
}