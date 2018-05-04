// A model that contains a bitcoin address for each user to deposit their bitcoins.

// withdrawalbitcoinaddress
// id - int
// email - text
// bitcoinaddress - boolean

var pgClient = require('./pg-client');

module.exports.addAddress = function(email, coinType, address, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM withdrawaladdress WHERE email=$1 AND cointype=$2 AND address=$3;";
    var params = [email, coinType, address];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO withdrawaladdress (email, cointype, address) VALUES ($1, $2, $3);";
            var params2 = [email, coinType, address];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM withdrawaladdress WHERE email=$1 AND cointype=$2 AND address=$3;";
                var params3 = [email, coinType, address];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            callback(err, res)
        }
    });
}

module.exports.removeAddress = function(email, coinType, address, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query2 = "DELETE FROM withdrawaladdress WHERE email=$1 AND cointype=$2 AND address=$3;";
    var params2 = [email, coinType, address];
    pgClient.runQuery(query2, params2, callback);
}

module.exports.getAddresses = function(email, coinType, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM withdrawaladdress WHERE email=$1 AND cointype=$2;";
    var params = [email, coinType];
    pgClient.runQueryMultiSelect(query, params, callback);
}