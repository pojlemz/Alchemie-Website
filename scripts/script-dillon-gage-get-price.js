require('dotenv').config({path: '../.env'});

const request = require('request');
const host = process.env.DILLON_GAGE_API_ENDPOINT;
const publicToken = process.env.DILLON_GAGE_PRIVATE_TOKEN;

// 100G
// var url = host + '/FizServices/GetPrices/'+publicToken+'/1GP';
// var url = host + '/FizServices/GetPrices/'+publicToken+'/1KILOG';
var url = host + '/FizServices/GetPrices/'+publicToken+'/.9999PURE';
request({
    uri: url,
    method: ""
}, function(error, response, body) {
    if (typeof(body) === 'undefined') {
        console.error("Error when getting body.");
        console.log(error);
    } else {
        var result = JSON.parse(body);
        console.log(result);
    }
});
/*
{ code: '1KILOG',
    isActiveBuy: 'Y',
    isActiveSell: 'Y',
    availability: '1-5 Days',
    tiers:
    { '1':
        { spread: 200.92,
            melt: 32.148,
            bidPercise: 41885.62920000001,
            askPercise: 42086.554200000006,
            bid: 41885.63,
            ask: 42086.55 },
        '2':
        { spread: 200.92,
            melt: 32.148,
            bidPercise: 41885.62920000001,
            askPercise: 42086.554200000006,
            bid: 41885.63,
            ask: 42086.55 },
        '3':
        { spread: 200.92,
            melt: 32.148,
            bidPercise: 41885.62920000001,
            askPercise: 42086.554200000006,
            bid: 41885.63,
            ask: 42086.55 },
        '4':
        { spread: 200.92,
            melt: 32.148,
            bidPercise: 41885.62920000001,
            askPercise: 42086.554200000006,
            bid: 41885.63,
            ask: 42086.55
        }
    }
}
*/
/*
{ code: '1KILOG',
    isActiveBuy: 'Y',
    isActiveSell: 'Y',
    availability: '1-5 Days',
    tiers:
    { '1':
        { spread: 200.93,
            melt: 32.148,
            bidPercise: 41560.934400000006,
            askPercise: 41761.8594,
            bid: 41560.93,
            ask: 41761.86 },
        '2':
        { spread: 200.93,
            melt: 32.148,
            bidPercise: 41560.934400000006,
            askPercise: 41761.8594,
            bid: 41560.93,
            ask: 41761.86 },
        '3':
        { spread: 200.93,
            melt: 32.148,
            bidPercise: 41560.934400000006,
            askPercise: 41761.8594,
            bid: 41560.93,
            ask: 41761.86 },
        '4':
        { spread: 200.93,
            melt: 32.148,
            bidPercise: 41560.934400000006,
            askPercise: 41761.8594,
            bid: 41560.93,
            ask: 41761.86 } } } */