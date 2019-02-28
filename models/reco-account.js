// A model that maps wallet account id to
// A negative value corresponds to a buy.

// recoaccount
// id - SERIAL
// email - text

var pgClient = require('./pg-client');

module.exports.getRecoAddressByEmail = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM recoaccount WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}

module.exports.createRecoAddressForEmail = function(email, callback){
    const query = "SELECT * FROM recoaccount WHERE email=$1;";
    const params = [email];
    pgClient.runQuery(query, params, function(err, res){
        if (res === null){
            var query2 = "INSERT INTO recoaccount (email) VALUES ($1);";
            var params2 = [email];
            pgClient.runQuery(query2, params2, function(err, res){
                pgClient.runQuery(query, params, callback);
            });
        } else {
            // Do nothing if the transaction for this record already exists.
            callback(err, res);
        }
    });
}