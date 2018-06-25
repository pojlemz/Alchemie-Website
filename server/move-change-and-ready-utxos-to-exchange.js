const getChangeUtxos = require('../server/get-change-utxos');

const getAvailableUtxosAsBitgoList = require('../server/get-available-utxos-as-bitgo-list');
var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';
const networkBTC = process.env.BITCOIN_NETWORK;
const destinationAddress = process.env.DESTINATION_BITCOIN_ADDRESS;
const maxFee = process.env.BITCOIN_MAX_FEE;

module.exports = function moveChangeAndReadyUtxosToExchange() {
    getChangeUtxos(function(err, res) {
        const changeUtxos = res;
        getReadyUtxos(function(err, res){
            const allUtxos = res.concat(changeUtxos);
            const allUtxoCount = allUtxos.length;
            var finalUnspents = [];
            var totalValue = 0;
            for (var i = 0; i < allUtxos.length; i++){
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
            if (totalValue > maxFee) {
                const params = {
                    recipients: [
                        {
                            amount: totalValue - maxFee,
                            address: destinationAddress
                        }
                    ]
                };

                bitgo.coin(networkBTC).wallets().get({ id: walletId }).then(function(wallet) {
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
                                        "nP2SHInputs": allUtxoCount,
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
    });
}