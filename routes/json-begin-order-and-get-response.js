const express = require('express');
const router = express.Router();

var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const OrderPromise = require('../models/order-promise');

router.post('/begin-order-and-get-response', ensureAuthenticated, function(req, res) {
    // TODO: What type of response are we going to get from this call?
    // TODO: Send back a response with the expiry time of the prices
    const productAddress = req.body.productAddress;
    const prices = JSON.parse(req.body.prices);
    const quantities = JSON.parse(req.body.quantities);
    const response = res;
    bitgo.coin('tbtc').wallets().get({ id: walletId }).then(function(wallet) {
        // print the wallets
        wallet.createAddress({chain: 0}).then(function(address) {
            // print new address
            const depositAddress = address.address;
            var newOrderPromise = {};
            newOrderPromise.email = req.user.email;
            newOrderPromise.cointype = 'BTC';
            newOrderPromise.depositAddress = depositAddress;
            newOrderPromise.productAddress = productAddress;
            newOrderPromise.expirymillisecondssinceunixepoch = new Date().getTime() + (1000 * 600);
            OrderPromise.createOrderPromise(newOrderPromise, function(err, res){
                response.send({productAddress: productAddress, prices: prices, quantities: quantities, depositAddress: depositAddress});
            });
        });
    });
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