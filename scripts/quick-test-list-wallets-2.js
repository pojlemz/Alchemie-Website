require('dotenv').config({path: '../.env'});
//
// List all multi-sig wallets at BitGo for the given coin.
// This makes use of the convenience function wallets().list()
//
// This tool will help you see how to use the BitGo API to easily list your
// BitGo wallets.
//
// Copyright 2018, BitGo, Inc.  All Rights Reserved.
//

const BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT });
const Promise = require('bluebird');

// TODO: set your access token here
const accessToken = process.env.BITGO_ACCESS_TOKEN;

const coin = 'tbtc';

Promise.coroutine(function *() {
    bitgo.authenticateWithAccessToken({ accessToken });

    const wallets = yield bitgo.coin(coin).wallets().list({});

    for (const wallet of wallets.wallets) {
        console.log(`Wallet label: ${wallet.label()}`);
        console.log(`Wallet ID: ${wallet.id()}`);
    }
})();