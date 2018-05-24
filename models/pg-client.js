const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/alchemy';
const client = new pg.Client(connectionString);

client.connect();

module.exports.runQuery = function(query, params, callback){
    client.query(query, params, function(err, res){
        if (typeof(res) === 'undefined' || res === null || typeof(res.rows) === 'undefined' || res.rows === null || res.rows.length === 0){
            // console.log("Statement returned no results");
            if (err){
                console.error(err);
            }
            callback(err, null);
        } else {
            callback(err, res.rows[0]);
        }
    });
}

module.exports.runQueryMultiSelect = function(query, params, callback){
    client.query(query, params, function(err, res){
        if (err){
            console.error(err);
        }
        if (typeof(res) === 'undefined' || res === null || typeof(res.rows) === 'undefined' || res.rows === null || res.rows.length === 0){
            callback(err, []);
        } else {
            callback(err, res.rows); // This is the key difference between this function and runQuery
        }
    });
}