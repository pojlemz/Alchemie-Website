require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
const destinationAddress = "2N7Ru2nBQPaZtcaMpRGf73SoFfyVLw9LFBu";
const amountSatoshis = 30000;
// const fee = 10000;

const params = {
    recipients: [
        {
            amount: 3000000,
            address: "2N7Ru2nBQPaZtcaMpRGf73SoFfyVLw9LFBu",
        }
    ]
};

// transaction size of in x 180 + out x + 10 plus or minus in

// Set recipients
const recipients = {};
recipients[destinationAddress] = amountSatoshis;

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    wallet.getEncryptedUserKeychain({}, function(err, keychain) {
        if (err) {
            console.log('Error getting encrypted keychain!');
            console.dir(err);
            return process.exit(-1);
        }
        console.log('Got encrypted user keychain');

        keychain.xprv = bitgo.decrypt({ password: walletPassphrase, input: keychain.encryptedPrv });

        // Set recipients
        const recipients = {};
        recipients[destinationAddress] = amountSatoshis;

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
                                "index": 3,
                                "redeemScript": "5221024e11e2233ba01dc7940e5cb9fed244eb9889221a47d6f3b9f6ebece06a2af72621039703f3eeddc16c70bbaa097b7a142b94742d4c3da0f3997f8d0e59fa21ebc5fc2103c73ed3ffd55b28da339214f20a9665d0d6ff1e4e0202e46be6a649706167241a53ae",
                                "id": "e197d9e085e3e0fb50c59a856ecdba2c1c465abef210bf52f10fc230c6d0a26e:0",
                                "address": "2N65JKxUzbY4fiML7aAZcSKPLwhEUgJqNEb",
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