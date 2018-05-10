const request = require('request');
mlog = require('mocha-logger');
const host = "https://stage-connect.fiztrade.com";
const privateToken = "1349-00bdbf2b582db69fb28b72a446cb6d18";

describe('Lock Prices Dillon Gage Product', function() {
    it('Lock a Dillon Gage order to be placed later', function(done) {
        // var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
        var url = host + '/FizServices/LockPrices/'+privateToken;
        request.post(url,
        {json:
            {
                "transactionId": "12345",
                "includeRetailPrices": "yes",          // optional
                "items":
                    [
                        {"code":"1KILOG","transactionType":"buy","qty":"10"},
                        {"code":"1GP","transactionType":"buy","qty":"50"}
                    ]
            }
        }, function(error, response, body) {
            if (typeof(body) === 'undefined') {
                console.error("Error when getting body.");
                console.log(error);
            } else {
                console.log(body);
            }
            done();
        });
    });
});