const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');
const BitgoAddress = require('../models/bitgo-address');
const BitGoJS = require('bitgo');

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

// Get Homepage
router.get('/deposit', ensureAuthenticated, function(req, res){
    const email = req.user.email;
    const response = res;
    BitgoAddress.getAddressByEmail(email, 'BTC', function(err, res){
        if (typeof(res) === 'undefined' || res === null){
            // A bitcoin address has not been assigned for this user
            bitgo.coin(coinType).wallets().get({ id: walletId }).then(function(wallet) {
                // Create a new bitcoin address.
                wallet.createAddress({ label: email }).then(function(address) {
                    // Store this bitcoin address
                    const btcAddress = address.address;
                    // Now get the Address information
                    bitgo.blockchain().getAddress({ address: btcAddress}, function(err, res) {
                        if (err) { console.log(err); process.exit(-1); }
                        console.log('Address info is: ');
                        const btcSpendableBalance = Number(res.spendableBalance / 100000000).toFixed(8) + " BTC";
                        const btcBalance = Number(res.balance / 100000000).toFixed(8) + " BTC";
                        BitgoAddress.setAddress(email, 'BTC', btcAddress, function(err, res){
                            response.render('deposit', {
                                'bitGoAddress': btcAddress,
                                'spendableBalance': btcSpendableBalance,
                                'balance': btcBalance
                            });
                        });
                    });
                });
            });
        } else {
            const address = res.address; // Create a bitcoin address
            bitgo.blockchain().getAddress({ address: address}, function(err, res) {
                if (err) { console.log(err); process.exit(-1); }
                const btcSpendableBalance = Number(res.spendableBalance / 100000000).toFixed(8) + " BTC";
                const btcBalance = Number(res.balance / 100000000).toFixed(8) + " BTC";
                response.render('deposit', {
                    'bitGoAddress': address,
                    'spendableBalance': btcSpendableBalance,
                    'balance': btcBalance
                });
            });
        }
    })
});

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;