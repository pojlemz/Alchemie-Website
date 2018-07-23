require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
// const fee = 10000;

const params = {
    recipients: [
        {
            amount: 1000000,
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
                        "nP2SHInputs": 0,
                        "nSegwitInputs": 1,
                        "nOutputs": 2,
                        "unspents": [
                            {
                                "chain": 11,
                                "index": 43,
                                "redeemScript": '0020e22cafde6f9dd68877e8a9afc7b931799c0c4d7e0f9f6ac9f560d51a932353f1',
                                "id": '2f72e6722283cdc586b1ba00f9cab48412e3ccb179c654d67f70fce59306d6ef:1',
                                "address": '2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN',
                                "value": 1998878,
                                "isSegwit": true,
                                "witnessScript": '52210256a5575955c31917cf9271ce3d211d88150d046ededb2ff55ddf77e558a40fb02102dd12fb9f88602739fde59a6c212e98e860fbba1a0ef9a1929e39840a016e188121021befcce7626449a15cfd4ccd44b03cb8899c77eed1d3b31a43c04bc367c1bb0653ae'
                            }
                        ],
                        "changeAddress": "2N2vEpSXBFKikusSFoAZDFc4FPaemkhjoiP"
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