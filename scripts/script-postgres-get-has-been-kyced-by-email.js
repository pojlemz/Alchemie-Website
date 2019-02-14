const express = require('express'); // Express app
const router = express.Router(); // Express router
const HasBeenKyced = require("../models/has-been-kyced");

HasBeenKyced.getHasBeenKycedByEmail('dan@blockunity.com', function(err, res) {
    console.log(res); // {email: "dan@blockunity.com", kyced: true}
});

module.exports = router;