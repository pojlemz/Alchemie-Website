var pgClient = require('../../models/pg-client');

pgClient.runQuery('SELECT * FROM pg_catalog.pg_tables', [], function(err, result) {
    console.log(result);
});