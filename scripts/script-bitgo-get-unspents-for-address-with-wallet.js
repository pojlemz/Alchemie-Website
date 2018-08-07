require('dotenv').config({path: '../.env'});
getUnspentsForAddressWithWallet = require('../server/get-unspents-for-address-with-wallet');

const BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const bitcoinNetwork = process.env.BITCOIN_NETWORK; // ie. tbtc

bitgo.coin(bitcoinNetwork).wallets().get({ id: walletId }).then(function(wallet) {
    getUnspentsForAddressWithWallet("2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", wallet, function(err, res){
        if (err) {
            console.log(err);
        }
        console.log(res);
    });
});