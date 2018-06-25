var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const OrderPromise = require('../models/order-promise');

module.exports = function getReadyUtxos(callback) {
    OrderPromise.getReadyUnspents(function(err, res) {
        var unspentMapping = {};
        for (var i = 0; i < res.length; i++){
            unspentMapping[res.transactionoutput] = true;
        }
        bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function (wallet) {
            // print the wallets
            wallet.unspents().then(function (unspents) {
                var unspentArray = unspents.unspents;
                filteredUnspents = unspentArray.filter(function (element) {
                    if (unspentMapping[element.id]) {
                        return true;
                    } else {
                        return false;
                    }
                });
                callback(err, filteredUnspents);
            });
        });
    });
}