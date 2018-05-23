require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const address = "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr";

mlog = require('mocha-logger');
var utxoList = [];

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    wallet.unspents().then(function(unspents) {
        // console.dir(unspents);
        // print the wallets
        wallet.transactions({}, function(err, result) {
            // print unspents
            var transactions = result['transactions'];
            // Initialize the utxo list here
            for (var j = 0; j < transactions.length; j++){
                var outputIds = [];
                var transaction = transactions[j];
                var outputs = transaction['outputs'].filter(function(output){
                    return (output['address'] == address);
                });
                for (var i = 0; i < outputs.length; i++){
                    outputIds.push(outputs[i]['id']);
                }
                utxoList = utxoList.concat(outputIds);
                // console.log(utxoList);
            }
            // Grow the list here from
            // console.dir(result);
            // console.dir(transactions.length);
            utxoListCount = 0;
            while (utxoListCount < utxoList.length){
                utxoListCount = utxoList.length;
                for (var i = 0; i < utxoList.length; i++){
                    var utxo = utxoList[i];
                    for (var j = 0; j < transactions.length; j++){
                        var transaction = transactions[j];
                        var inputs = transaction['inputs'].filter(function(input){
                            return (input['id'] == utxo);
                        });
                        utxoList.concat(inputs);
                    }
                }
            }
            console.log(utxoList);
            console.log(utxoList.length);
        });
    });
});