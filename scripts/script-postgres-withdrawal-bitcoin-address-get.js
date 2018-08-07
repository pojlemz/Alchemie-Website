const WithdrawalBitcoinAddress = require('../models/withdrawal-address');

WithdrawalBitcoinAddress.getBitcoinAddresses("dan@blockunity.com", function (err, data) {
    console.log('Data: ', JSON.stringify(data));
});