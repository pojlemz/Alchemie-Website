var pgClient = require('./pg-client');

module.exports.createMintReady = function(newMintReady, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    const query = "SELECT * FROM mintready WHERE transactionid=$1;";
    const params = [newMintReady.transactionId];
    pgClient.runQuery(query, params, function(err, res){
        if (res === null){
            var query = "INSERT INTO mintready (transactionid, product, productaddress, qty, transactionoutput, confirmationnumber) VALUES ($1, $2, $3, $4, $5, $6);";
            var params = [newMintReady.transactionId, newMintReady.product, newMintReady.productAddress, newMintReady.qty, newMintReady.transactionOutput, newMintReady.confirmationNumber];
            pgClient.runQuery(query, params, callback);
        } else {
            // Do nothing if the transaction for this record already exists.
            callback(err, res);
        }
    });
}

module.exports.removeMintReady = function(transactionId, callback) {
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    const query = "DELETE FROM mintready WHERE transactionid=$1;";
    const params = [transactionId];
    pgClient.runQuery(query, params, callback);
}