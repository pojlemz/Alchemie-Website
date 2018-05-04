const request = require('request');
mlog = require('mocha-logger');
const host = "https://stage-connect.fiztrade.com";
const publicToken = "1349-00bdbf2b582db69fb28b72a446cb6d18";

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