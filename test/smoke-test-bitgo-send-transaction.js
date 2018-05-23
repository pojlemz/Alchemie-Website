require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

const params = {address: "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", amount: 100000, walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: ['46c8287215cc34ba9411778516bdbfd7b5c713e89cab10d5a1bd823406206ee3:0']};
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