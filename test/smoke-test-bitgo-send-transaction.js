require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

const params = {address: "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", changeAddress: "2MwR7f7TjPVrphbQ98Y3x8VKNNJbpe4WZHy", amount: 100000, walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: ["898b66d5e4752177744465a5123dc3b8ee63c7421fe51ae5315ec78dd1a0889a:1"]};
// const recipients = {};
// recipients['2MwR7f7TjPVrphbQ98Y3x8VKNNJbpe4WZHy'] = 19176207 - 200000 - 150000;
// recipients['2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr'] = 200000;

// bitgo.unlock({ otp: '985357' }).then(function(unlockResponse) {
bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    wallet.send(params,
        function(err, result) {
            if (err) { console.log('Error sending coins!'); console.dir(err); return process.exit(-1); }
            console.dir(result);
        }
    );
});