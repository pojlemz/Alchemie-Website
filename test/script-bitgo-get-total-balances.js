require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

bitgo.coin('tbtc').wallets().getTotalBalances().then(function (balances) {
    // print total balances across all wallets for this coin
    console.dir(balances);
});