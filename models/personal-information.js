// A model that contains personal information provided when a user uploads the document.
// This includes any time the upload document form is submitted.

// personalinformation
// email - text
// firstname - text
// lastname - text
// streetaddress - text
// city - text
// state - text
// country - text
// dayofbirth - int
// monthofbirth - int
// yearofbirth - int

var pgClient = require('./pg-client');

// personalInformation contains everything except the email
module.exports.setPersonalInformationByEmail = function(email, personalInformation, callback) {
    // First check to see that user exists and insert a row if the user doesn't exist.
    var query = "SELECT * FROM personalinformation WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, function(err, res) {
        if (res === null) {
            var query2 = "INSERT INTO documentinreview (email, inreview) VALUES ($1, $2);";
            var params2 = [email, inReview];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM documentinreview WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        } else {
            var query2 = "UPDATE documentinreview SET inreview=$2 WHERE email=$1;";
            var params2 = [email, inReview];
            pgClient.runQuery(query2, params2, function (err, res) {
                var query3 = "SELECT * FROM documentinreview WHERE email=$1;";
                var params3 = [email];
                pgClient.runQuery(query3, params3, callback);
            });
        }
    });
}

module.exports.getIsDocumentInReviewByEmail = function(email, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT * FROM documentinreview WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}