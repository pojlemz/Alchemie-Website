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
                    {"code":"1KILOG","transactionType":"buy","qty":"1"},
                    {"code":"1GP","transactionType":"buy","qty":"5"}
                ]
        }
    }
    , function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("Error when getting body.");
            console.log(error);
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
                    "dropShipInfo": {"name": "Retail Customer", "address1": "123 Hickory Lane", "address2": "", "address4":"+1 416 996-1688", "city": "Madison", "state":"CT", "postalCode":"06443", "country": "US"},
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
/*
{ inventoryLocation: 'Vault',
    referenceNumber: '123456',
    status: 'filled',
    transactionId: '123456',
    confirmationNumber: [ 'FIZ00063269' ] }
*/