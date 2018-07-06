const express = require('express');
const fileUpload = require('express-fileupload');
var router = express.Router();

const csrfProtection = require('../server/csrf-protection');
const parseForm = require('../server/parse-form');

// @NOTE: For encoding and decoding filenames we use
// https://www.hacksparrow.com/base64-encoding-decoding-in-node-js.html

// default options
router.use(fileUpload());

router.post('/kyc-upload',parseForm, function(req, res) {
    if (!req.files)
        return res.status(400).send('No uploads were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.sampleFile;
    var email = req.user.email;
    // Use the mv() method to place the file somewhere on your server

    sampleFile.mv(hash, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
    // sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    //     bcrypt.genSalt(10, function(err, salt) {
    //
    //     });
    //
    //     if (err)
    //         return res.status(500).send(err);
    //
    //     res.send('File uploaded!');
    // });
});

module.exports = router;