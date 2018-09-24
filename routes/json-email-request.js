var express = require('express'); // Express app
var router = express.Router(); // Express app

const Memo = require('../models/memo');

var pgClient = require('../models/pg-client'); // client used for making calls to work directly with the Postgres database.
var web3 = require('web3'); // Set variable to the web3 module

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/add-owned-address-to-email?address=0x0000000000000000000000000000000000000000000000000
router.post('/email-request',function(req, res){ // route that is run when POST request adds owned address to account
    // POST params: coinType, email, content
    // params: coinType, address, email, content, amount
    //const coinType = "BTC";
    const email = "dan@blockunity.com";
    const amount = 0.01;
    const response = res;

    bitgo.coin(coinType).wallets().get({id: walletId}).then(function (wallet) {
        // print the wallets
        wallet.createAddress({chain: 0}).then(function (address) {
            const depositAddress = address.address;
            var newMemo = {coinType: "BTC", address: depositAddress, email: email, content: req.body.content, amount: amount}
            Memo.createMemo(newMemo, function(err, res) {
                response.send({"grandTotal": amount, "depositAddress": depositAddress});
            });
        });
    });
});

module.exports = router;