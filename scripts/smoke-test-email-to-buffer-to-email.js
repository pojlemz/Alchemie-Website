const hexToAscii = require('../server/hex-to-ascii');

describe('This converts an email to a string in hex form and then back to an email', function() {
    it('Printing the email after it has been converted and then converted back', function() {
        // var hexToAscii = function(inputString){
        //     var str = '';
        //     for (var i = 0; i < inputString.length; i += 2)
        //         str += String.fromCharCode(parseInt(inputString.substr(i, 2), 16));
        //     return str;
        // }
        var b = new Buffer('barrat@darryl.com');
        var s = b.toString('hex');
        var asciiString = hexToAscii(s);
        console.log("Final String: ", asciiString);
    });
});
