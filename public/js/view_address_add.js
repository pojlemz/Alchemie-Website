function ViewAddressAdd(){

};

ViewAddressAdd.prototype.initialize = function(){

}

ViewAddressAdd.prototype.showErrorForTakenAddress  = function(){
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">This address is already taken.</div>';
    $(".fnAlertBox").prepend(htmlMessage);
    // Make API call to server to see if Address is taken
    // If address is not taken then add address to user's owned addresses and return positive result
    // If address is taken then report an error in the ajax call
}

ViewAddressAdd.prototype.showListOfOwnedAddresses = function(addressList){
    var url = g_App.getAjaxUrlPrefix() + "/get-owned-addresses-by-email";
    var self = this;
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    $.ajax(url).done(function(msg) { // Make API call to server to see if Address is taken
        if (msg !== 'You are not logged in.') {
            var addresses = msg.addresses;
            // addresses looks like the following:
            // [{"email":"dan@blockunity.com","address":"bobson-address"},{"email":"dan@blockunity.com","address":"0x0000000000000000000000000000000000000000000000000"},{"email":"dan@blockunity.com","address":""}]
            $('.fn-owned-addresses-added').empty();
            for (var i = 0; i < addresses.length; i++) {
                $('.fn-owned-addresses-added').append(self.getHtmlForOwnedAddress(addresses[i].address));
            }
        }
    });
    // {"email":"dan@blockunity.com"}
}

// Try the following in the Javascript console:
// g_App.getViewAddressAdd().getHtmlForOwnedAddress('0x012345678902345678901234567890123456789')
ViewAddressAdd.prototype.getHtmlForOwnedAddress = function(address){
    // address = '0x012345678902345678901234567890123456789'
    var html = "";
    html += '<div class="css-address-group">';
    html +=     '<span class="css-address-left-tab" id="sizing-addon1" clickcontroller="addAddressToAccount"></span>';
    html +=     '<div type="text" class="css-address-main-text css-green-background" aria-describedby="sizing-addon1">'+address+'</div>';
    html += '</div>';
    return html;
}

ViewAddressAdd.prototype.addAddressToList = function(address){
    var self = this;
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    htmlMessage = '<div class="alert alert-success fnShowErrorForTakenAddress">Address added to list for logged in user.</div>';
    $('.fn-owned-addresses-added').prepend(self.getHtmlForOwnedAddress(address));
}

ViewAddressAdd.prototype.showErrorForInvalidAddress = function(){
    $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">The entered address is invalid.</div>';
    $(".fnAlertBox").prepend(htmlMessage);
    // Make API call to server to see if Address is taken
    // If address is not taken then add address to user's owned addresses and return positive result
    // If address is taken then report an error in the ajax call
}