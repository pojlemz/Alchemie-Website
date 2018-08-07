require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});

bitgo.coin('tbtc').wallets().list({}).then(function(wallets) {
    // print the wallets
    console.log(JSON.stringify(wallets));
});