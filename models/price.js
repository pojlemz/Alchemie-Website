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

module.exports.getLatestPrice = function(instrument){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM price WHERE instrument=$1 AND time_created=(SELECT MAX(time_created) FROM price WHERE instrument=$1 GROUP BY instrument);";
    var params = [instrument];
    pgClient.runQueryMultiSelect(query, params, callback);
}