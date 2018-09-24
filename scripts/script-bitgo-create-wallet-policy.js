//
// Create a velocity limit policy on a multi-sig wallet at BitGo.
//
// This tool will help you see how to use the BitGo API to easily
// create new wallet policies
//
// Copyright 2018, BitGo, Inc.  All Rights Reserved.
//

const BitGoJS = require('../../src/index.js');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT , accessToken: promise.env.BITGO_FULL_ACCESS_TOKEN});
const Promise = require('bluebird');

// TODO: put the new policy on the wallet with this id
const id = process.env.WALLET_ID;
const coin = process.env.BITCOIN_NETWORK;

Promise.coroutine(function *() {
    bitgo.coin(coin).wallets().get({ id: id }).then(function(wallet) {
        console.log(wallet);

        const policy = {
            action: {
                type: 'deny'
            },
            condition: {
                add: process.env.DESTINATION_BITCOIN_ADDRESS,
            },
            id: 'my_whitelist_policy',
            type: 'whitelist'
        };

        wallet.createPolicyRule(policy).then(function(result){
            console.dir(result);
        });
    });
})();