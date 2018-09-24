require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

var url2 = host + '/FizServices/ClearDropShipHold/' + privateToken;
// https://stage-connect.fiztrade.com/FizServices/ExecuteTrade/token/1349-00bdbf2b582db69fb28b72a446cb6d18
/* "inventoryLocation":"DGI", */
request.post(url2,
    { json:
        {
            "confirmationNumber":'FIZ00064156',
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