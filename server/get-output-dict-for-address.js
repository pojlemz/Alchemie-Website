const BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const bitcoinNetwork = process.env.BITCOIN_NETWORK; // ie. tbtc

const getOutputDictForAddressWithWallet = require('../server/get-output-dict-for-address-with-wallet');

module.exports = function getOutputDictForAddress(address, callback) {
    bitgo.coin(bitcoinNetwork).wallets().get({ id: walletId }).then(function(wallet) {
        getOutputDictForAddressWithWallet(address, wallet, callback);
    });
}
