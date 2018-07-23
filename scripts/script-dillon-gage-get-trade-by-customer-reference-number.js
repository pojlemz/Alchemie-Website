require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const publicToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
// const referenceNumber = 11;

// 100G
// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
var url = host + '/FizServices/GetTradeByCustomerReferenceNumber/'+publicToken;
request.post(url,
    {json:
        {
            // orderDate:"YYYY-MM-DD",
            referenceNumber: '11'
        }
    }
// request({
//         uri: url,
//         method: 'POST',
//         data: { json :
//             {
//                 referenceNumber: '11'
//             }
//         },
//         headers: {
//             'Content-Type': 'text/html',
//         }
//     }
, function(error, response, body) {
    if (typeof(body) === 'undefined') {
        console.error("Error when getting body.");
        console.log(error);
    } else {
        var result = body;
        console.log(result);
    }
});