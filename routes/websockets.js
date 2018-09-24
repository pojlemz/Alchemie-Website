const express = require('express'); // Express app
const fileUpload = require('express-fileupload');
var router = express.Router(); // Express router

const parseForm = require('../server/parse-form'); // Function used for ensuring the CSRF token provided is valid

// @NOTE: For encoding and decoding filenames we use
// https://www.hacksparrow.com/base64-encoding-decoding-in-node-js.html

router.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

module.exports = router;