// var assert = require('assert');
// var BitGoJS = require('bitgo');
//
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_FULL_ACCESS_TOKEN });
//
// module.exports.getBitgoWalletByEmail = function(email, callback){
//     BitgoWallet.getWalletIdByEmail(email, function(err, res) {
//         // If we can get a wallet for a given email then we assume that it has been created on BitGo's side.
//         if (typeof(res) === 'undefined' || res === null) {
//             bitgo.coin(process.env.BITCOIN_NETWORK).wallets().generateWallet({ label: email, passphrase: process.env.BITGO_PASSPHRASE }).then(function(wallet) {
//                 // print the wallets
//                 // @TODO: Replace walletId
//                 const res = {walletId: }
//                 console.log(JSON.stringify(wallet));
//             });
//         } else {
//
//         }
//     });
// }