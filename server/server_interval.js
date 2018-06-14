const productsDict = require('../server/constants-products');
const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const privateToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;
const products = Object.keys(productsDict);
const Price = require('../models/price');
const OrderPromise = require('../models/order-promise');
const markupPriceForCustomer = require('../server/markup-price-for-customer');
const handleOrderPromise = require('../server/handle-order-promise');

var BitGoJS = require('bitgo');
// const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});
const walletId = process.env.WALLET_ID;
const coinType = process.env.BITCOIN_NETWORK;

const requestLoop = setInterval(function(){
    // Get prices for various Dillon Gage products and store them in a Postgres table.
    for (var i = 0 ; i < products.length; i++){
        const instrument = products[i];
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
    // Get the unspents from BitGo and react to their values.
    bitgo.coin(coinType).wallets().get({ id: walletId }).then(function(wallet) {
        wallet.unspents().then(function(unspents) {
            // For each unspent, look up the corresponding value in the orderpromise table
            const utxoArray = unspents.unspents;
            for (var i = 0; i < utxoArray.length; i++) {
                const address = utxoArray[i].address;
                const blockHeight = utxoArray[i].blockHeight;
                const value = utxoArray[i].value;
                OrderPromise.getOrderPromiseByDepositAddress(address, function(err, orderPromise){
                    handleOrderPromise(orderPromise, address, blockHeight, value);
                });
            }
        });
    });
}, 1000 * 5);

module.exports = requestLoop;