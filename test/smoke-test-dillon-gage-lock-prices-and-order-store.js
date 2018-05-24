require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
var url = host + '/FizServices/LockPrices/'+privateToken;
request.post(url,
    {json:
        {
            "transactionId": "123456",
            "includeRetailPrices": "yes",          // optional
            "items":
                [
                    {"code":"1KILOG","transactionType":"buy","qty":"10"},
                    {"code":"1GP","transactionType":"buy","qty":"50"}
                ]
        }
    }
    , function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("Error when getting body.");
            console.log(error);
        } else {
            console.log(body);
            var url2 = host + '/FizServices/ExecuteTrade/token/' + privateToken;
            // https://stage-connect.fiztrade.com/FizServices/ExecuteTrade/token/1349-00bdbf2b582db69fb28b72a446cb6d18
            request.post(url2, {json:
                {
                    "transactionId":"123456",
                    "referenceNumber":"123",
                    "inventoryLocation":"DGI",
                    "shippingOption":"store",
                    "lockToken":body.lockToken,
                    "traderId":"jargonson2828282828@gmail.com"
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