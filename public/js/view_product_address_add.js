function ViewProductAddressAdd(){

};

ViewProductAddressAdd.prototype.initialize = function(){

}

ViewProductAddressAdd.prototype.showErrorForTakenAddress  = function(){
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">This address is already taken.</div>';
    $(".fnAlertBox").prepend(htmlMessage);
    // Make API call to server to see if Address is taken
    // If address is not taken then add address to user's owned addresses and return positive result
    // If address is taken then report an error in the ajax call
}

ViewProductAddressAdd.prototype.showListOfProductAddresses = function(callbackOnSuccess){
    var url = g_App.getAjaxUrlPrefix() + "/get-owned-addresses-by-email";
    var self = this;
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    $.ajax(url).done(function(msg) { // Make API call to server to see if Address is taken
        if (msg !== 'You are not logged in.') {
            var addresses = msg.addresses;
            // addresses looks like the following:
            // [{"email":"dan@blockunity.com","address":"bobson-address"},{"email":"dan@blockunity.com","address":"0x0000000000000000000000000000000000000000000000000"},{"email":"dan@blockunity.com","address":""}]
            $('.fn-product-address-list').empty();
            for (var i = 0; i < addresses.length; i++) {
                $('.fn-product-address-list').append(self.getHtmlForProductAddress(addresses[i].address));
            }
            g_App.getControllerClick().resetClickControllerForSelector('.fn-product-address-list');
            callbackOnSuccess(msg)
        }
    });
    // {"email":"dan@blockunity.com"}
}

// Try the following in the Javascript console:
// g_App.getViewAddressAdd().getHtmlForOwnedAddress('0x012345678902345678901234567890123456789')
ViewProductAddressAdd.prototype.getHtmlForProductAddress = function(address){
    // address = '0x012345678902345678901234567890123456789'
    var html = "";
    html += '<div class="css-withdrawal-address fn-product-address" associate="'+address+'">';
    html +=     '<div class="css-withdrawal-address-main-text fn-product-address-main-text cssCursorPointer" clickcontroller="selectProductAddress" aria-describedby="sizing-addon1" associate="'+address+'">'+address+'</div>'
    html +=     '<div class="cssCursorPointer css-product-address-delete" clickcontroller="deleteProductAddress" style="display:none" associate="{{'+address+'}}">'
    html +=         '<div class="css-product-address-delete-image"></div>';
    html +=     '</div>';
    html += '</div>';
    return html;
}

ViewProductAddressAdd.prototype.addAddressToList = function(address){
    var self = this;
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    htmlMessage = '<div class="alert alert-success fnShowErrorForTakenAddress">Address added to list for logged in user.</div>';
    $('.fn-product-address-list').prepend(self.getHtmlForProductAddress(address));
}

ViewProductAddressAdd.prototype.showErrorForInvalidAddress = function(){
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">The entered address is invalid.</div>';
    $(".fnAlertBox").prepend(htmlMessage);
    // Make API call to server to see if Address is taken
    // If address is not taken then add address to user's owned addresses and return positive result
    // If address is taken then report an error in the ajax call
}

ViewProductAddressAdd.prototype.showShowFinalOrderButton = function(){
    $('.fn-show-final-order-button').show();
}

ViewProductAddressAdd.prototype.hideShowFinalOrderButton = function(){
    $('.fn-show-final-order-button').hide();
}