// A model that describes the details of a particular order that have been promised.

// orderpromiseproduct
// id - SERIAL
// orderpromiseid - INT
// code - text
// qty - int
// priceid - INT

var pgClient = require('./pg-client');

module.exports.createOrderPromiseProduct = function(newOrderPromiseProduct, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = "INSERT INTO orderpromiseproduct (orderpromiseid, code, qty, priceid) VALUES ($1, $2, $3, $4);";
    var params = [newOrderPromiseProduct.orderPromiseId, newOrderPromiseProduct.code, newOrderPromiseProduct.qty, newOrderPromiseProduct.priceId];
    pgClient.runQuery(query, params, callback);
}

module.exports.getOrderPromiseById = function(id, callback){
    var query = "SELECT * FROM orderpromiseproduct WHERE id=$1;";
    var params = [id];
    pgClient.runQuery(query, params, callback);
}

module.exports.getListOfRowsByOrderPromiseId = function(orderPromiseId, callback){
    var query = "SELECT * FROM orderpromiseproduct WHERE orderpromiseid=$1;";
    var params = [orderPromiseId];
    pgClient.runQueryMultiSelect(query, params, callback);
}