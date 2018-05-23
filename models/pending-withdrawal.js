// A model that contains all successful requests a user makes to withdraw.

// pendingwithdrawal
// email - text
// cointype - text
// address - text
// amount - bigint - satoshis
// withdrawlink - text
// expirysecondssinceunixepoch - bigint

var pgClient = require('./pg-client');

module.exports.getListOfRowsByEmail = function(email, callback){
    var query = "SELECT * FROM pendingwithdrawals WHERE email=$1";
    var params = email;
    pgClient.runQueryMultiSelect(query, params, callback);
}

module.exports.createPendingWithdrawalLink = function(newPendingWithdrawalLink, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = "INSERT INTO pendingwithdrawal (email, cointype, address, amount, withdrawlink, expirymillisecondssinceunixepoch) VALUES ($1, $2, $3, $4, $5, $6);";
    params = [newPendingWithdrawalLink.email, newPendingWithdrawalLink.cointype, newPendingWithdrawalLink.address, newPendingWithdrawalLink.amount, newPendingWithdrawalLink.withdrawLink, newPendingWithdrawalLink.expiryMillisecondsSinceUnixEpoch];
    pgClient.runQuery(query, params, function(err, res) {
        var query2 = "SELECT * FROM pendingwithdrawal WHERE withdrawlink=$1;";
        var params2 = [newPendingWithdrawalLink.withdrawLink];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getPendingWithdrawalLinkByWithdrawalLink = function(withdrawLink, callback){
    var query = "SELECT * FROM pendingwithdrawal WHERE withdrawlink=$1;";
    var params = [withdrawLink];
    pgClient.runQuery(query, params, callback);
}