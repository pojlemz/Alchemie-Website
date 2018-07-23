require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
// const fee = 10000;

const params = {
    recipients: [
        {
            amount: 100000,
            address: "2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN"
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
                                "index": 16,
                                "redeemScript": '52210263fbb9074fab4d61d33953c3f930a87a4e0ff3aa8f58a8a93c002183c35c77e821031bdc694faba0fd2a86bb0c7651c9b2e40be8677ab32421c2ee049b61100f333221033c85066e5656d89b5cdb2fc7ea7b327b3da42bd253e0346e2524f4051892660753ae',
                                "id": 'aeccfef18e2a6d3528007498222546ce6d973ab2319f4c60998a681617bfd81c:0',
                                "address": '2NE44DyA3wzaY7x518xMaxKo8FQBXJQikPn',
                                "value": 500000,
                                "isSegwit": false
                            }
                        ],
                        "changeAddress": "2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN"
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

// Unhandled rejection Error: Expected Buffer, got undefined requestId=cji3hjveo0isvrlry8lbh7zd1