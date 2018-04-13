// A model that maintains deposits withdrawals into bank account and all of the gold brokers.
// A positive value corresponds to a deposit.

// bankandbrokerbalanceinusd
// id - SERIAL
// difference - INT
// time_created - TIMESTAMP

var pgClient = require('./pg-client');

module.exports.addBalanceDifference = function(difference, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "INSERT INTO bankandbrokerbalanceinusd (difference) VALUES ($1);";
    var params = [difference];
    pgClient.runQuery(query, params, function (err, res) {
        var query2 = "SELECT * FROM bankandbrokerbalanceinusd ORDER BY id DESC;";
        var params2 = [];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getRowsFromTable = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT id, difference, time_created FROM bankandbrokerbalanceinusd;";
    var params = [];
    pgClient.runQueryMultiSelect(query, params, callback);
}

module.exports.getTotalOfBalanceDifferences = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT SUM(difference) AS total FROM bankandbrokerbalanceinusd;";
    var params = [];
    pgClient.runQuery(query, params, callback);
}