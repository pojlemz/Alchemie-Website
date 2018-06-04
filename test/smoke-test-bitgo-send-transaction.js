require('dotenv').config({path: '../.env'});

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;

const unspentList = ['f0a8c2b57cae044d71ac091fbed140a490a6129504eb0fc213cf8b56674a4e98:0',
    '5c1437ed20cf9ccc71e7e1cc8fb0a317029b96b990e485d7e647883545546e89:0',
    '93665d079606111ef69c16a3ffb4e623089b8673489e6b548994e0dd1ad15794:0',
    'a1b4706511bf2413cf859531f6452774cfb1290139a3cdba7009b09a614a1d07:0',
    '8c6da4a1d564b2479b7a6802bee35953e7336cf0b99a6cbe981914f4a00d7a42:1',
    'e01441ab4950afd9630ba4d36e4c7171590582c23daf59dbd6a7df95b73ec518:0',
    'e01441ab4950afd9630ba4d36e4c7171590582c23daf59dbd6a7df95b73ec518:2',
    '0f38c78c2e2da9068266bead15e0b591254289e2e85e8983f5ebafa2441f4fa6:0',
    '0f38c78c2e2da9068266bead15e0b591254289e2e85e8983f5ebafa2441f4fa6:1',
    '46c8287215cc34ba9411778516bdbfd7b5c713e89cab10d5a1bd823406206ee3:1',
    '0da031603ba7e3c64ae4e62c7c7b5773c45fe24a942c4debfde210df5ef5e60e:0',
    '1e6e63bf0a436bcb1f2643359ee26f366fa5ddea7844809e1ff299a954547fee:1',
    'a00a0b1407aac116fed64179c73348525c7f11a377be1c253d6faaa376b47ffd:0',
    'a00a0b1407aac116fed64179c73348525c7f11a377be1c253d6faaa376b47ffd:1'];
const params = {address: "2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", fee: 210000, amount: 100000, walletPassphrase: 'secretpassphrase1a5df8380e0e30', unspents: unspentList};
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