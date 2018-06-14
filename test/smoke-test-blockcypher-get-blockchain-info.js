const request = require('request');

// $.get('https://api.blockcypher.com/v1/btc/main').then(function(d) {console.log(d)});

var url = 'https://api.blockcypher.com/v1/btc/main';
request({
    uri: url,
    method: ""
}, function(error, response, body) {
    if (typeof(body) === 'undefined') {
        console.error("Error when fetching block height.");
        console.log(error);
    } else {
        console.log(body);
    }
});