const PollVote = require('../models/poll-vote');

PollVote.getPollAndVoteByEmail('dan@blockunity.com', function(err, res){
    console.log(res);
});