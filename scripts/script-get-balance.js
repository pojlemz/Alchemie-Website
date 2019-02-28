const request = require('request');

var address = '16Fg2yjwrbtC6fZp61EV9mNVKmwCzGasw5';
var url = 'https://blockchain.info/balance?active=' + address;

request({
    uri: url,
    method: ""
}, function(error, response, body) {
    if (!error){
        // console.log(response);
        console.log(body);
        //address
        console.log(JSON.parse(body)[address].final_balance);
    }
});