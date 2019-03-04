// A model that records the reco balance corresponding to each users email address.

// recobalance
// email - text
// amount - float8

var pgClient = require('./pg-client');

module.exports.addToRecoBalance = function(email, increase, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM recobalance WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO recobalance (email, amount) VALUES ($1, $2);";
            var params2 = [email, increase];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM recobalance WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            var spent = res.amount + increase;
            var query2 = "UPDATE recobalance SET amount=$2 WHERE email=$1;";
            var params2 = [email, spent];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM recobalance WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        }
    });
}

module.exports.getRECOBalanceByEmail = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM recobalance WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}