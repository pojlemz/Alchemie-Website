var fnUpdateBitcoinBalance = function(){
    var btcAddress = $('#btc-address').attr('associate');
    var url = '/get-balance?address=' + btcAddress;
    $.ajax(url).done(function(msg){
        var balance = msg['balance'];
        $('.fn-display-btc-balance').text(parseFloat(balance / 100000000).toFixed(8));
    });
};

fnUpdateBitcoinBalance();
setInterval(function(){
    fnUpdateBitcoinBalance();
}, 5000);

var fnUpdateRecoBalance = function(){
    var url = '/get-reco-balance';
    $.ajax(url).done(function(msg){
        var balance = msg['balance'];
        $('.fn-reco-balance').text(balance);
        $('.fn-reco-balance-in-usd').text('('+balance * 10+' USD)');
    });
};

fnUpdateRecoBalance();
setInterval(function(){
    fnUpdateRecoBalance();
}, 5000);