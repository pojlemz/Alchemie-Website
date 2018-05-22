require('dotenv').config({path: '../.env'});

var assert = require('assert');
var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

mlog = require('mocha-logger');

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    wallet.unspents().then(function(unspents) {
        // print unspents
        console.dir(unspents);
    });
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
     { id: '898b66d5e4752177744465a5123dc3b8ee63c7421fe51ae5315ec78dd1a0889a:1',
       address: '2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr',
       value: 1000000,
       valueString: '1000000',
       blockHeight: 1297158,
       date: '2018-05-10T15:50:20.619Z',
       wallet: '5ab2cda32dcbafe707ff865a642ea734',
       chain: 10,
       index: 18,
       redeemScript: '0020f76e413dbfb3c883cc4e9d1e056ba5452b0b939e81931434764e239d89120c86',
       isSegwit: true,
       witnessScript: '52210218064b2a899784e0da46900acba4ec5719f19ec6b683eafa16c5ffe4eb6a37742103c724ccc7b265375a05e7bb26ce62961eae6bc11b33ab45a26ac28ba27a721031210264027f0a15a8f8f361ca560cfb36eaf140055c3eb40149cc646ce7592f5303fe53ae' } ],
  coin: 'tbtc' }
 */