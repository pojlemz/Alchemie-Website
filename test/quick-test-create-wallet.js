require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_FULL_ACCESS_TOKEN});

bitgo.coin('tbtc').wallets().generateWallet({ label: 'Barglovess Wallet', passphrase: 'secretpassphrase1a5df8380e0e30' }).then(function(wallet) {
    // print the wallets
    console.log(JSON.stringify(wallet));
});