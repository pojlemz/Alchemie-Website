const hex = require('ascii-hex');

var b = new Buffer('Darryl');
var s = b.toString('hex');
console.log("hex: ", s);
