const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');
const BitcoinAddress = require('../models/bitcoin-address');
const BitGoJS = require('bitgo');

const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

// Get Homepage
router.get('/buy-tokens', ensureAuthenticated, function(req, res){
    const response = res;
    HasBeenKyced.getHasBeenKycedByEmail(req.user.email, function(err, res) {
        if (res !== null && res.kyced){ // User has been successfully kyced so take them to the page where they select a coin
            // Here we allow the user to start a purchase.
            preparePageToShowBitGoAddress(req, response);
        } else { // User has not been successfully kyced so take them to the page where they upload their documents
            // Pane is available for user to upload document and document is shown below when this is done.
            // If document has already been uploaded then we notify the user.
            DocumentInReview.getIsDocumentInReviewByEmail(req.user.email, function(err, res){
                if (res !== null && res.inreview) {
                    // Here we tell the user that their documents are being reviewed.
                    response.redirect('/information-is-in-review');
                } else {
                    // Here we ask the user to upload a document along with their address.
                    response.redirect('/submit-your-information');
                }
            });
        }
    });
});

function preparePageToShowBitGoAddress(req, res) {
    const email = req.user.email;
    const response = res;
    BitcoinAddress.getBitcoinAddressByEmail(email, function(err, res){
        if (typeof(res) === 'undefined' || res === null){
            // A bitcoin address has not been assigned for this user
            bitgo.coin(coinType).wallets().get({ id: walletId }).then(function(wallet) {
                // Create a new bitcoin address.
                wallet.createAddress({ label: email }).then(function(address) {
                    // Store this bitcoin address
                    const btcAddress = address.address;
                    BitcoinAddress.setBitcoinAddress(email, btcAddress, function(err, res){
                        response.render('buy-bitgo-tokens-with-bitcoin', {
                            'bitGoAddress': btcAddress
                        });
                    });
                });
            });

        } else {
            const address = res.bitcoinaddress; // Create a bitcoin address
            response.render('buy-bitgo-tokens-with-bitcoin', {
                'bitGoAddress': address
            });
        }
    })
}

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;