require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const walletPassphrase = process.env.BITGO_PASSPHRASE;
const destinationAddress = process.env.DESTINATION_BITCOIN_ADDRESS;

bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    // print the wallets
    wallet.maximumSpendable({}).then(function(result) {
        // print new address
        const amount = result.maximumSpendable;
        const params = {address: destinationAddress, amount: amount, walletPassphrase: walletPassphrase};
        wallet.send(params,
            function(err, result) {
                if (err) {
                    console.log('Error sending coins!'); console.dir(err); return process.exit(-1);
                }
                console.dir(result);
            }
        );
    });
});