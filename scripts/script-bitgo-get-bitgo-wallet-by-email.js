require('dotenv').config({path: '../.env'});

getBitgoWalletByEmail = require("../server/get-bitgo-wallet-by-email");
getBitgoWalletByEmail("dan@blockunity.com", function(err, res){console.log(res);});