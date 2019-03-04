// const request = require('request');
//
// module.exports = function getUsdToBtcConversionRate(callback) {
//     var url = 'https://blockchain.info/ticker';
//     request.get(url
//         , function(error, response, body) {
//             try {
//                 if (typeof(body) === 'undefined') {
//                     console.error("Error when getting body.");
//                     console.log(error);
//                 } else {
//                     var result = JSON.parse(body).USD.last;
//                     console.log(callback(result));
//                 }
//             } catch(error) {
//                 console.log(callback("Data Not Available"));
//             }
//         }
//     );
// }