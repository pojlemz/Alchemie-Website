var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812"});
// const bitgo = new BitGoJS.BitGo({ env: 'prod', accessToken: "v2x3857f9a2abef5e8c20f058aa68fe05d21d96fc4a1b1f9a8a969596f3450ff390"});

bitgo.coin('tbtc').wallets().list({}).then(function(wallets) {
    // print the wallets
    console.log(JSON.stringify(wallets));
});