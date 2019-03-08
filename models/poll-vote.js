// A model that manages polls and votes .

// polls and votes

// poll
// pollid - int
// topic - text

// vote
// email - text
// pollid - int
// selection - text

const getUsdToBtc = require('../server/get-usd-to-btc');
var pgClient = require('./pg-client');

module.exports.addPoll = function(topic, callback) {
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query2 = "INSERT INTO poll (topic) VALUES ($1);";
    var params2 = [topic];
    pgClient.runQuery(query2, params2, callback);
}

module.exports.addVote = function(pollid, email, selection, callback) {
    // var query = "SELECT * FROM vote WHERE pollid=$1 AND time_created=(SELECT MAX(time_created) FROM price WHERE instrument=$1 GROUP BY instrument);";
    var query = "INSERT INTO vote (pollid, email, selection) VALUES ($1, $2, $3);";
    // var query = "SELECT * FROM vote WHERE pollid=$1 AND time_created=(SELECT MAX(time_created) FROM price WHERE instrument=$1 GROUP BY instrument);";
    var params = [pollid, email, selection];
    pgClient.runQuery(query, params, callback);
}

module.exports.getPollAndVoteByEmail = function(email, callback){
    var query = "SELECT p1.pollid AS pollid, p1.topic AS topic, v1.email AS email, v1.selection AS selection FROM poll p1 LEFT JOIN vote v1 ON p1.pollid=v1.pollid AND email=$1";
    var params = [email];
    pgClient.runQueryMultiSelect(query, params, callback);
}

module.exports.updateVote = function(pollid, email, selection, callback){
    var query2 = "SELECT * FROM vote WHERE pollid=$1 AND email=$2";
    params2 = [pollid, email];
    pgClient.runQuery(query2, params2, function(err, res){
        if (res === null) {
            var query = "INSERT INTO vote (pollid, email, selection) VALUES ($1, $2, $3);";
            var params = [pollid, email, selection];
            pgClient.runQuery(query, params, callback);
        } else {
            var query = "UPDATE vote SET selection=$3 WHERE pollid=$1 AND email=$2;";
            var params = [pollid, email, selection];
            pgClient.runQuery(query, params, callback);
        }
    });
}

