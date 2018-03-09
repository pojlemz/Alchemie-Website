var bcrypt = require('bcryptjs');
var pgClient = require('./pg-client');

// users
// email - text
// password - text
// name - text

module.exports.createUser = function(newUser, callback) {
	// Note that this is created from a pending user (password already hashed etc.)
    var query = "INSERT INTO users (email, password, name) VALUES ($1, $2, $3);";
    var params = [newUser.email, newUser.password, newUser.name];
    pgClient.runQuery(query, params, function(err, res) {
        pgClient.runQuery("SELECT * FROM users;", [], callback);
    });
}

module.exports.getUserByEmail = function(email, callback) {
    var query = "SELECT * FROM users WHERE email=$1;";
    var params = [email];
    pgClient.runQuery(query, params, callback);
}

module.exports.getUserById = function(id, callback) {
    var query = "SELECT * FROM users WHERE id=$1;";
    var params = id;
    pgClient.runQuery(query, params, callback);
}

module.exports.comparePassword = function(candidatePassword, compareHash, callback) {
	bcrypt.compare(candidatePassword, compareHash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.changeAndHashPassword = function(email, newPassword,  callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            var query = "UPDATE users SET password=$1 WHERE email=$2;";
            var params = [hash, email];
            pgClient.runQuery(query, params, callback);
        });
    });
}