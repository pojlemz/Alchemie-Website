require('dotenv').config({path: '../.env'});
const UTXO = require('../models/utxo');

UTXO.updateUTXOListWithBitGoByEmail('dan@blockunity.com', function(err, res){
    console.log(res);
});