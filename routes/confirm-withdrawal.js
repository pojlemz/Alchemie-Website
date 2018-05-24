const express = require('express');
const router = express.Router();
var requestIp = require('request-ip');
const HasBeenKyced = require("../models/has-been-kyced");
const DocumentInReview = require('../models/document-in-review');
const getUnspentsForEmail = require("../server/get-unspents-for-email");

const PendingWithdrawal = require('../models/pending-withdrawal');
const WithdrawalAddress = require('../models/withdrawal-address');
const BitGoJS = require('bitgo');

const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;
const bitgoPassphrase = process.env.BITGO_PASSPHRASE;

// Get Homepage
router.get('/confirm-withdrawal', ensureAuthenticated, function(req, res){
    const response = res;
    const withdrawLink = req.query.key;
    PendingWithdrawal.getPendingWithdrawalLinkByWithdrawalLink(withdrawLink, function(err, res){
        if (res === null || err) {
            response.render('withdrawal-link-invalid');
        } else {
            const targetAddress = res['address'];
            const email = res['email'];
            const expiryMillisecondsSinceUnixEpoch = res['expirymillisecondssinceunixepoch'];
            const amount = res['amount'];
            // It is presumed that the coin type is BTC at this time.
            // TODO: check for expiration
            var currentTime = new Date().getTime();
            if (expiryMillisecondsSinceUnixEpoch > currentTime) {
                getUnspentsForEmail(email, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        const params = {address: targetAddress, amount: amount, walletPassphrase: bitgoPassphrase, unspents: res};
                        // TODO: Sort through the unspent transaction outputs here and reassign them to different sets
                        bitgo.coin(coinType).wallets().get({ id: walletId }).then(function(wallet) {
                            wallet.send(params,
                                function(err, result) {
                                    if (err) {
                                        // State that we failed to withdraw coins.
                                        response.render('withdrawal-expired');
                                    } else {
                                        // Use green flash to say that the withdrawal was successful.
                                    }
                                }
                            );
                        });
                    }
                });
            } else {
                response.render('withdrawal-expired');
            }
        }
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;