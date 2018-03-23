
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
const bitgo = new BitGoJS.BitGo({ env: 'test' });
const Promise = require('bluebird');

// TODO: set your access token here
const accessToken = "v2xafc2ff5a59e25198a5533b3b31c77f4e39769a0e59ce36bd0a53bca9479c5812";

const coin = 'tbtc';

Promise.coroutine(function *() {
    bitgo.authenticateWithAccessToken({ accessToken });

    const wallets = yield bitgo.coin(coin).wallets().list({});

    for (const wallet of wallets.wallets) {
        console.log(`Wallet label: ${wallet.label()}`);
        console.log(`Wallet ID: ${wallet.id()}`);
    }
})();