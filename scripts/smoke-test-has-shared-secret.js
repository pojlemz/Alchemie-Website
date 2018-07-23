var request = require('request');

var url = host + '/has-shared-secret?email='+email;
request({
    uri: url,
    method: ""
}, function(error, response, body) {
    var result = JSON.parse(body).response;
    if (error) {
        console.log(error);
    }
    callback(error, result);
});