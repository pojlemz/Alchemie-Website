var BitGoJS = require('bitgo');

const getOutputDictForAddress = require('../server/get-output-dict-for-address');

module.exports = function getUnspentsForAddress(address, wallet, callback) {
    // const address = "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr";
    getOutputDictForAddress(address, wallet, function (err, res) {
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