var WAValidator = require('wallet-address-validator');

validateAddress = function(address, coinType){
    // Example parameter: coinType="BTC"
    var valid = false;
    if (process.env.NETWORK_TYPE === 'testnet'){
        valid = WAValidator.validate(address, coinType, 'testnet');
    } else {
        valid = WAValidator.validate(address, coinType);
    }
    return valid;
};

module.exports = validateAddress;