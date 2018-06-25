// A model that adds the orders executed to the table to record them for analytics purposes.

// orderexecuted
// transactionid - int
// referencenumber - int
// status - text
// confirmationnumber - text

var pgClient = require('./pg-client');

module.exports.createOrderExecuted = function (newOrderExecuted, callback) {
    var item = newOrderExecuted; // We do this to shorten notation
    var query = "INSERT INTO orderexecuted (transactionid, inventorylocation, referencenumber, status, confirmationnumber) VALUES ($1, $2, $3, $4, $5);";
    var params = [item.transactionId, item.inventoryLocation, item.referenceNumber, item.status, item.confirmationNumber];
    pgClient.runQuery(query, params, function(err, res) {
        var query2 = "SELECT * FROM orderexecuted WHERE transactionid=$1;";
        var params2 = [item.transactionId];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getOrderExecutedByTransactionId = function (transactionId, callback) {
    var query = "SELECT * FROM orderexecuted WHERE transactionid=$1;";
    var params = [transactionId];
    pgClient.runQuery(query, params, callback);
}