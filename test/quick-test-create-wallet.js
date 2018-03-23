var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.ACCESS_TOKEN });
// const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812"});
const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: "v2x6b1b28cd3e2b5c36795532621d5ba713af3577dad8eb537cd98f596e63f60404"});

bitgo.coin('tbtc').wallets().generateWallet({ label: 'Bargloves Wallet', passphrase: 'secretpassphrase1a5df8380e0e30' }).then(function(wallet) {
    // print the wallets
    console.log(JSON.stringify(wallet));
});