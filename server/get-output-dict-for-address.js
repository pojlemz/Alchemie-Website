
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });

module.exports = function getOutputDictForAddress(address, wallet, callback) {
    // console.dir(unspents);
    // print the wallets
    wallet.transactions({}, function(err, result) {
        if (!err) {
            // print unspents
            var utxoList = [];
            var transactions = result['transactions'];
            var outputDictionary = {}; // Key maps to true only if they are supposed to be included in tx list
            // @NOTE: This block fills the output dictionary with default false values for all our utxos
            for (var j = 0; j < transactions.length; j++){
                var transaction = transactions[j];
                var outputs = transaction['outputs'];
                var inputs = transaction['inputs'];
                for (var i = 0; i < outputs.length; i++){
                    var output = outputs[i];
                    outputDictionary[output['id']] = false;
                }
                for (var i = 0; i < inputs.length; i++){
                    var input = inputs[i];
                    outputDictionary[input['id']] = false;
                }
            }
            // @NOTE: This code block sets the initial list of outputs with which the recursive function will be called with.
            // @NOTE: Each element in the list is the first to be appended to the owned outputs.
            var initialOutputs = [];
            for (var j = 0; j < transactions.length; j++){
                var transaction = transactions[j];
                var outputs = transaction['outputs'].filter(function(output){
                    return (output['address'] == address);
                });
                outputs.forEach(function(element) {
                    initialOutputs.push(element['id']);
                });
            }
            // @NOTE: This code block recreates the input/output model as a dictionary.
            // @NOTE: We assume that inputs are only ever used once (as it should be in the UTXO model)
            var inputToOutputDict = {};
            for (var j = 0; j < transactions.length; j++){
                var transaction = transactions[j];
                var inputs = transaction['inputs'];
                var outputs = transaction['outputs'];
                for (var i = 0; i < inputs.length; i++){
                    inputToOutputDict[inputs[i]['id']] = [];
                    for (var k = 0; k < outputs.length; k++) {
                        inputToOutputDict[inputs[i]['id']].push(outputs[k]['id']);
                    }
                }
            }
            // @NOTE: We use the following recursive function to expand the dictionary of outputs with 'true' value.
            var expandOutputDictionary = function selfExpandOutputDictionary(id){
                outputDictionary[id] = true;
                if (typeof(inputToOutputDict[id]) !== 'undefined') { // This condition is met if the output is not a leaf.
                    var listOfOutputs = inputToOutputDict[id];
                    for (var i = 0; i < listOfOutputs.length; i++) {
                        if (outputDictionary[listOfOutputs[i]] === false) {
                            selfExpandOutputDictionary(listOfOutputs[i]);
                        }
                    }
                }
            }
            // @NOTE: We call the recursive output function with the initial outputs array.
            initialOutputs.forEach(function(element){
                expandOutputDictionary(element);
            });
            // Call the callback with the list that we have built.
            callback(err, outputDictionary);
        }
    });
}