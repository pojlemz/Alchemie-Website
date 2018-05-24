const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const instruments = ['100G', '1KILOG'];
const Price = require('../models/price');

const requestLoop = setInterval(function(){
    // Get prices for various Dillon Gage products and store them in a Postgres table.
    for (var i = 0 ; i < instruments.length; i++){
        const instrument = instruments[i];
        var url = host + '/FizServices/GetPrices/'+privateToken+'/'+ instrument;
        request({
            uri: url,
            method: ""
        }, function(error, response, body) {
            if (typeof(body) === 'undefined') {
                console.error("Error when fetching prices.");
                console.log(error);
            } else {
                Price.addPrice(instrument, JSON.parse(body)['tiers'][1]['ask'], function(err, res){
                    if (err) {
                        console.error("Error when storing prices.");
                    }
                });
            }
        });
    }
}, 20000);

module.exports = requestLoop;