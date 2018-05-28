const crypto = require('crypto');

module.exports = function getUsdToBtc(usdAmount) {
    return usdAmount / 10000;
}