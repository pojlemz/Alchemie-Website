require('dotenv').config({path: '../.env'});

const getReadyUtxos = require('../server/get-ready-utxos');

getReadyUtxos(function(err, res){
    console.log(res);
})