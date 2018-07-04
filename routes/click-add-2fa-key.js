// var express = require('express');
// var router = express.Router();
// var TwoFactorAuthenticator = require('../server/two-factor-authenticator');
//
// // Get Homepage
// router.get('/click-add-2fa', ensureAuthenticated, function(req, res){
//     var response = res;
//     TwoFactorAuthenticator.hasSharedSecret(req.user.email, function(err, res){
//
//     });
// });
//
// function ensureAuthenticated(req, res, next){
//     if(req.isAuthenticated()) {
//         return next();
//     } else {
//         //req.flash('error_msg','You are not logged in');
//         res.redirect('/login');
//     }
// }
//
// module.exports = router;

const Web3 = require('web3');
const contract = require('truffle-contract');

const metacoinArtifacts = require('../build/contracts/MetaCoin.json');
const MetaCoin = contract(metacoinArtifacts);

var accounts;
var account;

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
MetaCoin.setProvider(web3.currentProvider);
if (typeof MetaCoin.currentProvider.sendAsync !== "function") {
    MetaCoin.currentProvider.sendAsync = function() {
        return MetaCoin.currentProvider.send.apply(
            MetaCoin.currentProvider, arguments
        );
    };
}
MetaCoin.setProvider(web3.currentProvider);
web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
        console.error("There was an error fetching your accounts.");
        return;
    }
    if (accs.length == 0) {
        console.error("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
    }
    accounts = accs;
    account = accounts[0];

    var meta;
    MetaCoin.deployed().then(function(instance) {
        meta = instance;
        return (account, {from: account});
    }).then(function(value) {
        console.log("Printing value: value of....");
        console.log(value.valueOf());
        // done();
    }).catch(function(e) {
        console.error(e);
        // done();
    });
});