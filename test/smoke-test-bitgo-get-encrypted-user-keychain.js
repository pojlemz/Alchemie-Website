require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
// const fee = 10000;

const params = {
    recipients: [
        {
            amount: 3000000,
            address: "2N7Ru2nBQPaZtcaMpRGf73SoFfyVLw9LFBu"
        }
    ]
};

// transaction size of in x 180 + out x + 10 plus or minus in

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    wallet.getEncryptedUserKeychain({}, function(err, keychain) {
        if (err) {
            console.log('Error getting encrypted keychain!');
            console.dir(err);
            return process.exit(-1);
        }
        console.log('Got encrypted user keychain');

        keychain.xprv = bitgo.decrypt({ password: walletPassphrase, input: keychain.encryptedPrv });
        wallet.prebuildTransaction(params).then(function (transaction) {
            // print transaction details
            // TODO: Write code to estimate fee
            var params3 = {
                "txPrebuild": {
                    "txHex": transaction.txHex,
                    "txInfo": {
                        "nP2SHInputs": 1,
                        "nSegwitInputs": 0,
                        "nOutputs": 2,
                        "unspents": [
                            {
                                "chain": 0,
                                "index": 5,
                                "redeemScript": '5221020419d166ab2337b3630b8c065829137022ba217e545d7ea32aceea11084381f22103e74f5ebd9bffb6d441741b05628036b12124bd3137f181566f5616c8951f62c62102e996b76297d33b5a369b0570108391a58aa01bd99a896eacf3d97ea0b2f7e0d553ae',
                                "id": '5f2d049ae28736accd69e33ccc3b98157cf1803ef5c7d69b15af46864b7e2706:0',
                                "address": '2NCWko9dFrJt5JFwxHgMR4zQHHPoNHZ6tq2',
                                "value": 5000000,
                                "isSegwit": false
                            }
                        ],
                        "changeAddresses": [
                            "2N2vEpSXBFKikusSFoAZDFc4FPaemkhjoiP"
                        ]
                    },
                    "feeInfo": {
                        "size": 218,
                        "fee": 654,
                        "feeRate": 3000,
                        "payGoFee": 0,
                        "payGoFeeString": "0"
                    }
                },
                "prv": keychain.xprv
            };
            // console.dir(transaction);
            wallet.signTransaction(params3, function (err, transaction) {
                if (err) {
                    console.log('Failed to sign transaction!');
                    console.dir(err);
                    return process.exit(-1);
                }
                const params2 = {
                    txHex: transaction.txHex
                };
                wallet.submitTransaction(params2).then(function (transaction) {
                    console.dir(transaction);
                });
                console.dir(transaction);
            });
        });
    });
});

// wallet.getEncryptedUserKeychain({}, function(err, keychain) {
//     if (err) {
//         console.log('Error getting encrypted keychain!');
//         console.dir(err);
//         return process.exit(-1);
//     }
//     console.log('Got encrypted user keychain');
//
//     // Decrypt the user key with a passphrase
//     keychain.xprv = bitgo.decrypt({ password: walletPassphrase, input: keychain.encryptedXprv });
//
//     // Set recipients
//     const recipients = {};
//     recipients[destinationAddress] = amountSatoshis;
//
//     console.dir(keychain);
//     console.log('Creating transaction');
//     wallet.createTransaction({
//             recipients: recipients,
//             fee: fee
//         },
//         function(err, transaction) {
//             if (err) {
//                 console.log('Failed to create transaction!');
//                 console.dir(err);
//                 return process.exit(-1);
//             }
//
//             console.dir(transaction);
//             console.log('Signing transaction');
//             wallet.signTransaction({
//                     transactionHex: transaction.transactionHex,
//                     unspents: transaction.unspents,
//                     keychain: keychain
//                 },
//                 function (err, transaction) {
//                     if (err) {
//                         console.log('Failed to sign transaction!');
//                         console.dir(err);
//                         return process.exit(-1);
//                     }
//
//                     console.dir(transaction);
//                     console.log('Sending transaction');
//                     wallet.sendTransaction({tx: transaction.tx}, function (err, callback) {
//                         console.log('Transaction sent: ' + callback.tx);
//                     });
//                 });
//         }
//     });
// });