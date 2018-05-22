// A model that contains all successful requests a user makes to withdraw.

// pendingwithdrawals
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

module.exports.createPasswordResetLink = function(newPendingWithdrawalLink, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = "INSERT INTO pendingwithdrawals (email, cointype, address, amount, withdrawlink, expirymillisecondssinceunixepoch) VALUES ($1, $2, $3, $4, $5, $6);";
    params = [newPendingWithdrawalLink.email, newPendingWithdrawalLink.cointype, newPendingWithdrawalLink.address, newPendingWithdrawalLink.amount, newPendingWithdrawalLink.withdrawLink, newPendingWithdrawalLink.expiryMillisecondsSinceUnixEpoch];
    pgClient.runQuery(query, params, function(err, res) {
        var query2 = "SELECT * FROM pendingwithdrawals WHERE withdrawlink=$1;";
        var params2 = [newPendingWithdrawalLink.withdrawLink];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getForgottenPasswordLinkByPasswordLink = function(passwordLink, callback){
    var query = "SELECT * FROM pendingwithdrawals WHERE withdrawlink=$1;";
    var params = [withdrawLink];
    pgClient.runQuery(query, params, callback);
}