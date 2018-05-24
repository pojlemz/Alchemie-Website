require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

const params = {address: "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", amount: 100000, walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: ['0da031603ba7e3c64ae4e62c7c7b5773c45fe24a942c4debfde210df5ef5e60e:1', '1e6e63bf0a436bcb1f2643359ee26f366fa5ddea7844809e1ff299a954547fee:1']};
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