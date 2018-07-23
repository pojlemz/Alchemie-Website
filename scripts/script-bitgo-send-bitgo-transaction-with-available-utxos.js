require('dotenv').config({path: '../.env'});
const getAvailableUtxosAsBitgoList = require('../server/get-available-utxos-as-bitgo-list');
var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
const totalFee = 200000;
var destinationAddress = "2NAttnCeZFoRLhSkirg7NjuVJZ4hSE6m8YN";
const newInput = { id: 'cfed2842ae3038031773feee6f6d41598de5cc34c15335bd3daad422d3e49c82:1',
    address: '2N3hqBWVNSFgS9uav2Qjh97eSWrUZJU7Z3h',
    value: 45267200,
    valueString: '45267200',
    blockHeight: 1326035,
    date: '2018-06-21T20:22:55.460Z',
    wallet: '5ab2cda32dcbafe707ff865a642ea734',
    chain: 0,
    index: 63,
    redeemScript: '5221024107ee4410dc2dd14b16550fb80a3697046531cb28f55bed740ccb99d6589a0321022e6c4bed41f03b9d4cbf616d4aaec1908d63e6e88676dbbed351718b5171252f21032ba1aeeef48dd4b50d86371321aa4deedc514ac50316c84c73da1a191713fb2b53ae',
    isSegwit: false
};

getChangeUtxos(function(err, res){
    var finalUnspents = [];
    var totalValue = 0;
    var maxFee = 200000;
    for (var i = 0; i < res.length; i++){
        finalUnspents.push({
            "chain": res.chain,
            "index": res.index,
            "redeemScript": res.redeemScript,
            "id": res.id,
            "address": res.address,
            "value": res.value,
            "isSegwit": res.isSegwit
        });
        totalValue += res.value;
    }
    finalUnspents.push({
        "chain": newInput.chain,
        "index": newInput.index,
        "redeemScript": newInput.redeemScript,
        "id": newInput.id,
        "address": newInput.address,
        "value": newInput.value,
        "isSegwit": newInput.isSegwit
    });
    totalValue += newInput.value;

    if (totalValue > maxFee) {
        const params = {
            recipients: [
                {
                    amount: totalValue - maxFee,
                    address: destinationAddress
                }
            ]
        };

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
                                "unspents": finalUnspents,
                            },
                            // "feeInfo": {
                            //     "size": 218,
                            //     "fee": 654,
                            //     "feeRate": 3000,
                            //     "payGoFee": 0,
                            //     "payGoFeeString": "0"
                            // }
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
    }
});