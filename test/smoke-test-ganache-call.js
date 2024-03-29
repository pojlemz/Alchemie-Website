require('dotenv').config({path: '../.env'});

const request = require('request');
mlog = require('mocha-logger');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const publicToken = process.env.DILLON_GAGE_PUBLIC_TOKEN;

describe('Get Dillon Gage Products', function() {
    it('List the Dillon Gage products that are available on the website', function(done) {
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
            done();
        });
    });
});