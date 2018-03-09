// A model that contains all successful requests a user makes to reset their password.
// This includes any request that successfully sends an email.

// ownedaddress
// email - text
// passwordlink - text
// expirysecondssinceunixepoch - bigint

var pgClient = require('./pg-client');

module.exports.getListOfRowsByEmail = function(email, callback){
    var query = "SELECT * FROM forgottenpasswordlinks WHERE email=$1";
    var params = email;
    pgClient.runQueryMultiSelect(query, params, callback);
}

module.exports.createPasswordResetLink = function(newPasswordResetLink, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = "INSERT INTO forgottenpasswordlinks (email, passwordlink, expirymillisecondssinceunixepoch) VALUES ($1, $2, $3);";
    params = [newPasswordResetLink.email, newPasswordResetLink.passwordLink, newPasswordResetLink.expiryMillisecondsSinceUnixEpoch];
    pgClient.runQuery(query, params, function(err, res) {
        var query2 = "SELECT * FROM forgottenpasswordlinks WHERE passwordlink=$1;";
        var params2 = [newPasswordResetLink.passwordLink];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getForgottenPasswordLinkByPasswordLink = function(passwordLink, callback){
    var query = "SELECT * FROM forgottenpasswordlinks WHERE passwordLink=$1;";
    var params = [passwordLink];
    pgClient.runQuery(query, params, callback);
}