var contract = require("../server/gold-contract");

// var callPromise = contract.address; // getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
// var callPromise = contract.functions.getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
var callPromise = contract.functions.getAdministrator();

callPromise.then(function(value) {
    console.log('Single Return Value:' + value);
}).catch(function(err){
    console.log(err);
});