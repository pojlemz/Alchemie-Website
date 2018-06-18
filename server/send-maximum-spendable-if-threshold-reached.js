var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = process.env.BITGO_PASSPHRASE;
const destinationAddress = process.env.DESTINATION_BITCOIN_ADDRESS;
const coinType = process.env.BITCOIN_NETWORK;
const spendingThreshold = process.env.BITCOIN_SPENDING_THRESHOLD;

module.exports = function sendMaximumSpendableIfThresholdReached(){
    bitgo.coin(coinType).wallets().get({ id: walletId }).then(function(wallet) {
        // print the wallets
        wallet.maximumSpendable({}).then(function(result) {
            // print new address
            const amount = result.maximumSpendable;
            if (amount > spendingThreshold) {
                const params = {address: destinationAddress, amount: amount, walletPassphrase: walletPassphrase};
                wallet.send(params,
                    function(err, result) {
                        if (err) {
                            console.log('Error sending coins!'); console.dir(err); return process.exit(-1);
                        }
                        console.dir(result);
                    }
                );
            }
        });
    });
}