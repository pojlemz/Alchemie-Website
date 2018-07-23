require('dotenv').config({path: '../.env'});

const getUnspentsForEmail = require("../server/get-unspents-for-email");

getUnspentsForEmail('dan@blockunity.com', function(err, res){
    if (err) {
        console.log(err);
    }
    console.log(res);
});