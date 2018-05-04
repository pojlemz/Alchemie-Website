// A model that contains a bitcoin address for each user to deposit their bitcoins.
// Flow is User => stored BitGo address => exchange.

// bitgoaddress
// email - text
// address - boolean

var pgClient = require('./pg-client');

module.exports.setAddress = function(email, coinType, address, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM bitgoaddress WHERE email=$1 AND cointype=$2;";
    var params = [email, coinType];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO bitgoaddress (email, cointype, address) VALUES ($1, $2, $3);";
            var params2 = [email, coinType, address];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM bitgoaddress WHERE email=$1 AND coinType=$2;";
                var params3 = [email, coinType];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            var query2 = "UPDATE bitgoaddress SET address=$3 WHERE email=$1 AND coinType=$2;";
            var params2 = [email, coinType, address];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM bitgoaddress WHERE email=$1 AND coinType=$2;";
                var params3 = [email, coinType];
                pgClient.runQuery(query3, params3, callback);
            });
        }
    });
}

module.exports.getAddressByEmail = function(email, coinType, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM bitgoaddress WHERE email=$1 AND cointype=$2;";
    var params = [email, coinType];
    pgClient.runQuery(query, params, callback);
}