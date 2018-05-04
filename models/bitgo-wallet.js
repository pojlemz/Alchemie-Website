// A model that contains a bitgo walletid for each user to deposit their bitcoins.
// Flow is User => stored BitGo address => exchange.

// bitgowallet
// email - text
// cointype - text
// walletid - boolean

var pgClient = require('./pg-client');

module.exports.setWalletId = function(email, id, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM bitgowalletid WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO bitgowalletid (email, id) VALUES ($1, $2);";
            var params2 = [email, id];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM bitgowalletid WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            var query2 = "UPDATE bitgowalletid SET id=$2 WHERE email=$1;";
            var params2 = [email, id];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM bitgowalletid WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        }
    });
}

module.exports.getWalletIdByEmail = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM bitgowalletid WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}