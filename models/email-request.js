// A model that contains all requests to send an email.

// Email Request
// email - text
// cointype - text
// amount - float8
// address - text
// content - text
// finalAddress - text

var pgClient = require('./pg-client');

// module.exports.getListOfRowsByEmail = function(email, callback){
//     var query = "SELECT * FROM forgottenpasswordlinks WHERE email=$1";
//     var params = email;
//     pgClient.runQueryMultiSelect(query, params, callback);
// }

module.exports.createEmailRequest = function(newEmailRequest, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = 'INSERT INTO "EmailRequest" (cointype, address, email, content, amount, finalAddress) VALUES ($1, $2, $3, $4, $5, $6);';
    params = [newEmailRequest.coinType, newEmailRequest.address, newEmailRequest.email, newEmailRequest.content, newEmailRequest.amount, newEmailRequest.finalAddress];
    pgClient.runQuery(query, params, function(err, res) {
        var query2 = "SELECT * FROM memo WHERE cointype=$1 AND address=$2;";
        var params2 = [newMemo.coinType, newMemo.address];
        pgClient.runQuery(query2, params2, callback);
    });
}

// module.exports.getForgottenPasswordLinkByPasswordLink = function(passwordLink, callback) {
//     var query = "SELECT * FROM forgottenpasswordlinks WHERE passwordLink=$1;";
//     var params = [passwordLink];
//     pgClient.runQuery(query, params, callback);
// }