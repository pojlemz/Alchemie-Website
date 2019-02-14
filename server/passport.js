// This contains the new postgres code for passport.js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/alchemy';
// const client = new pg.Client(connectionString);
var bcrypt = require('bcryptjs');
var pgClient = require('../models/pg-client');

passport.use(new LocalStrategy(function(username, password, cb) {
    var query = "SELECT email, password, name FROM users WHERE email=$1;";
    var params = [username];
    console.log("Looking up user in table.");
    pgClient.runQuery(query, params, function(err, result) {
        // If postgres isn't configured properly then the application may hang here
        console.log("User found.");
        if(err) {
            console.error('Error when selecting user on login', err);
            return cb(err);
        }

        // if(result.rows.length > 0) {
        if(typeof(result) !== undefined && result !== null) {
            const first = result;
            bcrypt.compare(password, first.password, function(err, res) {
                if(res) {
                    cb(null, { email: first.email, username: first.password, type: first.name});
                } else {
                    cb(null, false);
                }
            });
        } else {
            cb(null, false);
        }
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, cb) {
    var query = "SELECT email, password, name FROM users WHERE email = $1;";
    var params = [email];
    pgClient.runQuery(query, params, function(err, results) {
        if (err) {
            console.error('Error when selecting user on session deserialize', err);
            return cb(err)
        } else {
            cb(null, results);
        }
    });
});

module.exports = passport;