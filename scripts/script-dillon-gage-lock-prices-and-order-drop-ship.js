require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
var url = host + '/FizServices/LockPrices/' + privateToken;
request.post(url,
    {json:
        {
            "transactionId": "123456",
            "includeRetailPrices": "no",          // optional
            "items":
                [
                    {"code":"1KILOG","transactionType":"buy","qty":"1"}
                ]
        }
    }
    , function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("Error when getting body.");
            console.log(error);
        } else if (body.error || error) {
            console.error("Error with locking request.");
            console.log(error);
            console.log(body);
        } else {
            console.log(body);
            var url2 = host + '/FizServices/ExecuteTrade/' + privateToken;
            // https://stage-connect.fiztrade.com/FizServices/ExecuteTrade/token/1349-00bdbf2b582db69fb28b72a446cb6d18
            /* "inventoryLocation":"DGI", */
            request.post(url2, {json:
                {
                    "transactionId":"123456",
                    "referenceNumber":"123456",
                    "shippingOption":"hold",
                    "lockToken":body.lockToken,
                    "traderId":"dan@blockunity.com"
                }
            }, function(error, response, body) {
                // body.lockToken
                console.log("Printing response from order.");
                if (typeof(body) === 'undefined') {
                    console.error("Error when getting body.");
                    console.log(error);
                } else {
                    console.log(body);
                }
            });
        }
    }
);