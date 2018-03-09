// A model that contains the name of a document along with the accompanied email.
// This includes any request that successfully sends an email.

// submitteddocumentname
// email - text
// documentname - boolean

var pgClient = require('./pg-client');

module.exports.setSubmittedDocumentNameByEmail = function(email, documentName, callback){
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM submitteddocumentname WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO submitteddocumentname (email, documentName) VALUES ($1, $2);";
            var params2 = [email, documentName];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM submitteddocumentname WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            var query2 = "UPDATE submitteddocumentname SET documentName=$2 WHERE email=$1;";
            var params2 = [email, documentName];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM submitteddocumentname WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        }
    });
}

module.exports.getSubmittedDocumentNameByEmail = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM submitteddocumentname WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}