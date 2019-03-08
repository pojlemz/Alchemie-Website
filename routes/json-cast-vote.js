var express = require('express'); // Express app
var router = express.Router(); // Express router
const ensureAuthenticated = require('../server/ensure-authenticated'); // Route middleware to ensure that the user is authenticated

const Price = require('../models/price');
const request = require('request');

const BitcoinSpent = require('../models/bitcoin-spent');
const RecoBalance = require('../models/reco-balance');

const PollVote = require('../models/poll-vote');

// Try the following line in the browser to test retrieval of owned addresses
// http://localhost:3000/get-owned-addresses-by-email
router.get('/cast-vote', ensureAuthenticated, function(req, res) {
    // Ensure user is authenticated.
    var response = res;
    var email = req.user.email;
    var voteSelection = req.query.selection;
    var pollid = req.query.pollid;
    PollVote.updateVote(pollid, email, voteSelection, function(err, res) {
        response.send({msg: "Vote updated"});
    })
});

module.exports = router;