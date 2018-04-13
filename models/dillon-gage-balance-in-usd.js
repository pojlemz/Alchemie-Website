// A model that maintains the amount of money deducted/added to the dillon gage accounts due to trades
// A negative value corresponds to a buy.

// dillongagebalanceinusd
// id - SERIAL
// difference - INT
// time_created - TIMESTAMP

var pgClient = require('./pg-client');

module.exports.addBalanceDifference = function(difference, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "INSERT INTO dillongagebalanceinusd (difference) VALUES ($1);";
    var params = [difference];
    pgClient.runQuery(query, params, function (err, res) {
        var query2 = "SELECT * FROM dillongagebalanceinusd ORDER BY id DESC;";
        var params2 = [];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getRowsFromTable = function(callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT id, difference, time_created FROM dillongagebalanceinusd;";
    var params = [];
    pgClient.runQueryMultiSelect(query, params, callback);
}

module.exports.getTotalOfBalanceDifferences = function(callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT SUM(difference) AS total FROM dillongagebalanceinusd;";
    var params = [];
    pgClient.runQuery(query, params, callback);
}