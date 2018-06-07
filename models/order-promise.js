// A model that describes who has been promised a particular order.

// orderpromise
// email - text
// cointype - text
// address - text
// expirymillisecondssinceunixepoch - BIGINT

var pgClient = require('./pg-client');

module.exports.createOrderPromise = function(newOrderPromise, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = "INSERT INTO orderpromise (email, cointype, depositaddress, productaddress, expirymillisecondssinceunixepoch) VALUES ($1, $2, $3, $4, $5);";
    var params = [newOrderPromise.email, newOrderPromise.coinType, newOrderPromise.depositAddress, newOrderPromise.productAddress, newOrderPromise.expiryMillisecondsSinceUnixEpoch];
    pgClient.runQuery(query, params, callback);
}

module.exports.getOrderPromiseById = function(id, callback){
    var query = "SELECT * FROM orderpromise WHERE id=$1;";
    var params = [id];
    pgClient.runQuery(query, params, callback);
}

module.exports.getOrderPromiseByDepositAddress = function(address, callback){
    var query = "SELECT * FROM orderpromise WHERE depositaddress=$1;";
    var params = [address];
    pgClient.runQuery(query, params, callback);
}