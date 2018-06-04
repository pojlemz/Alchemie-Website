require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
const destinationAddress = "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr";
const amountSatoshis = 30000;
// const fee = 10000;

const params = {
    recipients: [
        {
            amount: 30000,
            address: "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr",
        }
    ]
};

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
                        "nP2SHInputs": 0,
                        "nSegwitInputs": 1,
                        "nOutputs": 2,
                        "unspents": [
                            {
                                "chain": 10,
                                "index": 18,
                                "redeemScript": "0020f76e413dbfb3c883cc4e9d1e056ba5452b0b939e81931434764e239d89120c86",
                                "id": "5c1437ed20cf9ccc71e7e1cc8fb0a317029b96b990e485d7e647883545546e89:0",
                                "address": "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr",
                                "value": 200000,
                                "isSegwit": true
                            }
                        ],
                        "changeAddresses": [
                            "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr"
                        ]
                    },
                    "feeInfo": {
                        "size": 373,
                        "fee": 3730,
                        "feeRate": 10000,
                        "payGoFee": 0,
                        "payGoFeeString": "0"
                    }
                },
                "prv": keychain.xprv
            };
            console.dir(transaction);
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