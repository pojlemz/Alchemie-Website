var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812"});
const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812"});
const walletId = "5ab2cda32dcbafe707ff865a642ea734";

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    wallet.addresses().then(function(addresses) {
        // print addresses
        console.dir(addresses);
        // Sample return data:
        /*
        [ { id: '5ab2cda32dcbafe707ff865ea00febe4',
            address: '2NCBU2fBNjJm57baWyWAbDjV12pGsifpeAH',
                chain: 0,
                index: 0,
                coin: 'tbtc',
                wallet: '5ab2cda32dcbafe707ff865a642ea734',
                coinSpecific: [Object] },
        { id: '5ab2d7858d78816b07d7caf8915f3c4a',
            address: '2NB2qMdh1Jk1EnuTfr2EDUMWMitbjojFBKd',
            chain: 10,
            index: 1,
            coin: 'tbtc',
            wallet: '5ab2cda32dcbafe707ff865a642ea734',
            coinSpecific: [Object] },
        { id: '5ab50ed458003907aed58ada799225b8',
            address: '2MyfvPkEkd2FB6QfV6zmsbNWYZLMzMCUvtq',
            chain: 10,
            index: 2,
            coin: 'tbtc',
            wallet: '5ab2cda32dcbafe707ff865a642ea734',
            coinSpecific: [Object] } ]
         */
    });
});