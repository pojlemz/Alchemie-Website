require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

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
});
/*
{ transactionId: '12345',
    prices:
    [ { amount: 418422.30000000005,
        pricePerOunce: 1301.55,
        qty: '10',
        retailAmount: 422598.32,
        bid: 41641.3,
        transType: 'buy',
        formula: '1298.8',
        price: 41842.23,
        product: '1KILOG',
        retailPrice: 42259.831920000004,
        ask: 41842.23 },
        { amount: 2613,
            pricePerOunce: 1625.3940902021773,
            qty: '50',
            retailAmount: 3262.32,
            bid: 41.72,
            transType: 'buy',
            formula: '1298.8',
            price: 52.26,
            product: '1GP',
            retailPrice: 65.24642,
            ask: 52.26 }
    ],
    lockToken: 'BLOCKUNITY-1712372'
}
*/