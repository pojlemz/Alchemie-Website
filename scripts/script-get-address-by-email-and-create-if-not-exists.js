require('dotenv').config({path: '../.env'});
const getAddressByEmailAndCreateIfNotExists = require('../server/get-address-by-email-and-create-if-not-exists');

getAddressByEmailAndCreateIfNotExists('bob@saggot.com', process.env.BITCOIN_NETWORK, function(err, res) {
    console.log(res);
});