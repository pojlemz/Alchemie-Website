// A model that describes who owns various Ethereum addresses (users 'own' various addresses so that they can reassign tokens if necessary)

// orderpromiselockedprices
// transactionid - int
// product - text
// amount - float8
// priceperounce - float8
// qty - int
// retailamount - float8
// bid - float8
// transtype - text
// formula - float8
// price - float8
// retailprice - float8
// ask - float8

// var pgClient = require('./pg-client');
//
// module.exports.createOrderPromiseLockedPrices = function (newOrderPromiseLockedPrices, callback) {
//     var item = newOrderPromiseLockedPrices; // We do this to shorten notation
//     var query = "INSERT INTO orderpromiselockedprices (transactionid, product, amount, priceperounce, qty, retailamount, bid, transtype, formula, price, retailprice, ask) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);";
//     var params = [item.transactionId, item.product, item.amount, item.pricePerOunce, item.qty, item.retailAmount, item.bid, item.transType, item.formula, item.price, item.retailPrice, item.ask];
//     pgClient.runQuery(query, params, function(err, res) {
//         var query2 = "SELECT * FROM orderpromiselockedprices WHERE transactionid=$1 AND product=$2;";
//         var params2 = [item.transactionId, item.product];
//         pgClient.runQuery(query2, params2, callback);
//     });
// }