// This contains the new postgres code for passport.js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/alchemy';
const client = new pg.Client(connectionString);

passport.use(new LocalStrategy(function(username, password, cb) {
    client.query('SELECT email, password, name FROM users WHERE email=$1', [username], function(err, result) {
        if(err) {
            console.error('Error when selecting user on login', err);
            return cb(err);
        }

        if(result.rows.length > 0) {
            const first = result.rows[0];
            bcrypt.compare(password, first.password, function(err, res) {
                if(res) {
                    cb(null, { id: first.email, username: first.password, type: first.name});
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
    client.query('SELECT email, password, name FROM users WHERE email = $1', [parseInt(email, 10)], function(err, results) {
        if (err) {
            console.error('Error when selecting user on session deserialize', err);
            return cb(err)
        } else {
            cb(null, results.rows[0]);
        }
    });
});

module.exports = passport;