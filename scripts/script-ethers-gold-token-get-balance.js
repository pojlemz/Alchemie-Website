var contract = require("../server/gold-contract");

// var callPromise = contract.address; // getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
// var callPromise = contract.functions.getBalance("0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C");
var callPromise = contract.functions.balanceOf("0xa20a3ea17ed3e1a16a42e8dc1f4419c587f8c59d");

callPromise.then(function(value) {
    console.log('Single Return Value:' + value);
}).catch(function(err){
    console.log(err);
});