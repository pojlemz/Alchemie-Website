const hex = require('ascii-hex');

describe('This just prints the ascii hex of a string with funny characters', function() {
    it('Printing the ascii hex', function() {
        var b = new Buffer('Darryl');
        var s = b.toString('hex');
        console.log("hex: ", s);
    });
});
