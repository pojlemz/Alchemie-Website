const getOutputDictForAddressWithWallet = require('./get-output-dict-for-address-with-wallet');

// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });

module.exports = function getOutputsForAddressWithWallet(address, wallet, callback) {
    // console.dir(unspents);
    // print the wallets
    getOutputDictForAddressWithWallet(address, wallet, function(err, result){
        var outputDictionary = result;
        // @NOTE: We collect a list of all the dictionary elements that have been assigned to true.
        var outputList = [];
        var keys = Object.keys(outputDictionary);
        keys.forEach(function(element){
            if (outputDictionary[element]) {
                outputList.push(element)
            }
        });
        callback(err, outputList);
    });
}