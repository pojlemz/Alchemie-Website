// A model with a schema similar to users that stores users who have not confirmed their registration yet.

// pendingusers
// email - text
// password - text
// name - text
// key - text

var bcrypt = require('bcryptjs');
var pgClient = require('./pg-client');

module.exports.createUser = function(newUser, callback){
    // Note that this is created from a pending user (password already hashed etc.)
    // INSERT INTO testtable VALUES(15, :'content');
    // client.query("INSERT INTO users (email, password, name) VALUES ('"+"a@a.com"+"', '"+"b7b7b7b7"+"','"+"aaa"+"');", [], function(err, res) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            var params = [newUser.email, hash, newUser.name, newUser.key];
            var query = "INSERT INTO pendingusers (email, password, name, key) VALUES ($1, $2, $3, $4);";
            // insertString example: INSERT INTO pendingusers (email, password, name) VALUES ('h@h.com', 'kkkkkkkk','yeti');
            pgClient.runQuery(query,params, function(err, res) {
                pgClient.runQuery('SELECT * FROM pendingusers;', [], callback);
            });
        });
    });
}

module.exports.getUserByEmail = function(email, callback){
    // var query = {email: email};
    // PendingUser.findOne(query).select(['email', 'password', 'name', 'key']).exec(callback);
    var query = "SELECT * FROM pendingUsers WHERE email=$1;"
    var params = [email];
    pgClient.runQuery(query, params, callback);
}

module.exports.getUserById = function(id, callback){
    // PendingUser.findById(id, callback);
    var query = "SELECT * FROM pendingUsers WHERE id=$1;";
    var params = [id];
    pgClient.runQuery(query, params, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

// This function is used when confirming a registration for example
module.exports.getUserByHashKey = function(hashKey, callback){
    // This code returns the full document
    // var query = {key: hashKey};
    // PendingUser.findOne(query).select(['email', 'password', 'name', 'key']).exec(callback);
    // This code returns the full document
    var query = "SELECT * FROM pendingUsers WHERE key=$1;";
    var params = [hashKey];
    pgClient.runQuery(query, params, callback);
}

module.exports.deleteUserByHashKey = function(hashKey, callback){
    var query = "DELETE FROM pendingUsers WHERE key=$1;";
    var params = [hashKey];
    pgClient.runQuery(query, params, callback);
}

module.exports.deleteUserByEmail = function(email, callback){
    // var query = {email: email};
    // PendingUser.remove(query).exec(callback);
    var query = "DELETE FROM pendingUsers WHERE email=$1;";
    var params = [query.email];
    // PendingUser.remove(query).exec(callback);
    pgClient.runQuery(query, params, callback);
}