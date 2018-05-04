var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812"});
const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812"});
const walletId = "5ab2cda32dcbafe707ff865a642ea734";

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