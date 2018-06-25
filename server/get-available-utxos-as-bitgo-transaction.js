const getAvailableUtxosAsBitgoList = require('../server/get-available-utxos-as-bitgo-list');

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = 'secretpassphrase1a5df8380e0e30';

getAvailableUtxosAsBitgoList(function(err, res){
    var finalUnspents = [];
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

    }
});

/*
{ unspents:
    [ { id: 'e790c4628169d947bece8904228f1c1927da14270e1f156fd9a193951311f6bb:0',
        address: '2N7Ru2nBQPaZtcaMpRGf73SoFfyVLw9LFBu',
        value: 500000,
        valueString: '500000',
        blockHeight: 1294632,
        date: '2018-04-26T20:51:58.835Z',
        wallet: '5ab2cda32dcbafe707ff865a642ea734',
        chain: 10,
        index: 7,
        redeemScript: '00205ab09f3bd39086563a520c2c42a5a2a02e3cc592c49d343919b5b2ff291c1565',
        isSegwit: true,
        witnessScript: '5221033ccc8ff821fc0f0571ed38c11b16b8f36554e016491de5b9e01a954b5d709bed2103026c23cbfd88b15ea6f81b927ab584a6dec2d64179607e6fbf761cc88309b6d52103e33b0bf8e7ca86ffa955ddc55c5355ffc73031f479904abde6f1f4901dd3e42c53ae' },
        */