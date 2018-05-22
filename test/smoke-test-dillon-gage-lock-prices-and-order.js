require('dotenv').config({path: '../.env'});

const request = require('request');
mlog = require('mocha-logger');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

describe('Order Dillon Gage Product', function() {
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
        }
        , function(error, response, body) {
            if (typeof(body) === 'undefined') {
                console.error("Error when getting body.");
                console.log(error);
            } else {
                console.log(result);
                request.post(url, {json:
                    {
                        "transactionId":"12345",
                        "referenceNumber":"123",
                        "inventoryLocation":"DGI",
                        "shippingOption":"store",
                        "dropShipInfo": {
                            "name":"John Smith",
                            "address1": "1 Main St.",
                            "address2": "",
                            "address3": "",
                            "address4": "",
                            "city": "Dallas",
                            "state": "TX",
                            "postalCode": "75255",
                            "country":"USA",
                            "depository":"IDS-CANADA | IDS-DE",     // specify this tag if shippingOption = 'store' | 'store_hold'
                            "fbo":"John Smith",                     // specify this tag if shippingOption = 'store' | 'store_hold'
                            "accountNumber": "90023"                // specify this tag if shippingOption = 'store' | 'store_hold'
                        },
                        "fulfillment": {
                            "Data001": "01/25/2015",
                            "Data002": "BR549",
                            "Data009": "Visa *009",
                            "Data011": "John Smith",
                            "Data012": "1 Main St.",
                            "Data015": "Dallas",
                            "Data016": "TX",
                            "Data017": "75255",
                            "items":
                                [
                                    { "Data030a": "1", "Data032a": "1MAPLE", "Data033a": "1 OZ Canadian Gold Maple Leaf", "Data034a": "1325.00", "Data035a": "1,325.00" },
                                    { "Data030b": "2", "Data032b": "1EAGLE", "Data033b": "1 OZ American Gold Eagle", "Data034b": "1320.00", "Data035b": "2,640.00" }
                                ],
                            "Data040": "Order Notes Line 1",
                            "Data041": "Order Notes Line 2",
                            "Data050": "0.00",
                            "Data051": "25.00",
                            "Data052": "3,990.00"
                        },
                        "lockToken":body.lockToken,
                        "traderId":"jargonson2828282828@gmail.com"
                    }
                }, function(error, response, body) {
                    // body.lockToken
                    if (typeof(body) === 'undefined') {
                        console.error("Error when getting body.");
                        console.log(error);
                    } else {
                        console.log(body);
                    }
                    done();
                });
            }
        });
    });
});