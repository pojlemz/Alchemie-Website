function ViewProductPrices(){
    this._prices = [];
    this._isAvailable = false;
    this._lockedPrices = [];
};

ViewProductPrices.prototype.initialize = function(){
    var fetchPricesAndUpdate = function(){
        $.post( "/get-prices", {}, function( data ) {
            if (data.response === 'error') {

                g_App.getViewProductPrices().setIsPriceAvailable(false);
            } else {
                g_App.getViewProductPrices().setIsPriceAvailable(true);
                g_App.getViewProductPrices().setPrices(data.prices);
                g_App.getViewProductPrices().updatePrices();
            }
            // Run the function that changes the prices here
        }, "json");
    }
    var requestLoop = setInterval(fetchPricesAndUpdate, 5000);
    $(document).ready(function(){
        fetchPricesAndUpdate();
        $(".fnQty").val('');
    });
}

ViewProductPrices.prototype.setPrices = function(jsonPrices){
    // jsonPrices should be an array of objects
    this._prices = jsonPrices;
}

ViewProductPrices.prototype.setIsPriceAvailable = function(boolIsAvailable){
    // jsonPrices should be an array of objects
    this._isAvailable = boolIsAvailable;
}

// ViewProductPrices.prototype.updateQuantities  = function(){
//     // $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
//     // htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">This address is already taken.</div>';
//     // $(".fnAlertBox").prepend(htmlMessage);
//     // Make API call to server to see if Address is taken
//     // If address is not taken then add address to user's owned addresses and return positive result
//     // If address is taken then report an error in the ajax call
// }

ViewProductPrices.prototype.updatePrices = function(){
    var jsonPrices = this._prices;
    if (this._isAvailable){
        for (var i = 0; i < jsonPrices.length; i++) {
            var selector = ".fnPrice[associate='" + jsonPrices[i].instrument + "']";
            $(selector).text(jsonPrices[i].price.toFixed(8));
        }
        this.updateGrandTotal();
    } else {
        $(".fnPrice").val("Unavailable");
    }
}

ViewProductPrices.prototype.updateGrandTotal = function() {
    if (this._isAvailable) {
        var prices = this._prices;
        var grandTotal = 0;
        for (var i = 0; i < prices.length; i++) {
            var selector = ".fnQty[associate='" + prices[i].instrument + "']";
            var qty = parseInt($(selector).val());
            if (isNaN(qty)){
                qty = 0;
            }
            grandTotal += qty * prices[i].price;
        }
        $(".fn-grand-total").text(grandTotal.toFixed(8) + " BTC");
    } else {
        $(".fn-grand-total").text(".....");
    }
}

ViewProductPrices.prototype.getLockedPrices = function(){
    return this._lockedPrices;
}

ViewProductPrices.prototype.copyCurrentPricesToLockedPrices = function(){
    this._lockedPrices = this._prices;
}