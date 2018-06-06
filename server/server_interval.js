const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const instruments = ['100G', '1KILOG'];
const Price = require('../models/price');
const markupPriceForCustomer = require('../server/markup-price-for-customer');

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
                const customerPrice = markupPriceForCustomer(JSON.parse(body)['tiers'][1]['ask']);
                Price.addPrice(instrument, customerPrice, function(err, res){
                    if (err) {
                        console.error("Error when storing prices.");
                    }
                });
            }
        });
    }
}, 1000 * 5);

module.exports = requestLoop;