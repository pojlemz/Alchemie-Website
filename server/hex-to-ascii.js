module.exports = function hexToAscii(inputString){
    var str = '';
    for (var i = 0; i < inputString.length; i += 2)
        str += String.fromCharCode(parseInt(inputString.substr(i, 2), 16));
    return str;
}