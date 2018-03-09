// A model that contains all successful requests a user makes to reset their password.
// This includes any request that successfully sends an email.

// hasbeenkyced
// email - text
// kyced - boolean

var pgClient = require('./pg-client');

module.exports.setHasBeenKycedByEmail = function(email, hasBeenKyced, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM hasbeenkyced WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO hasbeenkyced (email, kyced) VALUES ($1, $2);";
            var params2 = [email, hasBeenKyced];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM hasbeenkyced WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            var query2 = "UPDATE hasbeenkyced SET kyced=$2 WHERE email=$1;";
            var params2 = [email, hasBeenKyced];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM hasbeenkyced WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        }
    });
}

module.exports.getHasBeenKycedByEmail = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM hasbeenkyced WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}