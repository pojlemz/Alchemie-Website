require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

var url2 = host + '/FizServices/UpdateDropShipInfo/' + privateToken;
// https://stage-connect.fiztrade.com/FizServices/ExecuteTrade/token/1349-00bdbf2b582db69fb28b72a446cb6d18
/* "inventoryLocation":"DGI", */
request.post(url2,
    { json:
        {
            "dropShipInfo":
                {
                    "name":"John Smith",
                    "address1": "1 Main St.",
                    "address2": "",
                    "address3": "",
                    "address4": "",
                    "city": "Dallas",
                    "state": "TX",
                    "postalCode": "75255",
                    "country":"US"
                },
            "confirmationNumber":'FIZ00063921',
            "traderId":"dan@blockunity.com"
        }
    }, function(error, response, body) {
        if (error){
            console.log(error);
        }
        console.log(body);
        // body = {error: "Expected a two character country code", confirmationNumber: "00063921"}
    }
);