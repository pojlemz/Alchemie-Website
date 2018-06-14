const request = require('request');

module.exports = function getBlockHeight(callback) {
    var url = 'https://api.blockcypher.com/v1/btc/main';
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("Error when fetching block height.");
            console.log(error);
        } else {
            // example of response.height = 527451;
            callback(null, response);
        }
    });
}