var express = require('express'); // Express app
var router = express.Router(); // Express app

const Memo = require('../models/memo');

var pgClient = require('../models/pg-client'); // client used for making calls to work directly with the Postgres database.
var web3 = require('web3'); // Set variable to the web3 module

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

const RecoAccount = require('../models/reco-account');
var secrets = require("./../secrets.json");

var ethers = require('ethers');
var mnemonic = secrets.mnemonic; // "marble modify two slogan that salmon finger shield omit sight glance vintage";

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/json-establish-address-and-get-reco-balance
router.get('/json-establish-address-and-get-reco-balance', function(req, res){ // route that is run when POST request adds owned address to account
    // POST params: coinType, email, content
    // params: coinType, address, email, content, amount
    //const coinType = "BTC";
    const email = req.user.email;
    const response = res;

    RecoAccount.createRecoAddressForEmail(email, function(err, data){
        var id = data.id;
        var path = "m/44'/60'/"+parseInt(id).toString()+"'/0/0";
        var wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
        var address = wallet.address;
    });
});

module.exports = router;