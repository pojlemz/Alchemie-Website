require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
var confirmationNumber = 'FIZ00064055';
var url = host + '/FizServices/SimulateOrderShipment/'+privateToken + '/' + confirmationNumber;
request.get(url,
    function(error, response, body) {
        // {"result":"ok"}
        if (typeof(body) === 'undefined') {
            console.error("Error when getting body.");
            console.log(error);
        } else if (body.error || error) {
            console.error("Error with locking request.");
            console.log(error);
            console.log(body);
        } else {
            console.log(body);
        }
    }
);