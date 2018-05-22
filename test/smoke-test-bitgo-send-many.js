require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

//const params = {address: "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", "changeAddresses": ["2MwR7f7TjPVrphbQ98Y3x8VKNNJbpe4WZHy"], amount: 200000, walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: ["8c6da4a1d564b2479b7a6802bee35953e7336cf0b99a6cbe981914f4a00d7a42:0"]};
const params = {walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: ["8c6da4a1d564b2479b7a6802bee35953e7336cf0b99a6cbe981914f4a00d7a42:0"]};
// const recipients = {};
// recipients['2MwR7f7TjPVrphbQ98Y3x8VKNNJbpe4WZHy'] = 19176207 - 200000 - 150000;
// recipients['2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr'] = 200000;
const recipients = [];
recipients.push({address: '2MwR7f7TjPVrphbQ98Y3x8VKNNJbpe4WZHy', amount: 19176207 - 200000 - 150000});
recipients.push({address: '2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr', amount: 200000});

// bitgo.unlock({ otp: '985357' }).then(function(unlockResponse) {
bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
    wallet.sendMany({recipients: recipients, walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: ["8c6da4a1d564b2479b7a6802bee35953e7336cf0b99a6cbe981914f4a00d7a42:0"]},
        function(err, result) {
            if (err) { console.log('Error sending coins!'); console.dir(err); return process.exit(-1); }
            console.dir(result);
        }
    );
});