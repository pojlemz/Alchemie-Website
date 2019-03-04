BitcoinSpent = require('../models/bitcoin-spent');

BitcoinSpent.getBitcoinSpentByEmail('dan@blockunity.com', function(err, res){
    console.dir(res); // null
});