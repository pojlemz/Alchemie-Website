require('dotenv').config({path: '../.env'});

const BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const bitcoinNetwork = process.env.BITCOIN_NETWORK; // ie. tbtc

const getUnspentsForAddressWithWallet = require('../server/get-unspents-for-address-with-wallet');

module.exports = function getUnspentsForAddress(address, callback){
    bitgo.coin(bitcoinNetwork).wallets().get({ id: walletId }).then(function(wallet) {
        getUnspentsForAddressWithWallet(address, wallet, callback);
    });
}