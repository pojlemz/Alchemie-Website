require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const publicToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const numFizTradeNumber = "FIZ00063480";

// 100G
// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
var url = host + '/FizServices/GetTrade/'+publicToken+'/'+numFizTradeNumber;
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