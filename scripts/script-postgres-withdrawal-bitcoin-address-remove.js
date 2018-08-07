const WithdrawalBitcoinAddress = require('../models/withdrawal-address');

WithdrawalBitcoinAddress.removeBitcoinAddress("dan@blockunity.com", '35Ggzxe9v5mxgCJr5gRm9cpbY5Z3nZKAgc', function (err, data) {
    console.log('Data: ', JSON.stringify(data));
});