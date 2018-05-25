// A model that contains a bitcoin address for each user to deposit their bitcoins.

// price
// id - int
// instrument - text
// time_created - TIMESTAMP
// price - float8

var pgClient = require('./pg-client');

module.exports.addPrice = function(instrument, price, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query2 = "INSERT INTO price (instrument, price) VALUES ($1, $2);";
    var params2 = [instrument, price];
    pgClient.runQuery(query2, params2, callback);
}

module.exports.getLatestPrice = function(instrument, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM price WHERE instrument=$1 AND time_created=(SELECT MAX(time_created) FROM price WHERE instrument=$1 GROUP BY instrument);";
    var params = [instrument];
    pgClient.runQuery(query, params, callback);
}

module.exports.getLatestPrices = function(callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM price p1 INNER JOIN (SELECT instrument, MAX(time_created) AS latest_time FROM price GROUP BY instrument) p2 ON p1.instrument=p2.instrument AND p1.time_created=p2.latest_time;";
    var params = [];
    pgClient.runQueryMultiSelect(query, params, callback);
}