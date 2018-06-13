// // A model that contains the lock token belonging to each order.
//
// // orderlocktoken
// // id - int
// // locktoken - text
//
// var pgClient = require('./pg-client');
//
// module.exports.SetLockToken = function(id, lockToken, callback){
//     // The lock token for any transaction should only ever be set once.
//     var query2 = "INSERT INTO orderlocktoken (id, locktoken) VALUES ($1, $2);";
//     var params2 = [id, lockToken];
//     pgClient.runQuery(query2, params2, function (err, res) {
//         var query3 = "SELECT * FROM orderlocktoken WHERE id=$1;";
//         var params3 = [id];
//         pgClient.runQuery(query3, params3, callback);
//     });
// }
//
// module.exports.getLockTokenById = function(email, coinType, callback){
//     // null or false indicates that the user has not been kyced
//     var query = "SELECT email, coinType, MAX(id) AS id FROM orderemail WHERE email=$1 AND cointype=$2 GROUP BY email, cointype;";
//     var params = [email, coinType];
//     pgClient.runQuery(query, params, callback);
// }