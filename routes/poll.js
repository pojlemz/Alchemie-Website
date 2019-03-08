const express = require('express'); // Express app
const router = express.Router(); // Express router
const HasBeenKyced = require("../models/has-been-kyced");

const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated
const getAddressByEmailAndCreateIfNotExists = require('../server/get-address-by-email-and-create-if-not-exists');

const getBitgoBalanceByEmail = require('../server/get-bitgo-balance-by-email');
const PollVote = require('../models/poll-vote');

// Get Homepage
router.get('/poll', ensureAuthenticated, function(req, res){
    votes = [];
    // selectedNo, selectedUndecided
    var response = res;
    PollVote.getPollAndVoteByEmail(req.user.email, function(err, res){
        for (var i = 0; i < res.length; i++){
            if (res[i].selection === 'yes'){
                votes.push({pollid: res[i].pollid, topic: res[i].topic, selectedYes: true});
            } else if (res[i].selection === 'no') {
                votes.push({pollid: res[i].pollid, topic: res[i].topic, selectedNo: true});
            } else {
                votes.push({pollid: res[i].pollid, topic: res[i].topic, selectedUndecided: true});
            }
        }
        response.render('poll', {votes: votes});
    });
});

module.exports = router;