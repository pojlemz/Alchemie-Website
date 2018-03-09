// A model that describes who owns various Ethereum addresses (users 'own' various addresses so that they can reassign tokens if necessary)

// ownedaddress
// email - text
// address - text

var pgClient = require('./pg-client');

module.exports.getListOfRowsByUser = function(email, callback){
    var query = "SELECT * FROM users WHERE email=$1;";
    var params = [email];
    pgClient.runQueryMultiSelect(query, params, callback);
}

module.exports.createOwnedAddress = function(newUser, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    var query = "INSERT INTO ownedaddress (email, address) VALUES ($1, $2);";
    var params = [newUser.email, newUser.address];
    pgClient.runQuery(query, params, function(err, res) {
        var query2 = "SELECT * FROM ownedaddress WHERE address=$1;";
        var params2 = [newUser.address];
        pgClient.runQuery(query2, params2, callback);
    });
}

module.exports.getOwnedAddressByAddress = function(address, callback){
    var query = "SELECT * FROM ownedaddress WHERE address=$1;";
    var params = address;
    pgClient.runQuery(query, params, callback);
}