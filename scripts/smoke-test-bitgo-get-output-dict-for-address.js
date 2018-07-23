require('dotenv').config({path: '../.env'});
const getOutputDictForAddress = require('../server/get-output-dict-for-address');

getOutputDictForAddress("2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", function (err, res) {
    if (err) {
        console.log(err);
    }
    console.log(res);
});