const getOutputDictForAddress = require('../server/get-output-dict-for-address');

// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });

module.exports = function getOutputsForAddress(address, wallet, callback) {
    // console.dir(unspents);
    // print the wallets
    getOutputDictForAddress(address, wallet, function(err, result){
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