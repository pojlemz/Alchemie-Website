setInterval(function(){
    var btcAddress = $('#btc-address').attr('associate');
    var url = '/get-balance?address=' + btcAddress;
    $.ajax(url).done(function(msg){
        var balance = msg['balance'];
        $('.fn-display-btc-balance').text(parseFloat(balance / 100000000).toFixed(8));
    });
}, 5000);

setInterval(function(){
    var url = '/json-establish-address-and-get-reco-balance';
}, 5000);