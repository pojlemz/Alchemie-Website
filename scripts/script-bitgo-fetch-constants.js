var BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: process.env.BITGO_ENVIRONMENT, accessToken: process.env.BITGO_ACCESS_TOKEN});

bitgo.fetchConstants().then(function(constants) {
    // print constants
    console.dir(constants);
});