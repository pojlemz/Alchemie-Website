require('dotenv').config();

var messageSender = require('./server/emailer/message-sender.js');

messageSender('dan@blockunity.com', 'Sample Subject', 'Sample Body', function(){console.log(arguments);});