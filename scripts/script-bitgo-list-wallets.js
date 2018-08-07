require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
// const bitgo = new BitGoJS.BitGo({ env: 'prod', accessToken: "v2x3857f9a2abef5e8c20f058aa68fe05d21d96fc4a1b1f9a8a969596f3450ff390"});

bitgo.coin('tbtc').wallets().list({}).then(function(wallets) {
    // print the wallets
    console.log(JSON.stringify(wallets));
});