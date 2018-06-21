function ViewProducts(){
    this._productList = {};
};

ViewProducts.prototype.initialize = function(){
    this.populateProductList();
}

ViewProducts.prototype.getHtmlForProductInList = function(key, object){
    // key/object combination looks something like the following:
    // '1KILOG': {name: 'KILO GOLD BAR', image: '1kg-gold-bar.png'},
    var html = "";
    //html += '<div class="container-fluid css-dillon-gage-product-list">';
    html +=     '<div class="row css-row-dillon-gage-product">';
    html +=         '<div class="fn-order-once css-order-once cssCursorPointer" clickcontroller="buyOne" associate="' + key + '">';
    html +=             '<img src="'+object['image']+'" class="img-thumbnail css-dillon-gage-thumbnail" alt="gold-bar">';
    html +=             '<div class="css-dillon-gage-product-label">';
    html +=                 '<b>'+object['name']+'</b>';
    html +=             '</div>';
    // html +=         '<div class="input-group input-group-md css-dillon-gage-amount">';
    // html +=             '<input type="text" class="form-control fnQty" associate="'+key+'" placeholder="0" changecontroller="inputPurchaseQuantity">';
    // html +=         '</div>';
    html +=             '<div class="css-dillon-gage-product-price">';
    html +=                 '<b class="fnPrice" associate="'+key+'">0.00 BTC</b>';
    html +=             '</div>';
    html +=         '</div>';
    html +=     '</div>';
    //html += '</div>';
    return html;
}

ViewProducts.prototype.populateProductList = function(){
    var self = this;
    $.post("/get-products", {}, function( data ) {
        $(".fn-dillon-gage-product-list").empty();
        self._productList = data;
        var products = data;
        var keys = Object.keys(products);
        for (var i = 0; i < keys.length; i++){
            var html = self.getHtmlForProductInList(keys[i], products[keys[i]]);
            $(".fn-dillon-gage-product-list").append(html);
        }
        g_App.getControllerClick().resetClickControllerForSelector('.fn-dillon-gage-product-list');
    }, "json");
}

// ViewProducts.prototype.getHtmlForProductInList = function(key, object){
//     // key/object combination looks something like the following:
//     // '1KILOG': {name: 'KILO GOLD BAR', image: '1kg-gold-bar.png'},
//     var html = "";
//     html += '<div class="container-fluid css-dillon-gage-product-list">';
//     html +=     '<div class="row css-row-dillon-gage-product">';
//     html +=         '<img src="'+object['image']+'" class="img-thumbnail css-dillon-gage-thumbnail" alt="gold-bar">';
//     html +=         '<div class="css-dillon-gage-product-label">';
//     html +=             '<b>'+object['name']+'</b>';
//     html +=         '</div>';
//     html +=         '<div class="input-group input-group-md css-dillon-gage-amount">';
//     html +=             '<input type="text" class="form-control fnQty" associate="'+key+'" placeholder="0" changecontroller="inputPurchaseQuantity">';
//     html +=         '</div>';
//     html +=         '<div class="css-dillon-gage-product-price">';
//     html +=             '<b class="fnPrice" associate="'+key+'">0.00 BTC</b>';
//     html +=         '</div>';
//     html +=     '</div>';
//     html += '</div>';
//     return html;
// }

ViewProducts.prototype.populateProductListInModal = function(keys){
    // keys = ['1KILOG', '10GP']
    // This function assumes we have already fetched the list of products from the server.
    var self = this;
    $(".fn-dillon-gage-product-list-modal").empty();
    for (var i = 0; i < keys.length; i++) {
        var html = self.getHtmlForProductInModalList(keys[i], this._productList[keys[i]]);
        $(".fn-dillon-gage-product-list-modal").append(html);
    }
}

ViewProducts.prototype.getHtmlForProductInModalList = function(key, object){
    var html = "";
    html += '<div class="row css-row-dillon-gage-product-modal">';
    html +=     '<div class="css-dillon-gage-product-label-modal">';
    html +=         '<b>'+object['name']+'</b>';
    html +=     '</div>';
    html +=     '<div class="css-dillon-gage-product-total-modal">';
    html +=         '<b class="fn-order-total" associate="'+key+'">0.00000000 BTC</b>';
    html +=     '</div>';
    html +=     '<div class="css-dillon-gage-amount-modal">';
    html +=         '<b class="fn-order-qty" associate="'+key+'">0</b>';
    html +=     '</div>';
    html +=     '<div class="css-dillon-gage-product-price-modal">';
    html +=         '<b class="fn-order-unit-price" associate="'+key+'">0.00000000 BTC</b>';
    html +=     '</div>';
    html += '</div>';
    return html;
}
