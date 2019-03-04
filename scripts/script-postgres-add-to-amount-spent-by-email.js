BitcoinSpent = require('../models/bitcoin-spent');

BitcoinSpent.addToAmountSpent('dan@blockunity.com', 10, function(err, res){
    console.dir(res); // null
});