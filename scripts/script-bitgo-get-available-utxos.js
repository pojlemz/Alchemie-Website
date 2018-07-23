require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const OrderPromise = require('../models/order-promise');

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    wallet.unspents().then(function(unspents) {
        OrderPromise.getUnpaidPaidConfirmedAndFilledUnspents(function(err, res){
            var mappingOfUsedUtxos = {};
            for (var i = 0; i < res.length; i++) {
                mappingOfUsedUtxos[res.transactionoutput] = true;
            }
            var unspentArray = unspents.unspents;
            filteredUnspents = unspentArray.filter(function (element) {
                if (mappingOfUsedUtxos[element.id]) {
                    return false;
                } else {
                    return true;
                }
            });
            console.dir(filteredUnspents);
        });
        // print unspents
    });
});