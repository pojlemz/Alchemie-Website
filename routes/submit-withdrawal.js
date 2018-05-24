const express = require('express');
const router = express.Router();
const host = require('../server/host');
const PendingWithdrawal = require('../models/pending-withdrawal');

var generateRandomHash = require('../server/generate-random-hash');
var messageSender = require('../server/emailer/message-sender');

const BitGoJS = require('bitgo');

// Get Homepage
router.post('/submit-withdrawal', ensureAuthenticated, function(req, res){
    administerWithdrawLink(req, res);
});

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

function administerWithdrawLink(req, res){
    const email = req.user.email; // bob@blockunity.com
    const address = req.body.address; // "2MtaWaq1uH4HvukDbXi1irjnDthFcdpvVMG"
    const amountRequested = req.body.amount;
    const amountSatoshis = parseInt(parseFloat(req.body.amount) * 1000); // 0.01
    var currentTime = new Date().getTime();
    var expiryTime = currentTime + 1000 * 60 * 30;
    var randomHash = generateRandomHash();
    var newPendingWithdrawalLink = {email: email, cointype: 'BTC', address: address, amount: amountSatoshis, withdrawLink:randomHash, expiryMillisecondsSinceUnixEpoch: expiryTime};
    var url = host + '/reset-your-password?key=' + randomHash;
    var messageSubject = 'Confirm your withdrawal with Block Unity';
    var messageBody = "Greetings from the Block Unity team!\n\n We received a request to withdraw bitcoin from your Alchemie account.\n\n If this was you then please click on the link found at " + url + " within thirty minutes to complete your withdrawal. \n\n If you didn't make this request then feel free to ignore this email. \n\n" +"Best Regards,"+"\n\n" +"The Block Unity Team";
    PendingWithdrawal.createPendingWithdrawalLink(newPendingWithdrawalLink, function(err2, res2) {
        messageSender(email, messageSubject, messageBody, function (err, content) {
            res.render('withdraw-check-email');
        });
    });
}

module.exports = router;