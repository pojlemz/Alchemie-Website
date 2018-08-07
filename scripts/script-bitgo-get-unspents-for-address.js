require('dotenv').config({path: '../.env'});
const getUnspentsForAddress = require('../server/get-unspents-for-address');

getUnspentsForAddress("2N6WNRJzgwokT2qKLSCoYovBJqUmN5Ay8Dr", function (err, res) {
    if (err) {
        console.log(err);
    }
    console.log(res);
});