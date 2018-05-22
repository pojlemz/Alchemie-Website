require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    //console.log(JSON.stringify(wallet));
    wallet.createAddress({ label: 'My address' }).then(function(address) {
        // Now get the Address information
        bitgo.blockchain().getAddress({ address: address.address }, function(err, response) {
            if (err) { console.log(err); process.exit(-1); }
            console.log('Address info is: ');
            console.dir(response);
        });
        // print new address
        //console.dir(address);
    });
});