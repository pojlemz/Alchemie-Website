var request = require('request');
var host = process.env.TWO_FACTOR_HOST;

module.exports.verifyOneTimeCodeAndEmail = function(email, code, callback){
    // Sample request:
    // localhost:4000/verify-one-time-code-and-email?email=bob@saggot.com&code=000000
    // Sample response:
    // {"err": null, "response": false}
    var url = host + '/verify-one-time-code-and-email?email='+email+'&code='+code;
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("You probably forgot to start the 2fa server if you see error SyntaxError: Unexpected token u in JSON at position 0");
            callback(error, null);
        } else {
            var result = JSON.parse(body).response;
            callback(error, result);
        }
    });
}

module.exports.hasSharedSecret = function(email, callback){
    // Sample request:
    // localhost:4000/has-shared-secret?email=bob@saggot.com
    // Sample response:
    // {"err": null, "response": false}
    // response is sent which reports true if shared secret is set for given email and false otherwise
    var url = host + '/has-shared-secret?email='+email;
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("You probably forgot to start the 2fa server if you see error SyntaxError: Unexpected token u in JSON at position 0");
            callback(error, null);
        } else {
            if (error) {
                console.log(error);
            }
            var result = JSON.parse(body).response;
            callback(error, result);
        }
    });
}

module.exports.setSharedSecret = function(email, sharedSecret, code, callback){
    // Sample request:
    // localhost:4000/set-shared-secret?email=bob@saggot.com&sharedSecret=xe26kektvv&code=000000
    // Sample response:
    // {"err": null, "response": false}
    var url = host + '/set-shared-secret?email='+email+'&sharedSecret='+sharedSecret+'&code='+code;
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("You probably forgot to start the 2fa server if you see error SyntaxError: Unexpected token u in JSON at position 0");
            callback(error, null);
        } else {
            var result = JSON.parse(body).response;
            callback(error, result);
        }
    });
}


module.exports.deleteSharedSecret = function(email, code, callback){
    // Sample request:
    // localhost:4000/delete-shared-secret?email=bob@saggot.com&code=000000
    // Sample response:
    // {"err": null, "response": false}
    // response is sent which reports true if new shared secret was deleted and false otherwise
    var url = host + '/delete-shared-secret?email='+email+'&code='+code;
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("You probably forgot to start the 2fa server if you see error SyntaxError: Unexpected token u in JSON at position 0");
            callback(error, null);
        } else {
            var result = JSON.parse(body).response;
            callback(error, result);
        }
    });
};

module.exports.verifyOneTimeCodeAndEmailAgainstSharedSecret = function(email, code, sharedSecret, callback){
    // Sample request:
    // localhost:4000/verify-one-time-code-and-email?email=bob@saggot.com&code=000000
    // Sample response:
    // {"err": null, "response": false}
    var url = host + '/verify-one-time-code-and-email-against-specific-shared-secret?email='+email+'&code='+code +'&sharedSecret='+sharedSecret;
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("You probably forgot to start the 2fa server if you see error SyntaxError: Unexpected token u in JSON at position 0");
            callback(error, null);
        } else {
            var result = JSON.parse(body).response;
            callback(error, result);
        }
    });
}

module.exports.isAttemptable = function(email, callback){
    // Sample request:
    // localhost:4000/verify-one-time-code-and-email?email=bob@saggot.com&code=000000
    // Sample response:
    // {"err": null, "response": false}
    var url = host + '/is-attemptable?email='+email;
    request({
        uri: url,
        method: ""
    }, function(error, response, body) {
        if (typeof(body) === 'undefined') {
            console.error("You probably forgot to start the 2fa server if you see error SyntaxError: Unexpected token u in JSON at position 0");
            callback(error, null);
        } else {
            var result = JSON.parse(body).response;
            callback(error, result);
        }
    });
}