require('dotenv').config({path: '../.env'});

const request = require('request');
mlog = require('mocha-logger');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const publicToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

var url = host + '/FizServices/GetProductsByMetalV2/'+publicToken+'/Gold';
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