// This script gives us all the

require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const targetAddress = "2N3Ljt8MaHqC87kJBBF1PM8mCQyDRPFcWjD";

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    wallet.transactions({}, function(err, result) {
        // print unspents
        // console.dir(result['transactions'].length);
        var transactions = result.transactions;
        filterResult = transactions.filter(function(element) {
            var flag = false;
            for (var i = 0; i < element.outputs.length; i++){
                if (element.outputs[i].address === targetAddress){
                    flag = true;
                }
            }
            for (var i = 0; i < element.inputs.length; i++) {
                if (element.inputs[i].address === targetAddress) {
                    flag = true;
                }
            }
            return flag;
        });
        console.dir(filterResult);
        console.dir(JSON.stringify(filterResult));
    });
});