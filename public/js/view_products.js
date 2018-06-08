function ViewProducts(){

};

ViewProducts.prototype.initialize = function(){
    this.populateProductList();
}

ViewProducts.prototype.getHtmlForProductInList = function(key, object){
    // key/object combination looks something like the following:
    // '1KILOG': {name: 'KILO GOLD BAR', image: '1kg-gold-bar.png'},
    var html = "";
    html += '<div class="container-fluid css-dillon-gage-product-list">';
    html +=     '<div class="row css-row-dillon-gage-product">';
    html +=         '<img src="'+object['image']+'" class="img-thumbnail css-dillon-gage-thumbnail" alt="gold-bar">';
    html +=         '<div class="css-dillon-gage-product-label">';
    html +=             '<b>'+object['name']+'</b>';
    html +=         '</div>';
    html +=         '<div class="input-group input-group-md css-dillon-gage-amount">';
    html +=             '<input type="text" class="form-control fnQty" value="'+key+'" placeholder="0" changecontroller="inputPurchaseQuantity">';
    html +=         '</div>';
    html +=         '<div class="css-dillon-gage-product-price">';
    html +=             '<b class="fnPrice" value="'+key+'">0.00 BTC</b>';
    html +=         '</div>';
    html +=     '</div>';
    html += '</div>';
    return html;
}

ViewProducts.prototype.populateProductList = function(){
    var self = this;
    $.post("/get-products", {}, function( data ) {
        $(".fn-dillon-gage-product-list").empty();
        var products = data;
        var keys = Object.keys(products);
        for (var i = 0; i < keys.length; i++){
            var html = self.getHtmlForProductInList(keys[i], products[keys[i]]);
            $(".fn-dillon-gage-product-list").append(html);
        }
    }, "json");
}