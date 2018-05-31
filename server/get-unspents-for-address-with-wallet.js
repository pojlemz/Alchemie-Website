var BitGoJS = require('bitgo');

const getOutputDictForAddressWithWallet = require('./get-output-dict-for-address-with-wallet');

module.exports = function getUnspentsForAddressWithWallet(address, wallet, callback) {
    // const address = "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr";
    getOutputDictForAddressWithWallet(address, wallet, function (err, res) {
        outputDict = res;
        wallet.unspents().then(function (unspents) {
            var listOfUnspentsForAddress = [];
            for (var i = 0; i < unspents.unspents.length; i++){
                if (outputDict[unspents.unspents[i]['id']]){
                    listOfUnspentsForAddress.push(unspents.unspents[i]['id']);
                }
            }
            callback(err, listOfUnspentsForAddress)
        });
    });
}