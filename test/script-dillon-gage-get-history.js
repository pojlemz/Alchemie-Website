require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const publicToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

// 100G
// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
var url = host + '/FizServices/GetPrices/'+publicToken+'/1KILOG';
request({
    uri: url,
    method: ""
}, function(error, response, body) {
    if (typeof(body) === 'undefined') {
        console.error("Error when getting body.");
        console.log(error);
    } else {
        var result = JSON.parse(body);
        console.log(result);
    }
});