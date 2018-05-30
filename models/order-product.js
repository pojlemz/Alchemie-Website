// A model that contains the lock token belonging to each order.

// orderproduct
// column - type - example
// id - int - 12345
// code - text - '1KILOG'
// amount - float8 - 418422.30000000005
// priceperounce - float8 - 1301.55
// qty - int - 10
// retailamount - float8 - 422598.32
// bid - float8 - 41641.3
// transtype - text - 'buy'
// formula - float8 - '1298.8'
// price - float8 - 41842.23
// retailPrice - float8 - 42259.831920000004
// ask - float8 - 41842.23

var pgClient = require('./pg-client');

module.exports.AddProduct = function(id, values, callback){
    // TODO: Later make it so that bulk inserts are possible
    // The lock token for any transaction should only ever be set once.
    var query2 = "INSERT INTO orderproduct (id, code, amount, priceperounce, qty, retailamount, bid, transtype, formula, price, retailprice, ask, unitpricebtc, totalpricebtc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);";
    var params2 = [id, values['code'], values['amount'], values['pricePerOunce'], values['qty'], values['retailAmount'], values['bid'], values['transType'], values['formula'], values['price'], values['retailPrice'], values['ask'], values['unitPriceBtc'], values['totalPriceBtc']];
    pgClient.runQuery(query2, params2, callback);
}

module.exports.getProductByIdAndCode = function(id, code, callback){
    // null or false indicates that the user has not been kyced
    var query = "SELECT id, code FROM orderproduct WHERE id=$1 AND code=$2;";
    var params = [id, code];
    pgClient.runQuery(query, params, callback);
}