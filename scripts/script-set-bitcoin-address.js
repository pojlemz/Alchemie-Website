var BitgoAddress = require('../models/bitgo-address');

BitgoAddress.setAddress("rawbort@salmon.com", 'BTC', '35Ggzxe9v5mxgCJr5gRm9cpbY5Z3nZKAgc', function(err, data){
    console.log('Data: ', JSON.stringify(data));
});