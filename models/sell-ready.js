var pgClient = require('./pg-client');

module.exports.createSellReady = function(newSellReady, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    const query = "SELECT * FROM sellready WHERE transactionid=$1;";
    const params = [newSellReady.transactionId];
    pgClient.runQuery(query, params, function(err, res){
        if (res === null) {
            var query = "INSERT INTO sellready (transactionid, cointype, grandtotal) VALUES ($1, $2, $3);";
            var params = [newSellReady.transactionId, newSellReady.coinType, newSellReady.grandTotal];
            pgClient.runQuery(query, params, callback);
        } else {
            // Do nothing if the transaction for this record already exists.
            callback(err, res);
        }
    });
}

module.exports.removeSellReady = function(transactionId, callback) {
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    const query = "DELETE FROM sellready WHERE transactionid=$1;";
    const params = [transactionId];
    pgClient.runQuery(query, params, callback);
}