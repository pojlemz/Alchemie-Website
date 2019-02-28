require('dotenv').config({path: '../.env'});

var email = 'dan@blockunity.com';
var coinType = process.env.BITCOIN_NETWORK;
var getBitgoBalanceByEmail = require('../server/get-bitgo-balance-by-email');

getBitgoBalanceByEmail(email, coinType, function(err, res){
    console.log(res);
});