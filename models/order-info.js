// A model that contains the cointype and email address belonging to each order.

// orderemail
// id - int
// cointype - text
// email - text

var pgClient = require('./pg-client');

module.exports.addNewTransaction = function(email, coinType, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query2 = "INSERT INTO orderinfo (email, cointype) VALUES ($1, $2);";
    var params2 = [email, coinType];
    pgClient.runQuery(query2, params2, function (err, res) {
        var query3 = "SELECT * FROM orderinfo WHERE id = (SELECT MAX(id) AS id FROM orderinfo WHERE email=$1 AND cointype=$2 GROUP BY email, cointype);";
        var params3 = [email, coinType];
        pgClient.runQuery(query3, params3, callback);
    });
}

module.exports.viewLatestTransactionByEmail = function(email, coinType, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM orderinfo WHERE id = (SELECT MAX(id) AS id FROM orderinfo WHERE email=$1 AND cointype=$2 GROUP BY email, cointype);";
    var params = [email, coinType];
    pgClient.runQuery(query, params, callback);
}