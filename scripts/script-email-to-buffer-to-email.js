const hexToAscii = require('../server/hex-to-ascii');

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